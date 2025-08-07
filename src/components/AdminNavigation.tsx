import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminNavigation = () => {
  const location = useLocation();

  const adminNavItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Content", href: "/admin/content" },
    { name: "Try Out", href: "/admin/tryout" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="flex items-center hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gradient-primary">SNBTKU Admin</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">Back to App</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;