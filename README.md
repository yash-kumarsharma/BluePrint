# <p align="center">BluePrint AI: The Career Architecture Engine</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Production--Ready-black?style=for-the-badge&logo=vercel" alt="Build Status">
  <img src="https://img.shields.io/badge/Stack-MERN--Stack-blue?style=for-the-badge&logo=mongodb" alt="Tech Stack">
  <img src="https://img.shields.io/badge/AI-Gemini--Pro-orange?style=for-the-badge&logo=google-gemini" alt="AI Engine">
  <img src="https://img.shields.io/badge/UI-Brutalist--Studio-white?style=for-the-badge&logo=framer" alt="UI Aesthetic">
</p>

---

## 🚀 Overview

**BluePrint AI** is a studio-grade career diagnostic platform designed to bridge the gap between academic profiles and industry requirements. Using advanced LLM orchestration and vector-based skill mapping, BluePrint analyzes your resume against any target Job Description to generate a high-fidelity **Analysis Matrix**, actionable **Roadmaps**, and a personalized **Knowledge Hub**.

### 💎 Key Features

- **⚡ Vectorized Skill Diagnostic**: Real-time parity analysis between your resume and target JDs.
- **🛡️ Self-Healing AI Engine**: Multi-model fallback system (Gemini 2.5 → 3 Flash) ensuring 99.9% uptime.
- **🎓 Knowledge Hub**: Dynamic generation of learning resources (YouTube, GFG, LeetCode) based on detected gaps.
- **🗺️ Execution Roadmap**: Phase-by-phase career strategy with specific technical milestones.
- **📄 Shadow PDF Export**: High-resolution, full-content report generation using a hidden "Shadow" DOM for perfect fidelity.
- **🎨 Editorial Brutalist UI**: A premium, motion-heavy aesthetic built for the high-end SaaS feel.

---

## 🛠️ Technical Architecture

### **The Stack**
- **Frontend**: React 19 + Vite + Framer Motion + Three.js
- **Backend**: Node.js + Express + MongoDB
- **Intelligence**: Google Gemini API (Vertex AI)
- **Visuals**: Recharts (Radar Diagnostic) + React Globe (Visualization)

### **Performance Optimization**
BluePrint uses **Manual Chunk Splitting** to ensure the core application bundle remains ultra-light (**~41KB**), lazy-loading heavy libraries like Three.js and Recharts only when the user enters the Analysis Workbench.

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/yash-kumarsharma/BluePrint.git
cd BluePrint
```

### **2. Environment Configuration**
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### **3. Install Dependencies**
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### **4. Run the Platform**
```bash
# Start Backend (from /server)
npm start

# Start Frontend (from /client)
npm run dev
```

---

## 🎯 Project Roadmap

- [x] **V1.0**: Core MERN Implementation & Basic LLM Parsing.
- [x] **V1.5**: Studio UI Refinement & Radar Diagnostics.
- [x] **V2.0**: Shadow PDF Engine & Knowledge Hub Integration.
- [ ] **V2.5**: Collaborative "Team Blueprints" & GitHub Repo Analysis.

---

## 📜 License
Licensed under the [MIT License](LICENSE).

<p align="center">
  Built with ❤️ by <b>Yash Kumar Sharma</b> for the Integrated Project Viva (SEM-6).
</p>
