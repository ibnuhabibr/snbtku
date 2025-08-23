import { FastifyInstance } from 'fastify';
import { GamificationController } from '../controllers/gamificationController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function gamificationRoutes(fastify: FastifyInstance) {
  // All gamification routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // Get user gamification stats
  fastify.get('/api/v1/gamification/stats', {
    schema: {
      description: 'Get user gamification statistics',
      tags: ['Gamification'],
      response: {
        200: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                xp: { type: 'number' },
                coins: { type: 'number' },
                level: { type: 'number' },
                totalQuestions: { type: 'number' },
                correctAnswers: { type: 'number' },
                studyTime: { type: 'number' },
                streak: { type: 'number' },
                avatar_url: { type: 'string' },
                xpToNextLevel: { type: 'number' },
                xpProgress: { type: 'number' }
              }
            }
          }
        }
      }
    },
    handler: GamificationController.getUserStats
  });

  // Get active quests
  fastify.get('/api/v1/gamification/quests', {
    schema: {
      description: 'Get user active quests',
      tags: ['Gamification'],
      response: {
        200: {
          type: 'object',
          properties: {
            daily: { type: 'array' },
            weekly: { type: 'array' },
            achievements: { type: 'array' }
          }
        }
      }
    },
    handler: GamificationController.getQuests
  });

  // Update quest progress
  fastify.post('/api/v1/gamification/progress', {
    schema: {
      description: 'Update quest progress',
      tags: ['Gamification'],
      body: {
        type: 'object',
        required: ['action'],
        properties: {
          action: { type: 'string' },
          data: { type: 'object' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            updatedQuests: { type: 'array' },
            completedQuests: { type: 'array' },
            newAchievements: { type: 'array' },
            userStats: { type: 'object' },
            xpGained: { type: 'number' },
            coinsGained: { type: 'number' },
            leveledUp: { type: 'boolean' }
          }
        }
      }
    },
    handler: GamificationController.updateProgress
  });

  // Claim quest reward
  fastify.post('/api/v1/gamification/quests/:questId/claim', {
    schema: {
      description: 'Claim quest reward',
      tags: ['Gamification'],
      params: {
        type: 'object',
        properties: {
          questId: { type: 'string' }
        },
        required: ['questId']
      },
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
            newStats: { type: 'object' }
          }
        }
      }
    },
    handler: GamificationController.claimQuestReward
  });

  // Update avatar
  fastify.post('/api/v1/gamification/avatar', {
    schema: {
      description: 'Update user avatar',
      tags: ['Gamification'],
      body: {
        type: 'object',
        required: ['avatarUrl'],
        properties: {
          avatarUrl: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            avatarUrl: { type: 'string' }
          }
        }
      }
    },
    handler: GamificationController.updateAvatar
  });

  // Daily check-in
  fastify.post('/api/v1/gamification/checkin', {
    schema: {
      description: 'Daily check-in',
      tags: ['Gamification'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            streak: { type: 'number' },
            reward: {
              type: 'object',
              properties: {
                coins: { type: 'number' },
                xp: { type: 'number' }
              }
            },
            nextCheckIn: { type: 'string' }
          }
        }
      }
    },
    handler: GamificationController.dailyCheckIn
  });

  // Get achievements
  fastify.get('/api/v1/gamification/achievements', {
    schema: {
      description: 'Get user achievements',
      tags: ['Gamification'],
      response: {
        200: {
          type: 'object',
          properties: {
            achievements: { type: 'array' }
          }
        }
      }
    },
    handler: GamificationController.getAchievements
  });

  // Add health check endpoint for gamification
  fastify.get('/api/v1/gamification/health', {
    schema: {
      description: 'Gamification system health check',
      tags: ['Health']
    },
    handler: async (request, reply) => {
      return reply.send({
        status: 'healthy',
        system: 'gamification',
        timestamp: new Date().toISOString()
      });
    }
  });
}
