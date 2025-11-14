import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, SkipForward, ArrowLeft, Sparkles } from 'lucide-react';
import type { Exercise } from '@/data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onRepeat: () => void;
  onSkip: () => void;
  onDrawNew: () => void;
  onBack: () => void;
  isFlipped: boolean;
}

export default function ExerciseCard({ 
  exercise, 
  onRepeat, 
  onSkip, 
  onDrawNew, 
  onBack,
  isFlipped 
}: ExerciseCardProps) {
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = () => {
    setIsSkipping(true);
    setTimeout(() => {
      onSkip();
      setIsSkipping(false);
    }, 300);
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
      className={`transition-all duration-300 ${isSkipping ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'}`}
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
            <div className="flex justify-center">
              <span 
                className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold border ${difficultyColors[exercise.difficulty]}`}
                data-testid="badge-difficulty"
              >
                {difficultyLabels[exercise.difficulty]}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold" data-testid="text-exercise-name">
              {exercise.name}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-exercise-description">
              {exercise.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-3">
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
    </div>
  );
}
