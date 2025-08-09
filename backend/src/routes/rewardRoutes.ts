import { FastifyInstance } from 'fastify';
import { 
  getDailyCheckInStatus, 
  claimDailyReward, 
  getRewardHistory, 
  getUserStats 
} from '../controllers/rewardController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function rewardRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all reward routes
  fastify.addHook('preHandler', authMiddleware);

  // Daily check-in routes
  fastify.get('/daily-status', {
    schema: {
      description: 'Get daily check-in status for the authenticated user',
      tags: ['Rewards'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            canClaim: { type: 'boolean' },
            currentStreak: { type: 'number' },
            lastCheckIn: { type: 'string', format: 'date-time' },
            nextClaimAt: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, getDailyCheckInStatus);

  fastify.post('/daily-claim', {
    schema: {
      description: 'Claim daily check-in reward',
      tags: ['Rewards'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            reward: {
              type: 'object',
              properties: {
                coins: { type: 'number' },
                xp: { type: 'number' }
              }
            },
            streak: { type: 'number' },
            nextClaimAt: { type: 'string', format: 'date-time' },
            message: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            nextClaimAt: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, claimDailyReward);

  // Reward history
  fastify.get('/history', {
    schema: {
      description: 'Get user reward history',
      tags: ['Rewards'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  coins: { type: 'number' },
                  xp: { type: 'number' },
                  description: { type: 'string' },
                  claimedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            totalRewards: { type: 'number' }
          }
        }
      }
    }
  }, getRewardHistory);

  // User stats for gamification
  fastify.get('/stats', {
    schema: {
      description: 'Get user gamification stats',
      tags: ['Rewards'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            },
            stats: {
              type: 'object',
              properties: {
                level: { type: 'number' },
                xp: { type: 'number' },
                xpProgress: { type: 'number' },
                xpForNextLevel: { type: 'number' },
                coins: { type: 'number' },
                dailyStreak: { type: 'number' },
                lastCheckIn: { type: 'string', format: 'date-time' },
                memberSince: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, getUserStats);
}