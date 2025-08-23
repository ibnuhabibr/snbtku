import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Coins, Zap, Target, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getAuthHeaders } from '@/stores/authStore';

interface UserStatsData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  dailyStreak: number;
  totalStudyTime: number;
  achievements: string[];
  questsCompleted: number;
  totalQuests: number;
}

export const UserStats: React.FC = () => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/user-stats', {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to user data from authStore
        if (user) {
          setStats({
            level: user.level || 1,
            xp: user.xp || 0,
            xpToNextLevel: 1000 - ((user.xp || 0) % 1000),
            coins: user.coins || 0,
            dailyStreak: user.dailyStreak || 0,
            totalStudyTime: 0,
            achievements: [],
            questsCompleted: 0,
            totalQuests: 10
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Fallback to user data from authStore
      if (user) {
        setStats({
          level: user.level || 1,
          xp: user.xp || 0,
          xpToNextLevel: 1000 - ((user.xp || 0) % 1000),
          coins: user.coins || 0,
          dailyStreak: user.dailyStreak || 0,
          totalStudyTime: 0,
          achievements: [],
          questsCompleted: 0,
          totalQuests: 10
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}j ${mins}m`;
    }
    return `${mins}m`;
  };

  const getXPProgress = () => {
    if (!stats) return 0;
    const currentLevelXP = stats.xp - (stats.level - 1) * 1000; // Assuming 1000 XP per level
    return (currentLevelXP / 1000) * 100;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Gagal memuat statistik pengguna</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-purple-600">{stats.level}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>XP Progress</span>
                <span>{stats.xp} / {stats.xpToNextLevel}</span>
              </div>
              <Progress value={getXPProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Coins Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Koin</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.coins.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Streak Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak Harian</p>
                <p className="text-2xl font-bold text-orange-600">{stats.dailyStreak}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">hari berturut-turut</p>
          </CardContent>
        </Card>

        {/* Study Time Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waktu Belajar</p>
                <p className="text-2xl font-bold text-blue-600">{formatStudyTime(stats.totalStudyTime)}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">total waktu</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quest Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progress Quest
            </CardTitle>
            <CardDescription>
              Kemajuan penyelesaian quest Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quest Selesai</span>
                <Badge variant="secondary">
                  {stats.questsCompleted} / {stats.totalQuests}
                </Badge>
              </div>
              <Progress 
                value={(stats.questsCompleted / stats.totalQuests) * 100} 
                className="h-3"
              />
              <p className="text-xs text-gray-500">
                {Math.round((stats.questsCompleted / stats.totalQuests) * 100)}% quest telah diselesaikan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Pencapaian
            </CardTitle>
            <CardDescription>
              Pencapaian yang telah Anda raih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Pencapaian</span>
                <Badge variant="outline">
                  {stats.achievements.length}
                </Badge>
              </div>
              
              {stats.achievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {stats.achievements.slice(0, 6).map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {achievement}
                    </Badge>
                  ))}
                  {stats.achievements.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{stats.achievements.length - 6} lainnya
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Belum ada pencapaian. Mulai belajar untuk mendapatkan pencapaian pertama!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};