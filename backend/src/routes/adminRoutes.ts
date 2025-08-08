import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware, superAdminMiddleware } from '../middleware/adminMiddleware.js';
import { getAdminStats, getUsers, updateUserRole, updateUserStatus } from '../controllers/adminController.js';

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
}