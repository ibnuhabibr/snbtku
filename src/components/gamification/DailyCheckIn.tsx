import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Flame, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { getAuthHeaders } from '@/stores/authStore';

interface CheckInStatus {
  canClaim: boolean;
  currentStreak: number;
  lastCheckIn: string | null;
  nextClaimAt: string;
  weeklyProgress: {
    currentDay: number; // 1-7, resets weekly
    weeklyRewards: {
      day: number;
      coins: number;
      xp: number;
      claimed: boolean;
      unlocked: boolean;
    }[];
  };
}

interface CheckInResponse {
  success: boolean;
  reward: {
    coins: number;
    xp: number;
    bonus?: {
      type: string;
      amount: number;
    };
  };
  streak: number;
  userStats: {
    level: number;
    xp: number;
    coins: number;
    dailyStreak: number;
  };
  message: string;
}

export const DailyCheckIn: React.FC = () => {
  const [status, setStatus] = useState<CheckInStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { toast } = useToast();
  const { updateUserStats } = useAuthStore();

  useEffect(() => {
    fetchCheckInStatus();
  }, []);

  const fetchCheckInStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/daily-status', {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch check-in status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!status?.canClaim) return;

    try {
      setClaiming(true);
      const response = await fetch('/api/rewards/daily-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (response.ok) {
        const data: CheckInResponse = await response.json();
        
        // Update user stats in store
        updateUserStats({
          level: data.userStats.level,
          xp: data.userStats.xp,
          coins: data.userStats.coins,
          dailyStreak: data.userStats.dailyStreak,
        });

        // Show success toast
        toast({
          title: "Check-in berhasil!",
          description: `${data.message} (+${data.reward.coins} koin, +${data.reward.xp} XP)`,
        });

        // Refresh status
        await fetchCheckInStatus();
      } else {
        const error = await response.json();
        toast({
          title: "Gagal check-in",
          description: error.message || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
      toast({
        title: "Gagal check-in",
        description: "Terjadi kesalahan jaringan",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Check-in Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Check-in Harian
        </CardTitle>
        <CardDescription>
          Dapatkan hadiah setiap hari dengan check-in!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Streak Saat Ini</span>
          </div>
          <Badge variant="secondary" className="text-orange-600">
            {status.currentStreak} hari
          </Badge>
        </div>

        {/* Weekly Progress */}
        {status.weeklyProgress && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Progress Mingguan</h4>
              <Badge variant="secondary">
                Hari {status.weeklyProgress.currentDay}/7
              </Badge>
            </div>
            
            {/* Weekly Rewards Grid */}
            <div className="grid grid-cols-7 gap-2">
              {status.weeklyProgress.weeklyRewards.map((reward) => {
                const isToday = reward.day === status.weeklyProgress.currentDay;
                const canClaim = reward.unlocked && !reward.claimed && status.canClaim && isToday;
                
                return (
                  <div
                    key={reward.day}
                    className={`relative p-3 rounded-lg border-2 text-center transition-all ${
                      reward.claimed
                        ? 'bg-green-50 border-green-200'
                        : canClaim
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                        : reward.unlocked
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Day Number */}
                    <div className={`text-xs font-bold mb-1 ${
                      reward.claimed
                        ? 'text-green-600'
                        : canClaim
                        ? 'text-orange-600'
                        : reward.unlocked
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}>
                      Hari {reward.day}
                    </div>
                    
                    {/* Reward Info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium">{reward.coins}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-blue-500 text-xs">⚡</span>
                        <span className="text-xs font-medium">{reward.xp}</span>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    {reward.claimed && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                    
                    {isToday && !reward.claimed && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        <span className="text-xs">!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Today's Special Reward */}
            {status.weeklyProgress.weeklyRewards.find(r => r.day === status.weeklyProgress.currentDay) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Hadiah Hari Ini (Hari {status.weeklyProgress.currentDay})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span>{status.weeklyProgress.weeklyRewards.find(r => r.day === status.weeklyProgress.currentDay)?.coins} koin</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">⚡</span>
                    <span>{status.weeklyProgress.weeklyRewards.find(r => r.day === status.weeklyProgress.currentDay)?.xp} XP</span>
                  </div>
                  {status.weeklyProgress.currentDay === 7 && (
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100">
                      🎉 Bonus Mingguan!
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Check-in Button */}
        <Button
          onClick={handleCheckIn}
          disabled={!status.canClaim || claiming}
          className="w-full"
          size="lg"
        >
          {claiming ? (
            "Mengklaim..."
          ) : status.canClaim ? (
            "Check-in Sekarang"
          ) : (
            "Sudah Check-in Hari Ini"
          )}
        </Button>

        {status.lastCheckIn && (
          <p className="text-xs text-gray-500 text-center">
            Terakhir check-in: {new Date(status.lastCheckIn).toLocaleDateString('id-ID')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};