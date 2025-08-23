# SNBTKU Production-Ready Overhaul Strategy

**Alright, time to shift gears from building to perfecting. This is the blueprint to make SNBTKU not just functional, but exceptional. Let's execute.**

---

## 🎯 Executive Summary

This comprehensive strategy transforms SNBTKU from a functional prototype into a production-grade, real-time, personalized gamified learning platform. The plan addresses 7 critical issues through 5 strategic priorities over a 2-3 week intensive sprint.

**Current Pain Points:**
- ❌ Broken reward claiming system
- ❌ Generic, non-personalized content
- ❌ Faulty navigation flows
- ❌ Incomplete e-commerce functionality
- ❌ Non-functional purchasing system
- ❌ Lack of real-time feedback
- ❌ Stale test data hindering development

---

## 🏗️ Priority 1: Foundation Hardening - Real-time & Test Readiness

### Data Reset System

**Backend Script Implementation:**

```typescript
// scripts/reset-user-data.ts
import { db } from '../src/db';
import { users, userProgress, userInventory, questProgress } from '../src/db/schema';

export async function resetAllUserData() {
  await db.transaction(async (tx) => {
    // Reset user stats
    await tx.update(users).set({
      xp: 0,
      coins: 1000, // Starting coins
      level: 1,
      lastLoginAt: new Date(),
      dailyCheckInStreak: 0,
      lastDailyCheckIn: null
    });
    
    // Clear progress data
    await tx.delete(userProgress);
    await tx.delete(userInventory);
    await tx.delete(questProgress);
    
    console.log('✅ All user data reset successfully');
  });
}
```

**Checklist:**
- [ ] Create reset script with Drizzle ORM
- [ ] Add npm script: `"reset:data": "tsx scripts/reset-user-data.ts"`
- [ ] Implement backup before reset functionality
- [ ] Add confirmation prompts for production safety

### Real-time Architecture Implementation

**Technology Choice: Socket.IO for robust real-time communication**

**Backend WebSocket Setup:**

```typescript
// src/services/socketService.ts
import { Server } from 'socket.io';
import { authenticateSocket } from '../middleware/socketAuth';

class SocketService {
  private io: Server;
  
  initialize(server: any) {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL }
    });
    
    this.io.use(authenticateSocket);
    
    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      socket.join(`user:${userId}`);
      
      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
      });
    });
  }
  
  // Real-time notification system
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }
  
  // Broadcast system updates
  broadcastRewardClaimed(userId: string, reward: any) {
    this.emitToUser(userId, 'reward:claimed', {
      type: 'success',
      message: `+${reward.coins} coins, +${reward.xp} XP!`,
      coins: reward.coins,
      xp: reward.xp
    });
  }
}

export const socketService = new SocketService();
```

**Frontend Socket Integration:**

```typescript
// src/hooks/useSocket.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../components/ui/use-toast';

let socket: Socket | null = null;

export const useSocket = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user && !socket) {
      socket = io(process.env.VITE_API_URL, {
        auth: { token: user.token }
      });
      
      socket.on('reward:claimed', (data) => {
        toast({
          title: "Reward Claimed! 🎉",
          description: data.message,
          variant: "success"
        });
        
        // Update user stats in real-time
        useAuthStore.getState().updateUserStats({
          coins: data.coins,
          xp: data.xp
        });
      });
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user]);
  
  return socket;
};
```

**Checklist:**
- [ ] Install Socket.IO dependencies
- [ ] Implement socket authentication middleware
- [ ] Create real-time notification system
- [ ] Add socket connection management
- [ ] Implement real-time user stats updates
- [ ] Add connection status indicators

---

## 🎮 Priority 2: Gamification & Reward System Overhaul

### Daily Check-in System Fix

**Backend API Implementation:**

