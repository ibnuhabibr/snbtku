import { MessageCircle, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Community = () => {
  const handleWhatsAppGroup = () => {
    // Replace with actual WhatsApp group link
    window.open("https://chat.whatsapp.com/your-group-invite-link", "_blank");
  };

  const handleWhatsAppChannel = () => {
    // Replace with actual WhatsApp channel link
    window.open("https://whatsapp.com/channel/your-channel-link", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            Bergabung dengan Komunitas SNBTKU
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Terhubung dengan ribuan pelajar lainnya, berbagi tips, dan saling mendukung dalam persiapan SNBT
          </p>
        </div>
      </section>

      {/* Community Options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* WhatsApp Group Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  WhatsApp Grup Diskusi
                </CardTitle>
                <CardDescription className="text-lg">
                  Bergabung dengan grup diskusi aktif untuk bertanya, berbagi materi, dan saling membantu
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✅ Diskusi soal dan pembahasan</p>
                  <p>✅ Sharing tips dan trik</p>
                  <p>✅ Motivasi dan dukungan sesama</p>
                  <p>✅ Update informasi SNBT terbaru</p>
                </div>
                <Button 
                  onClick={handleWhatsAppGroup}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Gabung Grup WhatsApp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Channel Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  WhatsApp Channel
                </CardTitle>
                <CardDescription className="text-lg">
                  Ikuti channel resmi untuk mendapatkan update, tips, dan informasi penting seputar SNBT
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>📢 Pengumuman penting</p>
                  <p>📚 Tips belajar harian</p>
                  <p>📊 Statistik dan analisis</p>
                  <p>🎯 Motivasi dan quotes inspiratif</p>
                </div>
                <Button 
                  onClick={handleWhatsAppChannel}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Ikuti Channel WhatsApp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Aturan Komunitas
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Yang Boleh Dilakukan:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ Bertanya tentang materi SNBT</li>
                <li>✅ Berbagi tips dan strategi belajar</li>
                <li>✅ Memberikan motivasi kepada sesama</li>
                <li>✅ Sharing materi pembelajaran yang bermanfaat</li>
                <li>✅ Diskusi konstruktif tentang soal</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Yang Tidak Boleh Dilakukan:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>❌ Spam atau pesan berulang</li>
                <li>❌ Konten yang tidak relevan</li>
                <li>❌ Bahasa yang tidak sopan</li>
                <li>❌ Promosi produk/jasa lain</li>
                <li>❌ Menyebarkan informasi yang salah</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;