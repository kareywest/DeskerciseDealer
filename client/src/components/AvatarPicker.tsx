import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSelect: (emoji: string) => void;
}

const AVATAR_OPTIONS = [
  '😊', '😎', '🤓', '🥳', '🤠',
  '🦸', '🦹', '🧙', '🧚', '🧛',
  '🐶', '🐱', '🐼', '🐨', '🦊',
  '🦁', '🐯', '🐸', '🐵', '🦄',
  '🌟', '✨', '💫', '⭐', '🔥',
  '🎨', '🎭', '🎪', '🎯', '🎮',
  '🍕', '🍔', '🌮', '🍩', '🍰',
  '☕', '🥤', '🧃', '🍉', '🍓',
];

export default function AvatarPicker({ isOpen, onClose, currentAvatar, onSelect }: AvatarPickerProps) {
  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="dialog-avatar-picker">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Pick an emoji to personalize your profile
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-8 gap-2 p-4">
          {AVATAR_OPTIONS.map((emoji) => (
            <Button
              key={emoji}
              variant={currentAvatar === emoji ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleSelect(emoji)}
              className="text-2xl h-12 w-12"
              data-testid={`button-avatar-${emoji}`}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
