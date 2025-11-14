import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Clock, Zap, Bell, Volume2, VolumeX } from 'lucide-react';
import type { DifficultyLevel } from '@/data/exercises';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  interval: number;
  difficulty: DifficultyLevel;
  notificationsEnabled: boolean;
  onIntervalChange: (interval: number) => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onNotificationsToggle: (enabled: boolean) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  interval,
  difficulty,
  notificationsEnabled,
  onIntervalChange,
  onDifficultyChange,
  onNotificationsToggle
}: SettingsPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" data-testid="panel-settings">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Settings</SheetTitle>
          <SheetDescription>
            Customize your deskercise experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <Label className="text-lg font-heading font-semibold">Reminder Interval</Label>
            </div>
            <RadioGroup value={interval.toString()} onValueChange={(v) => onIntervalChange(Number(v))}>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="30" id="settings-interval-30" data-testid="radio-settings-interval-30" />
                <Label htmlFor="settings-interval-30" className="cursor-pointer flex-1">Every 30 minutes</Label>
              </div>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="60" id="settings-interval-60" data-testid="radio-settings-interval-60" />
                <Label htmlFor="settings-interval-60" className="cursor-pointer flex-1">Every 60 minutes</Label>
              </div>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="90" id="settings-interval-90" data-testid="radio-settings-interval-90" />
                <Label htmlFor="settings-interval-90" className="cursor-pointer flex-1">Every 90 minutes</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <Label className="text-lg font-heading font-semibold">Exercise Intensity</Label>
            </div>
            <RadioGroup value={difficulty} onValueChange={(v) => onDifficultyChange(v as DifficultyLevel)}>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="silent" id="settings-difficulty-silent" data-testid="radio-settings-difficulty-silent" />
                <div className="flex-1 flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="settings-difficulty-silent" className="cursor-pointer">Silent Mode</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="easy" id="settings-difficulty-easy" data-testid="radio-settings-difficulty-easy" />
                <div className="flex-1 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="settings-difficulty-easy" className="cursor-pointer">Easy Stretches</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2 hover-elevate rounded-md p-3">
                <RadioGroupItem value="intense" id="settings-difficulty-intense" data-testid="radio-settings-difficulty-intense" />
                <div className="flex-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="settings-difficulty-intense" className="cursor-pointer">Intense Workout</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-chart-2 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <Label className="text-lg font-heading font-semibold">Notifications</Label>
            </div>
            <div className="flex items-center justify-between p-3 hover-elevate rounded-md">
              <Label htmlFor="notifications-toggle" className="cursor-pointer">
                Browser notifications
              </Label>
              <Switch
                id="notifications-toggle"
                checked={notificationsEnabled}
                onCheckedChange={onNotificationsToggle}
                data-testid="switch-notifications"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onClose} className="w-full" data-testid="button-save-settings">
              Save Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
