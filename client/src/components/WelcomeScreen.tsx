import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock, Zap, Volume2, VolumeX } from 'lucide-react';
import type { DifficultyLevel } from '@/data/exercises';
import heroImage from '@assets/generated_images/Office_worker_stretching_happily_ae132027.png';

interface WelcomeScreenProps {
  onStart: (interval: number, difficulty: DifficultyLevel) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [interval, setInterval] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');

  const handleStart = () => {
    onStart(interval, difficulty);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white" data-testid="text-welcome-title">
              Deskercise Dealer
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed" data-testid="text-welcome-subtitle">
              Stay active, energized, and healthy with fun desk exercises delivered right when you need them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <Card className="backdrop-blur-md bg-background/80 border-2" data-testid="card-interval-settings">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <Label className="text-lg font-heading font-semibold">Reminder Interval</Label>
                </div>
                <RadioGroup value={interval.toString()} onValueChange={(v) => setInterval(Number(v))}>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="30" id="interval-30" data-testid="radio-interval-30" />
                    <Label htmlFor="interval-30" className="cursor-pointer flex-1">Every 30 minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="60" id="interval-60" data-testid="radio-interval-60" />
                    <Label htmlFor="interval-60" className="cursor-pointer flex-1">Every 60 minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="90" id="interval-90" data-testid="radio-interval-90" />
                    <Label htmlFor="interval-90" className="cursor-pointer flex-1">Every 90 minutes</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-background/80 border-2" data-testid="card-difficulty-settings">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <Label className="text-lg font-heading font-semibold">Exercise Intensity</Label>
                </div>
                <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="silent" id="difficulty-silent" data-testid="radio-difficulty-silent" />
                    <div className="flex-1 flex items-center gap-2">
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="difficulty-silent" className="cursor-pointer">Silent Mode</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="easy" id="difficulty-easy" data-testid="radio-difficulty-easy" />
                    <div className="flex-1 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="difficulty-easy" className="cursor-pointer">Easy Stretches</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                    <RadioGroupItem value="intense" id="difficulty-intense" data-testid="radio-difficulty-intense" />
                    <div className="flex-1 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="difficulty-intense" className="cursor-pointer">Intense Workout</Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-12 py-6 font-heading font-semibold backdrop-blur-md bg-primary/90 hover:bg-primary border-2 border-primary-border"
            onClick={handleStart}
            data-testid="button-start"
          >
            Start Deskercising
          </Button>
        </div>
      </div>
    </div>
  );
}
