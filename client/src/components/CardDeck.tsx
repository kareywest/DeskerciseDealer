import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardDeckProps {
  onDrawCard: () => void;
  cardsRemaining: number;
  shouldShuffle?: boolean;
}

export default function CardDeck({ onDrawCard, cardsRemaining, shouldShuffle = false }: CardDeckProps) {
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (shouldShuffle) {
      setIsShuffling(true);
      const timer = setTimeout(() => setIsShuffling(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShuffle]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative w-64 h-80" data-testid="deck-stack">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={false}
            animate={isShuffling ? {
              x: [index * 4, (index - 1) * 60, index * 4],
              y: [index * -8, -40, index * -8],
              rotate: [index * -2, (index - 1) * 15, index * -2],
              scale: [1, 1.1, 1],
            } : {
              x: index * 4,
              y: index * -8,
              rotate: index * -2,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              zIndex: 3 - index,
            }}
          >
            <Card
              className="w-full h-full bg-gradient-to-br from-primary to-primary/70 border-2 border-primary-border shadow-xl"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-primary-foreground space-y-4">
                  <Sparkles className="w-16 h-16 mx-auto opacity-50" />
                  <p className="text-6xl font-heading font-bold">{cardsRemaining}</p>
                  <p className="text-sm font-semibold opacity-75">exercises ready</p>
                </div>
              </div>
            </Card>
          </motion.div>
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
