# SNBTKU Platform Architecture & Core Functionality Design

## Overview
Rancangan arsitektur dan fungsionalitas inti untuk platform tryout online UTBK-SNBT yang paling powerful dan engaging di Indonesia.

---

## MODUL 1: "THE BRAIN" - TRYOUT ENGINE & ANALYTICS

### 1. User Flow: Pengerjaan Tryout hingga Analisis

```
[Start Tryout] → [Question Display] → [Answer Submission] → [IRT Calculation] → [Results Dashboard] → [Personalized Analysis] → [Study Recommendations]
```

#### Detailed User Flow:
1. **Pre-Tryout**
   - User memilih paket tryout
   - Sistem menampilkan info durasi, jumlah soal, subtes
   - User konfirmasi mulai tryout

2. **During Tryout**
   - Soal ditampilkan per subtes dengan timer
   - Real-time saving jawaban ke database
   - Navigation antar soal dengan marking system
   - Auto-submit saat waktu habis

3. **Post-Tryout Processing**
   - Sistem menghitung skor menggunakan IRT
   - Generate analisis personal
   - Update user statistics dan progress
   - Trigger gamification rewards

4. **Results & Analysis**
   - Dashboard analisis personal
   - Detailed breakdown per subtes
   - Comparison dengan peserta lain
   - Study recommendations

### 2. Item Response Theory (IRT) Implementation

#### IRT Model: 3-Parameter Logistic (3PL)
```
P(θ) = c + (1-c) * [e^(a(θ-b)) / (1 + e^(a(θ-b)))]

Where:
- θ (theta) = User ability level
- a = Item discrimination parameter
- b = Item difficulty parameter  
- c = Guessing parameter
```

#### IRT Calculation Process:
1. **Item Calibration**: Setiap soal memiliki parameter a, b, c yang sudah dikalibrasi
2. **Ability Estimation**: Menggunakan Maximum Likelihood Estimation (MLE)
3. **Iterative Process**: Newton-Raphson method untuk konvergensi θ
4. **Score Scaling**: Convert θ ke skala 200-800 (mirip SAT)

### 3. Database Schema Design

#### Core Tables:

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Gamification Fields
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    
    -- Profile Fields
    target_university VARCHAR(255),
    target_major VARCHAR(255),
    graduation_year INTEGER,
    study_hours_goal INTEGER DEFAULT 2
);

-- Question Bank
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    subtest_type VARCHAR(50) NOT NULL, -- 'PU', 'PPU', 'PBM', 'PK', etc.
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    options JSONB NOT NULL, -- [{"key": "A", "text": "...", "image_url": "..."}]
    correct_answer VARCHAR(1) NOT NULL,
    explanation TEXT,
    explanation_video_url TEXT,
    
    -- IRT Parameters
    discrimination_param DECIMAL(4,3), -- parameter 'a'
    difficulty_param DECIMAL(4,3),     -- parameter 'b' 
    guessing_param DECIMAL(4,3),       -- parameter 'c'
    
    -- Metadata
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard', 'very_hard'
    cognitive_level VARCHAR(20),  -- 'LOTS', 'MOTS', 'HOTS'
    topic VARCHAR(255),
    subtopic VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Tryout Packages
