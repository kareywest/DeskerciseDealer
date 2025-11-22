import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@shared/schema';

interface UserAvatarProps {
  user?: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-base',
    md: 'h-10 w-10 text-xl',
    lg: 'h-16 w-16 text-4xl',
  };

  const getInitials = () => {
    if (!user) return '?';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`} data-testid="avatar-user">
      <AvatarFallback className="text-center" data-testid="avatar-fallback">
        {user?.avatarEmoji || getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
