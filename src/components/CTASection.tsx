import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Rocket, 
  Users, 
  CheckCircle, 
  Star,
  Trophy,
  Target
} from "lucide-react";

const CTASection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const benefits = [
    { icon: CheckCircle, text: "Akses semua fitur gratis selamanya" },
    { icon: Target, text: "5000+ soal latihan dan pembahasan" },
    { icon: Trophy, text: "Try out unlimited" },
    { icon: Star, text: "Sistem gamifikasi yang memotivasi" },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Siswa SMA 12",
      content: "Berkat SNBTKU, aku bisa masuk PTN impian dengan skor 700+!",
      rating: 5
    },
    {
      name: "Rizki A.",
      role: "Alumni 2024",
      content: "Platform terbaik untuk persiapan SNBT. Gratis dengan kualitas terbaik!",
      rating: 5
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA */}
        <Card className="card-float overflow-hidden">
          <CardContent className="p-0">
            <div className="hero-gradient text-white p-6 md:p-12 text-center space-y-6 md:space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="h-4 w-4 mr-2" />
                  Bergabung dengan 10,000+ siswa lainnya
                </Badge>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Mulai Perjalanan{" "}
                  <span className="text-yellow-300">Sukses</span>
                  {" "}SNBT-mu Sekarang!
                </h2>
                
                <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                  Daftar gratis dan rasakan pengalaman belajar yang berbeda. 
                  Tidak ada biaya tersembunyi, tidak ada batas waktu.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                  >
                    <benefit.icon className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-white/90">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button 
                  variant="accent" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold shadow-2xl animate-bounce-gentle px-6 py-3 md:px-8 md:py-4"
                  onClick={handleRegisterClick}
                >
                  <Rocket className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  {currentUser ? 'Masuk ke Dashboard' : 'Daftar Gratis Sekarang'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary font-semibold shadow-lg transition-all duration-300 px-6 py-3 md:px-8 md:py-4"
                  asChild
                >
                  <Link to="/about">
                    Pelajari Lebih Lanjut
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-4 opacity-80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">100% Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Tanpa Iklan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Akses Selamanya</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Kata Mereka tentang SNBTKU</h3>
            <p className="text-muted-foreground">Ribuan siswa telah merasakan manfaatnya</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-gradient">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <blockquote className="text-lg font-medium">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;