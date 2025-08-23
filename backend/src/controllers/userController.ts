import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq, ilike } from 'drizzle-orm';

interface SearchUserParams {
  query: string;
}

interface GetUserByIdParams {
  userId: string;
}

export class UserController {
  // Search users by unique_id or name
  static async searchUsers(request: FastifyRequest<{ Querystring: SearchUserParams }>, reply: FastifyReply) {
    try {
      const { query } = request.query;

      if (!query || query.trim().length < 2) {
        return reply.status(400).send({
          error: 'Search query must be at least 2 characters long'
        });
      }

      const searchQuery = query.trim().toUpperCase();

      // Search by unique_id (exact match) or full_name (partial match)
      const foundUsers = await db
        .select({
          id: users.id,
          unique_id: users.unique_id,
          full_name: users.full_name,
          avatar_url: users.avatar_url,
          school_name: users.school_name,
          grade_level: users.grade_level,
          level: users.level,
          xp: users.xp,
          created_at: users.created_at
        })
        .from(users)
        .where(
          // Search by unique_id (exact match) or full_name (case-insensitive partial match)
          eq(users.unique_id, searchQuery)
        )
        .limit(10);

      // If no exact unique_id match, search by name
      if (foundUsers.length === 0) {
        const nameResults = await db
          .select({
            id: users.id,
            unique_id: users.unique_id,
            full_name: users.full_name,
            avatar_url: users.avatar_url,
            school_name: users.school_name,
            grade_level: users.grade_level,
            level: users.level,
            xp: users.xp,
            created_at: users.created_at
          })
          .from(users)
          .where(ilike(users.full_name, `%${query}%`))
          .limit(10);

        return reply.status(200).send({
          users: nameResults,
          searchType: 'name'
        });
      }

      return reply.status(200).send({
        users: foundUsers,
        searchType: 'unique_id'
      });
    } catch (error) {
      request.log.error('User search error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Get user profile by ID
  static async getUserProfile(request: FastifyRequest<{ Params: GetUserByIdParams }>, reply: FastifyReply) {
    try {
      const { userId } = request.params;

      const user = await db
        .select({
          id: users.id,
          unique_id: users.unique_id,
          full_name: users.full_name,
          avatar_url: users.avatar_url,
          school_name: users.school_name,
          grade_level: users.grade_level,
          target_university: users.target_university,
          target_major: users.target_major,
          level: users.level,
          xp: users.xp,
          coins: users.coins,
          daily_streak: users.daily_streak,
          total_study_time: users.total_study_time,
          achievements: users.achievements,
          created_at: users.created_at
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        return reply.status(404).send({
          error: 'User not found'
        });
      }

      return reply.status(200).send({
        user: user[0]
      });
    } catch (error) {
      request.log.error('Get user profile error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Get current user's friends list
  static async getFriends(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user?.userId;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized'
        });
      }

      // For now, return empty array as friends system is not fully implemented
      // This will be expanded when we add the friends table
      return reply.status(200).send({
        friends: [],
        message: 'Friends system coming soon!'
      });
    } catch (error) {
      request.log.error('Get friends error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Send friend request
  static async sendFriendRequest(request: FastifyRequest<{ Body: { targetUserId: string } }>, reply: FastifyReply) {
    try {
      const userId = (request as any).user?.userId;
      const { targetUserId } = request.body;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized'
        });
      }

      if (!targetUserId) {
        return reply.status(400).send({
          error: 'Target user ID is required'
        });
      }

      if (userId === targetUserId) {
        return reply.status(400).send({
          error: 'Cannot send friend request to yourself'
        });
      }

      // Check if target user exists
      const targetUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1);

      if (targetUser.length === 0) {
        return reply.status(404).send({
          error: 'Target user not found'
        });
      }

      // For now, return success message as friends system is not fully implemented
      return reply.status(200).send({
        message: 'Friend request feature coming soon!',
        targetUserId
      });
    } catch (error) {
      request.log.error('Send friend request error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}