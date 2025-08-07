import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Brain,
  Clock,
  TrendingUp,
  Users,
  Award,
  Zap
} from "lucide-react";

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: BookOpen,
      title: "Materi Lengkap",
      description: "Semua subtest SNBT dengan penjelasan detail dan rangkuman yang mudah dipahami",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Target,
      title: "Try Out Realistis",
      description: "Simulasi ujian dengan tingkat kesulitan yang sama dengan SNBT sesungguhnya",
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      icon: Trophy,
      title: "Gamifikasi Seru",
      description: "Sistem level, XP, badge, dan leaderboard yang membuat belajar jadi menyenangkan",
      color: "text-success",
      bg: "bg-success/10"
    }
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "Sistem yang menyesuaikan dengan kemampuan dan progress belajar kamu"
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Analisis waktu pengerjaan untuk optimasi strategi ujian"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor perkembangan belajar dengan grafik dan statistik detail"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Bergabung dengan komunitas siswa lain untuk belajar bersama"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Raih berbagai pencapaian dan badge untuk memotivasi belajar"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Pembahasan detail langsung setelah mengerjakan soal"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            ✨ Fitur Unggulan
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Semua yang Kamu{" "}
            <span className="text-gradient-primary">Butuhkan</span>
            {" "}untuk SNBT
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Platform all-in-one yang dirancang khusus untuk membantu kamu meraih skor SNBT terbaik
            dengan metode belajar yang efektif dan menyenangkan.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="card-float group hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="card-gradient group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full">
            <span className="text-sm font-medium">🎯 Siap merasakan semua fitur ini?</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;