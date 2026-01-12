const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // You'll need to set this in a .env file
});

const analyzeSafety = async (drugList, userLanguage = 'English') => {
  
  const systemPrompt = `
    You are the "AI Medication Safety Guardian." Your goal is to keep patients safe by analyzing their medication list.
    
    RULES:
    1. **Audience:** Explain everything at a Grade 5 reading level. No complex medical jargon.
    2. **Tone:** Empathetic but firm on safety.
    3. **Language:** Translate the FINAL output into ${userLanguage}.
    
    YOUR PROCESS (Chain of Thought):
    1. Identify the active ingredients for: ${drugList.join(', ')}.
    2. Check for **Polypharmacy Interactions** (Drug-Drug). Cite specific medical risks (e.g., "Risk of Serotonin Syndrome").
    3. Check for **Temporal Interactions** (Timing). Do any of these clash? (e.g., "Take X in morning, Y at night").
    4. Formulate a "Safety Score" (High/Medium/Low Risk).
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "safetyScore": "Low | Medium | High",
      "summary": "A 2-sentence simple summary of the risks.",
      "interactions": [
        { "drugs": ["Drug A", "Drug B"], "risk": "Simple explanation of what might happen.", "severity": "High" }
      ],
      "schedule_advice": "Simple timing advice (e.g., 'Take the blue pill with breakfast...')"
    }
  `;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0, // Keep it strictly factual
      system: systemPrompt,
      messages: [
        { role: "user", content: `Analyze these drugs: ${JSON.stringify(drugList)}` }
      ]
    });

    // Extract the JSON content from Claude's response
    const textResponse = msg.content[0].text;
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    return JSON.parse(textResponse.slice(jsonStart, jsonEnd));

  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Safety check failed. Please consult a pharmacist." };
  }
};

module.exports = { analyzeSafety };