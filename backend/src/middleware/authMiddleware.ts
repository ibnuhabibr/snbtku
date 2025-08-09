import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (jwtError) {
      return reply.status(401).send({
        error: 'Invalid or expired token'
      });
    }

    // Handle admin user (special case)
    if (decoded.userId === 'admin') {
      // Attach admin user data to request object
      (request as any).user = {
        userId: 'admin',
        email: 'admin@snbtku.com',
        name: 'Administrator',
        role: 'super_admin'
      };
    } else {
      // Check if user still exists and is active
      const user = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.full_name,
          role: users.role,
          isActive: users.is_active
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (user.length === 0) {
        return reply.status(401).send({
          error: 'User not found'
        });
      }

      const foundUser = user[0];

      if (!foundUser.isActive) {
        return reply.status(401).send({
          error: 'Account is deactivated'
        });
      }

      // Attach user data to request object
      (request as any).user = {
        userId: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
    }

    // Continue to next handler
  } catch (error) {
    request.log.error('Auth middleware error:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}

// Optional: Role-based middleware
export function requireRole(allowedRoles: string[]) {
  return async function(request: FastifyRequest, reply: FastifyReply) {
    const userRole = (request as any).user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return reply.status(403).send({
        error: 'Insufficient permissions'
      });
    }
  };
}