import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Target,
  Award,
  Heart,
  Lightbulb,
  Zap,
  Shield,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Home
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Pengguna Aktif", value: "10,000+", color: "text-primary" },
    { icon: BookOpen, label: "Soal Latihan", value: "5,000+", color: "text-accent" },
    { icon: Target, label: "Try Out", value: "100+", color: "text-success" },
    { icon: Award, label: "Tingkat Keberhasilan", value: "85%", color: "text-level" },
  ];

  const features = [
    {
      icon: Heart,
      title: "100% Gratis",
      description: "Semua fitur tersedia gratis tanpa biaya tersembunyi atau batasan waktu."
    },
    {
      icon: Lightbulb,
      title: "Materi Lengkap",
      description: "Materi pembelajaran yang komprehensif untuk semua subtest SNBT."
    },
    {
      icon: Zap,
      title: "Gamifikasi",
      description: "Sistem poin, level, dan achievement yang membuat belajar lebih menyenangkan."
    },
    {
      icon: Shield,
      title: "Keamanan Data",
      description: "Data pribadi Anda aman dengan enkripsi tingkat enterprise."
    },
    {
      icon: Globe,
      title: "Akses Dimana Saja",
      description: "Belajar kapan saja dan dimana saja melalui perangkat apapun."
    },
    {
      icon: Star,
      title: "Kualitas Terbaik",
      description: "Konten berkualitas tinggi yang disusun oleh para ahli pendidikan."
    }
  ];

  const team = [
    {
      name: "Tim Pengembang",
      role: "Full Stack Development",
      description: "Mengembangkan platform dengan teknologi terdepan untuk pengalaman belajar terbaik."
    },
    {
      name: "Tim Konten",
      role: "Educational Content",
      description: "Menyusun materi pembelajaran yang berkualitas dan sesuai dengan kurikulum SNBT."
    },
    {
      name: "Tim Desain",
      role: "UI/UX Design",
      description: "Merancang antarmuka yang intuitif dan menyenangkan untuk digunakan."
    }
  ];

  const values = [
    {
      title: "Aksesibilitas",
      description: "Pendidikan berkualitas harus dapat diakses oleh semua orang tanpa terkecuali."
    },
    {
      title: "Inovasi",
      description: "Terus berinovasi dalam metode pembelajaran untuk hasil yang maksimal."
    },
    {
      title: "Komunitas",
      description: "Membangun komunitas belajar yang saling mendukung dan memotivasi."
    },
    {
      title: "Kualitas",
      description: "Berkomitmen memberikan konten dan layanan dengan standar kualitas tertinggi."
    }
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-6 md:space-y-8">
            <Badge variant="secondary" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium">
              🎓 Tentang SNBTKU
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Platform Belajar{" "}
              <span className="text-gradient-primary">SNBT</span>
              {" "}Terdepan di{" "}
              <span className="text-gradient-accent">Indonesia</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              SNBTKU adalah platform pembelajaran online yang didedikasikan untuk membantu siswa 
              Indonesia meraih impian mereka masuk perguruan tinggi negeri melalui SNBT.
            </p>
            
            {/* Back to Home Button */}
            <div className="pt-4">
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-4 md:p-6">
                  <stat.icon className={`h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 ${stat.color}`} />
                  <div className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Misi Kami: Demokratisasi{" "}
                <span className="text-gradient-primary">Pendidikan</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Kami percaya bahwa setiap siswa berhak mendapatkan akses ke pendidikan berkualitas 
                tinggi tanpa terkendala oleh faktor ekonomi. SNBTKU hadir untuk mewujudkan mimpi 
                tersebut dengan menyediakan platform belajar gratis yang komprehensif.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Akses gratis untuk semua fitur lengkap</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Materi yang selalu update sesuai kurikulum terbaru</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Dukungan komunitas yang aktif dan supportif</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap langkah kami dalam mengembangkan platform terbaik untuk Anda.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dibalik SNBTKU adalah tim yang berdedikasi untuk memberikan pengalaman belajar terbaik.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Belajar Anda?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Bergabunglah dengan ribuan siswa lainnya yang telah merasakan manfaat belajar di SNBTKU.
          </p>
          <div className="flex justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Daftar Sekarang
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;