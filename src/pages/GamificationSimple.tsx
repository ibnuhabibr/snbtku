import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { Sparkles, ArrowLeft, Zap, Trophy, Gift } from 'lucide-react';

const GamificationSimple = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  // Test function untuk update XP
  const testUpdateXP = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const { updateUserStats } = useAuthStore.getState();
      const currentXP = user?.xp || 0;
      const newXP = currentXP + 100;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      
      updateUserStats({
        xp: newXP,
        level: newLevel,
        coins: (user?.coins || 0) + 50
      });
      
      toast({
        title: "XP Updated! 🎉",
        description: `+100 XP, +50 koin! Level ${newLevel}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal update XP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  Sistem Gamifikasi (Test Mode)
                </h1>
                <p className="text-sm text-gray-600">
                  Selamat datang, {user.name}! Testing sistem gamifikasi baru.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Status Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.xp || 0}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{user.coins || 0}</div>
                    <div className="text-sm text-gray-600">Koin</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user.level || 1}</div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{user.dailyStreak || 0}</div>
                    <div className="text-sm text-gray-600">Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Test Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={testUpdateXP}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Gift className="h-4 w-4 mr-2" />
                {isLoading ? 'Loading...' : 'Test +100 XP & +50 Koin'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/tryout')}
                >
                  🎯 Tryout
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/practice')}
                >
                  📚 Practice
                </Button>
              </div>
              
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                🔄 Reset Data (Clear LocalStorage)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>ℹ️ Informasi Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>✅ Sistem Auth Baru:</strong> Dengan retry mechanism dan better error handling</p>
              <p><strong>✅ XP System:</strong> Data XP tersimpan di localStorage dan auth store</p>
              <p><strong>✅ Level Calculation:</strong> Level = floor(sqrt(XP / 100)) + 1</p>
              <p><strong>📡 Backend Integration:</strong> Siap untuk integrasi dengan API backend</p>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>🔧 Next Steps:</strong><br />
                  1. Start backend server<br />
                  2. Test API endpoints<br />
                  3. Integrate with real quest system<br />
                  4. Add real-time updates via socket.io
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationSimple;
