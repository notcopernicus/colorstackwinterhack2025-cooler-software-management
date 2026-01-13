Here's the README.md ready to copy and paste:

```markdown
# colorstackwinterhack2025-cooler-software-management

![MedGuard AI Banner](https://via.placeholder.com/1000x300?text=MedGuard+AI:+Bridging+Health+Literacy+Gaps)
*(Replace the link above with a screenshot of your app, or delete this line)*

## 🛡️ The Pitch: MedGuard AI
**MedGuard AI** is an intelligent medication safety guardian designed to bridge health literacy gaps and language barriers for underserved communities. It is not just a pill reminder; it is a safety and translation tool that prevents dangerous medication errors before they happen.

## 🧩 Problem Alignment
**Principle 2: Incorporate Prosocial Design Principles**

Medication errors cost the US healthcare system **$40 billion annually**. Non-English speakers and patients with low health literacy often cannot read or understand critical warnings on English-language pill bottles.

**How MedGuard AI Solves This:**
* **Visual Translation:** Instantly translates complex medical labels into the user's native language (Spanish, French, Arabic, Mandarin) using AI.
* **Literacy-First Design:** Simplifies technical jargon (e.g., "contraindicated") into Grade 5 reading level explanations.
* **Accessibility:** Uses a "Traffic Light" safety system (🔴 Red / 🟡 Yellow / 🟢 Green) and Text-to-Speech for visually impaired users.
* **Verification:** Cross-references drug names with the **OpenFDA government database** to ensure legitimacy.

---

## 🛠️ Technologies Used

### **Frontend (The Interface)**
* **React.js (Vite):** Fast, responsive user interface.
* **Tesseract.js:** Optical Character Recognition (OCR) running entirely in the browser to extract text from images.
* **Web Speech API:** Native text-to-speech for accessibility.
* **Lucide React:** Iconography for intuitive navigation.

### **Backend (The Intelligence)**
* **Node.js & Express:** Lightweight REST API handling requests.
* **Google Gemini 2.5 Flash:** The core AI engine that analyzes drug safety, translates text, and simplifies warnings.
* **OpenFDA API:** US Government database used to verify if a drug is FDA-approved.
* **Axios:** For handling external API requests.

---

## 🚀 Setup & Installation Instructions

Follow these steps to run MedGuard AI locally.

### **Prerequisites**
* Node.js installed (v16 or higher).
* A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### **1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/medguard-ai.git
cd medguard-ai
```

### **2. Setup the Backend**
The backend handles the AI logic and FDA verification.
```bash
cd backend
npm install
```

* Create a `.env` file in the `backend` folder and add your API key:
```
GOOGLE_API_KEY=your_actual_api_key_here
```

* Start the server:
```bash
node server.js
```

(You should see: `Server running on http://localhost:3000`)

### **3. Setup the Frontend**
Open a new terminal window for the client.
```bash
cd client
npm install
npm run dev
```

* Click the local link (usually `http://localhost:5173`) to open the app.

---

## 👥 Team Members & Contributions
* **Michael Shehata:** Full Stack Development, AI Integration, Prompt Engineering.
* **Copernic Mensah:** AI Integration, Web Development, Research, Documentation.

---

## 📸 Demo & Screenshots

### Demo Video
[Link to YouTube/Vimeo Demo Video] (Paste your link here)

### Screenshots
| Safety Analysis (Traffic Light) | Multi-Language Translation |
|---|---|
| Green/Red indicators for instant safety checks. | Full translation into Arabic/French. |

---

Built with ❤️ for ColorStack Winter Hack 2025.
```
