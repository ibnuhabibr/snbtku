import { FastifyRequest, FastifyReply } from 'fastify';
import { QuestService } from '../services/questService';
import { db } from '../db/index';
import { users } from '../db/schema/index';
import { eq } from 'drizzle-orm';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Get all quests for the authenticated user
 */
export async function getUserQuests(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const quests = await QuestService.getUserQuests(request.user.id);
    
    return reply.send({
      success: true,
      quests,
      totalQuests: quests.length,
      completedQuests: quests.filter(q => q.completed).length,
      availableRewards: quests.filter(q => q.canClaim).length
    });
  } catch (error) {
    request.log.error('Error fetching user quests:', error);
    return reply.status(500).send({ 
      error: 'Failed to fetch quests',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Claim a quest reward
 */
export async function claimQuestReward(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const { questId } = request.params as { questId: string };
    
    if (!questId) {
      return reply.status(400).send({ error: 'Quest ID is required' });
    }

    const result = await QuestService.claimQuestReward(request.user.id, questId);
    
    // Get updated user stats for socket notification
    const [updatedUser] = await db
      .select({
        id: users.id,
        level: users.level,
        xp: users.xp,
        coins: users.coins,
        full_name: users.full_name
      })
      .from(users)
      .where(eq(users.id, request.user.id));

    // Send real-time notification via socket
    if (request.server.socketService && updatedUser) {
      request.server.socketService.emitToUser(request.user.id, 'quest:completed', {
        questId,
        reward: result.reward,
        questTitle: result.quest,
        userStats: {
          level: updatedUser.level,
          xp: updatedUser.xp,
          coins: updatedUser.coins
        }
      });
    }
    
    return reply.send(result);
  } catch (error) {
    request.log.error('Error claiming quest reward:', error);
    
    if (error.message.includes('not found') || error.message.includes('not completed')) {
      return reply.status(404).send({ error: error.message });
    }
    
    if (error.message.includes('already claimed') || error.message.includes('expired')) {
      return reply.status(400).send({ error: error.message });
    }
    
    return reply.status(500).send({ 
      error: 'Failed to claim quest reward',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Update quest progress (internal endpoint for system use)
 */
export async function updateQuestProgress(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const { action, data } = request.body as { 
      action: string; 
      data?: any; 
    };
    
    if (!action) {
      return reply.status(400).send({ error: 'Action is required' });
    }

    const results = await QuestService.handleUserAction(request.user.id, action, data);
    
    // Send real-time notifications for completed quests
    if (request.server.socketService && results.length > 0) {
      const completedQuests = results.filter(r => r.completed);
      
      for (const completedQuest of completedQuests) {
        request.server.socketService.emitToUser(request.user.id, 'quest:progress', {
          questId: completedQuest.quest.id,
          questTitle: completedQuest.quest.title,
          progress: completedQuest.progress,
          target: completedQuest.quest.target,
          completed: true,
          reward: completedQuest.quest.reward
        });
      }
    }
    
    return reply.send({
      success: true,
      updatedQuests: results.length,
      completedQuests: results.filter(r => r.completed).length,
      results
    });
  } catch (error) {
    request.log.error('Error updating quest progress:', error);
    return reply.status(500).send({ 
      error: 'Failed to update quest progress',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Get quest statistics for the user
 */
export async function getQuestStats(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const quests = await QuestService.getUserQuests(request.user.id);
    
    const stats = {
      total: quests.length,
      completed: quests.filter(q => q.completed).length,
      inProgress: quests.filter(q => q.progress > 0 && !q.completed).length,
      available: quests.filter(q => q.progress === 0).length,
      canClaim: quests.filter(q => q.canClaim).length,
      byType: {
        daily: quests.filter(q => q.type === 'daily').length,
        weekly: quests.filter(q => q.type === 'weekly').length,
        achievement: quests.filter(q => q.type === 'achievement').length
      },
      completionRate: quests.length > 0 ? 
        Math.round((quests.filter(q => q.completed).length / quests.length) * 100) : 0
    };
    
    return reply.send({
      success: true,
      stats
    });
  } catch (error) {
    request.log.error('Error fetching quest stats:', error);
    return reply.status(500).send({ 
      error: 'Failed to fetch quest statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}