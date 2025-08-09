import { FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from './authMiddleware';

// Admin middleware that requires authentication and admin role
export async function adminMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // First run auth middleware
  await authMiddleware(request, reply);
  
  // Check if user has admin role
  const userRole = (request as any).user?.role;
  
  if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
    return reply.status(403).send({
      error: 'Admin access required'
    });
  }
}

// Super admin middleware
export async function superAdminMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // First run auth middleware
  await authMiddleware(request, reply);
  
  // Check if user has super admin role
  const userRole = (request as any).user?.role;
  
  if (userRole !== 'super_admin') {
    return reply.status(403).send({
      error: 'Super admin access required'
    });
  }
}