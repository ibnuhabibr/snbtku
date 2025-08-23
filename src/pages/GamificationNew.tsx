import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import RealtimeGamificationSystem from '@/components/RealtimeGamificationSystem';
import { Sparkles, ArrowLeft, Zap } from 'lucide-react';

const GamificationNew = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showGamificationSystem, setShowGamificationSystem] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Silakan login untuk mengakses sistem gamifikasi",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate, toast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Memuat sistem gamifikasi...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Sistem Gamifikasi
                </h1>
                <p className="text-sm text-gray-600">
                  Selamat datang, {user.name}! Raih pencapaian dan tingkatkan level Anda.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">Level {user.level || 1}</p>
                <p className="text-xs text-gray-600">{user.xp || 0} XP</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Gamification System */}
          <div className="lg:col-span-2">
            <RealtimeGamificationSystem 
              isVisible={showGamificationSystem}
              onClose={() => setShowGamificationSystem(false)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Aksi Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/tryout')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  🎯 Mulai Tryout
                </Button>
                <Button 
                  onClick={() => navigate('/practice')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  📚 Latihan Soal
                </Button>
                <Button 
                  onClick={() => navigate('/material')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  📖 Belajar Materi
                </Button>
                <Button 
                  onClick={() => navigate('/community')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  👥 Komunitas
                </Button>
              </CardContent>
            </Card>

            {/* Tips & Motivation */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Tips Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Konsistensi adalah kunci!</strong><br />
                      Check-in setiap hari untuk mendapatkan bonus streak.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Quality over quantity!</strong><br />
                      Fokus pada pemahaman daripada menyelesaikan banyak soal.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Join komunitas!</strong><br />
                      Berdiskusi dengan teman untuk memahami konsep yang sulit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Streak Info */}
            <Card>
              <CardHeader>
                <CardTitle>🔥 Streak Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    {user.dailyStreak || 0}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Hari berturut-turut</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Streak terbaik:</span>
                      <span className="font-medium">{Math.max(user.dailyStreak || 0, 0)} hari</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP:</span>
                      <span className="font-medium">{user.xp || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Koin:</span>
                      <span className="font-medium">{user.coins || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationNew;
