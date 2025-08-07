import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Star, 
  Gift, 
  Users, 
  BarChart3,
  Crown,
  Flame,
  Award,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import GamificationSystem from '@/components/GamificationSystem';
import QuestTracker from '@/components/QuestTracker';
import GameStats from '@/components/GameStats';
import RewardNotification from '@/components/RewardNotification';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import HappyAvatarSelector from '@/components/HappyAvatarSelector';

const Gamification = () => {
  const [showGamificationSystem, setShowGamificationSystem] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('/api/placeholder/150/150');

  // Demo data for notifications and animations
  const demoRewards = [
    {
      id: '1',
      type: 'achievement' as const,
      title: 'First Achievement!',
      description: 'Selamat! Kamu telah menyelesaikan quest pertama',
      xp: 100,
      coins: 50,
      items: ['Badge Beginner'],
      rarity: 'common' as const
    },
    {
      id: '2',
      type: 'quest' as const,
      title: 'Daily Quest Complete',
      description: 'Kamu telah menyelesaikan semua quest harian',
      xp: 200,
      coins: 100,
      rarity: 'rare' as const
    }
  ];

  const demoLevelUpData = {
    oldLevel: 11,
    newLevel: 12,
    xpGained: 350,
    totalXP: 2450,
    nextLevelXP: 2800,
    rewards: {
      coins: 200,
      items: ['Avatar Frame Gold', 'Badge Level Master'],
      unlocks: ['Advanced Quest System', 'Premium Avatar Collection']
    }
  };

  const features = [
    {
      title: 'Quest System',
      description: 'Sistem quest harian, mingguan, dan spesial dengan reward menarik',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: () => setShowGamificationSystem(true)
    },
    {
      title: 'Achievement System',
      description: 'Koleksi achievement dengan berbagai tingkat kesulitan dan rarity',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      action: () => setShowGamificationSystem(true)
    },
    {
      title: 'Reward Store',
      description: 'Toko reward dengan avatar, badge, theme, dan boost eksklusif',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      action: () => setShowGamificationSystem(true)
    },
    {
      title: 'Happy Avatar Collection',
      description: 'Koleksi avatar lucu dan tersenyum dengan berbagai kategori',
      icon: () => <div className="h-5 w-5 text-pink-600">😊</div>,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      action: () => setShowAvatarSelector(true)
    },
    {
      title: 'Level & XP System',
      description: 'Sistem level dengan animasi menarik dan reward eksklusif',
      icon: Crown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      action: () => setShowLevelUpAnimation(true)
    },
    {
      title: 'Reward Notifications',
      description: 'Notifikasi reward yang menarik dengan animasi sparkle',
      icon: Sparkles,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      action: () => setShowRewardNotification(true)
    }
  ];

  const gamificationBenefits = [
    {
      title: 'Motivasi Belajar',
      description: 'Sistem reward dan achievement meningkatkan motivasi belajar siswa',
      icon: Flame,
      color: 'text-red-500'
    },
    {
      title: 'Engagement Tinggi',
      description: 'Quest dan challenge membuat proses belajar lebih menarik dan interaktif',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      title: 'Progress Tracking',
      description: 'Siswa dapat melihat progress belajar mereka dengan jelas melalui XP dan level',
      icon: BarChart3,
      color: 'text-blue-500'
    },
    {
      title: 'Social Learning',
      description: 'Leaderboard dan kompetisi sehat mendorong pembelajaran sosial',
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Personalisasi',
      description: 'Avatar dan customization memberikan pengalaman personal yang unik',
      icon: Star,
      color: 'text-purple-500'
    },
    {
      title: 'Long-term Retention',
      description: 'Sistem streak dan habit building membantu konsistensi belajar jangka panjang',
      icon: Award,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Sistem Gamifikasi SNBT
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pengalaman belajar yang menyenangkan dengan sistem reward, achievement, dan kompetisi yang aman dan menarik
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quests">Quests</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <GameStats showDetailed={true} />
              </div>
            </div>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-8">
            <QuestTracker showHeader={true} maxQuests={10} />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "First Steps",
                  description: "Selesaikan 10 soal pertama",
                  icon: Star,
                  color: "text-yellow-500",
                  progress: 10,
                  maxProgress: 10,
                  completed: true,
                  reward: "100 XP + 50 Coins"
                },
                {
                  title: "Streak Master",
                  description: "Belajar 7 hari berturut-turut",
                  icon: Flame,
                  color: "text-orange-500",
                  progress: 5,
                  maxProgress: 7,
                  completed: false,
                  reward: "500 XP + 200 Coins"
                },
                {
                  title: "Quiz Champion",
                  description: "Raih skor perfect di 5 quiz",
                  icon: Trophy,
                  color: "text-purple-500",
                  progress: 2,
                  maxProgress: 5,
                  completed: false,
                  reward: "1000 XP + Avatar Khusus"
                },
                {
                  title: "Social Learner",
                  description: "Bergabung dengan 3 study group",
                  icon: Users,
                  color: "text-blue-500",
                  progress: 1,
                  maxProgress: 3,
                  completed: false,
                  reward: "300 XP + Badge Khusus"
                },
                {
                  title: "Speed Runner",
                  description: "Selesaikan try out dalam waktu < 2 jam",
                  icon: Zap,
                  color: "text-green-500",
                  progress: 0,
                  maxProgress: 1,
                  completed: false,
                  reward: "750 XP + Title Khusus"
                },
                {
                  title: "Knowledge Seeker",
                  description: "Baca 50 materi pembelajaran",
                  icon: BookOpen,
                  color: "text-indigo-500",
                  progress: 23,
                  maxProgress: 50,
                  completed: false,
                  reward: "400 XP + Akses Materi Premium"
                }
              ].map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full ${achievement.completed ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-full ${achievement.completed ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                            <IconComponent className={`h-6 w-6 ${achievement.color}`} />
                          </div>
                          {achievement.completed && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground font-medium">Reward: {achievement.reward}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals and Animations */}
      <GamificationSystem 
        isOpen={showGamificationSystem} 
        onClose={() => setShowGamificationSystem(false)} 
      />
      
      <HappyAvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={(avatarUrl) => {
          setSelectedAvatar(avatarUrl);
          setShowAvatarSelector(false);
        }}
        currentAvatar={selectedAvatar}
      />
      
      {showRewardNotification && (
        <RewardNotification
          rewards={demoRewards}
          onClose={(rewardId) => {
            console.log(`Closed reward: ${rewardId}`);
            if (demoRewards.length === 1) {
              setShowRewardNotification(false);
            }
          }}
          onClaimAll={() => setShowRewardNotification(false)}
        />
      )}
      
      <LevelUpAnimation
        isVisible={showLevelUpAnimation}
        levelData={demoLevelUpData}
        onClose={() => setShowLevelUpAnimation(false)}
      />
    </div>
  );
};

export default Gamification;