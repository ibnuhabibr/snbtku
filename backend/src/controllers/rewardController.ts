import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { socketService } from '../services/socketService';
import { isSameDay, differenceInDays, addDays, startOfDay } from 'date-fns';

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Get daily check-in status
export async function getDailyCheckInStatus(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.userId;
    
    const user = await db.select({
      id: users.id,
      lastDailyCheckIn: users.last_check_in,
      dailyCheckInStreak: users.daily_streak
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

    if (!user[0]) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const now = new Date();
    const lastCheckIn = user[0].lastDailyCheckIn;
    const canClaim = !lastCheckIn || !isSameDay(lastCheckIn, now);
    
    // Calculate next claim time (next midnight)
    const nextClaimAt = canClaim ? now : addDays(startOfDay(now), 1);
    
    // Calculate weekly progress
    const weekStart = startOfDay(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    
    let currentDay = 1;
    if (lastCheckIn) {
      const daysSinceWeekStart = differenceInDays(now, weekStart);
      currentDay = Math.min(daysSinceWeekStart + 1, 7);
    }
    
    // Weekly rewards structure (escalating rewards)
    const weeklyRewards = [
      { day: 1, coins: 100, xp: 50, claimed: false, unlocked: true },
      { day: 2, coins: 150, xp: 75, claimed: false, unlocked: currentDay >= 2 },
      { day: 3, coins: 200, xp: 100, claimed: false, unlocked: currentDay >= 3 },
      { day: 4, coins: 250, xp: 125, claimed: false, unlocked: currentDay >= 4 },
      { day: 5, coins: 300, xp: 150, claimed: false, unlocked: currentDay >= 5 },
      { day: 6, coins: 400, xp: 200, claimed: false, unlocked: currentDay >= 6 },
      { day: 7, coins: 500, xp: 300, claimed: false, unlocked: currentDay >= 7 }, // Bonus weekend
    ];
    
    // Mark claimed days based on check-in history
    if (lastCheckIn) {
      const daysSinceLastCheckIn = differenceInDays(now, lastCheckIn);
      if (daysSinceLastCheckIn === 0) {
        // Already claimed today
        const todayIndex = currentDay - 1;
        if (todayIndex >= 0 && todayIndex < weeklyRewards.length) {
          weeklyRewards[todayIndex].claimed = true;
        }
      }
    }

    return reply.send({
      canClaim,
      currentStreak: user[0].dailyCheckInStreak || 0,
      lastCheckIn: lastCheckIn?.toISOString(),
      nextClaimAt: nextClaimAt.toISOString(),
      weeklyProgress: {
        currentDay,
        weeklyRewards
      }
    });
  } catch (error) {
    console.error('Error getting daily check-in status:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// Claim daily reward
export async function claimDailyReward(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.userId;
    
    const user = await db.select({
      id: users.id,
      coins: users.coins,
      xp: users.xp,
      level: users.level,
      lastDailyCheckIn: users.last_check_in,
      dailyCheckInStreak: users.daily_streak
    })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const now = new Date();
    const lastCheckIn = user[0].lastDailyCheckIn;

    // Check if already claimed today
    if (lastCheckIn && isSameDay(lastCheckIn, now)) {
      const nextClaimAt = addDays(startOfDay(now), 1);
      return reply.status(400).send({ 
        error: 'Daily reward already claimed today',
        nextClaimAt: nextClaimAt.toISOString()
      });
    }

    // Calculate streak and rewards
    const isConsecutive = lastCheckIn && differenceInDays(now, lastCheckIn) === 1;
    const currentStreak = user[0].dailyCheckInStreak || 0;
    const newStreak = isConsecutive ? currentStreak + 1 : 1;
    
    // Calculate current day in week (1-7)
    const weekStart = startOfDay(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    const daysSinceWeekStart = differenceInDays(now, weekStart);
    const currentDay = Math.min(daysSinceWeekStart + 1, 7);
    
    // Weekly rewards structure (escalating rewards)
    const weeklyRewards = [
      { day: 1, coins: 100, xp: 50 },
      { day: 2, coins: 150, xp: 75 },
      { day: 3, coins: 200, xp: 100 },
      { day: 4, coins: 250, xp: 125 },
      { day: 5, coins: 300, xp: 150 },
      { day: 6, coins: 400, xp: 200 },
      { day: 7, coins: 500, xp: 300 }, // Bonus weekend
    ];
    
    const todayReward = weeklyRewards[currentDay - 1] || weeklyRewards[0];
    const totalReward = {
      coins: todayReward.coins,
      xp: todayReward.xp
    };

    // Update user data in transaction
    await db.transaction(async (tx) => {
      await tx.update(users)
        .set({
          coins: (user[0].coins || 0) + totalReward.coins,
          xp: (user[0].xp || 0) + totalReward.xp,
          daily_streak: newStreak,
          last_check_in: now,
          last_login_at: now
        })
        .where(eq(users.id, userId));
    });

    // Send real-time notification via socket
    if (request.server.socketService) {
      request.server.socketService.emitToUser(userId, 'reward:claimed', {
        type: 'daily_checkin',
        reward: totalReward,
        streak: newStreak,
        userStats: {
          level: user[0].level || 1,
          xp: (user[0].xp || 0) + totalReward.xp,
          coins: (user[0].coins || 0) + totalReward.coins,
          dailyStreak: newStreak
        },
        message: `Daily check-in complete! ${newStreak > 1 ? `Streak bonus: +${Math.min(newStreak * 10, 100)} coins!` : ''}`
      });
    }

    const nextClaimAt = addDays(startOfDay(now), 1);

    return reply.send({
      success: true,
      reward: totalReward,
      streak: newStreak,
      currentDay,
      nextClaimAt: nextClaimAt.toISOString(),
      message: `Daily reward claimed! +${totalReward.coins} coins, +${totalReward.xp} XP${newStreak > 1 ? ` (${newStreak} day streak!)` : ''}`
    });

  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return reply.status(500).send({ error: 'Failed to claim daily reward' });
  }
}

// Get user reward history
export async function getRewardHistory(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.userId;
    
    // For now, return mock data since we don't have reward history table yet
    // TODO: Implement proper reward history tracking
    const mockHistory = [
      {
        id: '1',
        type: 'daily_checkin',
        coins: 60,
        xp: 30,
        description: 'Daily check-in reward (3 day streak)',
        claimedAt: new Date().toISOString()
      }
    ];

    return reply.send({
      history: mockHistory,
      totalRewards: mockHistory.length
    });
  } catch (error) {
    console.error('Error getting reward history:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// Get user stats for gamification
export async function getUserStats(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const userId = request.user.userId;
    
    const user = await db.select({
      id: users.id,
      name: users.full_name,
      email: users.email,
      coins: users.coins,
      xp: users.xp,
      level: users.level,
      dailyCheckInStreak: users.daily_streak,
      lastDailyCheckIn: users.last_check_in,
      createdAt: users.created_at
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

    if (!user[0]) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const userData = user[0];
    const currentLevel = userData.level || 1;
    const currentXP = userData.xp || 0;
    
    // Calculate XP needed for next level (simple formula: level * 1000)
    const xpForNextLevel = currentLevel * 1000;
    const xpProgress = currentXP % 1000;
    
    return reply.send({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      },
      stats: {
        level: currentLevel,
        xp: currentXP,
        xpProgress,
        xpForNextLevel,
        coins: userData.coins || 0,
        dailyStreak: userData.dailyCheckInStreak || 0,
        lastCheckIn: userData.lastDailyCheckIn?.toISOString(),
        memberSince: userData.createdAt?.toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}