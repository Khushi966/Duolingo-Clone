# Duolingo Web Clone

A functional clone of the Duolingo web app, built as an SDE Fullstack placement assignment. Replicates Duolingo's core learning experience: skill tree progression, gamified lesson loop, hearts/XP/streak systems, and leaderboards.

## Live Links

- **Live App**: https://duolingo-clone-navy-alpha.vercel.app
- **Backend API Docs**: https://duolingo-clone-64zd.onrender.com/docs
- **GitHub Repository**: https://github.com/Khushi966/Duolingo-Clone
> Note: The backend is hosted on Render's free tier, which may spin down after periods of inactivity. If the app seems slow to load data on first visit, the backend is waking up — this can take 30-60 seconds.

## Tech Stack

- **Frontend**: Next.js (TypeScript)
- **Backend**: Python (FastAPI)
- **Database**: SQLite

## Features

- **Learning Path / Skill Tree** — unit-based path with locked/unlocked/completed skill nodes, level progression per skill
- **Lesson Player** — full exercise loop with 5 exercise types: Multiple Choice, Translate (Word Bank), Match Pairs, Fill in the Blank, Type the Answer
- **Hearts system** — lose hearts on wrong answers, refill with gems, "Out of Hearts" modal
- **XP, Gems, Streaks** — earned per lesson, daily XP quest tracking, day-based streak logic
- **Achievements** — unlockable based on performance conditions
- **Leaderboard** — league-based weekly rankings
- **Profile page** — stats, achievements, recent practice history
- **Custom mascot** — original character design (not Duolingo's owl)
- **Dev Simulator** — endpoints to simulate day advancement for testing streaks/quests

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend runs at `http://127.0.0.1:8000` (API docs at `/docs`).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

## Known Limitations

- Achievement records created during early development (before a logic fix to accuracy/hearts validation) may not reflect current unlock conditions for a test user's existing data.
- Only Spanish course content is seeded; other languages are shown as "coming soon" in the language switcher.
- Mobile responsiveness has not been fully polished.

## AI Tool Usage

This project was built with AI-assisted development (Antigravity) per assignment guidelines, with manual review, testing, and bug fixes throughout.