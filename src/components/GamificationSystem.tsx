import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Gift, 
  Crown, 
  Zap, 
  Heart,
  Coins,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Sparkles
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
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
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
  category: 'study' | 'social' | 'streak' | 'score' | 'special';
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

const GamificationSystem: React.FC = () => {
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

  // Daily & Weekly Quests
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Pagi yang Produktif',
      description: 'Selesaikan 20 soal sebelum jam 12 siang',
      type: 'daily',
      progress: 15,
      maxProgress: 20,
      xpReward: 100,
      coinReward: 50,
      completed: false,
      icon: Target,
      rarity: 'common',
      timeLeft: '4j 23m'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Pertahankan streak belajar selama 7 hari',
      type: 'weekly',
      progress: 5,
      maxProgress: 7,
      xpReward: 500,
      coinReward: 200,
      completed: false,
      icon: Flame,
      rarity: 'rare',
      timeLeft: '2h 15h'
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Jawab 10 soal dengan benar dalam 5 menit',
      type: 'daily',
      progress: 7,
      maxProgress: 10,
      xpReward: 150,
      coinReward: 75,
      completed: false,
      icon: Zap,
      rarity: 'uncommon',
      timeLeft: '8j 45m'
    },
    {
      id: '4',
      title: 'Perfect Score',
      description: 'Dapatkan skor 100% di try out',
      type: 'achievement',
      progress: 0,
      maxProgress: 1,
      xpReward: 1000,
      coinReward: 500,
      completed: false,
      icon: Crown,
      rarity: 'legendary',
    }
  ]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
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
    }
  ]);

  // Rewards Store
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Avatar Superhero',
      description: 'Koleksi avatar superhero eksklusif',
      cost: 500,
      type: 'avatar',
      icon: '🦸‍♂️',
      rarity: 'rare',
      owned: false
    },
    {
      id: '2',
      name: 'XP Boost 2x',
      description: 'Gandakan XP selama 1 jam',
      cost: 200,
      type: 'boost',
      icon: '⚡',
      rarity: 'common',
      owned: false
    },
    {
      id: '3',
      name: 'Golden Badge',
      description: 'Badge emas eksklusif untuk profil',
      cost: 1000,
      type: 'badge',
      icon: '🏆',
      rarity: 'epic',
      owned: false
    },
    {
      id: '4',
      name: 'Dark Theme Premium',
      description: 'Tema gelap dengan efek animasi',
      cost: 750,
      type: 'theme',
      icon: '🌙',
      rarity: 'rare',
      owned: false
    },
    {
      id: '5',
      name: 'Legendary Crown',
      description: 'Mahkota legendaris untuk top player',
      cost: 2500,
      type: 'special',
      icon: '👑',
      rarity: 'legendary',
      owned: false,
      limited: true,
      timeLeft: '7 hari'
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        setUserStats(stats => ({
          ...stats,
          xp: stats.xp + quest.xpReward,
          coins: stats.coins + quest.coinReward
        }));
        setNewReward(`+${quest.xpReward} XP, +${quest.coinReward} Coins`);
        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 3000);
        return { ...quest, completed: true, progress: quest.maxProgress };
      }
      return quest;
    }));
  };

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

  return (
    <div className="space-y-6">
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
  );
};

export default GamificationSystem;