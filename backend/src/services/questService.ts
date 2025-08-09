import { db } from '../db/index';
import { users, questProgress, questRewards } from '../db/schema/index';
import { eq, and, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay, endOfDay, addDays } from 'date-fns';

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'achievement';
  title: string;
  description: string;
  target: number;
  reward: {
    coins: number;
    xp: number;
  };
  icon: string;
  category: string;
}

export interface QuestProgress {
  questId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  expiresAt?: Date;
}

// Define available quests
const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily_practice_5',
    type: 'daily',
    title: 'Practice Makes Perfect',
    description: 'Complete 5 practice questions',
    target: 5,
    reward: { coins: 50, xp: 100 },
    icon: '📚',
    category: 'practice'
  },
  {
    id: 'daily_tryout_1',
    type: 'daily',
    title: 'Daily Challenge',
    description: 'Complete 1 tryout session',
    target: 1,
    reward: { coins: 100, xp: 200 },
    icon: '🎯',
    category: 'tryout'
  },
  {
    id: 'daily_streak_maintain',
    type: 'daily',
    title: 'Consistency Champion',
    description: 'Maintain your daily login streak',
    target: 1,
    reward: { coins: 25, xp: 50 },
    icon: '🔥',
    category: 'engagement'
  }
];

const WEEKLY_QUESTS: Quest[] = [
  {
    id: 'weekly_practice_25',
    type: 'weekly',
    title: 'Weekly Warrior',
    description: 'Complete 25 practice questions this week',
    target: 25,
    reward: { coins: 300, xp: 500 },
    icon: '⚔️',
    category: 'practice'
  },
  {
    id: 'weekly_tryout_5',
    type: 'weekly',
    title: 'Tryout Master',
    description: 'Complete 5 tryout sessions this week',
    target: 5,
    reward: { coins: 500, xp: 800 },
    icon: '👑',
    category: 'tryout'
  }
];

const ACHIEVEMENT_QUESTS: Quest[] = [
  {
    id: 'achievement_first_perfect',
    type: 'achievement',
    title: 'Perfect Score',
    description: 'Get 100% on any tryout',
    target: 1,
    reward: { coins: 1000, xp: 1500 },
    icon: '🏆',
    category: 'achievement'
  },
  {
    id: 'achievement_streak_7',
    type: 'achievement',
    title: 'Week Warrior',
    description: 'Maintain a 7-day login streak',
    target: 7,
    reward: { coins: 500, xp: 750 },
    icon: '🔥',
    category: 'engagement'
  }
];

export class QuestService {
  /**
   * Get all available quests for a user
   */
  static async getUserQuests(userId: string) {
    const today = new Date();
    const startOfWeek = startOfDay(addDays(today, -today.getDay()));
    const endOfWeek = endOfDay(addDays(startOfWeek, 6));

    // Get user's quest progress
    const userProgress = await db
      .select()
      .from(questProgress)
      .where(eq(questProgress.userId, userId));

    const progressMap = new Map(userProgress.map(p => [p.questId, p]));

    // Combine all quests with user progress
    const allQuests = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...ACHIEVEMENT_QUESTS];
    
