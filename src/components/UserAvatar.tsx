import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

type UserAvatarProps = {
  user: User | null;
  className?: string;
};

const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Avatar className={cn('border border-border', className)}>
      <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials(user?.name || '')}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;