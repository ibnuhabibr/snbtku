import { FastifyInstance } from 'fastify';
import { TryoutController } from '../controllers/tryoutController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export async function tryoutRoutes(fastify: FastifyInstance) {
  // Get all tryout packages (protected)
  fastify.get('/api/v1/tryouts/packages', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get all available tryout packages',
      tags: ['Tryouts'],
      security: [
        {
          bearerAuth: []
        }
      ],
      response: {
        200: {
          type: 'object',
          properties: {
            packages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'number' },
                  totalQuestions: { type: 'number' },
                  difficulty: { type: 'string' },
                  price: { type: 'number' },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'string' },
                  questionCount: { type: 'number' }
                }
              }
            },
            total: { type: 'number' }
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
  }, TryoutController.getPackages);

  // Get specific tryout package by ID (protected)
  fastify.get('/api/v1/tryouts/packages/:id', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get specific tryout package with questions',
      tags: ['Tryouts'],
      security: [
        {
          bearerAuth: []
        }
      ],
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Tryout package ID'
          }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            package: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                duration: { type: 'number' },
                totalQuestions: { type: 'number' },
                difficulty: { type: 'string' },
                price: { type: 'number' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string' },
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      questionText: { type: 'string' },
                      subtest: { type: 'string' },
                      difficulty: { type: 'string' },
                      createdAt: { type: 'string' }
                    }
                  }
                }
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
  }, TryoutController.getPackageById);
}