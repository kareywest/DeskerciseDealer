import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, SkipForward, ArrowLeft, Sparkles, Play, Pause, Square } from 'lucide-react';
import type { Exercise } from '@/data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onRepeat: () => void;
  onSkip: () => void;
  onDrawNew: () => void;
  onBack: () => void;
  isFlipped: boolean;
}

type TimerState = 'idle' | 'countdown' | 'running' | 'paused' | 'complete';

export default function ExerciseCard({ 
  exercise, 
  onRepeat, 
  onSkip, 
  onDrawNew, 
  onBack,
  isFlipped 
}: ExerciseCardProps) {
  const [isSkipping, setIsSkipping] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(exercise.durationSeconds);
  const timerRef = useRef<number | null>(null);

  // Cleanup timer on unmount or when exercise changes
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [exercise.id]);

  // Reset timer when exercise changes
  useEffect(() => {
    setTimerState('idle');
    setCountdown(3);
    setTimeRemaining(exercise.durationSeconds);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [exercise.id, exercise.durationSeconds]);

  const startCountdown = () => {
    setTimerState('countdown');
    setCountdown(3);
    
    let currentCount = 3;
    const countdownInterval = window.setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        window.clearInterval(countdownInterval);
        startExerciseTimer();
      }
    }, 1000);
  };

  const startExerciseTimer = () => {
    setTimerState('running');
    setTimeRemaining(exercise.durationSeconds);
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimerState('complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState('paused');
  };

  const resumeTimer = () => {
    setTimerState('running');
    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimerState('complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState('idle');
    setTimeRemaining(exercise.durationSeconds);
    setCountdown(3);
  };

  const handleSkip = () => {
    stopTimer();
    setIsSkipping(true);
    setTimeout(() => {
      onSkip();
      setIsSkipping(false);
    }, 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyColors = {
    easy: 'bg-primary/10 text-primary border-primary/20',
    intense: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    silent: 'bg-accent/10 text-accent-foreground border-accent/20'
  };

  const difficultyLabels = {
    easy: 'Easy',
    intense: 'Intense',
    silent: 'Silent'
  };

  return (
    <div 
      className={`relative transition-all duration-300 ${isSkipping ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'}`}
      style={{ 
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s'
      }}
    >
      <Card 
        className="max-w-md mx-auto shadow-2xl border-2"
        data-testid={`card-exercise-${exercise.id}`}
      >
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 flex items-center justify-center text-8xl" data-testid="text-exercise-emoji">
              {exercise.emoji}
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center gap-2">
              <span 
                className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold border ${difficultyColors[exercise.difficulty]}`}
                data-testid="badge-difficulty"
              >
                {difficultyLabels[exercise.difficulty]}
              </span>
              <span 
                className="inline-flex px-3 py-1 rounded-md text-xs font-semibold border bg-muted"
                data-testid="badge-duration"
              >
                {exercise.durationSeconds}s
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold" data-testid="text-exercise-name">
              {exercise.name}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-exercise-description">
              {exercise.description}
            </p>
          </div>

          {/* Timer Display */}
          {(timerState === 'running' || timerState === 'paused' || timerState === 'complete') && (
            <div className="text-center">
              <div className={`text-6xl font-bold ${timerState === 'complete' ? 'text-primary' : 'text-foreground'}`} data-testid="text-timer">
                {formatTime(timeRemaining)}
              </div>
              {timerState === 'complete' && (
                <p className="text-lg text-primary font-semibold mt-2" data-testid="text-complete">
                  Complete! 🎉
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-3">
          {/* Timer Controls */}
          {timerState === 'idle' && (
            <Button 
              onClick={startCountdown}
              className="gap-2 w-full"
              size="lg"
              data-testid="button-start"
            >
              <Play className="w-5 h-5" />
              Start Exercise
            </Button>
          )}

          {(timerState === 'running' || timerState === 'paused') && (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button 
                variant="outline"
                onClick={timerState === 'running' ? pauseTimer : resumeTimer}
                className="gap-2"
                data-testid="button-pause-resume"
              >
                {timerState === 'running' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                )}
              </Button>
              <Button 
                variant="destructive"
                onClick={stopTimer}
                className="gap-2"
                data-testid="button-stop"
              >
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </div>
          )}

          {/* Regular Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onRepeat}
              className="gap-2"
              data-testid="button-repeat"
            >
              <RotateCcw className="w-4 h-4" />
              Repeat
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="gap-2"
              data-testid="button-skip"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="secondary"
              onClick={onBack}
              className="gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={onDrawNew}
              className="gap-2"
              data-testid="button-draw-new"
            >
              <Sparkles className="w-4 h-4" />
              Draw New
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* 3-2-1 Countdown Overlay */}
      {timerState === 'countdown' && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-lg z-10"
          data-testid="countdown-overlay"
        >
          <div className="text-center">
            <div 
              className="text-9xl font-bold text-primary animate-pulse"
              data-testid="text-countdown"
            >
              {countdown}
            </div>
            <p className="text-xl text-muted-foreground mt-4">Get ready!</p>
          </div>
        </div>
      )}
    </div>
  );
}
