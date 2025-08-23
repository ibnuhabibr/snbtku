import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface UpdateProgressBody {
  action: string;
  data?: any;
}

interface UpdateAvatarBody {
  avatarUrl: string;
}

// XP and level calculation
const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXPForNextLevel = (currentLevel: number): number => {
  // XP needed for next level = (level^2) * 100
  return (currentLevel * currentLevel) * 100;
};

// Default quests configuration
const DAILY_QUESTS = [
  {
    id: 'daily_questions_5',
    title: 'Pagi yang Produktif',
    description: 'Selesaikan 5 soal hari ini',
    type: 'practice_questions',
    target: 5,
    reward: { coins: 50, xp: 100 }
  },
  {
    id: 'daily_study_30',
    title: 'Belajar Konsisten',
    description: 'Belajar selama 30 menit',
    type: 'study_time',
    target: 30,
    reward: { coins: 75, xp: 150 }
  },
  {
    id: 'daily_correct_3',
    title: 'Akurasi Tinggi',
    description: 'Jawab 3 soal dengan benar',
    type: 'correct_answers',
    target: 3,
    reward: { coins: 40, xp: 80 }
  }
];

const WEEKLY_QUESTS = [
  {
    id: 'weekly_tryout',
    title: 'Tryout Mingguan',
    description: 'Selesaikan 1 tryout lengkap minggu ini',
    type: 'complete_tryout',
    target: 1,
    reward: { coins: 200, xp: 500 }
  },
  {
    id: 'weekly_streak_7',
    title: 'Streak Master',
    description: 'Pertahankan streak 7 hari berturut-turut',
    type: 'daily_streak',
    target: 7,
    reward: { coins: 300, xp: 750 }
  }
];

