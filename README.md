# 🦷 Dental Annotate Report

An interactive dental annotation and reporting web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. The app provides annotation tools, patient image upload, authentication, and PDF report generation.

---

## 🚀 Features
- 🔐 User authentication (Login & Register)  
- 🖊️ Annotation canvas for marking dental images  
- 📂 Patient image upload  
- 📑 PDF report generation  
- 🎨 Modern UI with Tailwind CSS  
- ⚡ Fast development with Vite  

---

## 📦 Tech Stack
- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS  
- **Linting & Formatting:** ESLint  
- **Build Tool:** Vite  

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/dental-annotate-report.git
cd dental-annotate-report-main

2. Install Dependencies

Using npm:

npm install


Or using bun (if installed):

bun install

3. Run Development Server
npm run dev


This starts the app at http://localhost:5173
.

4. Build for Production
npm run build

5. Preview Production Build
npm run preview

📂 Project Structure
├── public/             # Static assets (favicon, robots.txt, etc.)
├── src/                # Main source code
│   ├── components/     # UI components (annotation, auth, patient, reports, etc.)
│   ├── App.tsx         # Main app entry
│   ├── main.tsx        # React DOM entry
│   └── index.css       # Global styles
├── index.html          # Root HTML
├── package.json        # Project dependencies & scripts
├── tailwind.config.ts  # Tailwind config
├── vite.config.ts      # Vite config
└── tsconfig.json       # TypeScript config

🧑‍💻 Scripts

npm run dev → Start dev server

npm run build → Build production app

npm run preview → Preview production build

npm run lint → Run ESLint checks
