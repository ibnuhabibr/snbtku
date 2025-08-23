import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, LayoutDashboard, Target, Trophy, GraduationCap, FileText, Gamepad2, Heart, User, LogOut, BarChart3, ShoppingBag, Search, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { useUserCoins } from "@/hooks/useUserCoins";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { coins, loading: coinsLoading } = useUserCoins();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Materi", href: "/materi-belajar", icon: BookOpen },
    { name: "Alur Belajar", href: "/study-journey", icon: GraduationCap },
    { name: "Bank Soal", href: "/practice", icon: Target },
    { name: "Try Out", href: "/tryout", icon: Trophy },
    { name: "Misi", href: "/gamification", icon: Gamepad2 },
    { name: "Support", href: "/dukungkami", icon: Heart },
  ];



  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border fixed top-0 w-full z-50 will-change-transform transform-gpu backface-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center">
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-bold text-gradient-primary">
                SNBTKU
              </h1>
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center">
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold text-gradient-primary">
                SNBTKU
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Your #1 Free SNBT Companion
              </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-smooth",
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/social')}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Mobile Coins Display */}
            <Link to="/toko">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 hover:from-yellow-200 hover:to-orange-200 px-2 py-1 h-8"
              >
                <Coins className="h-3 w-3 text-yellow-600" />
                <span className="font-semibold text-yellow-700 text-xs">
                  {coinsLoading ? '...' : coins.toLocaleString()}
                </span>
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/social')}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Coins Button */}
            <Link to="/toko">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 hover:from-yellow-200 hover:to-orange-200"
              >
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-700">
                  {coinsLoading ? '...' : coins.toLocaleString()}
                </span>
              </Button>
            </Link>
            <PWAInstallPrompt />
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out bg-white border-t will-change-transform transform-gpu backface-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-3 py-2">
             {/* Compact Grid Layout - 3 columns */}
             <div className="grid grid-cols-3 gap-1.5">
               {/* Main Navigation Items - Compact Layout */}
               <Link
                 to="/dashboard"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/dashboard"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <LayoutDashboard className="h-4 w-4" />
                 <span className="truncate">Home</span>
               </Link>
               
               <Link
                 to="/materi-belajar"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/materi-belajar"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <BookOpen className="h-4 w-4" />
                 <span className="truncate">Materi</span>
               </Link>
               
               <Link
                 to="/practice"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/practice"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <Target className="h-4 w-4" />
                 <span className="truncate">Bank Soal</span>
               </Link>
               
               <Link
                 to="/tryout"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/tryout"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <Trophy className="h-4 w-4" />
                 <span className="truncate">Try Out</span>
               </Link>
               
               <Link
                 to="/gamification"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/gamification"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <Gamepad2 className="h-4 w-4" />
                 <span className="truncate">Misi</span>
               </Link>
               
               <Link
                 to="/leaderboard"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/leaderboard"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <Trophy className="h-4 w-4" />
                 <span className="truncate">Leaderboard</span>
               </Link>
               
               <Link
                 to="/study-journey"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/study-journey"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <GraduationCap className="h-4 w-4" />
                 <span className="truncate">Alur Belajar</span>
               </Link>
               
               <Link
                 to="/analisis-potensi"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/analisis-potensi"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <BarChart3 className="h-4 w-4" />
                 <span className="truncate">Analisis</span>
               </Link>
               
               <Link
                 to="/profile"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/profile"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <User className="h-4 w-4" />
                 <span className="truncate">Profil</span>
               </Link>
               
               <Link
                 to="/toko"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/toko"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <ShoppingBag className="h-4 w-4" />
                 <span className="truncate">Toko</span>
               </Link>
               
               <Link
                 to="/dukungkami"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/dukungkami"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <Heart className="h-4 w-4" />
                 <span className="truncate">Support</span>
               </Link>
               
               <Link
                 to="/about"
                 className={cn(
                   "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth",
                   location.pathname === "/about"
                     ? "text-primary bg-primary/10"
                     : "text-foreground hover:text-primary hover:bg-primary/5"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 <FileText className="h-4 w-4" />
                 <span className="truncate">About</span>
               </Link>
             </div>
             
             {/* Logout Button - Compact */}
             <div className="mt-2 pt-1.5 border-t border-gray-200 flex justify-center">
               <button
                 className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-smooth text-red-500 hover:bg-red-50"
                 onClick={async () => {
                   setIsOpen(false);
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
                 }}
               >
                 <LogOut className="h-3 w-3" />
                 <span>Keluar</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;