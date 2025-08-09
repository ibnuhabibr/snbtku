import { FastifyInstance } from 'fastify';
import { 
  getUserQuests, 
  claimQuestReward, 
  updateQuestProgress, 
  getQuestStats 
} from '../controllers/questController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function questRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all quest routes
  fastify.addHook('preHandler', authMiddleware);

  // Get all user quests
  fastify.get('/', {
    schema: {
      description: 'Get all quests for the authenticated user',
      tags: ['Quests'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            quests: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['daily', 'weekly', 'achievement'] },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  target: { type: 'number' },
                  progress: { type: 'number' },
                  completed: { type: 'boolean' },
                  canClaim: { type: 'boolean' },
                  reward: {
                    type: 'object',
                    properties: {
                      coins: { type: 'number' },
                      xp: { type: 'number' }
                    }
                  },
                  icon: { type: 'string' },
                  category: { type: 'string' },
                  expiresAt: { type: 'string', format: 'date-time' },
                  completedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            totalQuests: { type: 'number' },
            completedQuests: { type: 'number' },
            availableRewards: { type: 'number' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, getUserQuests);

  // Claim quest reward
  fastify.post('/:questId/claim', {
    schema: {
      description: 'Claim reward for a completed quest',
      tags: ['Quests'],
      security: [{ bearerAuth: [] }],
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
            quest: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
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
  }, claimQuestReward);

  // Update quest progress (internal endpoint)
  fastify.post('/progress', {
    schema: {
      description: 'Update quest progress based on user actions',
      tags: ['Quests'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          action: { 
            type: 'string',
            enum: ['practice_question_completed', 'tryout_completed', 'daily_login']
          },
          data: {
            type: 'object',
            properties: {
              score: { type: 'number' },
              streak: { type: 'number' }
            }
          }
        },
        required: ['action']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            updatedQuests: { type: 'number' },
            completedQuests: { type: 'number' },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  progress: { type: 'number' },
                  completed: { type: 'boolean' },
                  quest: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      target: { type: 'number' },
                      reward: {
                        type: 'object',
                        properties: {
                          coins: { type: 'number' },
                          xp: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, updateQuestProgress);

  // Get quest statistics
  fastify.get('/stats', {
    schema: {
      description: 'Get quest statistics for the authenticated user',
      tags: ['Quests'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            stats: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                completed: { type: 'number' },
                inProgress: { type: 'number' },
                available: { type: 'number' },
                canClaim: { type: 'number' },
                byType: {
                  type: 'object',
                  properties: {
                    daily: { type: 'number' },
                    weekly: { type: 'number' },
                    achievement: { type: 'number' }
                  }
                },
                completionRate: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, getQuestStats);
}