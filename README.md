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

## Architecture Overview

The app follows a decoupled frontend/backend architecture:

- **Frontend (Next.js)**: Client-rendered pages call the backend via a typed API client (`lib/api.ts`). No server-side rendering of user-specific data — all state is fetched live from the API on each page load.
- **Backend (FastAPI)**: Exposes REST endpoints grouped by domain (path, lessons, users, leaderboard, dev). Business logic (grading, XP, streaks, hearts) lives in dedicated service modules, keeping route handlers thin.
- **Database (SQLite)**: Single-file relational database, initialized and seeded automatically on backend startup.
- **Single learner model**: Per assignment scope, there's no auth — the app operates as one default logged-in learner (`/api/users/me` always returns the same seeded user).

## Database Schema

| Table | Purpose | Key Relationships |
|---|---|---|
| `users` | The learner: streak, XP, hearts, gems, daily goal | Has many skill_progress, lesson_attempts, user_achievements, league_memberships |
| `courses` | A language course (e.g. Spanish) | Has many units |
| `units` | A themed group of skills (e.g. "Unit 1: Basics") | Belongs to course; has many skills |
| `skills` | A skill node on the path (e.g. "Greetings") | Belongs to unit; has many lessons |
| `lessons` | A single lesson (sequence of exercises) | Belongs to skill; has many exercises |
| `exercises` | One exercise within a lesson | Belongs to lesson; stores type, prompt, correct answer, and options as JSON |
| `skill_progress` | Per-user progress on a skill (composite PK: user_id + skill_id) | Tracks status (locked/available/completed) and crown level (0-5) |
| `lesson_attempts` | A record of each lesson attempt/completion | Tracks correctness, XP earned, hearts lost |
| `achievements` | Achievement definitions | Has many user_achievements |
| `user_achievements` | Which achievements a user has unlocked (composite PK) | Links users and achievements, with unlock timestamp |
| `league_memberships` | Weekly leaderboard XP per user (composite PK: user_id + week_start) | Powers the leaderboard |
| `dev_settings` | Key-value store for dev/testing state (e.g. simulated date) | Used by the Dev Simulator |

Design notes: composite primary keys are used for join-style tables (`skill_progress`, `user_achievements`, `league_memberships`) instead of surrogate IDs, since each pairing is naturally unique and queried by both sides. Exercise data (`correct_answer`, `options`, `metadata`) is stored as JSON to accommodate the differing shapes of the 5 exercise types without needing a separate table per type.

## API Overview

| Router | Endpoints | Purpose |
|---|---|---|
| `path` | `GET /api/path` | Fetch the full learning path (units, skills, progress) for the current user |
| `lessons` | `GET /api/lessons/{id}`, `POST /api/lessons/{id}/submit` | Fetch a lesson's exercises; submit answers for grading and progress updates |
| `users` | `GET /api/users/me`, `POST /api/users/me/hearts/refill` | Fetch profile/stats; refill hearts using gems |
| `leaderboard` | `GET /api/leaderboard` | Fetch the current weekly league standings |
| `dev` | `POST /api/dev/advance-day`, `POST /api/dev/reset-day`, `GET /api/dev/status` | Testing utilities to simulate day changes for streak/quest logic |

Full interactive API docs (Swagger UI) are available at `/docs` on the backend URL.

## Assumptions

- No real authentication — a single seeded learner (`Carlos M.`) represents the logged-in user throughout, per assignment scope.
- Only Spanish is seeded as a course; other languages appear as "Coming Soon" via the language switcher.
- Leaderboard data is seeded with sample users rather than reflecting real multi-user activity.
- SQLite is used for simplicity and portability; on the deployed backend (Render free tier), the database file may reset on redeploy/restart, at which point it auto-reseeds via `seed.py`.
- Streak/day-based logic (daily XP quest, streak increments) uses a "simulated date" stored in `dev_settings`, advanced via the Dev Simulator, rather than relying on real wall-clock day changes — this makes the day-based gamification testable without waiting real days.

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