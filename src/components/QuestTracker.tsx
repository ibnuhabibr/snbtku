import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  Star, 
  Trophy, 
  CheckCircle, 
  Circle,
  Gift,
  Zap,
  BookOpen,
  Users,
  Flame,
  TrendingUp,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    coins: number;
    items?: string[];
  };
  completed: boolean;
  timeLeft?: string;
  icon: React.ComponentType<any>;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestTrackerProps {
  className?: string;
  showHeader?: boolean;
  maxQuests?: number;
}

const QuestTracker: React.FC<QuestTrackerProps> = ({ 
  className = '', 
  showHeader = true, 
  maxQuests = 3 
}) => {
  const quests: Quest[] = [
    {
      id: '1',
      title: 'Latihan Harian',
      description: 'Selesaikan 20 soal hari ini',
      type: 'daily',
      progress: 20,
      maxProgress: 20,
      reward: { xp: 100, coins: 50 },
      completed: true,
      timeLeft: '8j 30m',
      icon: BookOpen,
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Pertahankan streak belajar 7 hari',
      type: 'weekly',
      progress: 7,
      maxProgress: 7,
      reward: { xp: 500, coins: 200, items: ['Badge Streak Master'] },
      completed: true,
      timeLeft: '2h 15m',
      icon: Flame,
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Try Out Champion',
      description: 'Raih skor 85+ di try out',
      type: 'special',
      progress: 1,
      maxProgress: 1,
      reward: { xp: 1000, coins: 500, items: ['Avatar Champion', 'Badge Elite'] },
      completed: true,
      icon: Trophy,
      difficulty: 'hard'
    },
    {
      id: '4',
      title: 'Social Learner',
      description: 'Bergabung dengan 3 study group',
      type: 'weekly',
      progress: 1,
      maxProgress: 3,
      reward: { xp: 300, coins: 150 },
      completed: false,
      timeLeft: '4h 45m',
      icon: Users,
      difficulty: 'medium'
    },
    {
      id: '5',
      title: 'Speed Runner',
      description: 'Selesaikan 50 soal dalam 1 jam',
      type: 'daily',
      progress: 0,
      maxProgress: 50,
      reward: { xp: 200, coins: 100, items: ['Badge Speed Runner'] },
      completed: false,
      timeLeft: '12h 20m',
      icon: Zap,
      difficulty: 'hard'
    },
    {
      id: '6',
      title: 'Perfect Score',
      description: 'Dapatkan nilai 100 di try out',
      type: 'special',
      progress: 0,
      maxProgress: 1,
      reward: { xp: 1500, coins: 750, items: ['Badge Perfect', 'Avatar Gold'] },
      completed: false,
      timeLeft: '6d 12h',
      icon: Star,
      difficulty: 'hard'
    },
    {
      id: '7',
      title: 'Early Bird',
      description: 'Login sebelum jam 7 pagi selama 5 hari',
      type: 'weekly',
      progress: 2,
      maxProgress: 5,
      reward: { xp: 400, coins: 200, items: ['Badge Early Bird'] },
      completed: false,
      timeLeft: '3d 8h',
      icon: Clock,
      difficulty: 'medium'
    },
    {
      id: '8',
      title: 'Knowledge Seeker',
      description: 'Baca 10 materi pembelajaran',
      type: 'daily',
      progress: 3,
      maxProgress: 10,
      reward: { xp: 150, coins: 75 },
      completed: false,
      timeLeft: '18h 45m',
      icon: BookOpen,
      difficulty: 'easy'
    },
    {
      id: '9',
      title: 'Consistency King',
      description: 'Login selama 30 hari berturut-turut',
      type: 'special',
      progress: 15,
      maxProgress: 30,
      reward: { xp: 2000, coins: 1000, items: ['Crown Avatar', 'Badge Legendary'] },
      completed: false,
      timeLeft: '15d',
      icon: Crown,
      difficulty: 'hard'
    },
    {
      id: '10',
      title: 'Quiz Master',
      description: 'Jawab 100 soal dengan benar',
      type: 'weekly',
      progress: 45,
      maxProgress: 100,
      reward: { xp: 600, coins: 300, items: ['Badge Quiz Master'] },
      completed: false,
      timeLeft: '5d 2h',
      icon: Target,
      difficulty: 'medium'
    },
    {
      id: '11',
      title: 'Friend Collector',
      description: 'Tambahkan 5 teman baru',
      type: 'weekly',
      progress: 1,
      maxProgress: 5,
      reward: { xp: 250, coins: 125 },
      completed: false,
      timeLeft: '6d 14h',
      icon: Users,
      difficulty: 'easy'
    },
    {
      id: '12',
      title: 'Night Owl',
      description: 'Belajar setelah jam 10 malam selama 3 hari',
      type: 'weekly',
      progress: 0,
      maxProgress: 3,
      reward: { xp: 300, coins: 150, items: ['Badge Night Owl'] },
      completed: false,
      timeLeft: '4d 6h',
      icon: Clock,
      difficulty: 'medium'
    },
    {
      id: '13',
      title: 'Improvement Tracker',
      description: 'Tingkatkan skor try out sebesar 50 poin',
      type: 'special',
      progress: 25,
      maxProgress: 50,
      reward: { xp: 800, coins: 400, items: ['Badge Improver'] },
      completed: false,
      timeLeft: '10d',
      icon: TrendingUp,
      difficulty: 'medium'
    },
    {
      id: '14',
      title: 'Marathon Runner',
      description: 'Belajar selama 3 jam tanpa henti',
      type: 'daily',
      progress: 1,
      maxProgress: 3,
      reward: { xp: 300, coins: 150, items: ['Badge Marathon'] },
      completed: false,
      timeLeft: '20h 30m',
      icon: Zap,
      difficulty: 'hard'
    },
    {
      id: '15',
      title: 'Subject Master',
      description: 'Selesaikan semua materi dalam 1 mata pelajaran',
      type: 'special',
      progress: 8,
      maxProgress: 12,
      reward: { xp: 1200, coins: 600, items: ['Badge Subject Master', 'Avatar Scholar'] },
      completed: false,
      timeLeft: '7d',
      icon: BookOpen,
      difficulty: 'hard'
    }
  ];

  // Sort quests: completed quests first, then by progress percentage
  const sortedQuests = [...quests].sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    if (a.completed && b.completed) return 0;
    
    const aProgress = (a.progress / a.maxProgress) * 100;
    const bProgress = (b.progress / b.maxProgress) * 100;
    return bProgress - aProgress;
  });

  const activeQuests = sortedQuests.slice(0, maxQuests);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-700';
      case 'weekly': return 'bg-purple-100 text-purple-700';
      case 'special': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleClaimReward = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show success notification
        console.log('Reward claimed successfully:', data);
        
        // You can add toast notification here if available
        // toast({
        //   title: "Reward Claimed!",
        //   description: `${data.message} (+${data.reward.coins} coins, +${data.reward.xp} XP)`,
        // });
        
        // Refresh quests or update local state
        window.location.reload(); // Simple refresh for now
      } else {
        const error = await response.json();
        console.error('Failed to claim reward:', error.error);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Quest Tracker
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {activeQuests.map((quest) => {
          const IconComponent = quest.icon;
          const progressPercentage = (quest.progress / quest.maxProgress) * 100;
          
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative p-3 sm:p-5 border rounded-xl transition-all duration-300 hover:shadow-md ${
                quest.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
                  : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 border-border hover:border-blue-200'
              }`}
            >
              {/* Quest Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 sm:p-3 rounded-xl shadow-sm flex-shrink-0 ${
                    quest.completed 
                      ? 'bg-green-100 text-green-600 shadow-green-100' 
                      : 'bg-gradient-to-br from-primary/10 to-primary/20 text-primary shadow-primary/10'
                  }`}>
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base text-foreground">{quest.title}</h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge 
                          variant="secondary" 
                          className={`${getTypeColor(quest.type)} text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium rounded-full`}
                        >
                          {quest.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${getDifficultyColor(quest.difficulty)} text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium rounded-full border-2`}
                        >
                          {quest.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:ml-4">
                  {quest.timeLeft && !quest.completed && (
                    <div className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">{quest.timeLeft}</span>
                      <span className="sm:hidden">{quest.timeLeft.split(' ')[0]}</span>
                    </div>
                  )}
                  
                  {quest.completed ? (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
                      onClick={() => handleClaimReward(quest.id)}
                    >
                      <Gift className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                      <span className="hidden sm:inline">Claim Reward</span>
                      <span className="sm:hidden">Claim</span>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      {progressPercentage === 100 ? (
                        <div className="p-1 bg-green-100 rounded-full">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="p-1 bg-gray-100 rounded-full">
                          <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Progress</span>
                  <span className="text-xs sm:text-sm font-semibold text-primary">
                    {quest.progress}/{quest.maxProgress}
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden" 
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {Math.round(progressPercentage)}% completed
                </div>
              </div>
              
              {/* Rewards Section */}
              <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-lg p-2 sm:p-3 border border-yellow-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Rewards</span>
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="text-xs font-semibold">{quest.reward.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-100 text-amber-700 rounded-full">
                      <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-yellow-400 shadow-sm" />
                      <span className="text-xs font-semibold">{quest.reward.coins}</span>
                      <span className="hidden sm:inline text-xs font-semibold">coins</span>
                    </div>
                    {quest.reward.items && (
                      <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full">
                        <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="text-xs font-semibold">{quest.reward.items.length}</span>
                        <span className="hidden sm:inline text-xs font-semibold">item</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Completion indicator */}
              {quest.completed && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <div className="bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium shadow-md">
                    <span className="sm:hidden">✓</span>
                    <span className="hidden sm:inline">✓ Completed</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
        
        {activeQuests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Tidak ada quest aktif saat ini</p>
            <p className="text-xs">Quest baru akan tersedia setiap hari!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestTracker;