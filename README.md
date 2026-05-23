# <p align="center">BluePrint: AI Skill Gap Analysis Platform</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Production--Ready-black?style=for-the-badge&logo=vercel" alt="Build Status">
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.0.4-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Framer_Motion-12.38.0-pink?style=for-the-badge&logo=framer" alt="Framer Motion">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.2.1-lightgrey?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-9.4.1-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Google_Gemini-API-orange?style=for-the-badge&logo=google-gemini" alt="Gemini Engine">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=git" alt="License">
</p>

---

## 🚀 Overview

**BluePrint AI** is a studio-grade career diagnostic platform designed to bridge the gap between academic profiles and industry requirements. Using advanced Large Language Model (LLM) orchestration and vector-based skill mapping, BluePrint analyzes your resume against any target Job Description to generate a high-fidelity **Analysis Matrix**, estimate **ATS Score compatibility**, list **matched and missing skills**, compile actionable **phased learning roadmaps**, and build a personalized **Knowledge Hub** with reference links.

The system features a **Self-Healing AI Node** pipeline to ensure high availability, an API-driven job requirement scraper powered by **Jina Reader**, and a pixel-perfect, off-screen **Shadow DOM PDF Export Engine** designed for exporting reports without breaking layout grids.

---

## 🎨 UI Aesthetic & Design System

BluePrint is built with a premium, motion-heavy **Editorial Brutalist** design aesthetic. It prioritizes layout cleanliness, bold structural grids, and high-fidelity typography:

- **Typography & Grid System:** Features a bespoke, fully responsive typography framework supporting fluid scaling down to mobile viewports. Bold borders (`8px solid #fff`), clean card separators, and custom color-matched gradients.
- **Micro-Animations & Interactions:** Uses **Framer Motion** for smooth spring-physics transitions, layout shifts, step card stagger entries, hover zoom states (`scale: 1.03`), and a spring-followed global cursor glow overlay tracking mouse movements.
- **Radar Diagnostic Grid:** Integrates responsive multi-axis **Recharts Radar Charts** inside the workbench, giving users an immediate visual model of their core technical strengths compared directly to target job descriptions.

---

## 🛠️ System Architecture & Data Flow

The diagram below outlines how the client handles uploads, how the backend parses files and manages model fallbacks, and how PDF printing is isolated.

```mermaid
sequenceDiagram
    actor User
    participant FE as React Client (Vite)
    participant BE as Express Server
    participant AI as Gemini API Nodes
    database DB as MongoDB Database

    User->>FE: Upload Resume (PDF) & Paste/Scrape Job Description
    FE->>BE: POST /api/analysis/analyze-gap (FormData)
    Note over BE: Read PDF Buffer & extract raw text using pdf-parse
    BE->>AI: Call gemini-2.5-flash with prompt containing resume + JD
    alt Node Busy / Rate Limited (429/503)
        BE->>AI: Fail-over to gemini-3-flash-preview
    else Still Throttled
        BE->>AI: Fail-over to gemini-2.5-flash-lite
    end
    AI-->>BE: Return raw JSON with parsed matrices, roadmaps, and resources
    BE->>DB: Save analysis document (associate user ID if authenticated)
    DB-->>BE: Save confirmation
    BE-->>FE: HTTP 200 (analysis payload + document ID)
    Note over FE: Render Recharts Radar chart, skills grids, and step-cards
    User->>FE: Click "Download PDF Report"
    Note over FE: Instantiates off-screen #pdf-export-template (Shadow Layout)
    FE->>User: Trigger system download of styled document (html2pdf.js)
```

### Technical Stack & Package Registry

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | `^19.2.4` | Component framework |
| **Frontend** | Vite | `^8.0.4` | Build tool & Dev server |
| **Frontend** | Framer Motion | `^12.38.0` | Springs, exits, and layout transitions |
| **Frontend** | Recharts | `^3.8.1` | Radar diagnostic chart rendering |
| **Frontend** | Lucide React | `^1.8.0` | UI system icons |
| **Backend** | Express | `^5.2.1` | HTTP web server and API routing |
| **Backend** | Mongoose | `^9.4.1` | MongoDB Object Data Modeling (ODM) |
| **Backend** | JSON Web Token | `^9.0.3` | User session tokenization |
| **Backend** | Bcryptjs | `^3.0.3` | Password salting & hashing |
| **Backend** | PDF Parse | `^1.1.1` | Extraction of raw text from uploaded files |
| **Backend** | Cheerio / Axios | `^1.2.0` / `^1.15.0` | Direct crawling fallback mechanism |
| **Backend** | Google GenAI | `^1.50.1` | Gemini LLM Node interactions |

---

## 📡 API Reference Guide

All backend routing is prefixed with `/api`. All protected routes expect a `Bearer <token>` payload in the HTTP Authorization headers.

### Authentication Endpoints
`Prefix: /api/auth`

| Endpoint | Method | Access | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | `POST` | Public | `{ "name": "Name", "email": "email@test.com", "password": "secure" }` | `{ "success": true, "_id": "...", "name": "Name", "email": "...", "token": "JWT" }` |
| `/login` | `POST` | Public | `{ "email": "email@test.com", "password": "secure" }` | `{ "success": true, "_id": "...", "name": "Name", "email": "...", "token": "JWT" }` |

### Analysis & Diagnostic Endpoints
`Prefix: /api/analysis`

