import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageCircle, 
  Instagram, 
  Youtube,
  BookOpen,
  Target,
  Trophy,
  Users,
  Heart
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Materi Belajar", href: "#", icon: BookOpen },
    { name: "Try Out", href: "#", icon: Target },
    { name: "Leaderboard", href: "#", icon: Trophy },
    { name: "Komunitas", href: "#", icon: Users },
  ];

  const resources = [
    { name: "Panduan Belajar", href: "#" },
    { name: "Tips & Trik SNBT", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Kontak Support", href: "#" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-500" },
    { name: "YouTube", href: "#", icon: Youtube, color: "hover:text-red-500" },
    { name: "WhatsApp", href: "#", icon: MessageCircle, color: "hover:text-green-500" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4 md:space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gradient-primary mb-2">
                SNBTKU
              </h3>
              <p className="text-muted-foreground text-base md:text-lg">
                Your #1 Free Companion to Conquer the SNBT
              </p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Platform belajar gratis terlengkap untuk persiapan SNBT. 
              Dengan metode gamifikasi yang seru dan materi yang selalu update, 
              kami membantu ribuan siswa mencapai PTN impian mereka.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm md:text-base">Dapatkan Tips Belajar Terbaru</h4>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <div className="flex-1 relative">
                  <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email kamu"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <Button variant="default" size="sm" className="w-full sm:w-auto">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-semibold text-base md:text-lg">Navigasi Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-semibold text-base md:text-lg">Sumber Daya</h4>
            <ul className="space-y-2 md:space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.href}
                    className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="space-y-3">
              <h5 className="font-semibold text-sm md:text-base">Ikuti Kami</h5>
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`transition-colors ${social.color} h-8 w-8 md:h-10 md:w-10`}
                  >
                    <social.icon className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8 border-y border-border">
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-primary">10,000+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-accent">5,000+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Soal Latihan</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-success">100+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Try Out</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-level">85%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 md:pt-8 space-y-4 md:space-y-0">
          <div className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © 2024 SNBTKU. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
            <span>for Indonesian students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;