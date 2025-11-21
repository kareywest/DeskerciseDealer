# Deskercise Dealer

Deskercise Dealer is a React + TypeScript web app that prompts office workers to perform short, randomized desk exercises at customizable intervals. It includes guided timers, countdowns, snoozeable reminders, and optional team leaderboards for accountability.

---

## Table of Contents
- Project Summary
- Demo
- Features
- Tech Stack
- Quick Start (Local)
- Run on Replit / Deploy
- Configuration / Environment
- Usage
- File / Folder Structure
- Testing & Quality
- Contributing
- Roadmap
- Credits & License

---

## Project Summary
Deskercise Dealer helps users break long sedentary periods with micro‑workouts presented as a randomized card deck. The app includes customizable reminder intervals, a 5‑minute snooze option, difficulty filters (Easy / Intense / Silent), a guided exercise timer, and light team/leaderboard features.

---

## Demo
- Live App: https://deskercise-dealer-kareywest.replit.app
- GitHub Repo: https://github.com/kareywest/DeskerciseDealer

---

## Features
- Randomized exercise cards with instructions, duration, and difficulty
- Guided 3–2–1 countdown and exercise timer
- Pause / Resume / Stop controls
- Custom reminder intervals with snooze
- Difficulty filtering
- Team creation and simple leaderboard
- LocalStorage‑persisted preferences
- Responsive UI and dark mode

---

## Tech Stack
- React + TypeScript
- Vite / npm
- Replit Auth
- Replit DB (or equivalent)
- LocalStorage for client preferences

---

## Quick Start (Local)

```bash
git clone https://github.com/kareywest/DeskerciseDealer.git
cd DeskerciseDealer
npm install
npm run dev
```

Then open the local URL printed in terminal (typically http://localhost:5173).

---

## Run on Replit / Deploy
- Runs automatically inside Replit using Replit Auth.
- For Netlify/Vercel deployment, replace or stub Replit‑specific auth/DB variables.

---

## Configuration / Environment
Create `.env` or `.env.local`:

```
VITE_API_BASE_URL=http://localhost:3000
REPLIT_AUTH_CLIENT_ID=your_replit_client_id
REPLIT_DB_URL=your_replit_db_url
```

---

## Usage
1. Set reminder interval and difficulty.
2. Select “Draw Card” to receive a random exercise.
3. Start exercise → 3–2–1 countdown → timer.
4. Pause/Resume/Stop as needed.
5. Enable notifications for reminders.
6. Join or create a team to appear on the leaderboard.

---

## Suggested File / Folder Structure

```
/deskercise-dealer
├── client/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
├── package.json
└── README.md
```

---

## Testing & Quality
- Add unit tests for hooks: reminder logic, exercise timer logic.
- Manual QA recommendations:
  - Timer behavior
  - Snooze logic
  - Leaderboard updates

---

## Contributing
1. Create a feature branch.
2. Commit with descriptive messages.
3. Open a Pull Request linked to relevant tasks.
4. Add tests for new features.

---

## Roadmap
- Daily/weekly leaderboard filters  
- Exercise history and export  
- Engagement analytics  
- Accessibility improvements  

---

## Credits & License
Created for an MBA‑level AI course.  
Recommended License: MIT  
