import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { questions } from '../db/schema/questions';
import { tryoutPackages } from '../db/schema/tryout-packages';
import { eq, count, and, ilike, or, desc } from 'drizzle-orm';
import { insertQuestionSchema, updateQuestionSchema } from '../db/schema/questions';
import { insertTryoutPackageSchema } from '../db/schema/tryout-packages';

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

// === QUESTIONS MANAGEMENT ===

// Get all questions with filters
export const getQuestions = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { page = 1, limit = 20, subject, difficulty_level, review_status, search } = request.query as {
      page?: number;
      limit?: number;
      subject?: string;
      difficulty_level?: string;
      review_status?: string;
      search?: string;
    };

    const offset = (page - 1) * limit;
    let whereConditions = [];

    // Add filters
    if (subject && subject !== 'all') {
      whereConditions.push(eq(questions.subject, subject));
    }
    if (difficulty_level && difficulty_level !== 'all') {
      whereConditions.push(eq(questions.difficulty_level, difficulty_level));
    }
    if (review_status && review_status !== 'all') {
      whereConditions.push(eq(questions.review_status, review_status));
    }
    if (search) {
      whereConditions.push(
        or(
          ilike(questions.question_text, `%${search}%`),
          ilike(questions.sub_topic, `%${search}%`)
        )
      );
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get questions with pagination
    const questionsList = await db
      .select({
        id: questions.id,
        question_text: questions.question_text,
        subject: questions.subject,
        sub_topic: questions.sub_topic,
        difficulty_level: questions.difficulty_level,
        question_type: questions.question_type,
        review_status: questions.review_status,
        is_active: questions.is_active,
        times_used: questions.times_used,
        created_at: questions.created_at,
        updated_at: questions.updated_at
      })
      .from(questions)
      .where(whereClause)
      .orderBy(desc(questions.created_at))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(questions)
      .where(whereClause);
    const totalCount = totalCountResult[0]?.count || 0;

    reply.send({
      questions: questionsList,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    reply.status(500).send({ error: 'Failed to fetch questions' });
  }
};

// Create new question
export const createQuestion = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const validatedData = insertQuestionSchema.parse(request.body);
    
    const newQuestion = await db
      .insert(questions)
      .values({
        ...validatedData,
        created_by: request.user?.userId,
        review_status: 'draft'
      })
      .returning();

    reply.status(201).send({
      message: 'Question created successfully',
      question: newQuestion[0]
    });
  } catch (error) {
    console.error('Error creating question:', error);
    reply.status(400).send({ error: 'Failed to create question', details: error });
  }
};

// Update question
export const updateQuestion = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { questionId } = request.params as { questionId: string };
    const validatedData = updateQuestionSchema.parse(request.body);

    const updatedQuestion = await db
      .update(questions)
      .set({
        ...validatedData,
        updated_at: new Date()
      })
      .where(eq(questions.id, questionId))
      .returning();

    if (updatedQuestion.length === 0) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    reply.send({
      message: 'Question updated successfully',
      question: updatedQuestion[0]
    });
  } catch (error) {
    console.error('Error updating question:', error);
    reply.status(400).send({ error: 'Failed to update question', details: error });
  }
};

// Delete question
export const deleteQuestion = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { questionId } = request.params as { questionId: string };

    const deletedQuestion = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning({ id: questions.id });

    if (deletedQuestion.length === 0) {
      return reply.status(404).send({ error: 'Question not found' });
    }

    reply.send({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    reply.status(500).send({ error: 'Failed to delete question' });
  }
};

// === TRYOUT PACKAGES MANAGEMENT ===

// Get all tryout packages
export const getTryoutPackages = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { page = 1, limit = 20, package_type, category, review_status } = request.query as {
      page?: number;
      limit?: number;
      package_type?: string;
      category?: string;
      review_status?: string;
    };

    const offset = (page - 1) * limit;
    let whereConditions = [];

    // Add filters
    if (package_type && package_type !== 'all') {
      whereConditions.push(eq(tryoutPackages.package_type, package_type));
    }
    if (category && category !== 'all') {
      whereConditions.push(eq(tryoutPackages.category, category));
    }
    if (review_status && review_status !== 'all') {
      whereConditions.push(eq(tryoutPackages.review_status, review_status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get packages with pagination
    const packagesList = await db
      .select({
        id: tryoutPackages.id,
        title: tryoutPackages.title,
        description: tryoutPackages.description,
        package_type: tryoutPackages.package_type,
        category: tryoutPackages.category,
        difficulty_level: tryoutPackages.difficulty_level,
        total_questions: tryoutPackages.total_questions,
        duration_minutes: tryoutPackages.duration_minutes,
        is_free: tryoutPackages.is_free,
        price: tryoutPackages.price,
        is_active: tryoutPackages.is_active,
        review_status: tryoutPackages.review_status,
        total_attempts: tryoutPackages.total_attempts,
        created_at: tryoutPackages.created_at
      })
      .from(tryoutPackages)
      .where(whereClause)
      .orderBy(desc(tryoutPackages.created_at))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(tryoutPackages)
      .where(whereClause);
    const totalCount = totalCountResult[0]?.count || 0;

    reply.send({
      packages: packagesList,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching tryout packages:', error);
    reply.status(500).send({ error: 'Failed to fetch tryout packages' });
  }
};

// Create new tryout package
export const createTryoutPackage = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const validatedData = insertTryoutPackageSchema.parse(request.body);
    
    const newPackage = await db
      .insert(tryoutPackages)
      .values({
        ...validatedData,
        created_by: request.user?.userId,
        review_status: 'draft'
      })
      .returning();

    reply.status(201).send({
      message: 'Tryout package created successfully',
      package: newPackage[0]
    });
  } catch (error) {
    console.error('Error creating tryout package:', error);
    reply.status(400).send({ error: 'Failed to create tryout package', details: error });
  }
};

// Update tryout package
export const updateTryoutPackage = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { packageId } = request.params as { packageId: string };
    const updateData = request.body as any;

    const updatedPackage = await db
      .update(tryoutPackages)
      .set({
        ...updateData,
        updated_at: new Date()
      })
      .where(eq(tryoutPackages.id, packageId))
      .returning();

    if (updatedPackage.length === 0) {
      return reply.status(404).send({ error: 'Tryout package not found' });
    }

    reply.send({
      message: 'Tryout package updated successfully',
      package: updatedPackage[0]
    });
  } catch (error) {
    console.error('Error updating tryout package:', error);
    reply.status(400).send({ error: 'Failed to update tryout package', details: error });
  }
};

// Delete tryout package
export const deleteTryoutPackage = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    const { packageId } = request.params as { packageId: string };

    const deletedPackage = await db
      .delete(tryoutPackages)
      .where(eq(tryoutPackages.id, packageId))
      .returning({ id: tryoutPackages.id });

    if (deletedPackage.length === 0) {
      return reply.status(404).send({ error: 'Tryout package not found' });
    }

    reply.send({ message: 'Tryout package deleted successfully' });
  } catch (error) {
    console.error('Error deleting tryout package:', error);
    reply.status(500).send({ error: 'Failed to delete tryout package' });
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