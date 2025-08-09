import { FastifyInstance } from 'fastify';
import { TryoutController } from '../controllers/tryoutController';
import { authMiddleware } from '../middleware/authMiddleware';

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

  // Start new tryout session
  fastify.post('/api/v1/tryouts/sessions/start', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Start a new tryout session',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          packageId: { type: 'string' }
        },
        required: ['packageId']
      },
      response: {
        201: {
          type: 'object',
          properties: {
            sessionId: { type: 'string' },
            packageId: { type: 'string' },
            startTime: { type: 'string' },
            duration: { type: 'number' },
            totalQuestions: { type: 'number' },
            currentQuestionIndex: { type: 'number' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  question_text: { type: 'string' },
                  question_image_url: { type: 'string' },
                  subject: { type: 'string' },
                  question_type: { type: 'string' },
                  options: { type: 'array' }
                }
              }
            }
          }
        }
      }
    }
  }, TryoutController.startSession);

  // Get current session status
  fastify.get('/api/v1/tryouts/sessions/:sessionId', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get current tryout session status',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        },
        required: ['sessionId']
      }
    }
  }, TryoutController.getSession);

  // Submit answer for current question
  fastify.post('/api/v1/tryouts/sessions/:sessionId/answer', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Submit answer for current question',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        },
        required: ['sessionId']
      },
      body: {
        type: 'object',
        properties: {
          questionId: { type: 'string' },
          answer: { type: 'string' },
          timeSpent: { type: 'number' }
        },
        required: ['questionId', 'answer']
      }
    }
  }, TryoutController.submitAnswer);

  // Navigate to specific question
  fastify.post('/api/v1/tryouts/sessions/:sessionId/navigate', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Navigate to specific question in tryout',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        },
        required: ['sessionId']
      },
      body: {
        type: 'object',
        properties: {
          questionIndex: { type: 'number' }
        },
        required: ['questionIndex']
      }
    }
  }, TryoutController.navigateToQuestion);

  // Finish tryout session
  fastify.post('/api/v1/tryouts/sessions/:sessionId/finish', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Finish tryout session and get results',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        },
        required: ['sessionId']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            sessionId: { type: 'string' },
            totalScore: { type: 'number' },
            correctAnswers: { type: 'number' },
            totalQuestions: { type: 'number' },
            timeSpent: { type: 'number' },
            subjectScores: { type: 'object' },
            percentile: { type: 'number' },
            completedAt: { type: 'string' }
          }
        }
      }
    }
  }, TryoutController.finishSession);

  // Get user's tryout history
  fastify.get('/api/v1/tryouts/history', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get user tryout history',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 }
        }
      }
    }
  }, TryoutController.getUserHistory);

  // Get detailed session results
  fastify.get('/api/v1/tryouts/sessions/:sessionId/results', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get detailed results for completed session',
      tags: ['Tryouts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' }
        },
        required: ['sessionId']
      }
    }
  }, TryoutController.getSessionResults);
}