```typescript
// src/controllers/rewardController.ts
export async function claimDailyReward(req: Request, res: Response) {
  const userId = req.user.id;
  
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const now = new Date();
    const lastCheckIn = user[0].lastDailyCheckIn;
    
    // Check if already claimed today
    if (lastCheckIn && isSameDay(lastCheckIn, now)) {
      return res.status(400).json({ 
        error: 'Daily reward already claimed today',
        nextClaimAt: getNextMidnight(now)
      });
    }
    
    // Calculate streak and rewards
    const isConsecutive = lastCheckIn && 
      differenceInDays(now, lastCheckIn) === 1;
    
    const newStreak = isConsecutive ? user[0].dailyCheckInStreak + 1 : 1;
    const baseReward = { coins: 50, xp: 25 };
    const streakBonus = Math.min(newStreak * 10, 100); // Max 100 bonus
    
    const totalReward = {
      coins: baseReward.coins + streakBonus,
      xp: baseReward.xp + Math.floor(streakBonus / 2)
    };
    
    // Update user data
    await db.update(users)
      .set({
        coins: user[0].coins + totalReward.coins,
        xp: user[0].xp + totalReward.xp,
        dailyCheckInStreak: newStreak,
        lastDailyCheckIn: now
      })
      .where(eq(users.id, userId));
    
    // Real-time notification
    socketService.broadcastRewardClaimed(userId, {
      ...totalReward,
      streak: newStreak,
      type: 'daily_checkin'
    });
    
    res.json({
      success: true,
      reward: totalReward,
      streak: newStreak,
      nextClaimAt: getNextMidnight(now)
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to claim daily reward' });
  }
}
```

**Frontend Component Logic:**

```typescript
// src/components/DailyCheckIn.tsx
const DailyCheckIn = () => {
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [nextClaimAt, setNextClaimAt] = useState<Date | null>(null);
  const { user, updateUserStats } = useAuthStore();
  const { toast } = useToast();
  
  const checkClaimStatus = async () => {
    try {
      const response = await fetch('/api/rewards/daily-status');
      const data = await response.json();
      
      setCanClaim(data.canClaim);
      setNextClaimAt(data.nextClaimAt ? new Date(data.nextClaimAt) : null);
    } catch (error) {
      console.error('Failed to check claim status:', error);
    }
  };
  
  const handleClaim = async () => {
    if (!canClaim || claiming) return;
    
    setClaiming(true);
    
    try {
      const response = await fetch('/api/rewards/daily-claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCanClaim(false);
        setNextClaimAt(new Date(data.nextClaimAt));
        
        // Update local user stats
        updateUserStats({
          coins: user!.coins + data.reward.coins,
          xp: user!.xp + data.reward.xp
        });
        
        toast({
          title: `Daily Reward Claimed! 🎉`,
          description: `+${data.reward.coins} coins, +${data.reward.xp} XP (${data.streak} day streak!)`,
          variant: "success"
        });
      } else {
        toast({
          title: "Cannot Claim",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim daily reward",
        variant: "destructive"
      });
    } finally {
      setClaiming(false);
    }
  };
  
  return (
    <Card className="p-4">
      <h3 className="font-bold mb-2">Daily Check-in</h3>
      <Button 
        onClick={handleClaim}
        disabled={!canClaim || claiming}
        className="w-full"
      >
        {claiming ? 'Claiming...' : canClaim ? 'Claim Reward' : 'Already Claimed'}
      </Button>
      {nextClaimAt && (
        <p className="text-sm text-muted-foreground mt-2">
          Next claim: {nextClaimAt.toLocaleTimeString()}
        </p>
      )}
    </Card>
  );
};
```

### Quest Tracker Rewards System

**Database Schema Addition:**

```typescript
// src/db/schema.ts
export const questRewards = pgTable('quest_rewards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  questId: varchar('quest_id', { length: 50 }).notNull(),
  claimedAt: timestamp('claimed_at').defaultNow(),
  rewardCoins: integer('reward_coins').notNull(),
  rewardXp: integer('reward_xp').notNull()
});
```

**Quest Completion Logic:**

```typescript
// src/services/questService.ts
export async function claimQuestReward(userId: string, questId: string) {
  // Check if already claimed
  const existingClaim = await db.select()
    .from(questRewards)
    .where(and(
      eq(questRewards.userId, userId),
      eq(questRewards.questId, questId)
    ))
    .limit(1);
    
  if (existingClaim.length > 0) {
    throw new Error('Quest reward already claimed');
  }
  
  // Verify quest completion
  const questProgress = await getQuestProgress(userId, questId);
  if (!questProgress.completed) {
    throw new Error('Quest not completed');
  }
  
  const reward = getQuestReward(questId);
  
  await db.transaction(async (tx) => {
    // Add reward record
    await tx.insert(questRewards).values({
      userId,
      questId,
      rewardCoins: reward.coins,
      rewardXp: reward.xp
    });
    
    // Update user stats
    await tx.update(users)
      .set({
        coins: sql`coins + ${reward.coins}`,
        xp: sql`xp + ${reward.xp}`
      })
      .where(eq(users.id, userId));
  });
  
  return reward;
}
```

