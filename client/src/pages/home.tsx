import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, History, Moon, Sun, LogIn, LogOut, Home as HomeIcon } from 'lucide-react';
import WelcomeScreen from '@/components/WelcomeScreen';
import CardDeck from '@/components/CardDeck';
import ExerciseCard from '@/components/ExerciseCard';
import SettingsPanel from '@/components/SettingsPanel';
import HistoryView from '@/components/HistoryView';
import TeamView from '@/components/TeamView';
import TeamDialog from '@/components/TeamDialog';
import TeamList from '@/components/TeamList';
import ReminderBanner from '@/components/ReminderBanner';
import AvatarPicker from '@/components/AvatarPicker';
import UserAvatar from '@/components/UserAvatar';
import { exercises, type DifficultyLevel, type Exercise } from '@/data/exercises';
import { useAuth } from '@/hooks/useAuth';
import { useExerciseReminder } from '@/hooks/useExerciseReminder';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { Team, ExerciseLog } from '@shared/schema';

type View = 'welcome' | 'deck' | 'card' | 'history' | 'team';

interface ExerciseHistoryItem {
  id: string;
  exerciseName: string;
  emoji: string;
  timestamp: Date;
  status: 'completed' | 'skipped';
}

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<View>('welcome');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [interval, setInterval] = useState(30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [shouldShuffle, setShouldShuffle] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [recentCards, setRecentCards] = useState<string[]>([]);
  const shuffleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Fetch user teams if authenticated
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    enabled: isAuthenticated,
  });

  // Fetch user exercise logs if authenticated
  const { data: serverLogs = [] } = useQuery<ExerciseLog[]>({
    queryKey: ['/api/exercise-logs'],
    enabled: isAuthenticated,
  });

  // Fetch user stats if authenticated
  const { data: stats } = useQuery<{ total: number; streak: number }>({
    queryKey: ['/api/stats'],
    enabled: isAuthenticated,
  });

  // Mutation for logging exercises
  const logExerciseMutation = useMutation({
    mutationFn: async (log: { exerciseName: string; emoji: string; difficulty: string; status: string }) => {
      return await apiRequest('POST', '/api/exercise-logs', log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      if (selectedTeam) {
        queryClient.invalidateQueries({ queryKey: ['/api/teams', selectedTeam.id, 'logs'] });
      }
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Mutation for updating avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarEmoji: string) => {
      return await apiRequest('PATCH', '/api/user/avatar', { avatarEmoji });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Avatar updated!",
        description: "Your new avatar has been saved",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to update avatar",
          variant: "destructive",
        });
      }
    },
  });

  // Exercise reminder with snooze functionality
  const handleReminder = useCallback(() => {
    toast({
      title: "Time for Deskercise!",
      description: "Take a quick break and do a desk exercise",
    });
  }, [toast]);

  const reminder = useExerciseReminder({
    intervalMinutes: interval,
    enabled: notificationsEnabled,
    onReminder: handleReminder,
  });

  useEffect(() => {
    const stored = localStorage.getItem('deskercise-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      setInterval(settings.interval || 30);
      setDifficulty(settings.difficulty || 'easy');
      setNotificationsEnabled(settings.notificationsEnabled || false);
      if (!authLoading) {
        setView('deck');
      }
    }

    // Load local history for unauthenticated users
    if (!isAuthenticated) {
      const storedHistory = localStorage.getItem('deskercise-history');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      }
    }

    // Load recent cards history
    const storedRecentCards = localStorage.getItem('deskercise-recent-cards');
    if (storedRecentCards) {
      try {
        setRecentCards(JSON.parse(storedRecentCards));
      } catch {
        // Ignore invalid data
      }
    }

    const storedDarkMode = localStorage.getItem('deskercise-darkmode');
    if (storedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [authLoading, isAuthenticated]);

  // Sync server logs to local history format
  useEffect(() => {
    if (isAuthenticated && serverLogs.length > 0) {
      const convertedHistory = serverLogs.map(log => ({
        id: log.id,
        exerciseName: log.exerciseName,
        emoji: log.emoji,
        timestamp: new Date(log.completedAt || new Date()),
        status: log.status as 'completed' | 'skipped'
      }));
      setHistory(convertedHistory);
    }
  }, [isAuthenticated, serverLogs]);

  // Cleanup shuffle timeout on unmount
  useEffect(() => {
    return () => {
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current);
      }
    };
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

  const returnToDeck = () => {
    setShouldShuffle(true);
    setView('deck');
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
    }
    shuffleTimeoutRef.current = setTimeout(() => setShouldShuffle(false), 100);
  };

  const drawRandomCard = () => {
    const filtered = getFilteredExercises();
    if (filtered.length === 0) return;
    
    // Always read from localStorage to get the most up-to-date recent cards list
    // This prevents race conditions with rapid state updates
    let currentRecent: string[] = [];
    try {
      const stored = localStorage.getItem('deskercise-recent-cards');
      if (stored) {
        currentRecent = JSON.parse(stored);
      }
    } catch {
      // Ignore invalid data
    }
    
    // Exclude recently drawn cards (last 10)
    let available = filtered.filter(ex => !currentRecent.includes(ex.id));
    
    // If no cards are available (all are in recent list):
    // - If recent list is already at 10, we can safely exclude the last 10
    // - If recent list < 10, we need to make room by removing oldest entries
    if (available.length === 0) {
      if (currentRecent.length >= 10) {
        // List is full (10 items), remove oldest to make room
        currentRecent = currentRecent.slice(0, -1);
      } else if (currentRecent.length >= filtered.length) {
        // All exercises in pool are in recent list, but list < 10
        // Remove oldest to cycle through exercises
        currentRecent = currentRecent.slice(0, -1);
      }
      available = filtered.filter(ex => !currentRecent.includes(ex.id));
    }
    
    // If still no cards available (shouldn't happen), allow any card
    if (available.length === 0) {
      available = filtered;
      currentRecent = [];
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedExercise = available[randomIndex];
    
    // Update recent cards list (keep last 10)
    const updatedRecent = [selectedExercise.id, ...currentRecent].slice(0, 10);
    setRecentCards(updatedRecent);
    localStorage.setItem('deskercise-recent-cards', JSON.stringify(updatedRecent));
    
    setCurrentExercise(selectedExercise);
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
    // If authenticated, log to server
    if (isAuthenticated) {
      logExerciseMutation.mutate({
        exerciseName: exercise.name,
        emoji: exercise.emoji,
        difficulty: exercise.difficulty,
        status
      });
    } else {
      // Otherwise, use local storage
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
    }
    
    // Reset reminder timer when exercise is completed
    if (status === 'completed' && notificationsEnabled) {
      reminder.reset();
    }
  };

  const calculateStreak = () => {
    if (isAuthenticated && stats) {
      return stats.streak;
    }

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

  const getTotalExercises = () => {
    if (isAuthenticated && stats) {
      return stats.total;
    }
    return history.filter(h => h.status === 'completed').length;
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show welcome screen if not started yet
  if (view === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-heading font-bold text-primary" data-testid="text-app-title">
            Deskercise Dealer
          </h1>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAvatarPickerOpen(true)}
                  className="rounded-full"
                  data-testid="button-avatar"
                >
                  <UserAvatar user={user} size="sm" />
                </Button>
                <TeamDialog onTeamCreated={() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
                }} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => window.location.href = '/api/login'}
                className="gap-2"
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('welcome')}
              data-testid="button-home"
            >
              <HomeIcon className="w-5 h-5" />
            </Button>
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
        {isAuthenticated && teams.length > 0 && view !== 'team' && (
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold mb-3">Your Teams</h2>
            <TeamList 
              teams={teams} 
              onSelectTeam={(team) => {
                setSelectedTeam(team);
                setView('team');
              }}
              selectedTeamId={selectedTeam?.id}
            />
          </div>
        )}

        {view === 'deck' && (
          <CardDeck
            onDrawCard={drawRandomCard}
            cardsRemaining={getFilteredExercises().length}
            shouldShuffle={shouldShuffle}
          />
        )}

        {view === 'card' && currentExercise && (
          <div className="py-8">
            <ExerciseCard
              exercise={currentExercise}
              onRepeat={handleRepeat}
              onSkip={handleSkip}
              onDrawNew={handleDrawNew}
              onBack={returnToDeck}
              isFlipped={isCardFlipped}
            />
          </div>
        )}

        {view === 'history' && (
          <HistoryView
            history={history}
            totalExercises={getTotalExercises()}
            streak={calculateStreak()}
          />
        )}

        {view === 'team' && selectedTeam && (
          <TeamView
            teamId={selectedTeam.id}
            teamName={selectedTeam.name}
            onLeave={() => {
              setSelectedTeam(null);
              returnToDeck();
              queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
            }}
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
          // Clear recent cards when difficulty changes (new pool of exercises)
          setRecentCards([]);
          localStorage.removeItem('deskercise-recent-cards');
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

      {reminder.showBanner && (
        <ReminderBanner
          onSnooze={reminder.snooze}
          onDismiss={reminder.dismiss}
          onDrawCard={() => {
            reminder.dismiss();
            setView('deck');
            drawRandomCard();
          }}
        />
      )}

      <AvatarPicker
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        currentAvatar={user?.avatarEmoji || undefined}
        onSelect={(emoji) => updateAvatarMutation.mutate(emoji)}
      />
    </div>
  );
}
