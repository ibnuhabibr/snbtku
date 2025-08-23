import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Star } from "lucide-react";
import { tryoutApiService, TryoutPackage } from "@/services/tryoutApiService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TryoutPackages = () => {
  const [packages, setPackages] = useState<TryoutPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await tryoutApiService.getTryoutPackages();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: "Error",
          description: "Gagal memuat paket tryout. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [toast]);

  const handleStartTryout = (packageId: string) => {
    navigate(`/tryout/${packageId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat paket tryout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paket Tryout SNBT</h1>
        <p className="text-muted-foreground">
          Pilih paket tryout yang sesuai dengan kebutuhan persiapan SNBT Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                {pkg.isPremium && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {pkg.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Package Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {tryoutApiService.formatDuration(pkg.durationMinutes)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {pkg.totalQuestions} soal
                  </div>
                </div>

                {/* Difficulty and Category */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {tryoutApiService.getDifficultyLabel(pkg.difficultyLevel)}
                  </Badge>
                  <Badge variant="outline">
                    {pkg.category}
                  </Badge>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-primary">
                  {tryoutApiService.formatPrice(pkg.price)}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  onClick={() => handleStartTryout(pkg.id)}
                  disabled={!pkg.isActive}
                >
                  {pkg.isActive ? 'Mulai Tryout' : 'Tidak Tersedia'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Paket Tryout</h3>
          <p className="text-muted-foreground">
            Paket tryout akan segera tersedia. Silakan kembali lagi nanti.
          </p>
        </div>
      )}
    </div>
  );
};

export default TryoutPackages;