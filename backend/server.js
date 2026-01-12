const express = require('express');
const cors = require('cors'); // <--- Import CORS
const app = express();
const port = 3000;

// 1. ALLOW CONNECTIONS (Middleware)
app.use(cors()); // <--- This enables the frontend to talk to the backend
app.use(express.json());

// 2. THE API ENDPOINT
app.post('/api/analyze', (req, res) => {
    const { text } = req.body;
    console.log("Received text for analysis:", text); // Log what the server sees

    // Simple keyword safety logic (You can expand this later)
    const lowerText = text.toLowerCase();
    
    let isSafe = true;
    let message = "This medication appears safe based on the scanned label.";

    // Example Danger Keywords
    if (lowerText.includes("expired") || lowerText.includes("recall")) {
        isSafe = false;
        message = "WARNING: Label mentions 'expired' or 'recall'. Do not use.";
    } else if (lowerText.includes("drowsiness") || lowerText.includes("dizziness")) {
        isSafe = true; // Still safe, but with a warning
        message = "Caution: This medication may cause drowsiness. Do not drive.";
    }

    res.json({ safe: isSafe, message: message });
});

// 3. START SERVER
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});