import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';
import { Button } from '@/components/ui/button';
import type { DifficultyLevel } from '@/data/exercises';

export default function SettingsPanelExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [interval, setInterval] = useState(30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
      <SettingsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        interval={interval}
        difficulty={difficulty}
        notificationsEnabled={notifications}
        onIntervalChange={setInterval}
        onDifficultyChange={setDifficulty}
        onNotificationsToggle={setNotifications}
      />
    </div>
  );
}
