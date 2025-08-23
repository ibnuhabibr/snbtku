import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import gamificationService from '@/services/gamificationService';
import { 
  Trophy, 
  Star, 
  Target, 
  Crown, 
  Zap, 
  CheckCircle,
  Gift,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStats {
  xp: number;
  coins: number;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  streak: number;
  avatar_url?: string;
  xpToNextLevel?: number;
  xpProgress?: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  progress: number;
  target: number;
  reward: {
    coins: number;
    xp: number;
  };
  completed: boolean;
  claimed: boolean;
  expiresAt?: string;
}

interface RealtimeGamificationProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const RealtimeGamificationSystem: React.FC<RealtimeGamificationProps> = ({ 
  isVisible = true 
}) => {
  const { user, updateUserStats } = useAuthStore();
  const { toast } = useToast();
  
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    coins: 1000,
    level: 1,
    totalQuestions: 0,
    correctAnswers: 0,
    studyTime: 0,
    streak: 0,
  });
  
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load user stats and quests in parallel
      const [stats, quests] = await Promise.all([
        gamificationService.getUserStats(),
        gamificationService.getQuests()
      ]);

      setUserStats(stats);
      setDailyQuests(quests.daily);
      setWeeklyQuests(quests.weekly);

      // Update auth store with fresh stats
      updateUserStats({
        xp: stats.xp,
        coins: stats.coins,
        level: stats.level,
        totalQuestions: stats.totalQuestions,
        correctAnswers: stats.correctAnswers,
        studyTime: stats.studyTime,
      });

    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast({
        title: "Gagal memuat data",
        description: "Sistem gamifikasi sedang bermasalah. Data akan dimuat ulang otomatis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Daily check-in
  const handleDailyCheckIn = async () => {
    try {
      const result = await gamificationService.dailyCheckIn();
      
      setUserStats(prev => ({
        ...prev,
        streak: result.streak,
        coins: prev.coins + result.reward.coins,
        xp: prev.xp + result.reward.xp
      }));

      setLastCheckIn(new Date().toISOString());

      toast({
        title: "Check-in berhasil! 🎉",
        description: `Streak ${result.streak} hari! +${result.reward.coins} koin, +${result.reward.xp} XP`,
      });

      // Reload quests to reflect any progress updates
      loadGamificationData();

    } catch (error: any) {
      toast({
        title: "Check-in gagal",
        description: error.message || "Silakan coba lagi nanti",
        variant: "destructive",
      });
    }
  };

  // Claim quest reward
  const handleClaimReward = async (questId: string) => {
    try {
      const result = await gamificationService.claimQuestReward(questId);
      
      setUserStats(result.newStats);
      
      toast({
        title: "Reward diklaim! 🏆",
        description: `+${result.reward.coins} koin, +${result.reward.xp} XP`,
      });

      // Update quest state
      setDailyQuests(prev => prev.map(quest => 
        quest.id === questId ? { ...quest, claimed: true } : quest
      ));
      setWeeklyQuests(prev => prev.map(quest => 
        quest.id === questId ? { ...quest, claimed: true } : quest
      ));

    } catch (error: any) {
      toast({
        title: "Gagal klaim reward",
        description: error.message || "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (progress: number, target: number): number => {
    return Math.min((progress / target) * 100, 100);
  };

  // Check if can check in today
  const canCheckInToday = (): boolean => {
    if (!lastCheckIn) return true;
    const today = new Date().toDateString();
    const lastCheckInDate = new Date(lastCheckIn).toDateString();
    return today !== lastCheckInDate;
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Level {userStats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{userStats.xp}</div>
              <div className="text-sm text-muted-foreground">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{userStats.coins}</div>
              <div className="text-sm text-muted-foreground">Koin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress ke Level {userStats.level + 1}</span>
              <span>{userStats.xpProgress || 0}/{userStats.xpToNextLevel || 100}</span>
            </div>
            <Progress 
              value={((userStats.xpProgress || 0) / (userStats.xpToNextLevel || 100)) * 100} 
              className="h-3" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Daily Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Check-in Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Streak saat ini: <span className="font-bold text-red-500">{userStats.streak} hari</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Check-in setiap hari untuk mendapatkan bonus!
              </p>
            </div>
            <Button 
              onClick={handleDailyCheckIn}
              disabled={!canCheckInToday() || isLoading}
              className="flex items-center gap-2"
            >
              <Gift className="h-4 w-4" />
              {canCheckInToday() ? 'Check-in' : 'Sudah Check-in'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Quest Harian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyQuests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Memuat quest...</p>
          ) : (
            dailyQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{quest.title}</h4>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-yellow-500">
                      +{quest.reward.coins} koin
                    </div>
                    <div className="text-sm text-muted-foreground">
                      +{quest.reward.xp} XP
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Progress 
                      value={getProgressPercentage(quest.progress, quest.target)} 
                      className="h-2 flex-1" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                  
                  {quest.completed && !quest.claimed && (
                    <Button 
                      size="sm" 
                      onClick={() => handleClaimReward(quest.id)}
                      className="ml-2"
                    >
                      <Gift className="h-4 w-4 mr-1" />
                      Klaim
                    </Button>
                  )}
                  
                  {quest.claimed && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selesai
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Weekly Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            Quest Mingguan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyQuests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Memuat quest mingguan...</p>
          ) : (
            weeklyQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-pink-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{quest.title}</h4>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-yellow-500">
                      +{quest.reward.coins} koin
                    </div>
                    <div className="text-sm text-muted-foreground">
                      +{quest.reward.xp} XP
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Progress 
                      value={getProgressPercentage(quest.progress, quest.target)} 
                      className="h-2 flex-1" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                  
                  {quest.completed && !quest.claimed && (
                    <Button 
                      size="sm" 
                      onClick={() => handleClaimReward(quest.id)}
                      className="ml-2"
                    >
                      <Trophy className="h-4 w-4 mr-1" />
                      Klaim
                    </Button>
                  )}
                  
                  {quest.claimed && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selesai
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button 
          onClick={loadGamificationData} 
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {isLoading ? 'Memuat...' : 'Refresh Data'}
        </Button>
      </div>
    </div>
  );
};

export default RealtimeGamificationSystem;