    return allQuests.map(quest => {
      const progress = progressMap.get(quest.id);
      const isExpired = progress?.expiresAt && progress.expiresAt < today;
      
      return {
        ...quest,
        progress: isExpired ? 0 : (progress?.progress || 0),
        completed: progress?.completed && !isExpired,
        completedAt: progress?.completedAt,
        canClaim: progress?.completed && !progress.claimed && !isExpired,
        expiresAt: this.getQuestExpiry(quest, today)
      };
    });
  }

  /**
   * Update quest progress for a user
   */
  static async updateQuestProgress(
    userId: string, 
    questId: string, 
    increment: number = 1
  ) {
    const quest = this.getQuestById(questId);
    if (!quest) return null;

    const today = new Date();
    const expiresAt = this.getQuestExpiry(quest, today);

    // Get current progress
    const [currentProgress] = await db
      .select()
      .from(questProgress)
      .where(
        and(
          eq(questProgress.userId, userId),
          eq(questProgress.questId, questId)
        )
      );

    if (currentProgress) {
      // Check if quest is expired
      if (currentProgress.expiresAt && currentProgress.expiresAt < today) {
        // Reset expired quest
        const newProgress = Math.min(increment, quest.target);
        const completed = newProgress >= quest.target;

        await db
          .update(questProgress)
          .set({
            progress: newProgress,
            completed,
            completedAt: completed ? today : null,
            expiresAt,
            updatedAt: today
          })
          .where(
            and(
              eq(questProgress.userId, userId),
              eq(questProgress.questId, questId)
            )
          );

        return { progress: newProgress, completed, quest };
      }

      // Update existing progress
      if (!currentProgress.completed) {
        const newProgress = Math.min(currentProgress.progress + increment, quest.target);
        const completed = newProgress >= quest.target;

        await db
          .update(questProgress)
          .set({
            progress: newProgress,
            completed,
            completedAt: completed ? today : currentProgress.completedAt,
            updatedAt: today
          })
          .where(
            and(
              eq(questProgress.userId, userId),
              eq(questProgress.questId, questId)
            )
          );

        return { progress: newProgress, completed, quest };
      }
    } else {
      // Create new progress entry
      const newProgress = Math.min(increment, quest.target);
      const completed = newProgress >= quest.target;

      await db
        .insert(questProgress)
        .values({
          id: uuidv4(),
          userId,
          questId,
          progress: newProgress,
          completed,
          completedAt: completed ? today : null,
          expiresAt,
          createdAt: today,
          updatedAt: today
        });

      return { progress: newProgress, completed, quest };
    }

    return null;
  }

  /**
   * Claim quest reward
   */
  static async claimQuestReward(userId: string, questId: string) {
    const quest = this.getQuestById(questId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Check if quest is completed and not claimed
    const [progress] = await db
      .select()
      .from(questProgress)
      .where(
        and(
          eq(questProgress.userId, userId),
          eq(questProgress.questId, questId),
          eq(questProgress.completed, true)
        )
      );

    if (!progress) {
      throw new Error('Quest not completed or not found');
    }

    if (progress.claimed) {
      throw new Error('Reward already claimed');
    }

    // Check if quest is expired
    const today = new Date();
    if (progress.expiresAt && progress.expiresAt < today) {
      throw new Error('Quest has expired');
    }

    // Start transaction
    return await db.transaction(async (tx) => {
      // Mark quest as claimed
      await tx
        .update(questProgress)
        .set({
          claimed: true,
          claimedAt: today,
          updatedAt: today
        })
        .where(
          and(
            eq(questProgress.userId, userId),
            eq(questProgress.questId, questId)
          )
        );

      // Add reward to user
      await tx
        .update(users)
        .set({
          coins: db.raw(`coins + ${quest.reward.coins}`),
          xp: db.raw(`xp + ${quest.reward.xp}`),
          updated_at: today
        })
        .where(eq(users.id, userId));

      // Record reward history
      await tx
        .insert(questRewards)
        .values({
          id: uuidv4(),
          userId,
          questId,
          coins: quest.reward.coins,
          xp: quest.reward.xp,
          claimedAt: today,
          createdAt: today
        });

      return {
        success: true,
        reward: quest.reward,
        quest: quest.title,
        message: `Congratulations! You've earned ${quest.reward.coins} coins and ${quest.reward.xp} XP!`
      };
    });
  }

  /**
   * Get quest by ID
   */
  private static getQuestById(questId: string): Quest | null {
    const allQuests = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...ACHIEVEMENT_QUESTS];
    return allQuests.find(q => q.id === questId) || null;
  }

  /**
   * Get quest expiry date
   */
  private static getQuestExpiry(quest: Quest, baseDate: Date): Date {
    switch (quest.type) {
      case 'daily':
        return endOfDay(baseDate);
      case 'weekly':
        const startOfWeek = startOfDay(addDays(baseDate, -baseDate.getDay()));
        return endOfDay(addDays(startOfWeek, 6));
      case 'achievement':
        // Achievements don't expire
        return addDays(baseDate, 365 * 10); // 10 years from now
      default:
        return endOfDay(baseDate);
    }
  }

  /**
   * Auto-update quest progress based on user actions
   */
  static async handleUserAction(userId: string, action: string, data?: any) {
    const updates: Array<{ questId: string; increment: number }> = [];

    switch (action) {
      case 'practice_question_completed':
        updates.push(
          { questId: 'daily_practice_5', increment: 1 },
          { questId: 'weekly_practice_25', increment: 1 }
        );
        break;

      case 'tryout_completed':
        updates.push(
          { questId: 'daily_tryout_1', increment: 1 },
          { questId: 'weekly_tryout_5', increment: 1 }
        );
        
        // Check for perfect score achievement
        if (data?.score === 100) {
          updates.push({ questId: 'achievement_first_perfect', increment: 1 });
        }
        break;

      case 'daily_login':
        updates.push({ questId: 'daily_streak_maintain', increment: 1 });
        
        // Check streak achievement
        if (data?.streak >= 7) {
          updates.push({ questId: 'achievement_streak_7', increment: 1 });
        }
        break;
    }

    // Process all updates
    const results = [];
    for (const update of updates) {
      const result = await this.updateQuestProgress(userId, update.questId, update.increment);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }
}