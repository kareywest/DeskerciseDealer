import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Clock, X } from 'lucide-react';

interface ReminderBannerProps {
  onSnooze: () => void;
  onDismiss: () => void;
  onDrawCard: () => void;
}

export default function ReminderBanner({ onSnooze, onDismiss, onDrawCard }: ReminderBannerProps) {
  return (
    <Card className="fixed bottom-6 right-6 z-50 max-w-md border-primary shadow-lg" data-testid="reminder-banner">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg mb-1">Time for Deskercise!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Take a quick break and do a desk exercise
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onDrawCard}
                className="gap-2 flex-1 min-w-[120px]"
                data-testid="button-draw-from-reminder"
              >
                Draw a Card
              </Button>
              <Button
                onClick={onSnooze}
                variant="outline"
                className="gap-2"
                data-testid="button-snooze-reminder"
              >
                <Clock className="w-4 h-4" />
                Snooze 5 min
              </Button>
              <Button
                onClick={onDismiss}
                variant="ghost"
                size="icon"
                data-testid="button-dismiss-reminder"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