export class GamificationController {
  // Get user gamification stats
  static async getUserStats(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const user = await db
        .select({
          xp: users.xp,
          coins: users.coins,
          level: users.level,
          dailyStreak: users.dailyCheckInStreak,
          avatar_url: users.avatar_url,
        })
        .from(users)
        .where(eq(users.id, request.user.id))
        .limit(1);

      if (!user[0]) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const currentXP = user[0].xp || 0;
      const currentLevel = user[0].level || calculateLevel(currentXP);
      const nextLevelXP = calculateXPForNextLevel(currentLevel);

      const stats = {
        xp: currentXP,
        coins: user[0].coins || 0,
        level: currentLevel,
        totalQuestions: 0, // TODO: Implement actual tracking
        correctAnswers: 0, // TODO: Implement actual tracking
        studyTime: 0, // TODO: Implement actual tracking
        streak: user[0].dailyStreak || 0,
        avatar_url: user[0].avatar_url,
        xpToNextLevel: nextLevelXP,
        xpProgress: currentXP - calculateXPForNextLevel(currentLevel - 1)
      };

      return reply.send({ stats });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return reply.status(500).send({ error: 'Failed to fetch user stats' });
    }
  }

  // Get active quests
  static async getQuests(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      // For now, return static quests
      // TODO: Implement actual quest progress tracking from database
      const daily = DAILY_QUESTS.map(quest => ({
        ...quest,
        progress: 0,
        completed: false,
        claimed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }));

      const weekly = WEEKLY_QUESTS.map(quest => ({
        ...quest,
        progress: 0,
        completed: false,
        claimed: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }));

      const achievements = []; // TODO: Implement achievements

      return reply.send({
        daily,
        weekly,
        achievements
      });
    } catch (error) {
      console.error('Error fetching quests:', error);
      return reply.status(500).send({ error: 'Failed to fetch quests' });
    }
  }

  // Update quest progress
  static async updateProgress(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const { action, data } = request.body as UpdateProgressBody;

      let xpGained = 0;
      let coinsGained = 0;

      // Handle different action types
      switch (action) {
        case 'answer_question':
          xpGained = data?.correct ? 10 : 2; // More XP for correct answers
          coinsGained = data?.correct ? 5 : 1;
          break;
        case 'complete_tryout':
          const score = data?.score || 0;
          xpGained = Math.floor(score * 5); // XP based on score
          coinsGained = Math.floor(score * 2);
          break;
        case 'study_time':
          const minutes = data?.minutes || 0;
          xpGained = Math.floor(minutes * 2); // 2 XP per minute
          coinsGained = Math.floor(minutes * 1);
          break;
        case 'complete_lesson':
          xpGained = 50;
          coinsGained = 25;
          break;
        default:
          xpGained = 5;
          coinsGained = 2;
      }

      // Update user stats in database
      const updatedUser = await db
        .update(users)
        .set({
          xp: db.raw(`COALESCE(xp, 0) + ${xpGained}`),
          coins: db.raw(`COALESCE(coins, 0) + ${coinsGained}`),
          updated_at: new Date()
        })
        .where(eq(users.id, request.user.id))
        .returning();

      if (!updatedUser[0]) {
        throw new Error('Failed to update user stats');
      }

      // Recalculate level
      const newXP = updatedUser[0].xp || 0;
      const newLevel = calculateLevel(newXP);

      let leveledUp = false;
      if (newLevel > (updatedUser[0].level || 1)) {
        await db
          .update(users)
          .set({ level: newLevel })
          .where(eq(users.id, request.user.id));
        leveledUp = true;
      }

      const userStats = {
        xp: newXP,
        coins: updatedUser[0].coins || 0,
        level: newLevel,
        totalQuestions: 0, // TODO: Implement tracking
        correctAnswers: 0, // TODO: Implement tracking
        studyTime: 0, // TODO: Implement tracking
        streak: updatedUser[0].dailyCheckInStreak || 0,
      };

      return reply.send({
        updatedQuests: [], // TODO: Return actually updated quests
        completedQuests: [], // TODO: Return completed quests
        newAchievements: [], // TODO: Check for new achievements
        userStats,
        xpGained,
        coinsGained,
        leveledUp
      });

    } catch (error) {
      console.error('Error updating quest progress:', error);
      return reply.status(500).send({ error: 'Failed to update progress' });
    }
  }

  // Claim quest reward
  static async claimQuestReward(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const { questId } = request.params as { questId: string };

      // Find quest reward (simplified)
      const quest = [...DAILY_QUESTS, ...WEEKLY_QUESTS].find(q => q.id === questId);
      
      if (!quest) {
        return reply.status(404).send({ error: 'Quest not found' });
      }

      // TODO: Check if quest is actually completed and not already claimed
      
      // Award the reward
      const updatedUser = await db
        .update(users)
        .set({
          xp: db.raw(`COALESCE(xp, 0) + ${quest.reward.xp}`),
          coins: db.raw(`COALESCE(coins, 0) + ${quest.reward.coins}`),
          updated_at: new Date()
        })
        .where(eq(users.id, request.user.id))
        .returning();

      if (!updatedUser[0]) {
        throw new Error('Failed to claim reward');
      }

      const newStats = {
        xp: updatedUser[0].xp || 0,
        coins: updatedUser[0].coins || 0,
        level: calculateLevel(updatedUser[0].xp || 0),
        totalQuestions: 0,
        correctAnswers: 0,
        studyTime: 0,
        streak: updatedUser[0].dailyCheckInStreak || 0,
      };

      return reply.send({
        success: true,
        reward: quest.reward,
        newStats
      });

    } catch (error) {
      console.error('Error claiming quest reward:', error);
      return reply.status(500).send({ error: 'Failed to claim reward' });
    }
  }

  // Update avatar
  static async updateAvatar(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const { avatarUrl } = request.body as UpdateAvatarBody;

      if (!avatarUrl) {
        return reply.status(400).send({ error: 'Avatar URL is required' });
      }

      await db
        .update(users)
        .set({
          avatar_url: avatarUrl,
          updated_at: new Date()
        })
        .where(eq(users.id, request.user.id));

      return reply.send({
        success: true,
        avatarUrl
      });

    } catch (error) {
      console.error('Error updating avatar:', error);
      return reply.status(500).send({ error: 'Failed to update avatar' });
    }
  }

  // Daily check-in
  static async dailyCheckIn(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, request.user.id))
        .limit(1);

      if (!user[0]) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const now = new Date();
      const lastCheckIn = user[0].lastDailyCheckIn ? new Date(user[0].lastDailyCheckIn) : null;
      
      // Check if already checked in today
      if (lastCheckIn && lastCheckIn.toDateString() === now.toDateString()) {
        return reply.status(400).send({ 
          error: 'Already checked in today',
          nextCheckIn: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Calculate streak
      let newStreak = 1;
      if (lastCheckIn) {
        const diffTime = now.getTime() - lastCheckIn.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          newStreak = (user[0].dailyCheckInStreak || 0) + 1;
        }
        // If more than 1 day, streak resets to 1
      }

      // Calculate reward based on streak
      const baseReward = { coins: 20, xp: 50 };
      const streakBonus = Math.min(newStreak - 1, 10) * 5; // Max bonus at 10-day streak
      const reward = {
        coins: baseReward.coins + streakBonus,
        xp: baseReward.xp + streakBonus * 2
      };

      // Update user
      await db
        .update(users)
        .set({
          dailyCheckInStreak: newStreak,
          lastDailyCheckIn: now,
          xp: db.raw(`COALESCE(xp, 0) + ${reward.xp}`),
          coins: db.raw(`COALESCE(coins, 0) + ${reward.coins}`),
          updated_at: now
        })
        .where(eq(users.id, request.user.id));

      return reply.send({
        success: true,
        streak: newStreak,
        reward,
        nextCheckIn: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      });

    } catch (error) {
      console.error('Error with daily check-in:', error);
      return reply.status(500).send({ error: 'Failed to check in' });
    }
  }

  // Get achievements
  static async getAchievements(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      // TODO: Implement actual achievements system
      const achievements = [
        {
          id: 'first_question',
          title: 'First Step',
          description: 'Answer your first question',
          icon: '🎯',
          rarity: 'common',
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          reward: { coins: 50, xp: 100 }
        }
      ];

      return reply.send({ achievements });

    } catch (error) {
      console.error('Error fetching achievements:', error);
      return reply.status(500).send({ error: 'Failed to fetch achievements' });
    }
  }
}
