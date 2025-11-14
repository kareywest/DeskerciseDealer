import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CardDeckProps {
  onDrawCard: () => void;
  cardsRemaining: number;
}

export default function CardDeck({ onDrawCard, cardsRemaining }: CardDeckProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative w-64 h-80" data-testid="deck-stack">
        {[0, 1, 2].map((index) => (
          <Card
            key={index}
            className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 border-2 border-primary-border shadow-xl"
            style={{
              transform: `translateY(${index * -8}px) translateX(${index * 4}px) rotate(${index * -2}deg)`,
              zIndex: 3 - index,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-primary-foreground space-y-4">
                <Sparkles className="w-16 h-16 mx-auto opacity-50" />
                <p className="text-6xl font-heading font-bold">{cardsRemaining}</p>
                <p className="text-sm font-semibold opacity-75">exercises ready</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        onClick={onDrawCard}
        className="text-lg px-12 py-6 font-heading font-semibold shadow-lg"
        data-testid="button-draw-card"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Draw Card
      </Button>
    </div>
  );
}
