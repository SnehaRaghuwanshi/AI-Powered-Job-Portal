# TalentAI — AI-Powered Job Portal

A full-stack job portal with AI resume screening built with **Node.js + React + MongoDB + Anthropic Claude API**.

---

## Features

- **Job Listings** — Browse, search, filter jobs with pagination
- **AI Resume Screener** — Upload PDF/DOCX/TXT resumes, get ranked candidates with match scores, skill analysis, and hire/pass recommendation
- **AI Job Description Generator** — Auto-generate JD from title + skills using Claude
- **Authentication** — JWT-based login for Job Seekers and Recruiters
- **Apply with Resume** — Upload resume on apply, extracted and stored
- **Recruiter Dashboard** — Manage postings, view applicants

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, React Router v6     |
| Backend   | Node.js, Express              |
| Database  | MongoDB + Mongoose            |
| AI        | Anthropic Claude API (claude-sonnet) |
| Auth      | JWT + bcryptjs                |
| File Parse| pdf-parse, mammoth (DOCX)     |
| Upload    | Multer                        |

---

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Anthropic API key → https://console.anthropic.com

---

### Step 1 — Clone & Setup Backend

```bash
### dir , ke baad cd talentai , uske baad yeah niche bala
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talentai
JWT_SECRET=any_random_secret_string_here
ANTHROPIC_API_KEY=sk-ant-xxxxxx
```

Start backend:
```bash
npm run dev      # development (with nodemon)
# OR
npm start        # production
```

Backend runs on: http://localhost:5000

---

### Step 2 — Setup Frontend

```bash

cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

The `"proxy": "http://localhost:5000"` in frontend/package.json routes API calls automatically.

---

## Project Structure

```
talentai/
├── backend/
│   ├── server.js              # Entry point
│   ├── .env.example           # Environment variables template
│   ├── models/
│   │   ├── User.js            # User schema (jobseeker/recruiter)
│   │   ├── Job.js             # Job listing schema
│   │   └── Application.js     # Application + resume schema
│   ├── routes/
│   │   ├── auth.js            # Register, login, /me
│   │   ├── jobs.js            # CRUD for jobs
│   │   ├── screen.js          # AI screening + JD generation
│   │   └── applications.js    # Apply, list applications
│   └── middleware/
│       └── auth.js            # JWT protect + recruiterOnly
│
└── frontend/
    └── src/
        ├── App.js             # Router + layout
        ├── index.css          # Global styles
        ├── context/
        │   └── AuthContext.js # Auth state + login/register/logout
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── Home.js        # Job listings + search
            ├── Login.js
            ├── Register.js
            ├── JobDetail.js   # Job page + apply form
            ├── Screener.js    # AI resume screener (recruiter)
            ├── PostJob.js     # Post job + AI JD generator
            └── Dashboard.js   # User dashboard
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |

### Jobs
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/jobs | List jobs (search, filter, paginate) |
| GET  | /api/jobs/:id | Get single job |
| POST | /api/jobs | Create job (recruiter) |
| PUT  | /api/jobs/:id | Update job (recruiter) |
| DELETE | /api/jobs/:id | Remove job (recruiter) |

### AI Screener
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/screen | Screen resumes against JD (multipart) |
| POST | /api/screen/generate-jd | Generate JD with AI |

### Applications
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/apply | Submit application + resume |
| GET  | /api/apply/job/:jobId | List applications for job (recruiter) |
| PATCH | /api/apply/:id/status | Update status (recruiter) |

---

## Deployment

### Backend → Render (Free)
1. Push to GitHub
2. New Web Service on render.com
3. Build: `npm install`, Start: `node server.js`
4. Add env vars in Render dashboard

### Frontend → Vercel (Free)
1. Push frontend folder to GitHub
2. Import on vercel.com
3. Change `proxy` in package.json to your Render backend URL
4. Add `REACT_APP_API_URL` env var if needed

### Database → MongoDB Atlas (Free 512MB)
1. Create cluster on mongodb.com/atlas
2. Get connection string
3. Replace `MONGODB_URI` in .env

---

## Resume in One Line

> Built a full-stack AI job portal (React + Node.js + MongoDB) with NLP-based resume screening using Anthropic Claude API — featuring real PDF parsing, JWT auth, candidate ranking, and recruiter dashboard.
