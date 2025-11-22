# Deskercise Dealer

A playful, React-based web application that helps office workers stay active by prompting them to perform randomized desk exercises at customizable intervals. Now with team accountability features!

## Features

### Core Features
- **Card-deck UI**: Virtual deck of exercise cards with a "Draw Card" button and shuffle flourish animation
- **Exercise Timer**: Start button initiates 3-2-1 countdown, then exercise timer based on card duration
- **Timer Controls**: Pause, resume, and stop functionality during exercises
- **Customizable Reminders**: Set reminder frequency (30, 60, or 90 minutes) with 5-minute snooze
- **Difficulty Filtering**: Choose between Easy, Intense, or Silent Mode exercises
- **Exercise Actions**: Draw new card, repeat current, skip, or return to deck
- **Shuffle Animation**: Playful card flourish when returning to deck from exercise or team view
- **Persistent Storage**: User preferences saved locally or in database (when logged in)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes

### Team Accountability Features (NEW!)
- **User Authentication**: Log in with Google, GitHub, Apple, email/password via Replit Auth
- **Create Teams**: Form exercise teams with friends and colleagues
- **Join Teams**: Use invite codes to join existing teams
- **Team Leaderboard**: See rankings based on completed exercises
- **Activity Feed**: View recent team member exercises in real-time
- **Streak Tracking**: Monitor consecutive days with completed exercises
- **Cross-device Sync**: Exercise history syncs across all your devices when logged in

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn/ui components with Tailwind CSS
- Framer Motion for animations

### Backend
- Express.js server
- PostgreSQL database (Neon)
- Drizzle ORM
- Replit Auth (OpenID Connect)
- Passport.js for session management

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Shadcn UI primitives
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── CardDeck.tsx
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   ├── HistoryView.tsx
│   │   │   ├── TeamView.tsx
│   │   │   ├── TeamDialog.tsx
│   │   │   └── TeamList.tsx
│   │   ├── data/             # Exercise database
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   └── App.tsx
├── server/
│   ├── db.ts                 # Database connection
│   ├── storage.ts            # Data access layer
│   ├── routes.ts             # API endpoints
│   ├── replitAuth.ts         # Authentication setup
│   └── index.ts              # Express server
├── shared/
│   └── schema.ts             # Shared TypeScript types and Drizzle schema
└── design_guidelines.md      # Design system documentation
```

## Database Schema

### Tables
- **users**: User profiles (managed by Replit Auth)
- **sessions**: User sessions (managed by Passport.js)
- **teams**: Exercise teams
- **teamMembers**: Team membership (junction table)
- **exerciseLogs**: User exercise history

## API Routes

### Authentication
- `GET /api/login` - Initiates login flow
- `GET /api/callback` - OAuth callback
- `GET /api/logout` - Logs out user
- `GET /api/auth/user` - Gets current user info

### Teams
- `POST /api/teams` - Create a new team
- `GET /api/teams` - Get user's teams
- `GET /api/teams/:teamId` - Get team details
- `POST /api/teams/join` - Join team with invite code
- `DELETE /api/teams/:teamId/leave` - Leave a team
- `GET /api/teams/:teamId/members` - Get team members
- `GET /api/teams/:teamId/logs` - Get team exercise logs

### Exercise Logs
- `POST /api/exercise-logs` - Log an exercise
- `GET /api/exercise-logs` - Get user's exercise logs
- `GET /api/stats` - Get user stats (total, streak)

## Running the Project

The workflow "Start application" runs `npm run dev` which:
1. Starts the Express server on port 5000
2. Serves the Vite frontend
3. Handles hot module reloading

## Database Management

To sync database schema changes:
```bash
npm run db:push
```

To forcefully sync (if regular push fails):
```bash
npm run db:push --force
```

## Environment Variables

Required environment variables (automatically set by Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit application ID
- `ISSUER_URL` - OIDC issuer URL (defaults to https://replit.com/oidc)

## User Journey

### First Visit (Unauthenticated)
1. See welcome screen with app intro
2. Set preferred interval and difficulty
3. Start using the app (data saved locally)
4. Optional: Log in to enable team features

### Authenticated User
1. Log in with Replit Auth
2. Exercise history automatically syncs to database
3. Create or join teams
4. View team leaderboard and activity
5. Keep yourself and teammates accountable

### Team Usage
1. Create a team and share the invite code
2. Friends join using the invite code
3. Everyone's exercises appear on team activity feed
4. Compete on the leaderboard (ranked by completed exercises)
5. Track team member streaks and progress

## Design System

The app uses a vibrant, playful color scheme:
- Primary: Teal (hsl(174, 65%, 42%))
- Accent: Yellow (hsl(48, 95%, 76%))
- Chart colors: Pink, yellow, blue, purple

Fonts:
- Headings: Poppins
- Body: Inter

See `design_guidelines.md` for complete design specifications.

## Exercise Database

15 curated exercises across three difficulty levels:
- **Silent Mode**: Discreet stretches (neck rolls, wrist circles, eye exercises)
- **Easy**: Light movements (shoulder shrugs, arm circles, calf raises)
- **Intense**: Cardio workouts (desk push-ups, jumping jacks, burpees)

Each exercise includes:
- Name
- Description with step-by-step instructions
- Emoji icon
- Difficulty level

## Development Notes

### State Management
- Local state with React hooks for UI
- TanStack Query for server state
- LocalStorage for unauthenticated users
- PostgreSQL for authenticated users

### Authentication Flow
- Uses Replit Auth (OpenID Connect)
- Automatic token refresh
- Session stored in PostgreSQL
- Protected API routes with middleware

### Error Handling
- Unauthorized errors trigger login redirect
- Toast notifications for user feedback
- Graceful fallback for offline state

## Future Enhancements

Potential features for future development:
- Exercise completion tracking with streak counter and achievement badges
- Exercise favorites and custom deck creation
- Social sharing features to challenge coworkers
- Weekly activity reports and progress visualization charts
- Expanded exercise database with video demonstrations
- Team challenges and competitions
- Push notifications for exercise reminders
- Integration with fitness trackers