**Checklist:**
- [ ] Fix daily check-in timestamp validation
- [ ] Implement streak calculation logic
- [ ] Add quest reward claiming system
- [ ] Create reward notification animations
- [ ] Add cooldown timers and visual feedback
- [ ] Implement reward history tracking

---

## 🧠 Priority 3: The Personalization Engine

### Enhanced Performance Tracking Schema

```sql
-- Database schema modifications
CREATE TABLE user_performance_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subtest_category VARCHAR(50) NOT NULL, -- 'penalaran_umum', 'pengetahuan_kuantitatif', etc.
  subtest_subcategory VARCHAR(50), -- 'logika_dasar', 'analisis_kuantitatif', etc.
  question_id INTEGER,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
  attempted_at TIMESTAMP DEFAULT NOW(),
  session_id VARCHAR(100)
);

CREATE TABLE user_learning_patterns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subtest_category VARCHAR(50) NOT NULL,
  accuracy_rate DECIMAL(5,2), -- 0.00 to 100.00
  avg_time_per_question INTEGER, -- seconds
  total_questions_attempted INTEGER,
  weak_areas JSONB, -- Array of specific topics
  strong_areas JSONB,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

### Personalized Recommendation Algorithm

```typescript
// src/services/personalizationService.ts
interface UserWeakness {
  category: string;
  subcategory: string;
  accuracyRate: number;
  avgTimePerQuestion: number;
  priority: number; // 1-10, higher = more urgent
}

