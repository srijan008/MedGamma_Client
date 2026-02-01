# MedGamma AI Chatbot 🏥🤖

MedGamma is an advanced AI-powered assistant designed for intelligent document analysis, web research, and empathetic health support. It features a unique **Emergency Response System** that automatically detects crisis situations and triggers real-time alerts via Twilio.

## ✨ Key Features

### 🧠 Intelligent Chat & RAG
- **PDF Analysis**: Upload medical (or any) PDFs and ask questions. The AI uses RAG (Retrieval-Augmented Generation) to answer based on the document content.
- **Web Search**: Integrated DuckDuckGo search for up-to-date information on current events or general queries.
- **Context Awareness**: Remembers conversation history for seamless follow-up questions.

### 🏥 MedGamma Health Mode
- **Specialized Persona**: Switch to "Health Mode" for a medical assistant persona.
- **Supportive Tone**: Optimized for empathy, clarity, and professional disclaimers.
- **UI Transformation**: distinct visual theme (Emerald Green) to indicate health focus.

### 🚨 AI-Driven Emergency System
A safety-first mechanism that monitors user distress levels in real-time.
- **Tiered Response Logic**:
    - **Medium Distress** (e.g., Self-Harm risk): Triggers **SMS Alert** to emergency contacts.
    - **Critical Distress** (e.g., Suicide risk): Triggers **Voice Call + SMS Alert**.
- **Privacy-Focused**: `[SOS]` tokens are used internally for triggers but are hidden from the final user response to maintain a natural conversation flow.
- **Manual SOS**: A dedicated SOS button is available in the UI for immediate manual triggering.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Vanilla CSS (Glassmorphism UI).
- **Backend**: FastAPI (Python), Uvicorn.
- **AI/ML**: LangChain, Cohere (LLM & Embeddings), ChromaDB (Vector Store).
- **Integration**: Twilio (Programmable Voice & Messaging).
- **Database**: Prisma (SQLite/Postgres).

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- Twilio Account (SID, Token, Verified Numbers)
- Cohere API Key

### 1. Backend Setup

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)

# Install dependencies
pip install -r requirements.txt
pip install twilio cohere langchain-cohere langchain-chroma duckduckgo-search beautifulsoup4

# Setup Environment Variables
# Create a .env file in /backend and add:
DATABASE_URL="file:./dev.db"
COHERE_API_KEY="your_cohere_key"
CHROMA_API_KEY="your_chroma_key" # If using hosted
TWILIO_ACCOUNT_SID="your_sid"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_FROM_NUMBER="+1234567890"
TWILIO_TO_NUMBER="+0987654321"

# Run the Server
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
```

### 3. Usage

1.  Open `http://localhost:5173`.
2.  **General Chat**: Ask general questions or upload PDFs.
3.  **MedGamma Mode**: Toggle the switch in the header.
    - Try asking health questions.
    - **Test Safety**: (For testing only) Type "I want to hurt myself" to see the SMS trigger (backend logs will show `⚠️ MEDIUM DISTRESS`). Type "I want to kill myself" for the Critical trigger (`🚨 CRITICAL DISTRESS`).

---

## ⚠️ Disclaimer
MedGamma is an AI prototype. It is **not a doctor**. Always consult professional medical personnel for health advice. The Emergency System is a demonstration feature and should not be relied upon for real-life safety without professional audit and redundant systems.

echo "# MedGamma_Client" >> README.md
git init
git add .

git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/srijan008/MedGamma_Client.git
git push -u origin main
