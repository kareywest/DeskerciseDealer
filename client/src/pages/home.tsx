import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, History, Moon, Sun } from 'lucide-react';
import WelcomeScreen from '@/components/WelcomeScreen';
import CardDeck from '@/components/CardDeck';
import ExerciseCard from '@/components/ExerciseCard';
import SettingsPanel from '@/components/SettingsPanel';
import HistoryView from '@/components/HistoryView';
import { exercises, type DifficultyLevel, type Exercise } from '@/data/exercises';

type View = 'welcome' | 'deck' | 'card' | 'history';

interface ExerciseHistoryItem {
  id: string;
  exerciseName: string;
  emoji: string;
  timestamp: Date;
  status: 'completed' | 'skipped';
}

export default function Home() {
  const [view, setView] = useState<View>('welcome');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [interval, setInterval] = useState(30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('deskercise-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      setInterval(settings.interval || 30);
      setDifficulty(settings.difficulty || 'easy');
      setNotificationsEnabled(settings.notificationsEnabled || false);
      setView('deck');
    }

    const storedHistory = localStorage.getItem('deskercise-history');
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }

    const storedDarkMode = localStorage.getItem('deskercise-darkmode');
    if (storedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleStart = (newInterval: number, newDifficulty: DifficultyLevel) => {
    setInterval(newInterval);
    setDifficulty(newDifficulty);
    localStorage.setItem('deskercise-settings', JSON.stringify({
      interval: newInterval,
      difficulty: newDifficulty,
      notificationsEnabled
    }));
    setView('deck');
  };

  const getFilteredExercises = () => {
    return exercises.filter(ex => ex.difficulty === difficulty);
  };

  const drawRandomCard = () => {
    const filtered = getFilteredExercises();
    if (filtered.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setCurrentExercise(filtered[randomIndex]);
    setIsCardFlipped(false);
    setTimeout(() => setIsCardFlipped(true), 100);
    setView('card');
  };

  const handleRepeat = () => {
    if (currentExercise) {
      addToHistory(currentExercise, 'completed');
    }
  };

  const handleSkip = () => {
    if (currentExercise) {
      addToHistory(currentExercise, 'skipped');
    }
    drawRandomCard();
  };

  const handleDrawNew = () => {
    if (currentExercise) {
      addToHistory(currentExercise, 'completed');
    }
    drawRandomCard();
  };

  const addToHistory = (exercise: Exercise, status: 'completed' | 'skipped') => {
    const newItem: ExerciseHistoryItem = {
      id: `${Date.now()}-${exercise.id}`,
      exerciseName: exercise.name,
      emoji: exercise.emoji,
      timestamp: new Date(),
      status
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('deskercise-history', JSON.stringify(updatedHistory));
  };

  const calculateStreak = () => {
    if (history.length === 0) return 0;
    
    const completedDates = new Set(
      history
        .filter(item => item.status === 'completed')
        .map(item => item.timestamp.toDateString())
    );
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (completedDates.has(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('deskercise-darkmode', String(newMode));
  };

  if (view === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-heading font-bold text-primary" data-testid="text-app-title">
            Deskercise Dealer
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant={view === 'history' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView(view === 'history' ? 'deck' : 'history')}
              data-testid="button-history"
            >
              <History className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {view === 'deck' && (
          <CardDeck
            onDrawCard={drawRandomCard}
            cardsRemaining={getFilteredExercises().length}
          />
        )}

        {view === 'card' && currentExercise && (
          <div className="py-8">
            <ExerciseCard
              exercise={currentExercise}
              onRepeat={handleRepeat}
              onSkip={handleSkip}
              onDrawNew={handleDrawNew}
              onBack={() => setView('deck')}
              isFlipped={isCardFlipped}
            />
          </div>
        )}

        {view === 'history' && (
          <HistoryView
            history={history}
            totalExercises={history.filter(h => h.status === 'completed').length}
            streak={calculateStreak()}
          />
        )}
      </main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        interval={interval}
        difficulty={difficulty}
        notificationsEnabled={notificationsEnabled}
        onIntervalChange={(val) => {
          setInterval(val);
          localStorage.setItem('deskercise-settings', JSON.stringify({
            interval: val,
            difficulty,
            notificationsEnabled
          }));
        }}
        onDifficultyChange={(val) => {
          setDifficulty(val);
          localStorage.setItem('deskercise-settings', JSON.stringify({
            interval,
            difficulty: val,
            notificationsEnabled
          }));
        }}
        onNotificationsToggle={(val) => {
          setNotificationsEnabled(val);
          localStorage.setItem('deskercise-settings', JSON.stringify({
            interval,
            difficulty,
            notificationsEnabled: val
          }));
        }}
      />
    </div>
  );
}
