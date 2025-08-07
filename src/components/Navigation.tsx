import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Users, LayoutDashboard, Target, Trophy, GraduationCap, FileText, Gamepad2, Coins, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Materi Belajar", href: "/materi-belajar", icon: BookOpen },
    { name: "Study Journey", href: "/study-journey", icon: GraduationCap },
    { name: "Practice", href: "/practice", icon: Target },
    { name: "Try Out", href: "/tryout", icon: Trophy },
    { name: "Misi", href: "/gamification", icon: Gamepad2 },
    { name: "Dukung Kami", href: "/dukungkami", icon: Heart },
  ];

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
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
                  <item.icon className="h-3.5 w-3.5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Coins Button */}
            <Link to="/toko">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 hover:from-yellow-200 hover:to-orange-200"
              >
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-700">1,250</span>
              </Button>
            </Link>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-smooth",
                  location.pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;