CREATE TABLE tryout_packages (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    subtest_config JSONB NOT NULL, -- {"PU": 30, "PPU": 25, "PBM": 25, "PK": 30}
    difficulty_distribution JSONB, -- {"easy": 20, "medium": 50, "hard": 25, "very_hard": 5}
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Tryout Sessions
CREATE TABLE tryout_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES tryout_packages(id),
    questions JSONB NOT NULL, -- Array of question IDs in order
    started_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    duration_seconds INTEGER,
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    
    -- IRT Results
    overall_theta DECIMAL(6,3),
    overall_score INTEGER, -- Scaled score (200-800)
    subtest_scores JSONB, -- {"PU": {"theta": 0.5, "score": 650}, ...}
    
    -- Analytics Data
    total_correct INTEGER,
    total_attempted INTEGER,
    time_per_question JSONB, -- {"q1": 45, "q2": 67, ...} in seconds
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Answers
CREATE TABLE user_answers (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES tryout_sessions(id),
    question_id UUID REFERENCES questions(id),
    user_answer VARCHAR(1),
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    is_marked BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- Question Statistics (for analytics)
CREATE TABLE question_stats (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_time_seconds DECIMAL(6,2),
    difficulty_index DECIMAL(4,3), -- P-value (proportion correct)
    discrimination_index DECIMAL(4,3), -- Point-biserial correlation
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Progress Tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    subtest_type VARCHAR(50),
    topic VARCHAR(255),
    
    -- Performance Metrics
    total_questions_attempted INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    average_theta DECIMAL(6,3),
    average_score INTEGER,
    best_theta DECIMAL(6,3),
    best_score INTEGER,
    
    -- Time Tracking
    total_study_time_minutes INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMP,
    
    -- Mastery Level
    mastery_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'expert'
    confidence_score DECIMAL(4,3), -- 0-1 scale
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, subtest_type, topic)
);
```

### 4. API Endpoints Design

#### Tryout Management
```typescript
// Get available tryout packages
GET /api/v1/tryouts/packages
Response: {
  packages: [
    {
      id: string,
      title: string,
      description: string,
      duration_minutes: number,
      total_questions: number,
      subtest_config: object,
      is_premium: boolean,
      price?: number
    }
  ]
}

// Start new tryout session
POST /api/v1/tryouts/sessions
Body: {
  package_id: string
}
Response: {
  session_id: string,
  questions: [
    {
      id: string,
      subtest_type: string,
      question_text: string,
      question_image_url?: string,
      options: Array<{key: string, text: string, image_url?: string}>
    }
  ],
  time_limit_seconds: number
}

// Submit answer
POST /api/v1/tryouts/sessions/{sessionId}/answers
Body: {
  question_id: string,
  answer: string,
  time_spent_seconds: number,
  is_marked?: boolean
}
Response: {
  success: boolean,
  remaining_time_seconds: number
}

// Submit complete tryout
POST /api/v1/tryouts/sessions/{sessionId}/submit
Body: {
  final_answers: Array<{
    question_id: string,
    answer: string,
    time_spent_seconds: number
  }>
}
Response: {
  session_id: string,
  processing: boolean,
  estimated_completion_seconds: number
}
```

#### Analytics & Results
```typescript
// Get tryout results with IRT analysis
GET /api/v1/analysis/sessions/{sessionId}
Response: {
  session: {
    id: string,
    package_title: string,
    submitted_at: string,
    duration_seconds: number
  },
  scores: {
    overall: {
      theta: number,
      scaled_score: number, // 200-800
      percentile: number
    },
    by_subtest: {
      [subtest]: {
        theta: number,
        scaled_score: number,
        correct: number,
        total: number,
        time_efficiency: number // 0-1 scale
      }
    }
  },
  probability_analysis: {
    target_universities: [
      {
        name: string,
        major: string,
        passing_grade_estimate: number,
        probability_pass: number // 0-1
      }
    ]
  },
  weakness_analysis: {
    weakest_subtests: [
      {
        subtest: string,
        theta: number,
        improvement_needed: number,
        priority: 'high' | 'medium' | 'low'
      }
    ],
    topic_breakdown: {
      [topic]: {
        correct: number,
        total: number,
        difficulty_faced: number
      }
    }
  },
  question_statistics: [
    {
      question_id: string,
      user_answer: string,
      correct_answer: string,
      is_correct: boolean,
      difficulty_level: string,
      percentage_correct_others: number,
      time_spent_vs_average: number
    }
  ]
}

// Get personalized study recommendations
GET /api/v1/recommendations/user/{userId}
Response: {
  priority_topics: [
    {
      subtest: string,
      topic: string,
      urgency_score: number, // 0-1
      recommended_materials: [
        {
          type: 'video' | 'article' | 'practice',
          title: string,
          url: string,
          estimated_duration_minutes: number
        }
      ]
    }
  ],
  study_plan: {
    daily_target_minutes: number,
    weekly_focus_areas: string[],
    next_tryout_recommendation: string
  }
}

// Get user progress over time
GET /api/v1/analytics/progress/{userId}
Query: ?subtest=PU&timeframe=30d
Response: {
  progress_data: [
    {
      date: string,
      theta: number,
      scaled_score: number,
      questions_attempted: number,
      accuracy: number
    }
  ],
  trend_analysis: {
    overall_improvement: number, // theta change per week
    consistency_score: number, // 0-1
    predicted_next_score: number
  }
}
```

---

## MODUL 2: "THE HEART" - GAMIFIKASI & USER ENGAGEMENT

### 1. Gamification User Flow

```
[Daily Login] → [Check Quests] → [Complete Activities] → [Earn Points/XP] → [Level Up/Badges] → [Check Leaderboard] → [Challenge Friends] → [Redeem Rewards]
```

### 2. Database Schema for Gamification

```sql
-- Daily Quests
CREATE TABLE daily_quests (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quest_type VARCHAR(50) NOT NULL, -- 'practice_questions', 'complete_tryout', 'study_time', 'streak_maintain'
    target_value INTEGER NOT NULL, -- e.g., 10 questions, 60 minutes
    reward_points INTEGER NOT NULL,
    reward_xp INTEGER NOT NULL,
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Quest Progress
CREATE TABLE user_quest_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    quest_id UUID REFERENCES daily_quests(id),
    date DATE NOT NULL,
    current_progress INTEGER DEFAULT 0,
    target_value INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    points_earned INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, quest_id, date)
);

