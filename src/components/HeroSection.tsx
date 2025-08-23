import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Star, Users, BookOpen, Target, Award, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+", color: "text-primary" },
    { icon: BookOpen, label: "Soal Latihan", value: "5,000+", color: "text-accent" },
    { icon: Target, label: "Try Out", value: "100+", color: "text-success" },
    { icon: Award, label: "Success Rate", value: "85%", color: "text-level" },
  ];

  const features = [
    "✨ Gratis selamanya",
    "🎯 Materi lengkap semua subtest",
    "📱 Akses di mana saja",
    "🏆 Gamifikasi seru",
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-primary/5 to-accent/5 pt-12 md:pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Taklukkan{" "}
                <span className="text-gradient-primary">SNBT</span>
                {" "}dengan{" "}
                <span className="text-gradient-accent">Mudah</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Platform belajar gratis terlengkap untuk persiapan SNBT. 
                Dengan metode gamifikasi yang seru dan materi yang selalu update.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl" 
                className="animate-bounce-gentle"
                onClick={handleStartLearning}
              >
                🚀 Mulai Belajar Gratis
              </Button>
              <Link to="/dukungkami">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-2 hover:bg-primary/10"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Dukung Kami
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Dipercaya oleh <span className="font-semibold text-foreground">10,000+</span> siswa
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <Card className="card-float overflow-hidden bg-gradient-to-br from-white to-primary/5">
              <img
                src={heroImage}
                alt="Students learning SNBT"
                className="w-full h-auto object-cover"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute top-4 -left-4 space-y-3 z-20 pointer-events-none hidden md:block">
                {stats.slice(0, 2).map((stat, index) => (
                  <Card 
                    key={index}
                    className={`p-3 md:p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 pointer-events-auto hover:shadow-2xl transition-shadow duration-500 w-auto max-w-[140px] ${index === 0 ? 'animate-float' : 'animate-float-delay'}`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} flex-shrink-0`} />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="absolute bottom-4 -right-4 space-y-3 z-20 pointer-events-none hidden md:block">
                {stats.slice(2).map((stat, index) => (
                  <Card 
                    key={index}
                    className={`p-3 md:p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 pointer-events-auto hover:shadow-2xl transition-shadow duration-500 w-auto max-w-[140px] ${index === 0 ? 'animate-bounce-gentle' : 'animate-bounce-delay'}`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} flex-shrink-0`} />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Mobile Stats Grid */}
              <div className="md:hidden mt-6">
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <Card 
                      key={index}
                      className="p-3 bg-white/95 backdrop-blur-sm shadow-lg border-0"
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;