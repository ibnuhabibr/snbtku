import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Crown, 
  Zap, 
  CheckCircle,
  Users,
  BookOpen,
  Brain,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  timeLeft?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  category: 'study' | 'social' | 'streak' | 'score' | 'special' | 'speed' | 'accuracy' | 'dedication' | 'improvement' | 'endurance' | 'mastery' | 'volume' | 'competition';
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'avatar' | 'badge' | 'theme' | 'boost' | 'special';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  limited?: boolean;
  timeLeft?: string;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  rank: number;
  badges: number;
}

interface GamificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('quests');
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [newReward, setNewReward] = useState<string>('');

  // Mock user stats
  const [userStats, setUserStats] = useState<UserStats>({
    level: 15,
    xp: 3250,
    xpToNext: 4000,
    coins: 1850,
    streak: 12,
    totalQuestions: 2847,
    correctAnswers: 2203,
    studyTime: 145, // hours
    rank: 156,
    badges: 18
  });

  // Daily Quests
  const [dailyQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Pagi yang Produktif',
      description: 'Selesaikan 5 soal sebelum jam 10 pagi',
      type: 'daily',
      progress: 3,
      maxProgress: 5,
      xpReward: 100,
      coinReward: 50,
      completed: false,
      timeLeft: '4j 30m',
      icon: BookOpen,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Pertahankan streak belajar selama 3 hari',
      type: 'daily',
      progress: 2,
      maxProgress: 3,
      xpReward: 200,
      coinReward: 100,
      completed: false,
      timeLeft: '8j 15m',
      icon: Flame,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Quick Learner',
      description: 'Jawab 10 soal dengan benar dalam 15 menit',
      type: 'daily',
      progress: 6,
      maxProgress: 10,
      xpReward: 150,
      coinReward: 75,
      completed: false,
      timeLeft: '6j 20m',
      icon: Zap,
      rarity: 'common'
    },
    {
      id: '4',
      title: 'Night Owl',
      description: 'Belajar setelah jam 9 malam',
      type: 'daily',
      progress: 0,
      maxProgress: 1,
      xpReward: 120,
      coinReward: 60,
      completed: false,
      timeLeft: '12j 45m',
      icon: Star,
      rarity: 'common'
    },
    {
      id: '5',
      title: 'Focus Mode',
      description: 'Selesaikan 20 soal tanpa salah',
      type: 'daily',
      progress: 8,
      maxProgress: 20,
      xpReward: 300,
      coinReward: 150,
      completed: false,
      timeLeft: '5j 10m',
      icon: Target,
      rarity: 'rare'
    }
  ]);

  // Weekly Quests
  const [weeklyQuests] = useState<Quest[]>([
    {
      id: '6',
      title: 'Speed Demon',
      description: 'Selesaikan 50 soal dalam waktu kurang dari 1 jam',
      type: 'weekly',
      progress: 25,
      maxProgress: 50,
      xpReward: 500,
      coinReward: 250,
      completed: false,
      timeLeft: '3h 45m',
      icon: Zap,
      rarity: 'rare'
    },
    {
      id: '7',
      title: 'Perfect Score',
      description: 'Dapatkan skor 100% di try out',
      type: 'weekly',
      progress: 0,
      maxProgress: 1,
      xpReward: 1000,
      coinReward: 500,
      completed: false,
      timeLeft: '2h 30m',
      icon: Crown,
      rarity: 'legendary'
    },
    {
      id: '8',
      title: 'Marathon Runner',
      description: 'Selesaikan 100 soal dalam seminggu',
      type: 'weekly',
      progress: 45,
      maxProgress: 100,
      xpReward: 800,
      coinReward: 400,
      completed: false,
      timeLeft: '4d 12h',
      icon: Trophy,
      rarity: 'epic'
    },
    {
      id: '9',
      title: 'Subject Master',
      description: 'Raih skor 90%+ di 3 mata pelajaran berbeda',
      type: 'weekly',
      progress: 1,
      maxProgress: 3,
      xpReward: 600,
      coinReward: 300,
      completed: false,
      timeLeft: '5d 8h',
      icon: Brain,
      rarity: 'rare'
    },
    {
      id: '10',
      title: 'Consistency King',
      description: 'Belajar setiap hari selama seminggu',
      type: 'weekly',
      progress: 4,
      maxProgress: 7,
      xpReward: 700,
      coinReward: 350,
      completed: false,
      timeLeft: '3d 16h',
      icon: Flame,
      rarity: 'epic'
    },
    {
      id: '11',
      title: 'Social Learner',
      description: 'Bergabung dengan 5 study group',
      type: 'weekly',
      progress: 2,
      maxProgress: 5,
      xpReward: 400,
      coinReward: 200,
      completed: false,
      timeLeft: '6d 4h',
      icon: Users,
      rarity: 'uncommon'
    }
  ]);

  // Achievements
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Selesaikan 10 soal pertama',
      icon: '🎯',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2024-01-15',
      progress: 10,
      maxProgress: 10,
      xpReward: 50,
      category: 'study'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Belajar 7 hari berturut-turut',
      icon: '🔥',
      rarity: 'uncommon',
      unlocked: true,
      unlockedDate: '2024-01-22',
      progress: 7,
      maxProgress: 7,
      xpReward: 200,
      category: 'streak'
    },
    {
      id: '3',
      title: 'Math Genius',
      description: 'Skor 95%+ di Penalaran Matematika',
      icon: '🧮',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2024-02-01',
      progress: 1,
      maxProgress: 1,
      xpReward: 300,
      category: 'score'
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Bantu 50 teman dengan menjawab pertanyaan',
      icon: '🦋',
      rarity: 'epic',
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      xpReward: 500,
      category: 'social'
    },
    {
      id: '5',
      title: 'Legend',
      description: 'Mencapai level 50',
      icon: '👑',
      rarity: 'legendary',
      unlocked: false,
      progress: 15,
      maxProgress: 50,
      xpReward: 2000,
      category: 'special'
    },
    {
      id: '6',
      title: 'Speed Runner',
      description: 'Selesaikan 20 soal dalam 10 menit',
      icon: '💨',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 400,
      category: 'speed'
    },
    {
      id: '7',
      title: 'Perfect Streak',
      description: 'Jawab 50 soal berturut-turut dengan benar',
      icon: '⭐',
      rarity: 'epic',
      unlocked: false,
      progress: 12,
      maxProgress: 50,
      xpReward: 800,
      category: 'accuracy'
    },
    {
      id: '8',
      title: 'Night Scholar',
      description: 'Belajar setelah jam 10 malam selama 10 hari',
      icon: '🌙',
      rarity: 'uncommon',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      xpReward: 250,
      category: 'dedication'
    },
    {
      id: '9',
      title: 'Early Bird',
      description: 'Belajar sebelum jam 7 pagi selama 7 hari',
      icon: '🌅',
      rarity: 'uncommon',
      unlocked: false,
      progress: 1,
      maxProgress: 7,
      xpReward: 300,
      category: 'dedication'
    },
    {
      id: '10',
      title: 'Quiz Master',
      description: 'Raih skor perfect di 10 quiz berbeda',
      icon: '🏆',
      rarity: 'epic',
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      xpReward: 1000,
      category: 'score'
    },
    {
      id: '11',
      title: 'Comeback King',
      description: 'Tingkatkan skor try out sebesar 50 poin',
      icon: '📈',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 600,
      category: 'improvement'
    },
    {
      id: '12',
      title: 'Study Buddy',
      description: 'Ajak 10 teman bergabung ke platform',
      icon: '👥',
      rarity: 'epic',
      unlocked: false,
      progress: 2,
      maxProgress: 10,
      xpReward: 1200,
      category: 'social'
    },
    {
      id: '13',
      title: 'Marathon Master',
      description: 'Belajar selama 5 jam dalam sehari',
      icon: '⏰',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 500,
      category: 'endurance'
    },
    {
      id: '14',
      title: 'Subject Expert',
      description: 'Raih skor 95%+ di semua mata pelajaran',
      icon: '🎓',
      rarity: 'legendary',
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      xpReward: 1500,
      category: 'mastery'
    },
    {
      id: '15',
      title: 'Consistency Champion',
      description: 'Belajar 30 hari berturut-turut',
      icon: '🔥',
      rarity: 'legendary',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      xpReward: 2500,
      category: 'streak'
    },
    {
      id: '16',
      title: 'Question Collector',
      description: 'Selesaikan 1000 soal',
      icon: '📚',
      rarity: 'epic',
      unlocked: false,
      progress: 456,
      maxProgress: 1000,
      xpReward: 1000,
      category: 'volume'
    },
    {
      id: '17',
      title: 'Leaderboard King',
      description: 'Masuk top 10 leaderboard selama 7 hari',
      icon: '👑',
      rarity: 'legendary',
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      xpReward: 3000,
      category: 'competition'
    },
    {
      id: '18',
      title: 'Helper Hero',
      description: 'Bantu 100 teman dengan menjawab pertanyaan',
      icon: '🦸‍♂️',
      rarity: 'legendary',
      unlocked: false,
      progress: 23,
      maxProgress: 100,
      xpReward: 2000,
      category: 'social'
    }
  ]);

  // Rewards Store
  const [rewards, setRewards] = useState<Reward[]>([
    // Avatars - Karakter Terkenal
    {
      id: '1',
      name: 'Spiderman Avatar',
      description: 'Avatar Spiderman dengan kostum merah-biru ikonik',
      cost: 800,
      type: 'avatar',
      icon: '🕷️',
      rarity: 'epic',
      owned: false
    },
    {
      id: '2',
      name: 'Batman Avatar',
      description: 'Avatar Batman dengan jubah hitam legendaris',
      cost: 850,
      type: 'avatar',
      icon: '🦇',
      rarity: 'epic',
      owned: false
    },
    {
      id: '3',
      name: 'Superman Avatar',
      description: 'Avatar Superman dengan logo S di dada',
      cost: 900,
      type: 'avatar',
      icon: '🦸‍♂️',
      rarity: 'epic',
      owned: false
    },
    {
      id: '4',
      name: 'Iron Man Avatar',
      description: 'Avatar Iron Man dengan armor teknologi tinggi',
      cost: 950,
      type: 'avatar',
      icon: '🤖',
      rarity: 'epic',
      owned: false
    },
    {
      id: '5',
      name: 'Wonder Woman Avatar',
      description: 'Avatar Wonder Woman dengan tiara emas',
      cost: 800,
      type: 'avatar',
      icon: '👸',
      rarity: 'epic',
      owned: false
    },
    {
      id: '6',
      name: 'Captain America Avatar',
      description: 'Avatar Captain America dengan perisai vibranium',
      cost: 850,
      type: 'avatar',
      icon: '🛡️',
      rarity: 'epic',
      owned: false
    },
    {
      id: '7',
      name: 'Thor Avatar',
      description: 'Avatar Thor dengan palu Mjolnir',
      cost: 1000,
      type: 'avatar',
      icon: '⚡',
      rarity: 'legendary',
      owned: false
    },
    {
      id: '8',
      name: 'Hulk Avatar',
      description: 'Avatar Hulk dengan kekuatan super',
      cost: 900,
      type: 'avatar',
      icon: '💚',
      rarity: 'epic',
      owned: false
    },
    {
      id: '9',
      name: 'Black Panther Avatar',
      description: 'Avatar Black Panther dari Wakanda',
      cost: 950,
      type: 'avatar',
      icon: '🐾',
      rarity: 'epic',
      owned: false
    },
    {
      id: '10',
      name: 'Doctor Strange Avatar',
      description: 'Avatar Doctor Strange dengan mantel levitasi',
      cost: 1200,
      type: 'avatar',
      icon: '🔮',
      rarity: 'legendary',
      owned: false
    },
    
    // Power-ups
    {
      id: '6',
      name: 'XP Boost 2x',
      description: 'Gandakan XP selama 1 jam',
      cost: 200,
      type: 'boost',
      icon: '⚡',
      rarity: 'common',
      owned: false
    },
    {
      id: '7',
      name: 'XP Boost 3x',
      description: 'Triple XP selama 30 menit',
      cost: 400,
      type: 'boost',
      icon: '🔥',
      rarity: 'common',
      owned: false
    },
    {
      id: '8',
      name: 'Coin Magnet',
      description: 'Dapatkan 50% lebih banyak coins selama 2 jam',
      cost: 300,
      type: 'boost',
      icon: '🧲',
      rarity: 'common',
      owned: false
    },
    {
      id: '9',
      name: 'Lucky Charm',
      description: 'Peluang double reward 25% selama 1 hari',
      cost: 600,
      type: 'boost',
      icon: '🍀',
      rarity: 'rare',
      owned: false
    },
    {
      id: '10',
      name: 'Time Freeze',
      description: 'Hentikan timer selama try out (1x pakai)',
      cost: 500,
      type: 'boost',
      icon: '⏰',
      rarity: 'rare',
      owned: false
    },
    
    // Badges
    {
      id: '11',
      name: 'Bronze Scholar',
      description: 'Badge perunggu untuk pemula',
      cost: 150,
      type: 'badge',
      icon: '🥉',
      rarity: 'common',
      owned: false
    },
    {
      id: '12',
      name: 'Silver Scholar',
      description: 'Badge perak untuk yang berdedikasi',
      cost: 400,
      type: 'badge',
      icon: '🥈',
      rarity: 'common',
      owned: false
    },
    {
      id: '13',
      name: 'Golden Scholar',
      description: 'Badge emas untuk yang berprestasi',
      cost: 1000,
      type: 'badge',
      icon: '🥇',
      rarity: 'epic',
      owned: false
    },
    {
      id: '14',
      name: 'Diamond Scholar',
      description: 'Badge berlian untuk master SNBT',
      cost: 2500,
      type: 'badge',
      icon: '💎',
      rarity: 'legendary',
      owned: false
    },
    {
      id: '15',
      name: 'Speed Demon',
      description: 'Badge untuk yang cepat menyelesaikan soal',
      cost: 800,
      type: 'badge',
      icon: '💨',
      rarity: 'rare',
      owned: false
    },
    {
      id: '16',
      name: 'Perfect Score',
      description: 'Badge untuk yang mendapat nilai sempurna',
      cost: 1200,
      type: 'badge',
      icon: '⭐',
      rarity: 'epic',
      owned: false
    },
    
    // Themes
    {
      id: '17',
      name: 'Dark Theme Premium',
      description: 'Tema gelap premium dengan efek khusus',
      cost: 300,
      type: 'theme',
      icon: '🌙',
      rarity: 'common',
      owned: false
    },
    {
      id: '18',
      name: 'Ocean Theme',
      description: 'Tema biru laut yang menenangkan',
      cost: 350,
      type: 'theme',
      icon: '🌊',
      rarity: 'common',
      owned: false
    },
    {
      id: '19',
      name: 'Forest Theme',
      description: 'Tema hijau hutan yang segar',
      cost: 350,
      type: 'theme',
      icon: '🌲',
      rarity: 'common',
      owned: false
    },
    {
      id: '20',
      name: 'Sunset Theme',
      description: 'Tema sunset dengan gradasi indah',
      cost: 500,
      type: 'theme',
      icon: '🌅',
      rarity: 'rare',
      owned: false
    },
    {
      id: '21',
      name: 'Galaxy Theme',
      description: 'Tema galaksi dengan efek bintang',
      cost: 800,
      type: 'theme',
      icon: '🌌',
      rarity: 'epic',
      owned: false
    },
    
    // Special Items
    {
      id: '22',
      name: 'Legendary Crown',
      description: 'Mahkota legendaris untuk top player',
      cost: 2500,
      type: 'special',
      icon: '👑',
      rarity: 'legendary',
      owned: false,
      limited: true,
      timeLeft: '2h 30m'
    },
    {
      id: '23',
      name: 'Magic Wand',
      description: 'Tongkat ajaib dengan efek sparkle',
      cost: 1500,
      type: 'special',
      icon: '🪄',
      rarity: 'legendary',
      owned: false
    },
    {
      id: '24',
      name: 'Golden Wings',
      description: 'Sayap emas untuk avatar',
      cost: 1800,
      type: 'special',
      icon: '🪶',
      rarity: 'legendary',
      owned: false
    },
    {
      id: '25',
      name: 'Crystal Orb',
      description: 'Bola kristal dengan efek cahaya',
      cost: 1200,
      type: 'special',
      icon: '🔮',
      rarity: 'epic',
      owned: false
    },
    {
      id: '26',
      name: 'Phoenix Feather',
      description: 'Bulu phoenix yang langka',
      cost: 2200,
      type: 'special',
      icon: '🔥',
      rarity: 'legendary',
      owned: false
    }
  ]);





  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && userStats.coins >= reward.cost && !reward.owned) {
      setUserStats(prev => ({ ...prev, coins: prev.coins - reward.cost }));
      setRewards(prev => prev.map(r => 
        r.id === rewardId ? { ...r, owned: true } : r
      ));
      setNewReward(`Berhasil membeli ${reward.name}!`);
      setShowRewardAnimation(true);
      setTimeout(() => setShowRewardAnimation(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Sistem Gamifikasi</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Stats Overview */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{userStats.coins}</div>
                  <div className="text-sm text-muted-foreground">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{userStats.streak}</div>
                  <div className="text-sm text-muted-foreground">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{userStats.badges}</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP Progress</span>
                  <span>{userStats.xp}/{userStats.xpToNext}</span>
                </div>
                <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quests">Quests</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            {/* Quests Tab */}
            <TabsContent value="quests" className="space-y-4">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Daily Quests</h3>
                {dailyQuests.map((quest) => {
                  const IconComponent = quest.icon;
                  return (
                    <Card key={quest.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{quest.title}</h4>
                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2 w-32" />
                              <span className="text-xs">{quest.progress}/{quest.maxProgress}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-500">+{quest.coinReward} coins</div>
                          <div className="text-sm text-muted-foreground">+{quest.xpReward} XP</div>
                          {quest.timeLeft && <div className="text-xs text-red-500">{quest.timeLeft}</div>}
                        </div>
                      </div>
                    </Card>
                  );
                })}

                <h3 className="text-lg font-semibold mt-6">Weekly Quests</h3>
                {weeklyQuests.map((quest) => {
                  const IconComponent = quest.icon;
                  return (
                    <Card key={quest.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{quest.title}</h4>
                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2 w-32" />
                              <span className="text-xs">{quest.progress}/{quest.maxProgress}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-500">+{quest.coinReward} coins</div>
                          <div className="text-sm text-muted-foreground">+{quest.xpReward} XP</div>
                          {quest.timeLeft && <div className="text-xs text-red-500">{quest.timeLeft}</div>}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`p-4 ${achievement.unlocked ? 'bg-green-50 border-green-200' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {achievement.title}
                            {achievement.unlocked && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {!achievement.unlocked && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2 w-32" />
                              <span className="text-xs">{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                          )}
                          {achievement.unlocked && achievement.unlockedDate && (
                            <p className="text-xs text-green-600">Unlocked: {achievement.unlockedDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={achievement.rarity === 'legendary' ? 'default' : 'secondary'}>
                          {achievement.rarity}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">+{achievement.xpReward} XP</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <div>
                          <h4 className="font-medium">{reward.name}</h4>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={reward.rarity === 'legendary' ? 'default' : 'secondary'}>
                              {reward.rarity}
                            </Badge>
                            {reward.limited && <Badge variant="destructive">Limited</Badge>}
                          </div>
                          {reward.timeLeft && (
                            <p className="text-xs text-red-500 mt-1">Expires in: {reward.timeLeft}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-500 mb-2">{reward.cost} coins</div>
                        <Button 
                          size="sm" 
                          disabled={reward.owned || userStats.coins < reward.cost}
                          onClick={() => purchaseReward(reward.id)}
                        >
                          {reward.owned ? 'Owned' : 'Buy'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Reward Animation */}
          <AnimatePresence>
            {showRewardAnimation && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
              >
                <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-bold">{newReward}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default GamificationSystem;