| Endpoint | Method | Access | Request Body / Parameters | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `/analyze-gap` | `POST` | Public | `FormData` { `resume`: File, `jobDescription`: String, `userId`?: String } | `{ "success": true, "analysisId": "...", "data": { "matchPercentage": 75, "atsScore": 60, ... } }` |
| `/scrape-jd` | `POST` | Public | `{ "url": "https://careers.google.com/..." }` | `{ "success": true, "method": "Jina Reader", "text": "Cleaned JD details" }` |
| `/history` | `GET` | Private | *Header: Authorization: Bearer JWT* | `{ "success": true, "data": [ { analysis1 }, { analysis2 } ] }` |
| `/:id` | `GET` | Private | *Parameter:* `:id` (Analysis document ID) | `{ "success": true, "data": { analysisObj } }` |
| `/:id` | `DELETE` | Private | *Parameter:* `:id` (Analysis document ID) | `{ "success": true, "message": "Analysis removed" }` |

---

## 🗄️ Database Schemas

### 1. User Model Schema
Represents application accounts and password handling attributes.

| Field | Data Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated | Unique document identifier. |
| `name` | String | Required | Candidate's username. |
| `email` | String | Required, Unique, Regex Validated | Authenticated email address. |
| `password` | String | Required, Selected: False | Hashed password (using pre-save bcrypt hook). |
| `createdAt` | Date | Default: `Date.now` | Registration timestamp. |

### 2. Analysis Model Schema
Represents the vector diagnostic results generated via Gemini AI.

| Field | Data Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Ref: `'User'`, Required: False | Associated user profile (enables guest analysis). |
| `jobDescription`| String | Required | Raw or scraped Job Description text. |
| `matchPercentage`| Number | Required | Core compatibility metric calculated by Gemini. |
| `atsScore` | Number | Default: `0` | Estimated compatibility with recruitment parsers. |
| `matchedSkills` | Array (Strings)| - | Matching skills detected in both resume and JD. |
| `missingSkills` | Array (Strings)| - | Critical gaps detected in candidate profile. |
| `recommendations`| Array (Strings)| - | Core strategic action points for interview preparation.|
| `resumeImprovements`| Array (Strings)| - | Structural or phrasing suggestions for the resume file.|
| `roadmap` | Array (Objects)| `step`, `task`, `duration` | Step-by-step milestones to cover skill gaps. |
| `learningResources`| Array (Objects)| `title`, `platform`, `url` | Tailored reference materials (YouTube, GFG, LeetCode).|
| `createdAt` | Date | Default: `Date.now` | Date of calculation. |

---

## ⚙️ Environment Variables

Create a file named `.env` in the `/server` root directory:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Node server execution port. |
| `MONGO_URI` | `mongodb+srv://...` | Connection URI for the MongoDB instance. |
| `JWT_SECRET` | `your_jwt_secret_key` | Secret key used for encoding user authentication tokens. |
| `GEMINI_API_KEY` | `AIzaSy...` | Developer API key from Google AI Studio. |

---

## 📦 Directory Tree Structure

```text
BluePrint/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Branding and icons
│   │   ├── components/         # Global visual components
│   │   │   └── Navbar.jsx             # Nav component
│   │   ├── pages/              # View pages
│   │   │   ├── History.jsx            # User history
│   │   │   ├── Home.jsx               # Workspace workbench & PDF generator
│   │   │   ├── Login.jsx              # Session login
│   │   │   ├── Register.jsx           # Session register
│   │   │   └── Welcome.jsx            # Dynamic landing page & responsive grid
│   │   ├── App.css             # Theme style variables
│   │   ├── App.jsx             # React routing & mouse particle physics
│   │   ├── config.js           # API route mapping
│   │   ├── index.css           # Modern brutalist grid systems & styles
│   │   └── main.jsx            # DOM renderer entrypoint
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend API
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── auth.controller.js     # Auth routines
│   │   │   └── analysis.controller.js # Parse, Scrape, & Gemini model fallbacks
│   │   ├── middlewares/        # Express middleware chains
│   │   │   ├── auth.middleware.js     # JWT route protection
│   │   │   └── upload.middleware.js   # Multer file buffering
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── Analysis.js
│   │   │   └── User.js
│   │   ├── routes/             # Express routes endpoints
│   │   │   ├── analysis.routes.js
│   │   │   └── auth.routes.js
│   │   ├── utils/              # Cryptography and token tools
│   │   │   └── generateToken.js
│   │   ├── app.js              # Express app declarations
│   │   └── server.js           # Database hooks and process start
│   ├── package.json
│   └── .env
│
└── docs/                       # Project Documentation assets
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js** (v18.x or above recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Google Gemini API Key** (Obtained from Google AI Studio)

### 2. Clone the Codebase
```bash
git clone https://github.com/yash-kumarsharma/BluePrint.git
cd BluePrint
```

### 3. Server Deployment (Backend)
```bash
cd server
npm install

# Create server/.env file and fill in parameters
# Run Development Server with Nodemon:
npm run dev
```

### 4. Client Deployment (Frontend)
```bash
cd ../client
npm install

# Run Development Server:
npm run dev
```
The React development server runs by default on `http://localhost:5173`. The backend services route request payloads through `http://localhost:5000`.

---

## 🎯 Project Roadmap

- [x] **V1.0**: Core MERN setup, raw document text extraction.
- [x] **V1.5**: Brutalist typography, dynamic Recharts Radar diagnostics.
- [x] **V2.0**: Off-screen Shadow DOM print layouts, web scraper.
- [x] **V2.1**: Mobile-responsive viewport configurations and flexible grids.
- [ ] **V2.5**: Shared team analysis workspaces, GitHub repository coding scans, and multi-file processing.

---

## 📜 License
Licensed under the [MIT License](LICENSE).

<p align="center">
  Built with ❤️ by <b>Yash Kumar Sharma</b> for the Integrated Project Viva (SEM-6).
</p>
