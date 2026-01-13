require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 1. SETUP GOOGLE GEMINI
// PASTE YOUR KEY HERE
const genAI = new GoogleGenerativeAI("AIzaSyCYo3oVSSykb06IgaII6h7fa9vjmHJ_PSs");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/analyze', async (req, res) => {
    const scannedText = req.body.text || "";
    const userLanguage = req.body.language || "English"; 

    console.log(`Analyzing in ${userLanguage}...`);

    // 2. SAFETY CHECK (Traffic Light) - Runs locally
    let safetyResult = { safe: true, color: "green", title: "Likely Safe" };
    const dangerWords = ["dizziness", "faint", "interaction", "alcohol", "bleed", "stroke", "emergency", "fatal", "call your doctor"];
    const warningWords = ["drowsy", "food", "milk", "sunlight", "caution", "avoid", "may cause"];
    const lowerText = scannedText.toLowerCase();

    if (dangerWords.some(w => lowerText.includes(w))) {
        safetyResult = { safe: false, color: "red", title: "High Risk Warning" };
    } else if (warningWords.some(w => lowerText.includes(w))) {
        safetyResult = { safe: true, color: "yellow", title: "Moderate Caution" };
    }

    // 3. INTELLIGENCE (Strict Translation)
    let aiResponse = { 
        drug: "Unknown", 
        usage: "See label.", 
        dosage: "As directed.", 
        warning: "Consult doctor." 
    };
    let fdaVerification = "Not Checked";

    try {
        // --- THE "NUCLEAR" PROMPT ---
        // We tell it that English is dangerous for this patient.
        const prompt = `
        You are a medical translator for a patient who DOES NOT SPEAK ENGLISH. 
        They ONLY speak ${userLanguage}.
        
        Source Text: "${scannedText}"

        CRITICAL INSTRUCTION: 
        If you output English in the explanations, the patient will be harmed. 
        You MUST translate the Usage, Dosage, and Warning completely into ${userLanguage}.
        
        Step 1: Identify the Drug Name (Keep this in English for records).
        Step 2: Translate the Usage into ${userLanguage}.
        Step 3: Translate the Dosage instructions into ${userLanguage}.
        Step 4: Translate the Warning into ${userLanguage}.

        Output Format:
        DRUG: [English Name]
        USAGE: [Full translation in ${userLanguage}]
        DOSAGE: [Full translation in ${userLanguage}]
        WARN: [Full translation in ${userLanguage}]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        console.log("AI Response:", text); // Check your terminal to see if it worked

        const drugMatch = text.match(/DRUG: (.*)/);
        const usageMatch = text.match(/USAGE: (.*)/);
        const dosageMatch = text.match(/DOSAGE: (.*)/);
        const warnMatch = text.match(/WARN: (.*)/);

        if (drugMatch) aiResponse.drug = drugMatch[1].trim();
        if (usageMatch) aiResponse.usage = usageMatch[1].trim();
        if (dosageMatch) aiResponse.dosage = dosageMatch[1].trim();
        if (warnMatch) aiResponse.warning = warnMatch[1].trim();

        // 4. FDA CHECK (Using the English drug name)
        if (aiResponse.drug !== "Unknown") {
            try {
                const fdaUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${aiResponse.drug}"&limit=1`;
                await axios.get(fdaUrl);
                fdaVerification = `✅ Verified: "${aiResponse.drug}" is an FDA-approved drug.`;
            } catch (err) {
                 fdaVerification = `⚠️ Note: "${aiResponse.drug}" not found in FDA database.`;
            }
        }

    } catch (error) {
        console.error("AI Error:", error.message);
    }

    res.json({
        safe: safetyResult.safe,
        color: safetyResult.color,
        title: safetyResult.title,
        data: aiResponse,
        fda: fdaVerification
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});