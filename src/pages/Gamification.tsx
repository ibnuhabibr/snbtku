import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Star, 
  Gift, 
  Users, 
  // BarChart3, // Removed unused import
  Crown,
  Flame,
  Award,
  // Sparkles, // Removed unused import
  Zap,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import GamificationSystem from '@/components/GamificationSystem';
import QuestTracker from '@/components/QuestTracker';
import GameStats from '@/components/GameStats';
import RewardNotification from '@/components/RewardNotification';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import HappyAvatarSelector from '@/components/HappyAvatarSelector';
import { DailyCheckIn } from '@/components/gamification/DailyCheckIn';
import { UserStats } from '@/components/gamification/UserStats';
// import { QuestList } from '@/components/gamification/QuestList'; // Removed unused import
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/stores/authStore';

const Gamification = () => {
  const { user } = useAuthStore();
  const socket = useSocket();
  const navigate = useNavigate();
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

  useEffect(() => {
    // Initialize socket connection when component mounts
    if (user && socket) {
      console.log('Gamification page loaded with socket connection');
    }
  }, [user, socket]);

  // Removed unused handleQuestComplete function

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

  // Removed unused features array

  // Removed unused gamificationBenefits array

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Naik Rank, Kuy!
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
            
            {/* Integrated Components */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <DailyCheckIn />
              </div>
            </div>
            
            <UserStats />
            
            {/* Quick Actions - Moved to bottom */}
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate('/toko')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3"
                size="lg"
              >
                <Gift className="h-5 w-5 mr-2" />
                Buka Toko Reward
              </Button>
              <Button 
                onClick={() => setShowAvatarSelector(true)}
                variant="outline"
                className="px-6 py-3"
                size="lg"
              >
                😊 Ganti Avatar
              </Button>
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
                },
                {
                  title: "Math Genius",
                  description: "Selesaikan 100 soal matematika",
                  icon: Target,
                  color: "text-red-500",
                  progress: 67,
                  maxProgress: 100,
                  completed: false,
                  reward: "800 XP + Badge Matematika"
                },
                {
                  title: "Early Bird",
                  description: "Belajar sebelum jam 7 pagi selama 5 hari",
                  icon: Crown,
                  color: "text-amber-500",
                  progress: 2,
                  maxProgress: 5,
                  completed: false,
                  reward: "300 XP + Title Early Bird"
                },
                {
                  title: "Night Owl",
                  description: "Belajar setelah jam 10 malam selama 5 hari",
                  icon: Star,
                  color: "text-purple-400",
                  progress: 0,
                  maxProgress: 5,
                  completed: false,
                  reward: "300 XP + Title Night Owl"
                },
                {
                  title: "Perfect Score",
                  description: "Dapatkan nilai 100 di try out",
                  icon: Award,
                  color: "text-gold-500",
                  progress: 0,
                  maxProgress: 1,
                  completed: false,
                  reward: "2000 XP + Avatar Emas"
                },
                {
                  title: "Consistency King",
                  description: "Belajar 30 hari berturut-turut",
                  icon: Flame,
                  color: "text-red-600",
                  progress: 12,
                  maxProgress: 30,
                  completed: false,
                  reward: "1500 XP + Crown Avatar"
                },
                {
                  title: "Question Master",
                  description: "Jawab 500 soal dengan benar",
                  icon: Target,
                  color: "text-green-600",
                  progress: 234,
                  maxProgress: 500,
                  completed: false,
                  reward: "1200 XP + Badge Master"
                },
                {
                  title: "Speed Demon",
                  description: "Selesaikan 10 soal dalam 5 menit",
                  icon: Zap,
                  color: "text-yellow-400",
                  progress: 0,
                  maxProgress: 1,
                  completed: false,
                  reward: "600 XP + Lightning Badge"
                },
                {
                  title: "Comeback Kid",
                  description: "Tingkatkan skor try out sebesar 50 poin",
                  icon: TrendingUp,
                  color: "text-emerald-500",
                  progress: 0,
                  maxProgress: 1,
                  completed: false,
                  reward: "800 XP + Comeback Badge"
                },
                {
                  title: "Study Buddy",
                  description: "Ajak 5 teman bergabung ke platform",
                  icon: Users,
                  color: "text-pink-500",
                  progress: 1,
                  maxProgress: 5,
                  completed: false,
                  reward: "1000 XP + Referral Badge"
                },
                {
                  title: "Bookworm",
                  description: "Baca 100 artikel pembelajaran",
                  icon: BookOpen,
                  color: "text-brown-500",
                  progress: 45,
                  maxProgress: 100,
                  completed: false,
                  reward: "700 XP + Scholar Badge"
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