export async function getPersonalizedRecommendations(userId: string) {
  // 1. Analyze user performance data
  const performanceData = await db.select({
    category: userPerformanceAnalytics.subtestCategory,
    subcategory: userPerformanceAnalytics.subtestSubcategory,
    accuracy: sql<number>`AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100`,
    avgTime: sql<number>`AVG(time_taken_seconds)`,
    totalAttempts: sql<number>`COUNT(*)`
  })
  .from(userPerformanceAnalytics)
  .where(eq(userPerformanceAnalytics.userId, userId))
  .groupBy(
    userPerformanceAnalytics.subtestCategory,
    userPerformanceAnalytics.subtestSubcategory
  )
  .having(sql`COUNT(*) >= 5`); // Minimum attempts for reliable data
  
  // 2. Identify top 3 weakest areas
  const weaknesses: UserWeakness[] = performanceData
    .map(data => ({
      category: data.category,
      subcategory: data.subcategory,
      accuracyRate: data.accuracy,
      avgTimePerQuestion: data.avgTime,
      priority: calculatePriority(data.accuracy, data.avgTime, data.totalAttempts)
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
  
  // 3. Generate targeted recommendations
  const recommendations = {
    learningMaterials: await getTargetedMaterials(weaknesses),
    practiceQuestions: await getTargetedPractice(weaknesses),
    studyPlan: generateStudyPlan(weaknesses),
    motivationalMessage: generateMotivationalMessage(weaknesses)
  };
  
  return {
    weaknesses,
    recommendations,
    lastUpdated: new Date()
  };
}

function calculatePriority(accuracy: number, avgTime: number, attempts: number): number {
  // Lower accuracy = higher priority
  const accuracyScore = (100 - accuracy) / 10; // 0-10
  
  // Slower time = higher priority (normalized)
  const timeScore = Math.min(avgTime / 60, 5); // Cap at 5 minutes
  
  // More attempts = higher confidence in data
  const confidenceMultiplier = Math.min(attempts / 20, 1.5);
  
  return (accuracyScore + timeScore) * confidenceMultiplier;
}

async function getTargetedMaterials(weaknesses: UserWeakness[]) {
  const materials = [];
  
  for (const weakness of weaknesses) {
    const relevantMaterials = await db.select()
      .from(learningMaterials)
      .where(and(
        eq(learningMaterials.category, weakness.category),
        eq(learningMaterials.subcategory, weakness.subcategory)
      ))
      .orderBy(learningMaterials.difficulty)
      .limit(3);
    
    materials.push({
      weakness: weakness.subcategory,
      materials: relevantMaterials,
      reason: `Accuracy: ${weakness.accuracyRate.toFixed(1)}% - Need improvement`
    });
  }
  
  return materials;
}
```

### Dynamic Potential Analysis

```typescript
// src/pages/AnalisisPotensi.tsx - Enhanced Version
const AnalisisPotensi = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  
  useEffect(() => {
    loadPersonalizedAnalysis();
  }, []);
  
  const loadPersonalizedAnalysis = async () => {
    try {
      const response = await fetch(`/api/analysis/potential/${user?.id}`);
      const data = await response.json();
      
      setAnalysisData({
        overallScore: data.overallScore,
        categoryBreakdown: data.categoryBreakdown,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,
        progressTrend: data.progressTrend,
        predictedSNBTScore: data.predictedSNBTScore
      });
    } catch (error) {
      console.error('Failed to load analysis:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your SNBT Potential Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {analysisData.overallScore}%
            </div>
            <p className="text-muted-foreground">Overall Readiness</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {analysisData.predictedSNBTScore}
            </div>
            <p className="text-muted-foreground">Predicted SNBT Score</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {analysisData.progressTrend > 0 ? '+' : ''}{analysisData.progressTrend}%
            </div>
            <p className="text-muted-foreground">Progress This Week</p>
          </div>
        </div>
      </Card>
      
      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Performance by Category</h3>
        <div className="space-y-4">
          {analysisData.categoryBreakdown.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {category.score}% ({category.totalQuestions} questions)
                </span>
              </div>
              <Progress value={category.score} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
      
      {/* Personalized Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-green-600">Your Strengths 💪</h3>
          <ul className="space-y-2">
            {analysisData.strengths.map((strength, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-orange-600">Areas to Improve 🎯</h3>
          <ul className="space-y-2">
            {analysisData.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
```

**Checklist:**
- [ ] Create detailed performance tracking schema
- [ ] Implement real-time performance analytics
- [ ] Build personalization algorithm
- [ ] Create dynamic potential analysis
- [ ] Add progress trend visualization
- [ ] Implement SNBT score prediction model

---

## 🛒 Priority 4: E-commerce & Profile Customization

### Shop Revitalization - Creative Item Catalog

**New Shop Items Categories:**

```typescript
// src/types/shop.ts
interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'badge' | 'theme' | 'consumable' | 'frame' | 'effect';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isLimited: boolean;
  availableUntil?: Date;
  requirements?: {
    minLevel?: number;
    completedQuests?: string[];
    achievements?: string[];
  };
}

const CREATIVE_SHOP_ITEMS: ShopItem[] = [
  // Avatar Collection
  {
    id: 'avatar_ninja_student',
    name: 'Ninja Student',
    description: 'Stealthy learner who masters concepts in silence',
    category: 'avatar',
    price: 500,
    rarity: 'rare'
  },
  {
    id: 'avatar_quantum_scholar',
    name: 'Quantum Scholar',
    description: 'Exists in multiple study states simultaneously',
    category: 'avatar',
    price: 1200,
    rarity: 'epic',
    requirements: { minLevel: 10 }
  },
  
  // Profile Badges
  {
    id: 'badge_speed_demon',
    name: 'Speed Demon ⚡',
    description: 'Complete 10 questions in under 30 seconds each',
    category: 'badge',
    price: 300,
    rarity: 'common'
  },
  {
    id: 'badge_perfectionist',
    name: 'Perfectionist 💎',
    description: 'Achieve 100% accuracy in 5 consecutive practice sessions',
    category: 'badge',
    price: 800,
    rarity: 'epic'
  },
  
  // UI Themes
  {
    id: 'theme_dark_academia',
    name: 'Dark Academia Theme',
    description: 'Elegant dark theme for focused studying',
    category: 'theme',
    price: 600,
    rarity: 'rare'
  },
  {
    id: 'theme_neon_cyber',
    name: 'Neon Cyber Theme',
    description: 'Futuristic neon theme for tech enthusiasts',
    category: 'theme',
    price: 900,
    rarity: 'epic'
  },
  
  // Consumables
  {
    id: 'consumable_double_xp',
    name: 'Double XP Potion (1 hour)',
    description: 'Double all XP gains for 1 hour',
    category: 'consumable',
    price: 200,
    rarity: 'common'
  },
  {
    id: 'consumable_hint_master',
    name: 'Hint Master (5 uses)',
    description: 'Get smart hints for difficult questions',
    category: 'consumable',
    price: 150,
    rarity: 'common'
  },
  
  // Profile Frames
  {
    id: 'frame_golden_scholar',
    name: 'Golden Scholar Frame',
    description: 'Prestigious golden frame for top performers',
    category: 'frame',
    price: 1500,
    rarity: 'legendary',
    requirements: { minLevel: 25 }
  },
  
  // Special Effects
  {
    id: 'effect_particle_trail',
    name: 'Particle Trail Effect',
    description: 'Leave a trail of particles when navigating',
    category: 'effect',
    price: 400,
    rarity: 'rare'
  }
];
```

### Purchase System Implementation

```typescript
// src/controllers/shopController.ts
export async function purchaseItem(req: Request, res: Response) {
  const { itemId } = req.params;
  const userId = req.user.id;
  
  try {
    await db.transaction(async (tx) => {
      // Get user data
      const user = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]) throw new Error('User not found');
      
      // Get item data
      const item = await tx.select().from(shopItems).where(eq(shopItems.id, itemId)).limit(1);
      if (!item[0]) throw new Error('Item not found');
      
      // Check if item is available
      if (item[0].availableUntil && new Date() > item[0].availableUntil) {
        throw new Error('Item no longer available');
      }
      
      // Check requirements
      if (item[0].requirements) {
        const reqs = item[0].requirements;
        if (reqs.minLevel && user[0].level < reqs.minLevel) {
          throw new Error(`Requires level ${reqs.minLevel}`);
        }
      }
      
      // Check if user already owns the item (for non-consumables)
      if (item[0].category !== 'consumable') {
        const existing = await tx.select()
          .from(userInventory)
          .where(and(
            eq(userInventory.userId, userId),
            eq(userInventory.itemId, itemId)
          ))
          .limit(1);
          
        if (existing.length > 0) {
          throw new Error('You already own this item');
        }
      }
      
      // Check sufficient coins
      if (user[0].coins < item[0].price) {
        throw new Error('Insufficient coins');
      }
      
      // Deduct coins
      await tx.update(users)
        .set({ coins: user[0].coins - item[0].price })
        .where(eq(users.id, userId));
      
      // Add to inventory
      await tx.insert(userInventory).values({
        userId,
        itemId,
        purchasedAt: new Date(),
        quantity: item[0].category === 'consumable' ? 1 : 1
      });
      
      // Log purchase
      await tx.insert(purchaseHistory).values({
        userId,
        itemId,
        price: item[0].price,
        purchasedAt: new Date()
      });
    });
    
    // Real-time notification
    socketService.emitToUser(userId, 'purchase:success', {
      itemId,
      message: 'Item purchased successfully!'
    });
    
    res.json({ success: true, message: 'Purchase completed' });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

### Avatar Integration System

```typescript
// src/components/UserAvatar.tsx - Enhanced Version
const UserAvatar = ({ userId, size = 'md', showFrame = true }) => {
  const [avatarData, setAvatarData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadUserAvatarData();
  }, [userId]);
  
  const loadUserAvatarData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/avatar-data`);
      const data = await response.json();
      
      setAvatarData({
        activeAvatar: data.activeAvatar,
        activeFrame: data.activeFrame,
        activeEffect: data.activeEffect,
        level: data.level,
        badges: data.activeBadges
      });
    } catch (error) {
      console.error('Failed to load avatar data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Skeleton className={`rounded-full ${getSizeClass(size)}`} />;
  
  return (
    <div className={`relative ${getSizeClass(size)}`}>
      {/* Avatar Frame */}
      {showFrame && avatarData.activeFrame && (
        <div className="absolute inset-0 z-10">
          <img 
            src={`/assets/frames/${avatarData.activeFrame.id}.png`}
            alt="Profile Frame"
            className="w-full h-full"
          />
        </div>
      )}
      
      {/* Main Avatar */}
      <div className="relative z-5">
        <img 
          src={avatarData.activeAvatar ? 
            `/assets/avatars/${avatarData.activeAvatar.id}.png` : 
            '/assets/avatars/default.png'
          }
          alt="User Avatar"
          className="w-full h-full rounded-full"
        />
      </div>
      
      {/* Level Badge */}
      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 font-bold z-20">
        {avatarData.level}
      </div>
      
      {/* Active Badges */}
      {avatarData.badges && avatarData.badges.length > 0 && (
        <div className="absolute -top-1 -left-1 z-20">
          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs">🏆</span>
          </div>
        </div>
      )}
      
      {/* Particle Effect */}
      {avatarData.activeEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <ParticleEffect type={avatarData.activeEffect.id} />
        </div>
      )}
    </div>
  );
};
```

**Checklist:**
- [ ] Design creative shop item catalog
- [ ] Implement secure purchase transaction system
- [ ] Create inventory management system
- [ ] Build avatar customization interface
- [ ] Add profile frame and effect systems
- [ ] Implement consumable item usage logic
- [ ] Create admin shop management interface

---

## 🎨 Priority 5: UI/UX & Navigation Flow Polish

### Practice Zone Routing Fix

```typescript
// src/pages/PracticeZone.tsx - Corrected Implementation
const PracticeZone = () => {
  const navigate = useNavigate();
  const [practiceCategories, setPracticeCategories] = useState([]);
  
  const practiceData = [
    {
      id: 'penalaran-umum',
      title: 'Penalaran Umum',
      description: 'Logika, analisis, dan pemecahan masalah',
      icon: Brain,
      color: 'bg-blue-500',
      subtests: [
        { id: 'logika-dasar', name: 'Logika Dasar', questionCount: 25 },
        { id: 'analisis-verbal', name: 'Analisis Verbal', questionCount: 20 },
        { id: 'pemecahan-masalah', name: 'Pemecahan Masalah', questionCount: 15 }
      ]
    },
    {
      id: 'pengetahuan-kuantitatif',
      title: 'Pengetahuan Kuantitatif',
      description: 'Matematika dan analisis data',
      icon: Calculator,
      color: 'bg-green-500',
      subtests: [
        { id: 'aljabar', name: 'Aljabar', questionCount: 20 },
        { id: 'geometri', name: 'Geometri', questionCount: 15 },
        { id: 'statistika', name: 'Statistika', questionCount: 10 }
      ]
    }
  ];
  
  const handleStartPractice = (categoryId: string, subtestId?: string) => {
    if (subtestId) {
      // Navigate to specific subtest
      navigate(`/practice/${categoryId}/${subtestId}`);
    } else {
      // Navigate to category overview
      navigate(`/practice/${categoryId}`);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Zone 🎯</h1>
        <p className="text-muted-foreground">
          Pilih kategori dan mulai latihan untuk meningkatkan kemampuanmu
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceData.map((category) => (
          <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${category.color}`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {category.subtests.map((subtest) => (
                <div key={subtest.id} className="flex items-center justify-between p-2 rounded border">
                  <span className="font-medium">{subtest.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{subtest.questionCount} soal</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleStartPractice(category.id, subtest.id)}
                    >
                      Mulai
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleStartPractice(category.id)}
            >
              Latihan Campuran
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

### Enhanced Routing Configuration

```typescript
// src/App.tsx - Updated Routes
const router = createBrowserRouter([
  // ... existing routes
  {
    path: '/practice',
    element: <ProtectedRoute><PracticeZone /></ProtectedRoute>
  },
  {
    path: '/practice/:categoryId',
    element: <ProtectedRoute><PracticeCategoryPage /></ProtectedRoute>
  },
  {
    path: '/practice/:categoryId/:subtestId',
    element: <ProtectedRoute><PracticeSession /></ProtectedRoute>
  }
]);
```

### Practice Session Component Enhancement

```typescript
// src/pages/PracticeSession.tsx - Enhanced Version
const PracticeSession = () => {
  const { categoryId, subtestId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  useEffect(() => {
    loadPracticeQuestions();
  }, [categoryId, subtestId]);
  
  const loadPracticeQuestions = async () => {
    try {
      const response = await fetch(
        `/api/practice/questions?category=${categoryId}&subtest=${subtestId}&limit=20`
      );
      const data = await response.json();
      
      setQuestions(data.questions);
      setTimeRemaining(data.timeLimit * 60); // Convert to seconds
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast({
        title: "Error",
        description: "Failed to load practice questions",
        variant: "destructive"
      });
    }
  };
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer,
        timeSpent: Date.now() - questionStartTime,
        timestamp: new Date()
      }
    }));
  };
  
  const handleSubmitSession = async () => {
    try {
      const response = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          subtestId,
          answers: userAnswers,
          sessionDuration: (questions.length * 60) - timeRemaining
        })
      });
      
      const result = await response.json();
      
      // Navigate to results page
      navigate(`/practice/results/${result.sessionId}`);
      
    } catch (error) {
      console.error('Failed to submit session:', error);
    }
  };
  
  if (!questions.length) return <LoadingSpinner />;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Session Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {categoryId.replace('-', ' ')} - {subtestId.replace('-', ' ')}
          </h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-lg font-mono">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <Button variant="outline" onClick={() => navigate('/practice')}>
            Exit
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <Progress 
        value={(currentQuestionIndex / questions.length) * 100} 
        className="mb-6" 
      />
      
      {/* Question Content */}
      <Card className="p-6 mb-6">
        <QuestionDisplay 
          question={questions[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={userAnswers[questions[currentQuestionIndex]?.id]?.answer}
        />
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmitSession}>
            Submit Session
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            disabled={!userAnswers[questions[currentQuestionIndex]?.id]}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
```

**Checklist:**
- [ ] Fix Practice Zone navigation routing
- [ ] Implement dynamic route parameters
- [ ] Create category and subtest pages
- [ ] Add breadcrumb navigation
- [ ] Implement session state management
- [ ] Add progress tracking and analytics
- [ ] Create results and review pages

---

## 🚀 Implementation Timeline (2-3 Week Sprint)

### Week 1: Foundation & Core Systems
**Days 1-2: Foundation Hardening**
- [ ] Implement data reset scripts
- [ ] Set up Socket.IO real-time architecture
- [ ] Create performance tracking database schema

**Days 3-5: Gamification System**
- [ ] Fix daily check-in system
- [ ] Implement quest reward claiming
- [ ] Add real-time notifications

**Days 6-7: Testing & Debugging**
- [ ] Comprehensive testing of reward systems
- [ ] Performance optimization

### Week 2: Personalization & E-commerce
**Days 8-10: Personalization Engine**
- [ ] Build recommendation algorithm
- [ ] Create dynamic analysis system
- [ ] Implement user performance tracking

**Days 11-14: E-commerce Overhaul**
- [ ] Design and implement shop items
- [ ] Fix purchase system
- [ ] Create avatar integration
- [ ] Build inventory management

### Week 3: Polish & Launch Preparation
**Days 15-17: UI/UX Enhancement**
- [ ] Fix navigation flows
- [ ] Enhance practice session experience
- [ ] Add visual polish and animations

**Days 18-21: Final Testing & Deployment**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Production deployment preparation
- [ ] User acceptance testing

---

## 🎯 Success Metrics

**Technical Metrics:**
- [ ] 100% functional reward claiming system
- [ ] <200ms average API response time
- [ ] Real-time updates with <1s latency
- [ ] Zero critical bugs in core flows

**User Experience Metrics:**
- [ ] Personalized recommendations accuracy >80%
- [ ] Navigation success rate >95%
- [ ] Purchase completion rate >90%
- [ ] User engagement increase >40%

**Business Metrics:**
- [ ] Daily active users increase >30%
- [ ] Session duration increase >25%
- [ ] User retention (7-day) >60%
- [ ] In-app purchase conversion >15%

---

**Ready to transform SNBTKU into the ultimate gamified learning platform? Let's execute this blueprint with precision and passion. The future of SNBT preparation starts now! 🚀**