-- Achievements & Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    badge_icon_url TEXT,
    badge_color VARCHAR(7), -- Hex color
    category VARCHAR(50), -- 'performance', 'consistency', 'social', 'milestone'
    
    -- Unlock Conditions
    condition_type VARCHAR(50), -- 'total_score', 'streak_days', 'tryouts_completed', 'study_hours'
    condition_value INTEGER,
    condition_subtest VARCHAR(50), -- Optional: specific to subtest
    
    rarity VARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
    reward_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT TRUE, -- User can choose to display or hide
    
    UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    leaderboard_type VARCHAR(50), -- 'all_time_points', 'weekly_points', 'monthly_score', 'tryout_specific'
    period_identifier VARCHAR(50), -- '2024-W01', '2024-01', 'tryout_123'
    score_value INTEGER NOT NULL,
    rank_position INTEGER,
    
    -- Additional Context
    tryout_package_id UUID, -- For tryout-specific leaderboards
    calculated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, leaderboard_type, period_identifier)
);

-- Friend Challenges
CREATE TABLE friend_challenges (
    id UUID PRIMARY KEY,
    challenger_id UUID REFERENCES users(id),
    challenged_id UUID REFERENCES users(id),
    tryout_package_id UUID REFERENCES tryout_packages(id),
    
    challenge_message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed'
    
    -- Results
    challenger_session_id UUID,
    challenged_session_id UUID,
    winner_id UUID,
    
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Points & Rewards System
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    transaction_type VARCHAR(50), -- 'earned_quest', 'earned_tryout', 'spent_reward', 'bonus_streak'
    points_change INTEGER, -- Positive for earning, negative for spending
    description TEXT,
    
    -- Context
    quest_id UUID,
    session_id UUID,
    achievement_id UUID,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards Catalog
CREATE TABLE rewards (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reward_type VARCHAR(50), -- 'discount', 'premium_access', 'exclusive_tryout', 'avatar_unlock'
    cost_points INTEGER NOT NULL,
    
    -- Reward Details
    discount_percentage INTEGER, -- For discount rewards
    access_duration_days INTEGER, -- For premium access
    unlock_content_id UUID, -- For content unlocks
    
    stock_quantity INTEGER, -- -1 for unlimited
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Reward Redemptions
CREATE TABLE user_reward_redemptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    reward_id UUID REFERENCES rewards(id),
    points_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP, -- For time-limited rewards
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP
);

-- User Streaks
CREATE TABLE user_streaks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    streak_type VARCHAR(50), -- 'daily_login', 'daily_practice', 'weekly_tryout'
    current_count INTEGER DEFAULT 0,
    best_count INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Streak Rewards
    next_milestone INTEGER, -- Next streak count for bonus
    milestone_reward_points INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, streak_type)
);
```

### 3. Gamification API Endpoints

#### Daily Quests & Streaks
```typescript
// Get user's daily quests
GET /api/v1/gamification/quests/daily
Response: {
  date: string,
  quests: [
    {
      id: string,
      title: string,
      description: string,
      quest_type: string,
      current_progress: number,
      target_value: number,
      is_completed: boolean,
      reward_points: number,
      reward_xp: number,
      difficulty_level: string
    }
  ],
  streak_info: {
    current_streak: number,
    longest_streak: number,
    next_milestone: number,
    milestone_bonus_points: number
  }
}

