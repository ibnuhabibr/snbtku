import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
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
  email: string;
  name: string;
  firebaseUid: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'admin123'; // Default passkey untuk admin

export class AuthController {
  static async register(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
    try {
      const { email, password, name } = request.body;

      // Validate input
      if (!email || !password || !name) {
        return reply.status(400).send({
          error: 'Email, password, and name are required'
        });
      }

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return reply.status(409).send({
          error: 'Email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email,
          password_hash: hashedPassword,
          full_name: name,
          is_active: true
        })
        .returning({
          id: users.id,
          email: users.email,
          full_name: users.full_name,
          role: users.role,
          is_active: users.is_active,
          created_at: users.created_at
        });

      return reply.status(201).send({
        message: 'User registered successfully',
        user: newUser[0]
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      // Validate input
      if (!email || !password) {
        return reply.status(400).send({
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        return reply.status(401).send({
          error: 'Invalid email or password'
        });
      }

      const foundUser = user[0];

      // Check if user is active
      if (!foundUser.is_active) {
        return reply.status(401).send({
          error: 'Account is deactivated'
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, foundUser.password_hash);

      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Invalid email or password'
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: foundUser.id,
          email: foundUser.email,
          role: foundUser.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update last login
      await db
        .update(users)
        .set({ 
          last_login_at: new Date(),
          updated_at: new Date()
        })
        .where(eq(users.id, foundUser.id));

      return reply.send({
        message: 'Login successful',
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.full_name,
          role: foundUser.role,
          createdAt: foundUser.created_at,
          lastLoginAt: new Date()
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      // User data is attached by JWT middleware
      const userId = (request as any).user?.userId;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized'
        });
      }

      const user = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.full_name,
          role: users.role,
          createdAt: users.created_at,
          lastLoginAt: users.last_login_at
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        return reply.status(404).send({
          error: 'User not found'
        });
      }

      return reply.send({
        user: user[0]
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async adminLogin(request: FastifyRequest<{ Body: AdminLoginBody }>, reply: FastifyReply) {
    try {
      const { passkey } = request.body;

      // Validasi input
      if (!passkey) {
        return reply.status(400).send({
          error: 'Passkey is required'
        });
      }

      // Verifikasi passkey
      if (passkey !== ADMIN_PASSKEY) {
        return reply.status(401).send({
          error: 'Invalid passkey'
        });
      }

      // Generate JWT token untuk admin
      const token = jwt.sign(
        {
          userId: 'admin',
          email: 'admin@snbtku.com',
          role: 'super_admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return reply.send({
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin',
          email: 'admin@snbtku.com',
          name: 'Administrator',
          role: 'super_admin',
          isActive: true
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
   }

  static async googleAuth(request: FastifyRequest<{ Body: GoogleAuthBody }>, reply: FastifyReply) {
    try {
      const { email, name, firebaseUid } = request.body;

      // Validasi input
      if (!email || !name || !firebaseUid) {
        return reply.status(400).send({
          error: 'Email, name, and firebaseUid are required'
        });
      }

      // Cek apakah user sudah ada
      const existingUser = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.full_name,
          role: users.role,
          isActive: users.is_active,
          createdAt: users.created_at,
          lastLoginAt: users.last_login_at
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      let user;
      
      if (existingUser.length > 0) {
        // User sudah ada, update last login
        user = existingUser[0];
        
        if (!user.isActive) {
          return reply.status(401).send({
            error: 'Account is deactivated'
          });
        }

        // Update last login
        await db
          .update(users)
          .set({
            last_login_at: new Date(),
            updated_at: new Date()
          })
          .where(eq(users.id, user.id));
      } else {
        // User baru, buat akun
        const newUserResult = await db
          .insert(users)
          .values({
            email,
            full_name: name,
            password_hash: await bcrypt.hash(firebaseUid, SALT_ROUNDS), // Hash firebase UID sebagai password
            role: 'student',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
            last_login_at: new Date()
          })
          .returning({
            id: users.id,
            email: users.email,
            name: users.full_name,
            role: users.role,
            isActive: users.is_active,
            createdAt: users.created_at,
            lastLoginAt: users.last_login_at
          });

        user = newUserResult[0];
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.send({
        message: existingUser.length > 0 ? 'Login successful' : 'Registration successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        },
        isNewUser: existingUser.length === 0
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}