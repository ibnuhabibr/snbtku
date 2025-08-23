import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function userRoutes(fastify: FastifyInstance) {
  // Search users endpoint
  fastify.get('/api/v1/users/search', {
    schema: {
      description: 'Search users by unique ID or name',
      tags: ['Users'],
      querystring: {
        type: 'object',
        required: ['query'],
        properties: {
          query: {
            type: 'string',
            description: 'Search query (unique ID or name)',
            minLength: 2
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  unique_id: { type: 'string' },
                  full_name: { type: 'string' },
                  avatar_url: { type: 'string' },
                  school_name: { type: 'string' },
                  grade_level: { type: 'string' },
                  level: { type: 'number' },
                  xp: { type: 'number' },
                  created_at: { type: 'string' }
                }
              }
            },
            searchType: { type: 'string' }
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
  }, UserController.searchUsers);

  // Get user profile endpoint
  fastify.get('/api/v1/users/:userId/profile', {
    schema: {
      description: 'Get user profile by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: {
            type: 'string',
            description: 'User ID'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                unique_id: { type: 'string' },
                full_name: { type: 'string' },
                avatar_url: { type: 'string' },
                school_name: { type: 'string' },
                grade_level: { type: 'string' },
                target_university: { type: 'string' },
                target_major: { type: 'string' },
                level: { type: 'number' },
                xp: { type: 'number' },
                coins: { type: 'number' },
                daily_streak: { type: 'number' },
                total_study_time: { type: 'number' },
                achievements: { type: 'array' },
                created_at: { type: 'string' }
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
  }, UserController.getUserProfile);

  // Get friends list (protected route)
  fastify.get('/api/v1/users/friends', {
    preHandler: authMiddleware,
    schema: {
      description: 'Get current user friends list',
      tags: ['Users'],
      response: {
        200: {
          type: 'object',
          properties: {
            friends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  unique_id: { type: 'string' },
                  full_name: { type: 'string' },
                  avatar_url: { type: 'string' },
                  level: { type: 'number' },
                  xp: { type: 'number' }
                }
              }
            },
            message: { type: 'string' }
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
  }, UserController.getFriends);

  // Send friend request (protected route)
  fastify.post('/api/v1/users/friends/request', {
    preHandler: authMiddleware,
    schema: {
      description: 'Send friend request to another user',
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['targetUserId'],
        properties: {
          targetUserId: {
            type: 'string',
            description: 'Target user ID to send friend request'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            targetUserId: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        401: {
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
  }, UserController.sendFriendRequest);
}