// Update quest progress
POST /api/v1/gamification/quests/{questId}/progress
Body: {
  activity_data: {
    questions_answered?: number,
    study_minutes?: number,
    tryout_completed?: boolean
  }
}
Response: {
  quest_completed: boolean,
  points_earned: number,
  xp_earned: number,
  new_level?: number,
  achievements_unlocked?: string[]
}
```

#### Leaderboards
```typescript
// Get leaderboard data
GET /api/v1/gamification/leaderboard
Query: ?type=weekly_points&limit=50&user_context=true
Response: {
  leaderboard_type: string,
  period: string,
  entries: [
    {
      rank: number,
      user: {
        id: string,
        username: string,
        avatar_url: string,
        level: number
      },
      score: number,
      change_from_last_period?: number
    }
  ],
  user_position?: {
    rank: number,
    score: number,
    points_to_next_rank: number
  }
}

// Get multiple leaderboard types
GET /api/v1/gamification/leaderboards/summary
Response: {
  all_time: { user_rank: number, total_participants: number },
  weekly: { user_rank: number, total_participants: number },
  monthly: { user_rank: number, total_participants: number }
}
```

#### Achievements & Badges
```typescript
// Get user achievements
GET /api/v1/gamification/achievements
Response: {
  unlocked: [
    {
      id: string,
      title: string,
      description: string,
      badge_icon_url: string,
      badge_color: string,
      rarity: string,
      unlocked_at: string,
      is_displayed: boolean
    }
  ],
  available: [
    {
      id: string,
      title: string,
      description: string,
      badge_icon_url: string,
      progress_percentage: number,
      condition_description: string
    }
  ],
  stats: {
    total_unlocked: number,
    total_available: number,
    rarity_breakdown: {
      common: number,
      rare: number,
      epic: number,
      legendary: number
    }
  }
}
```

#### Friend Challenges
```typescript
// Send challenge to friend
POST /api/v1/gamification/challenges
Body: {
  challenged_user_id: string,
  tryout_package_id: string,
  message?: string
}
Response: {
  challenge_id: string,
  expires_at: string
}

// Get user's challenges
GET /api/v1/gamification/challenges
Query: ?status=pending&type=received
Response: {
  sent_challenges: [
    {
      id: string,
      challenged_user: { username: string, avatar_url: string },
      tryout_package: { title: string },
      status: string,
      created_at: string,
      expires_at: string
    }
  ],
  received_challenges: [
    {
      id: string,
      challenger_user: { username: string, avatar_url: string },
      tryout_package: { title: string },
      message: string,
      created_at: string,
      expires_at: string
    }
  ]
}

