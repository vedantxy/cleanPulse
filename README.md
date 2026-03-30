# 🌿 CleanPulse — Smart Waste & Planetary Healing System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Backend-Express.js-black?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/Frontend-React.js-blue?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Runtime-Node.js-green?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/AI-Gemini-orange?style=for-the-badge&logo=google)

---

## 🚀 Live Demo & Deployment
- **Live Site**: [Add your live URL here after deployment]
- **Deployment Guide**: [View Guide](README_DEPLOY.md)

---

## 📌 Vision & Problem Statement

> **"In most cities and towns, waste management is still handled through fixed schedules and manual reporting systems. Citizens have no proper platform to report garbage overflow, illegal dumping, or missed pickups in their area. Waste collectors operate without real-time data, leading to inefficient routes and missed locations.**
>
> **CleanPulse is the definitive platform for planetary healing. It is a premium, full-stack ecosystem that connects citizens and guardians to maintain a pristine environment. By combining real-time reporting, AI-powered classification, and interactive visualizations, CleanPulse restores harmony to our urban spaces — making cities cleaner, smarter, and more efficient."**

---

## 🎯 Goals of the Application

| Goal | Description |
|------|-------------|
| 📢 Easy Reporting | Citizens can report garbage issues instantly with geo-tagging |
| 🚛 Smart Collection | Collectors get organized pickup tasks and optimized routes |
| 📊 Admin Oversight | Admins monitor performance and problem areas via high-fidelity dashboards |
| 🌍 Planetary Healing | Restoring environmental harmony through community participation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **AI Engine** | Google Gemini (Chatbot & Image Classification) |
| **Auth** | JWT (JSON Web Token) |
| **Charts** | Recharts (High-fidelity visualizations) |

---

## 👥 User Roles

```
👨‍💼 Admin          → Monitor all reports, manage users, view analytics
🚛 Waste Collector → View assigned pickups, update pickup status
👤 Citizen         → Submit garbage reports, track status, earn eco-credits
```

---

## 🗺️ App Pages

```
/                    → Home / Landing Page (Premium Nature Theme)
/signup              → Join Sanctuary (Registration)
/login               → Login Access
/leaderboard         → Global Ranking & Eco-Credits

/citizen/dashboard   → Citizen Home      🔒
/citizen/submit      → Submit Report     🔒
/citizen/reports     → My Reports List   🔒
/citizen/profile     → Profile & Badges  🔒
/citizen/stats       → Public Analytics  🔒
/ecosystem           → System visualization (Architecture/Workflow)

/collector/dashboard → Collector Home    🔒
/collector/pickups   → Pickup List       🔒

/admin/dashboard     → Admin Analytics   🔒
/admin/reports       → All Reports       🔒
/admin/users         → User Management   🔒
```

> 🔒 = Protected Route (Login Required)

---

## 🧩 Premium Features

---

### 🔐 PART 1 — Authentication System
A secure, role-based authentication system for all three user types.
- ✅ **Role Based Access** — Citizen / Collector / Admin
- ✅ **JWT Authentication** — Token stored in localStorage
- ✅ **Protected Routes** — Each role sees only their pages

### 📊 PART 2 — Role Based Dashboards
After login, each user sees a completely different dashboard tailored to their specific needs.

### 📝 PART 3 — Garbage Report (CRUD)
Citizens submit garbage issue reports with details and photos, featuring **AI-powered waste classification**.

### 🔎 PART 4 — Search, Filter & Sort
All users can search and filter reports based on zone, status, and urgency with **debounced search**.

### 🚛 PART 5 — Pickup Management
Waste collectors manage their assignments in real-time, moving reports through the status flow from *Pending* to *Resolved*.

### 📊 PART 6 — Admin Panel & Analytics
Admin has full control over the system, viewing city-wide waste analytics via interactive charts.

### 🏅 PART 7 — Gamification & Rewards
Citizens earn **Eco-Credits** and achieve ranks:
- 🌱 **Seedling** (Start)
- 🌿 **Sprout** (100+ Credits)
- 🌲 **Forest Ranger** (500+ Credits)
- 🛡️ **Earth Guardian** (1000+ Credits)

### 🤖 PART 8 — AI Eco-Assistant
An integrated chatbot powered by **CleanPulse AI** (Google Gemini) that helps citizens with sustainability advice and recycling tips.

### Layers Visualization — PART 9
An interactive **Ecosystem** page that visualizes the technical architecture and operational workflow of the entire system.

### 🌙 PART 10 — Premium UI/UX
- **Nature Theme**: A serene, green-centric design focused on environment restoration.
- **Micro-animations**: Smooth transitions using Framer Motion.
- **Public Stats**: Live environment statistics for transparency and impact tracking.

---

## 📁 Folder Structure

```
cleanPulse/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # AIChatBot, WasteAnalyzer, Navbar...
│   │   ├── context/         # Auth + Theme Context
│   │   ├── pages/           
│   │   │   ├── Home.jsx     # Premium Landing
│   │   │   ├── citizen/     # Dashboard, Stats, Ecosystem...
│   │   │   ├── collector/   # Dashboard, Pickups...
│   │   │   └── admin/       # Dashboard, Reports, Users...
│   │   └── App.jsx          # Routing & Protected Layers
│
├── server/                  # Node.js Backend
│   ├── config/              # DB & Cloud config
│   ├── models/              # User, Report, Badge, Zone...
│   ├── routes/              # Auth, Reports, Analytics, AI...
│   ├── utils/               # Gamification Engine, AI helpers...
│   └── server.js            # Entry point
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cleanpulse.git
cd cleanpulse
```

### 2. Setup Backend
```bash
cd server
npm install
# Create .env with PORT, MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

---

## 👨‍💻 Team Members
| Name | Role |
|------|------|
| Member 1 | Frontend Specialist |
| Member 2 | Backend & AI Specialist |
| Member 3 | Database Engineer |
| Member 4 | UI/UX Designer |

---

> 🌿 *CleanPulse — Restoring Harmony, One Report at a Time.*
