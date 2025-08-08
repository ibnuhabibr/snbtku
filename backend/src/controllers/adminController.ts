import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq, count, and, ilike, or } from 'drizzle-orm';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Get admin dashboard stats
export const getAdminStats = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    // Get total users count
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get active users count
    const activeUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.is_active, true));
    const activeUsers = activeUsersResult[0]?.count || 0;

    // Get admin users count
    const adminUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(or(eq(users.role, 'admin'), eq(users.role, 'super_admin')));
    const adminUsers = adminUsersResult[0]?.count || 0;

    reply.send({
      totalUsers,
      activeUsers,
      adminUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    reply.status(500).send({ error: 'Failed to fetch admin stats' });
  }
};

// Get all users with filters
export const getUsers = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { page = 1, limit = 10, role, status, search } = request.query as {
      page?: number;
      limit?: number;
      role?: string;
      status?: string;
      search?: string;
    };

    const offset = (page - 1) * limit;
    let whereConditions = [];

    // Add role filter
    if (role && role !== 'all') {
      whereConditions.push(eq(users.role, role));
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        whereConditions.push(eq(users.is_active, true));
      } else if (status === 'inactive') {
        whereConditions.push(eq(users.is_active, false));
      }
    }

    // Add search filter
    if (search) {
      whereConditions.push(
        or(
          ilike(users.full_name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get users with pagination
    const usersList = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        role: users.role,
        is_active: users.is_active,
        created_at: users.created_at,
        last_login_at: users.last_login_at
      })
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(users.created_at);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);
    const total = totalResult[0]?.count || 0;

    reply.send({
      users: usersList,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    reply.status(500).send({ error: 'Failed to fetch users' });
  }
};

// Update user role (super admin only)
export const updateUserRole = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { userId } = request.params as { userId: string };
    const { role } = request.body as { role: string };

    // Validate role
    if (!['student', 'admin', 'super_admin'].includes(role)) {
      return reply.status(400).send({ error: 'Invalid role' });
    }

    // Update user role
    await db
      .update(users)
      .set({ role, updated_at: new Date() })
      .where(eq(users.id, userId));

    reply.send({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    reply.status(500).send({ error: 'Failed to update user role' });
  }
};

// Update user status
export const updateUserStatus = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { userId } = request.params as { userId: string };
    const { is_active } = request.body as { is_active: boolean };

    // Update user status
    await db
      .update(users)
      .set({ is_active, updated_at: new Date() })
      .where(eq(users.id, userId));

    reply.send({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    reply.status(500).send({ error: 'Failed to update user status' });
  }
};