// Accept/Decline challenge
POST /api/v1/gamification/challenges/{challengeId}/respond
Body: {
  action: 'accept' | 'decline'
}
Response: {
  success: boolean,
  tryout_session_id?: string // If accepted
}
```

#### Points & Rewards
```typescript
// Get user points summary
GET /api/v1/gamification/points
Response: {
  current_balance: number,
  lifetime_earned: number,
  lifetime_spent: number,
  recent_transactions: [
    {
      id: string,
      type: string,
      points_change: number,
      description: string,
      created_at: string
    }
  ]
}

// Get rewards catalog
GET /api/v1/gamification/rewards
Response: {
  categories: [
    {
      type: string,
      rewards: [
        {
          id: string,
          title: string,
          description: string,
          cost_points: number,
          stock_quantity: number,
          is_affordable: boolean
        }
      ]
    }
  ]
}

// Redeem reward
POST /api/v1/gamification/rewards/{rewardId}/redeem
Response: {
  success: boolean,
  redemption_id: string,
  new_balance: number,
  reward_details: {
    expires_at?: string,
    usage_instructions: string
  }
}
```

### 4. Advanced Gamification Features

#### Smart Quest Generation
```typescript
// Algorithm untuk generate daily quests berdasarkan user behavior
interface QuestGenerationParams {
  user_id: string;
  current_level: number;
  weak_subtests: string[];
  recent_activity: {
    avg_daily_questions: number;
    avg_study_time_minutes: number;
    last_tryout_days_ago: number;
  };
  streak_status: {
    current_streak: number;
    risk_of_breaking: boolean;
  };
}

// Dynamic difficulty adjustment
interface DifficultyAdjustment {
  base_target: number;
  user_performance_multiplier: number; // 0.8 - 1.5
  streak_bonus_multiplier: number; // 1.0 - 1.3
  final_target: number;
}
```

#### Social Features Integration
```typescript
// Study groups & collaborative challenges
interface StudyGroup {
  id: string;
  name: string;
  members: User[];
  group_challenges: {
    total_questions_goal: number;
    current_progress: number;
    reward_per_member: number;
  };
  leaderboard: {
    member_id: string;
    contribution_score: number;
  }[];
}
```

---

## TECHNICAL IMPLEMENTATION NOTES

### 1. IRT Calculation Service
```typescript
// Microservice untuk IRT calculations
class IRTCalculationService {
  async calculateUserAbility(
    userAnswers: UserAnswer[],
    questionParameters: QuestionIRTParams[]
  ): Promise<IRTResult> {
    // Implementation of Newton-Raphson method
    // Return theta, standard error, scaled score
  }
  
  async calibrateQuestionParameters(
    questionId: string,
    responseData: ResponsePattern[]
  ): Promise<QuestionIRTParams> {
    // Implementation of EM algorithm for item calibration
  }
}
```

### 2. Real-time Gamification Engine
```typescript
// Event-driven system untuk real-time updates
class GamificationEngine {
  async processUserActivity(event: UserActivityEvent): Promise<GamificationUpdate> {
    // Check quest progress
    // Update streaks
    // Check achievement unlocks
    // Calculate points/XP
    // Update leaderboards
    // Send real-time notifications
  }
}
```

### 3. Performance Optimization
- **Caching Strategy**: Redis untuk leaderboards, user stats, quest progress
- **Database Indexing**: Composite indexes untuk query optimization
- **Background Jobs**: Queue system untuk heavy calculations (IRT, analytics)
- **CDN**: Static assets (images, videos) delivery

### 4. Analytics & Monitoring
- **User Behavior Tracking**: Detailed analytics untuk engagement metrics
- **A/B Testing Framework**: Untuk optimize gamification features
- **Performance Monitoring**: Response times, error rates, user satisfaction

Dengan arsitektur ini, SNBTKU akan menjadi platform tryout online yang tidak hanya akurat dalam penilaian (dengan IRT) tetapi juga sangat engaging dengan sistem gamifikasi yang komprehensif.