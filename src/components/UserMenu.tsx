import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import UserAvatar from '@/components/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, BookOpen, BarChart3, ShoppingBag, Users } from 'lucide-react';

const UserMenu = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
      toast({
        title: 'Berhasil keluar',
        description: 'Anda telah berhasil keluar dari akun Anda.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal keluar',
        description: 'Terjadi kesalahan saat mencoba keluar. Silakan coba lagi.',
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center">
        <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link to="/login">Masuk/Daftar</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full bg-white hover:bg-gray-50 border border-gray-200 md:border-0 md:bg-transparent md:hover:bg-gray-100">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg" sideOffset={5}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || 'Pengguna'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex w-full cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profil Saya</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex w-full cursor-pointer items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/leaderboard" className="flex w-full cursor-pointer items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/analisis-potensi" className="flex w-full cursor-pointer items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analisis Potensi</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/toko" className="flex w-full cursor-pointer items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Toko</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile?tab=settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;