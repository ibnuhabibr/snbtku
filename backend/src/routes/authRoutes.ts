import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post('/api/v1/auth/register', {
    schema: {
      description: 'Register a new user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (minimum 6 characters)'
          },
          name: {
            type: 'string',
            minLength: 2,
            description: 'User full name'
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, AuthController.register);

  // Login endpoint
  fastify.post('/api/v1/auth/login', {
    schema: {
      description: 'Login user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            description: 'User password'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' }
              }
            }
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
        }
      }
    }
  }, AuthController.login);

  // Admin login endpoint
  fastify.post('/api/v1/auth/admin/login', {
    schema: {
      description: 'Admin login with passkey',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['passkey'],
        properties: {
          passkey: {
            type: 'string',
            description: 'Admin passkey'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' }
              }
            }
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
        }
      }
    }
  }, AuthController.adminLogin);

  // Google OAuth endpoint
  fastify.post('/api/v1/auth/google', {
    schema: {
      description: 'Google OAuth authentication',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'name', 'firebaseUid'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email from Google'
          },
          name: {
            type: 'string',
            description: 'User display name from Google'
          },
          firebaseUid: {
            type: 'string',
            description: 'Firebase UID from Google auth'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                lastLoginAt: { type: 'string' }
              }
            },
            isNewUser: { type: 'boolean' }
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
        }
      }
    }
  }, AuthController.googleAuth);
}

export async function userRoutes(fastify: FastifyInstance) {
  // Get current user endpoint (protected)
  fastify.get('/api/v1/users/me', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get current user information',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                lastLoginAt: { type: 'string' }
              }
            }
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
  }, AuthController.getCurrentUser);
}