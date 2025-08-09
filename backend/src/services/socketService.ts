import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

interface SocketData {
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RewardData {
  coins: number;
  xp: number;
  streak?: number;
  type: 'daily_checkin' | 'quest_complete' | 'achievement' | 'level_up';
}

class SocketService {
  private io: Server | null = null;
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8081",
        methods: ["GET", "POST"]
      }
    });

    // Socket authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        // Fetch user data from database
        const user = await db.select({
          id: users.id,
          email: users.email,
          name: users.full_name
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

        if (!user[0]) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.data = {
          userId: user[0].id,
          user: user[0]
        } as SocketData;

        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      console.log(`User ${userId} connected with socket ${socket.id}`);
      
      // Store user connection
      this.connectedUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);

      // Send connection confirmation
      socket.emit('connected', {
        message: 'Successfully connected to SNBTKU real-time system',
        userId: userId
      });

      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        this.connectedUsers.delete(userId);
      });

      // Handle ping for connection health check
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
    });

    console.log('✅ Socket.IO service initialized successfully');
  }

  // Real-time notification system
  emitToUser(userId: string, event: string, data: any) {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }

    this.io.to(`user:${userId}`).emit(event, data);
    console.log(`Emitted ${event} to user ${userId}:`, data);
  }

  // Broadcast reward claimed notification
  broadcastRewardClaimed(userId: string, reward: RewardData) {
    const message = this.generateRewardMessage(reward);
    
    this.emitToUser(userId, 'reward:claimed', {
      type: 'success',
      message,
      coins: reward.coins,
      xp: reward.xp,
      streak: reward.streak,
      rewardType: reward.type,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast quest progress update
  broadcastQuestProgress(userId: string, questData: any) {
    this.emitToUser(userId, 'quest:progress', {
      questId: questData.questId,
      progress: questData.progress,
      maxProgress: questData.maxProgress,
      completed: questData.completed,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast level up notification
  broadcastLevelUp(userId: string, levelData: any) {
    this.emitToUser(userId, 'user:level_up', {
      oldLevel: levelData.oldLevel,
      newLevel: levelData.newLevel,
      xpGained: levelData.xpGained,
      rewards: levelData.rewards,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast achievement unlock
  broadcastAchievementUnlock(userId: string, achievement: any) {
    this.emitToUser(userId, 'achievement:unlocked', {
      achievementId: achievement.id,
      title: achievement.title,
      description: achievement.description,
      xpReward: achievement.xpReward,
      rarity: achievement.rarity,
      timestamp: new Date().toISOString()
    });
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Generate reward message based on type
  private generateRewardMessage(reward: RewardData): string {
    const baseMessage = `+${reward.coins} coins, +${reward.xp} XP!`;
    
    switch (reward.type) {
      case 'daily_checkin':
        return `Daily Check-in Reward! ${baseMessage}${reward.streak ? ` (${reward.streak} day streak!)` : ''}`;
      case 'quest_complete':
        return `Quest Completed! ${baseMessage}`;
      case 'achievement':
        return `Achievement Unlocked! ${baseMessage}`;
      case 'level_up':
        return `Level Up! ${baseMessage}`;
      default:
        return baseMessage;
    }
  }
}

export const socketService = new SocketService();
export default socketService;