import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware, superAdminMiddleware } from '../middleware/adminMiddleware';
import { getAdminStats, getUsers, updateUserRole, updateUserStatus, getQuestions, createQuestion, updateQuestion, deleteQuestion, getTryoutPackages, createTryoutPackage, updateTryoutPackage, deleteTryoutPackage } from '../controllers/adminController';

export async function adminRoutes(fastify: FastifyInstance) {
  // Get admin dashboard stats
  fastify.get('/api/v1/admin/stats', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin'],
      summary: 'Get admin dashboard statistics',
      response: {
        200: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number' },
            activeUsers: { type: 'number' },
            adminUsers: { type: 'number' }
          }
        }
      }
    }
  }, getAdminStats);

  // Get all users (admin only)
  fastify.get('/api/v1/admin/users', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin'],
      summary: 'Get all users for admin management',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
          role: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  }, getUsers);

  // Update user role (super admin only)
  fastify.patch('/api/v1/admin/users/:userId/role', {
    preHandler: [authMiddleware, superAdminMiddleware],
    schema: {
      tags: ['Admin'],
      summary: 'Update user role (super admin only)',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
        },
        required: ['userId']
      },
      body: {
        type: 'object',
        properties: {
          role: { type: 'string', enum: ['student', 'admin', 'super_admin'] }
        },
        required: ['role']
      }
    }
  }, updateUserRole);

  // Toggle user active status
  fastify.patch('/api/v1/admin/users/:userId/status', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin'],
      summary: 'Toggle user active status',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
        },
        required: ['userId']
      },
      body: {
        type: 'object',
        properties: {
          is_active: { type: 'boolean' }
        },
        required: ['is_active']
      }
    }
  }, updateUserStatus);

  // === QUESTIONS MANAGEMENT ===
  
  // Get all questions with filters
  fastify.get('/api/v1/admin/questions', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Questions'],
      summary: 'Get all questions with filters and pagination',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
          subject: { type: 'string' },
          difficulty_level: { type: 'string' },
          review_status: { type: 'string' },
          search: { type: 'string' }
        }
      }
    }
  }, getQuestions);

  // Create new question
  fastify.post('/api/v1/admin/questions', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Questions'],
      summary: 'Create new question',
      body: {
        type: 'object',
        properties: {
          question_text: { type: 'string' },
          question_image_url: { type: 'string' },
          explanation: { type: 'string' },
          explanation_image_url: { type: 'string' },
          subject: { type: 'string', enum: ['matematika', 'fisika', 'kimia', 'biologi', 'bahasa_indonesia', 'bahasa_inggris'] },
          sub_topic: { type: 'string' },
          difficulty_level: { type: 'string', enum: ['mudah', 'sedang', 'sulit'] },
          question_type: { type: 'string', enum: ['multiple_choice', 'essay', 'true_false'] },
          options: { type: 'array' },
          correct_answer: { type: 'string' },
          source: { type: 'string' },
          year: { type: 'number' },
          tags: { type: 'array' }
        },
        required: ['question_text', 'subject', 'sub_topic', 'difficulty_level', 'correct_answer']
      }
    }
  }, createQuestion);

  // Update question
  fastify.put('/api/v1/admin/questions/:questionId', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Questions'],
      summary: 'Update question',
      params: {
        type: 'object',
        properties: {
          questionId: { type: 'string' }
        },
        required: ['questionId']
      }
    }
  }, updateQuestion);

  // Delete question
  fastify.delete('/api/v1/admin/questions/:questionId', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Questions'],
      summary: 'Delete question',
      params: {
        type: 'object',
        properties: {
          questionId: { type: 'string' }
        },
        required: ['questionId']
      }
    }
  }, deleteQuestion);

  // === TRYOUT PACKAGES MANAGEMENT ===
  
  // Get all tryout packages
  fastify.get('/api/v1/admin/tryout-packages', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Tryout Packages'],
      summary: 'Get all tryout packages with filters',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
          package_type: { type: 'string' },
          category: { type: 'string' },
          review_status: { type: 'string' }
        }
      }
    }
  }, getTryoutPackages);

  // Create new tryout package
  fastify.post('/api/v1/admin/tryout-packages', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Tryout Packages'],
      summary: 'Create new tryout package',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          package_type: { type: 'string' },
          category: { type: 'string' },
          difficulty_level: { type: 'string' },
          total_questions: { type: 'number' },
          duration_minutes: { type: 'number' },
          subject_distribution: { type: 'object' },
          is_free: { type: 'boolean' },
          price: { type: 'number' }
        },
        required: ['title', 'package_type', 'category', 'difficulty_level', 'total_questions', 'duration_minutes']
      }
    }
  }, createTryoutPackage);

  // Update tryout package
  fastify.put('/api/v1/admin/tryout-packages/:packageId', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Tryout Packages'],
      summary: 'Update tryout package',
      params: {
        type: 'object',
        properties: {
          packageId: { type: 'string' }
        },
        required: ['packageId']
      }
    }
  }, updateTryoutPackage);

  // Delete tryout package
  fastify.delete('/api/v1/admin/tryout-packages/:packageId', {
    preHandler: [authMiddleware, adminMiddleware],
    schema: {
      tags: ['Admin - Tryout Packages'],
      summary: 'Delete tryout package',
      params: {
        type: 'object',
        properties: {
          packageId: { type: 'string' }
        },
        required: ['packageId']
      }
    }
  }, deleteTryoutPackage);
}