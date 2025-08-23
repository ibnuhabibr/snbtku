import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface AdminLoginBody {
  passkey: string;
}

interface GoogleAuthBody {
  token: string; // Google ID token
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'admin123';

// Function to generate unique user ID
const generateUniqueId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    let uniqueId = '';
    for (let i = 0; i < 8; i++) {
      uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if this ID already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.unique_id, uniqueId))
      .limit(1);
    
    if (existingUser.length === 0) {
      return uniqueId;
    }
    
    attempts++;
  }
  
  throw new Error('Unable to generate unique ID');
};

// Helper function to create JWT token
const createToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

// Helper function to format user response
const formatUserResponse = (user: any) => ({
  id: user.id,
  unique_id: user.unique_id,
  email: user.email,
  name: user.full_name,
  role: user.role,
  createdAt: user.created_at,
  lastLoginAt: user.last_login_at,
  xp: user.xp || 0,
  coins: user.coins || 0,
  level: user.level || 1,
  avatar_url: user.avatar_url,
});

export class AuthController {
  // Health check endpoint
  static async health(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  static async register(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
    try {
      const { email, password, name } = request.body;

      // Enhanced validation
      if (!email || !password || !name) {
        return reply.status(400).send({
          error: 'Email, password, and name are required'
        });
      }

      if (password.length < 6) {
        return reply.status(400).send({
          error: 'Password must be at least 6 characters long'
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reply.status(400).send({
          error: 'Invalid email format'
        });
      }

      // Check if email already exists
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0) {
        return reply.status(409).send({
          error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Generate unique ID
      const uniqueId = await generateUniqueId();

      // Create user with gamification defaults
      const newUser = await db
        .insert(users)
        .values({
          unique_id: uniqueId,
          email: email.toLowerCase(),
          password: hashedPassword,
          full_name: name.trim(),
          role: 'user',
          xp: 0,
          coins: 1000, // Starting coins
          level: 1,
          created_at: new Date(),
          last_login_at: new Date(),
        })
        .returning();

      if (!newUser[0]) {
        throw new Error('Failed to create user');
      }

      // Generate JWT token
      const token = createToken(newUser[0]);

      // Format response
      const userResponse = formatUserResponse(newUser[0]);

      return reply.status(201).send({
        message: 'Registration successful',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'Unable to generate unique ID') {
        return reply.status(500).send({
          error: 'Terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.'
        });
      }

      return reply.status(500).send({
        error: 'Registrasi gagal. Silakan coba lagi.'
      });
    }
  }

  static async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      // Validation
      if (!email || !password) {
        return reply.status(400).send({
          error: 'Email and password are required'
        });
      }

      // Find user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (user.length === 0) {
        return reply.status(401).send({
          error: 'Email atau password salah.'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user[0].password);
      
      if (!isValidPassword) {
        return reply.status(401).send({
          error: 'Email atau password salah.'
        });
      }

      // Update last login
      await db
        .update(users)
        .set({ last_login_at: new Date() })
        .where(eq(users.id, user[0].id));

      // Generate JWT token
      const token = createToken(user[0]);

      // Format response
      const userResponse = formatUserResponse({
        ...user[0],
        last_login_at: new Date()
      });

      return reply.send({
        message: 'Login successful',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      return reply.status(500).send({
        error: 'Login gagal. Silakan coba lagi.'
      });
    }
  }

  static async adminLogin(request: FastifyRequest<{ Body: AdminLoginBody }>, reply: FastifyReply) {
    try {
      const { passkey } = request.body;

      if (!passkey) {
        return reply.status(400).send({
          error: 'Passkey is required'
        });
      }

      if (passkey !== ADMIN_PASSKEY) {
        return reply.status(401).send({
          error: 'Invalid admin passkey'
        });
      }

      // Create admin user session (temporary approach)
      const adminUser = {
        id: 'admin',
        unique_id: 'ADMIN001',
        email: 'admin@snbtku.com',
        full_name: 'System Administrator',
        role: 'admin',
        created_at: new Date(),
        last_login_at: new Date(),
        xp: 0,
        coins: 0,
        level: 1,
        avatar_url: null,
      };

      const token = createToken(adminUser);
      const userResponse = formatUserResponse(adminUser);

      return reply.send({
        message: 'Admin login successful',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Admin login error:', error);
      return reply.status(500).send({
        error: 'Admin login failed'
      });
    }
  }

  // Get current user info
  static async getCurrentUser(request: any, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          error: 'Authentication required'
        });
      }

      // Get fresh user data from database
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, request.user.id))
        .limit(1);

      if (user.length === 0) {
        return reply.status(404).send({
          error: 'User not found'
        });
      }

      const userResponse = formatUserResponse(user[0]);

      return reply.send({
        user: userResponse
      });

    } catch (error) {
      console.error('Get current user error:', error);
      return reply.status(500).send({
        error: 'Failed to get user data'
      });
    }
  }
}
