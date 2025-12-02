
# Deskercise Dealer

Deskercise Dealer is a modern React + TypeScript web application that helps office workers stay active through randomized micro‑workouts delivered via an interactive card‑deck experience. The app includes guided timers, a shuffle flourish animation, customizable reminders, avatar personalization, difficulty filtering, and optional team competition.

This README reflects *all* features and enhancements now included in the deployed version of the app.

---

## Table of Contents
- Project Summary  
- Demo  
- Full Feature List  
- Tech Stack  
- Quick Start (Local)  
- Deploying on Replit  
- Configuration / Environment  
- Usage Guide  
- File / Folder Structure  
- Testing & Quality  
- Contributing  
- Roadmap  
- License  

---

## Project Summary
Deskercise Dealer helps users break long sedentary periods by drawing exercise cards from a deck and completing short, guided desk‑friendly movements. Users can select difficulty, set reminders, choose avatars, join teams, and follow a simple countdown‑timer flow for each exercise.

The app now includes:
- **Animated flourish** during deck shuffle  
- **Avatar selection** (persistent via localStorage)  
- **33 total exercises**, 11 per difficulty  
- **10‑draw no‑repeat guarantee** backed by a corrected recent‑draws algorithm  
- **Reliable localStorage sync** for preventing race conditions  

---

## Demo
- Live App: https://deskercise-dealer-kareywest.replit.app  
- GitHub Code: https://github.com/kareywest/DeskerciseDealer  

---

## Full Feature List

### 1. Card‑Deck Exercise UI
- Draw exercise cards with:  
  - Name  
  - Instructions  
  - Difficulty (Easy / Intense / Silent)  
  - Emoji/icon  
  - Duration badge  
- **Flourish animation** plays when deck is shuffled  
- Actions: Draw New Card, Repeat, Skip  

### 2. Guided Exercise Flow
- 3‑2‑1 fullscreen countdown  
- Exercise timer based on exercise duration  
- Pause / Resume / Stop  
- Completion screen  

### 3. Reminder System
- Custom reminder interval (e.g., 30/60/90 minutes)  
- In‑app banner & optional browser notifications  
- 5‑minute Snooze  
- Reliable timer cleanup  

### 4. Difficulty Modes
- Easy  
- Intense  
- Silent (office‑friendly)  
- Difficulty change **resets recent‑draw history**  

### 5. Avatar Personalization
- User chooses an avatar  
- Avatar persists across sessions  
- Displayed in header, deck, and team views  

### 6. Robust No‑Repeat Draw Logic
- Tracks last **10 unique exercise IDs**  
- Pool expanded to **33 exercises (11 per difficulty)** to allow true 10‑draw exclusion  
- Logic avoids premature resets & race conditions  
- Uses **localStorage as the source of truth**  

### 7. Team Features
- Login via Replit Auth  
- Create or join a team  
- Team leaderboard sorted by activity count  
- Activity increments on completing exercises  

### 8. Preferences Persistence
- Difficulty  
- Reminder interval  
- Theme (dark/light mode)  
- Avatar  

---

## Tech Stack
- **React + TypeScript**  
- **Vite** bundler  
- **Replit Auth**  
- **Replit DB** for teams and leaderboard  
- **localStorage** for client‑side persistence  

---

## Quick Start (Local)

```bash
git clone https://github.com/kareywest/DeskerciseDealer.git
cd DeskerciseDealer
npm install
npm run dev
```

Navigate to the local URL displayed (usually http://localhost:5173).

---

## Deploying on Replit
- Works out of the box using Replit’s hosting & Auth.  
- Ensure secrets for Replit Auth & DB are configured in Replit’s environment variables.

---

## Configuration / Environment

```
VITE_API_BASE_URL=http://localhost:3000
REPLIT_AUTH_CLIENT_ID=your_replit_client_id
REPLIT_DB_URL=your_replit_db_url
```

---

## Usage Guide
1. Select difficulty & reminder preferences  
2. Choose your avatar  
3. Shuffle the deck (flourish animation plays)  
4. Draw a card → start the guided countdown → perform the exercise  
5. Join a team to compete via the leaderboard  
6. Enjoy automatically prevented repeats within 10 draws  

---

## File / Folder Structure

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
├── replit.md
├── package.json
└── README.md
```

---

## Testing & Quality
- Ensure 10‑draw no‑repeat logic persists exactly 10 unique IDs  
- Verify avatar persistence on refresh  
- Reminder snooze and cleanup work correctly  
- Countdown and timer cleanup verified  

---

## Contributing
- Branch from `main`  
- Use descriptive commit messages  
- Add tests for new logic  
- Submit PR with clear description  

---

## Roadmap
- Weekly / daily leaderboard filters  
- Mobile‑first refinements  
- Accessibility improvements  
- Analytics dashboard  

---

## License
MIT License (recommended for academic projects)
