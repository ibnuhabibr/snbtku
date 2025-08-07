# SNBTKU Platform Architecture Extended - Modul 3 & 4

## Overview
Melanjutkan pengembangan platform SNBTKU dengan fokus pada UX, aksesibilitas, komunitas, dan skalabilitas untuk menciptakan ekosistem belajar yang komprehensif.

---

## MODUL 3: "THE BODY" - UX, TEKNOLOGI, & AKSESIBILITAS

### 1. Dedicated Mobile Apps (iOS & Android)

#### Arsitektur Mobile Application

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Native/Flutter)                 │
│  ├── Screens (Dashboard, Tryout, Analysis, Community)      │
│  ├── Components (Reusable UI Components)                   │
│  └── Navigation (Stack, Tab, Drawer Navigation)            │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                      │
│  ├── State Management (Redux/Zustand)                      │
│  ├── Services (API, Offline, Sync)                         │
│  └── Utils (Helpers, Validators, Formatters)               │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── API Client (HTTP/GraphQL)                             │
│  ├── Local Database (SQLite/Realm)                         │
│  ├── Cache Management (AsyncStorage)                       │
│  └── File System (Downloaded Content)                      │
├─────────────────────────────────────────────────────────────┤
│  Platform Services                                         │
│  ├── Push Notifications (FCM/APNS)                         │
│  ├── Biometric Auth (TouchID/FaceID)                       │
│  ├── Background Sync                                       │
│  └── Analytics & Crash Reporting                           │
└─────────────────────────────────────────────────────────────┘
```

#### Core Mobile Features

```typescript
// Mobile-specific features
interface MobileAppFeatures {
  // Core Learning Features
  offline_tryouts: {
    download_packages: boolean;
    offline_practice: boolean;
    sync_on_reconnect: boolean;
  };
  
  // Enhanced UX
  biometric_login: boolean;
  dark_mode: boolean;
  adaptive_ui: boolean; // Tablet vs Phone layouts
  gesture_navigation: boolean;
  
  // Performance
  lazy_loading: boolean;
  image_caching: boolean;
  background_sync: boolean;
  offline_first: boolean;
  
  // Notifications
  push_notifications: boolean;
  local_notifications: boolean;
  smart_reminders: boolean;
  
  // Accessibility
  screen_reader_support: boolean;
  high_contrast_mode: boolean;
  font_scaling: boolean;
  voice_commands: boolean;
}
```

#### Mobile User Flow

```
[App Launch] → [Biometric Auth] → [Sync Check] → [Dashboard]
     ↓
[Download Content] → [Offline Mode] → [Practice/Tryout] → [Queue Sync]
     ↓
[Online Reconnect] → [Background Sync] → [Update Progress] → [Notifications]
```

### 2. Mode Offline Implementation

#### Offline Architecture

```typescript
// Offline Data Structure
interface OfflineDataStructure {
  downloaded_packages: {
    package_id: string;
    title: string;
    questions: Question[];
    materials: Material[];
    download_date: string;
    expiry_date: string;
    size_mb: number;
  }[];
  
  pending_sync: {
    user_answers: UserAnswer[];
    progress_updates: ProgressUpdate[];
    gamification_events: GamificationEvent[];
    analytics_events: AnalyticsEvent[];
  };
  
  cached_data: {
    user_profile: UserProfile;
    achievements: Achievement[];
    leaderboard_snapshot: LeaderboardEntry[];
    last_sync: string;
  };
}

// Sync Queue Management
interface SyncQueueItem {
  id: string;
  type: 'answer' | 'progress' | 'gamification' | 'analytics';
  data: any;
  timestamp: string;
  retry_count: number;
  priority: 'high' | 'medium' | 'low';
}
```

#### Database Schema untuk Offline

```sql
-- Mobile Local Database (SQLite)

-- Downloaded Packages
CREATE TABLE offline_packages (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL, -- Serialized questions & materials
    download_date INTEGER NOT NULL,
    expiry_date INTEGER NOT NULL,
    size_bytes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1
);

-- Offline Sessions
CREATE TABLE offline_sessions (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    answers_json TEXT, -- Serialized answers
    progress_json TEXT, -- Serialized progress
    is_synced BOOLEAN DEFAULT 0
);

-- Sync Queue
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,
    data_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    is_synced BOOLEAN DEFAULT 0
);

-- Cached User Data
CREATE TABLE cached_data (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    cached_at INTEGER NOT NULL,
    expires_at INTEGER
);
```

#### Offline Sync Service

```typescript
class OfflineSyncService {
  // Download content for offline use
  async downloadPackage(packageId: string): Promise<DownloadResult> {
    const package = await this.apiClient.getPackageContent(packageId);
    const compressedContent = await this.compressContent(package);
    
    await this.localDB.storeOfflinePackage({
      package_id: packageId,
      content: compressedContent,
      download_date: Date.now(),
      expiry_date: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    return { success: true, size_mb: compressedContent.size / 1024 / 1024 };
  }
  
  // Queue data for sync when online
  async queueForSync(type: SyncType, data: any, priority: Priority = 'medium'): Promise<void> {
    await this.localDB.addToSyncQueue({
      id: generateUUID(),
      type,
      data,
      timestamp: Date.now(),
      priority,
      retry_count: 0
    });
  }
  
  // Process sync queue when online
  async processSyncQueue(): Promise<SyncResult> {
    const queueItems = await this.localDB.getPendingSyncItems();
    const results = [];
    
    for (const item of queueItems.sort(this.prioritySort)) {
      try {
        await this.syncItem(item);
        await this.localDB.markAsSynced(item.id);
        results.push({ id: item.id, status: 'success' });
      } catch (error) {
        await this.localDB.incrementRetryCount(item.id);
        results.push({ id: item.id, status: 'failed', error });
      }
    }
    
    return { synced: results.filter(r => r.status === 'success').length, failed: results.filter(r => r.status === 'failed').length };
  }
}
```

### 3. Notifikasi Cerdas (Push Notifications)

#### Smart Notification System

```typescript
// Notification Types & Triggers
interface NotificationConfig {
  study_reminders: {
    daily_practice: {
      enabled: boolean;
      time: string; // "19:00"
      message_templates: string[];
    };
    streak_warning: {
      enabled: boolean;
      hours_before_break: number; // 2 hours before streak breaks
      escalation_messages: string[];
    };
    tryout_schedule: {
      enabled: boolean;
      reminder_times: number[]; // [24, 2, 0.5] hours before
      custom_message?: string;
    };
  };
  
  social_notifications: {
    friend_challenges: boolean;
    leaderboard_updates: boolean;
    achievement_unlocks: boolean;
    community_mentions: boolean;
  };
  
  personalized_recommendations: {
    weak_topic_practice: boolean;
    new_content_alerts: boolean;
    performance_insights: boolean;
  };
}

// Smart Notification Engine
class SmartNotificationEngine {
  async schedulePersonalizedReminders(userId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    const studyPattern = await this.analyzeStudyPattern(userId);
    const preferences = await this.getNotificationPreferences(userId);
    
    // Schedule based on user's optimal study time
    if (preferences.study_reminders.daily_practice.enabled) {
      const optimalTime = this.calculateOptimalStudyTime(studyPattern);
      await this.scheduleRecurringNotification({
        userId,
        type: 'daily_practice',
        time: optimalTime,
        message: this.generatePersonalizedMessage(userProfile, 'practice')
      });
    }
    
    // Streak protection notifications
    if (preferences.study_reminders.streak_warning.enabled) {
      const streakData = await this.getUserStreak(userId);
      if (streakData.current_streak > 3) { // Only for users with established streaks
        await this.scheduleStreakProtectionNotification(userId, streakData);
      }
    }
  }
  
  async sendContextualNotification(userId: string, context: NotificationContext): Promise<void> {
    const userState = await this.getUserCurrentState(userId);
    const message = await this.generateContextualMessage(context, userState);
    
    await this.sendPushNotification({
      userId,
      title: message.title,
      body: message.body,
      data: message.actionData,
      priority: context.priority
    });
  }
}
```

#### Database Schema untuk Notifications

```sql
-- Notification Templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'study_reminder', 'streak_warning', 'challenge', etc.
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    action_type VARCHAR(50), -- 'open_app', 'start_practice', 'view_challenge'
    action_data JSONB,
    
    -- Personalization
    variables JSONB, -- Available template variables
    conditions JSONB, -- When to use this template
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Notification Preferences
CREATE TABLE user_notification_preferences (
    user_id UUID REFERENCES users(id) PRIMARY KEY,
    
    -- Study Reminders
    daily_practice_enabled BOOLEAN DEFAULT TRUE,
    daily_practice_time TIME DEFAULT '19:00',
    streak_warning_enabled BOOLEAN DEFAULT TRUE,
    streak_warning_hours INTEGER DEFAULT 2,
    tryout_reminders_enabled BOOLEAN DEFAULT TRUE,
    
    -- Social Notifications
    friend_challenges_enabled BOOLEAN DEFAULT TRUE,
    leaderboard_updates_enabled BOOLEAN DEFAULT TRUE,
    achievement_notifications_enabled BOOLEAN DEFAULT TRUE,
    community_notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Personalized Content
    recommendation_notifications_enabled BOOLEAN DEFAULT TRUE,
    performance_insights_enabled BOOLEAN DEFAULT TRUE,
    
    -- Delivery Preferences
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    max_daily_notifications INTEGER DEFAULT 5,
    
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification History
CREATE TABLE notification_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    template_id UUID REFERENCES notification_templates(id),
    
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    action_type VARCHAR(50),
    action_data JSONB,
    
    -- Delivery Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'clicked', 'failed'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    -- Context
    trigger_event VARCHAR(50), -- What triggered this notification
    device_token TEXT,
    platform VARCHAR(20), -- 'ios', 'android', 'web'
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled Notifications
CREATE TABLE scheduled_notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    template_id UUID REFERENCES notification_templates(id),
    
    scheduled_for TIMESTAMP NOT NULL,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'custom'
    recurrence_data JSONB, -- Cron-like pattern or custom rules
    
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMP,
    next_send_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Integrasi Payment Gateway

#### Payment Architecture

```typescript
// Payment Gateway Integration
interface PaymentGatewayConfig {
  providers: {
    midtrans: {
      server_key: string;
      client_key: string;
      environment: 'sandbox' | 'production';
      enabled_payments: ('credit_card' | 'bank_transfer' | 'echannel' | 'gopay' | 'shopeepay' | 'qris')[];
    };
    xendit: {
      secret_key: string;
      public_key: string;
      webhook_token: string;
      enabled_payments: ('va' | 'ewallet' | 'qr_code' | 'credit_card')[];
    };
  };
  
  fallback_provider: 'midtrans' | 'xendit';
  webhook_endpoints: {
    midtrans: string;
    xendit: string;
  };
}

// Payment Service
class PaymentService {
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.selectOptimalProvider(paymentRequest.method);
    
    try {
      const payment = await provider.createPayment({
        amount: paymentRequest.amount,
        currency: 'IDR',
        payment_method: paymentRequest.method,
        customer: paymentRequest.customer,
        items: paymentRequest.items,
        callback_url: `${process.env.BASE_URL}/payment/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment/success`
      });
      
      // Store payment record
      await this.storePaymentRecord({
        payment_id: payment.id,
        user_id: paymentRequest.user_id,
        amount: paymentRequest.amount,
        status: 'pending',
        provider: provider.name,
        payment_method: paymentRequest.method
      });
      
      return {
        payment_id: payment.id,
        payment_url: payment.payment_url,
        qr_code: payment.qr_code,
        va_number: payment.va_number,
        expires_at: payment.expires_at
      };
    } catch (error) {
      // Fallback to secondary provider
      return this.createPaymentWithFallback(paymentRequest);
    }
  }
  
  async handleWebhook(provider: string, payload: any): Promise<WebhookResponse> {
    const signature = this.validateWebhookSignature(provider, payload);
    if (!signature.valid) {
      throw new Error('Invalid webhook signature');
    }
    
    const paymentUpdate = this.parseWebhookPayload(provider, payload);
    await this.updatePaymentStatus(paymentUpdate);
    
    // Trigger post-payment actions
    if (paymentUpdate.status === 'success') {
      await this.activatePremiumFeatures(paymentUpdate.user_id, paymentUpdate.items);
      await this.sendPaymentConfirmationNotification(paymentUpdate.user_id);
    }
    
    return { status: 'processed' };
  }
}
```

#### Database Schema untuk Payment

```sql
-- Premium Packages
CREATE TABLE premium_packages (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_idr INTEGER NOT NULL,
    duration_days INTEGER NOT NULL, -- 30, 90, 365
    
    -- Features Included
    features JSONB NOT NULL, -- {"unlimited_tryouts": true, "parent_dashboard": true, "priority_support": true}
    
    -- Pricing Strategy
    discount_percentage INTEGER DEFAULT 0,
    original_price_idr INTEGER,
    
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES premium_packages(id),
    
    -- Payment Details
    amount_idr INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'bank_transfer', 'gopay', 'shopeepay', 'qris'
    provider VARCHAR(50) NOT NULL, -- 'midtrans', 'xendit'
    external_payment_id VARCHAR(255) NOT NULL,
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'success', 'failed', 'expired', 'cancelled'
    payment_url TEXT,
    qr_code_url TEXT,
    va_number VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Webhook Data
    webhook_data JSONB,
    last_webhook_at TIMESTAMP
);

-- User Premium Subscriptions
CREATE TABLE user_premium_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES premium_packages(id),
    transaction_id UUID REFERENCES payment_transactions(id),
    
    -- Subscription Period
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    auto_renew BOOLEAN DEFAULT FALSE,
    
    -- Features Access
    features_granted JSONB NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, package_id, starts_at)
);

-- Payment Methods Configuration
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY,
    method_code VARCHAR(50) NOT NULL, -- 'gopay', 'shopeepay', 'bca_va', 'bni_va', 'qris'
    display_name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    
    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    min_amount_idr INTEGER DEFAULT 10000,
    max_amount_idr INTEGER DEFAULT 50000000,
    processing_fee_percentage DECIMAL(5,2) DEFAULT 0,
    processing_fee_fixed_idr INTEGER DEFAULT 0,
    
    -- UI Configuration
    icon_url TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Payment API Endpoints

```typescript
// Create payment
POST /api/v1/payments/create
Body: {
  package_id: string,
  payment_method: string,
  return_url?: string
}
Response: {
  payment_id: string,
  payment_url?: string,
  qr_code?: string,
  va_number?: string,
  expires_at: string,
  instructions: {
    title: string,
    steps: string[]
  }
}

// Check payment status
GET /api/v1/payments/{paymentId}/status
Response: {
  payment_id: string,
  status: string,
  amount: number,
  paid_at?: string,
  expires_at: string
}

// Get available payment methods
GET /api/v1/payments/methods
Query: ?amount=50000
Response: {
  methods: [
    {
      code: string,
      name: string,
      icon_url: string,
      description: string,
      processing_fee: {
        percentage: number,
        fixed_amount: number,
        total_fee: number
      }
    }
  ]
}

// Webhook endpoints
POST /api/v1/payments/webhook/midtrans
POST /api/v1/payments/webhook/xendit
```

---

## MODUL 4: "THE SOUL" - KOMUNITAS & EKSPANSI

### 1. Komunitas Belajar Terintegrasi

#### Community Architecture

```typescript
// Community Structure
interface CommunityStructure {
  forums: {
    general_discussion: Forum;
    subject_specific: {
      [subtest: string]: Forum;
    };
    study_groups: Forum;
    q_and_a: Forum;
  };
  
  study_groups: {
    public_groups: StudyGroup[];
    private_groups: StudyGroup[];
    school_groups: StudyGroup[];
  };
  
  mentorship: {
    peer_mentors: User[];
    expert_tutors: User[];
    mentorship_sessions: Session[];
  };
}

// Study Group Features
interface StudyGroup {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'school';
  
  // Membership
  members: GroupMember[];
  max_members: number;
  join_requirements: {
    min_level?: number;
    target_university?: string;
    invitation_only?: boolean;
  };
  
  // Activities
  group_challenges: Challenge[];
  study_sessions: StudySession[];
  shared_resources: Resource[];
  
  // Gamification
  group_points: number;
  group_achievements: Achievement[];
  leaderboard: GroupLeaderboard;
}
```

#### Database Schema untuk Community

```sql
-- Forums
CREATE TABLE forums (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'general', 'subject', 'study_group', 'qa'
    subtest_type VARCHAR(50), -- For subject-specific forums
    
    -- Permissions
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'premium', 'private'
    posting_permission VARCHAR(20) DEFAULT 'all', -- 'all', 'premium', 'moderator'
    
    -- Moderation
    moderator_ids UUID[],
    auto_moderation_enabled BOOLEAN DEFAULT TRUE,
    
    -- Stats
    total_threads INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Forum Threads
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY,
    forum_id UUID REFERENCES forums(id),
    author_id UUID REFERENCES users(id),
    
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    
    -- Thread Type
    thread_type VARCHAR(20) DEFAULT 'discussion', -- 'discussion', 'question', 'announcement', 'resource'
    tags VARCHAR(50)[],
    
    -- Status
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_solved BOOLEAN DEFAULT FALSE, -- For question threads
    
    -- Engagement
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    moderation_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Forum Posts (Replies)
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY,
    thread_id UUID REFERENCES forum_threads(id),
    author_id UUID REFERENCES users(id),
    parent_post_id UUID REFERENCES forum_posts(id), -- For nested replies
    
    content TEXT NOT NULL,
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    is_best_answer BOOLEAN DEFAULT FALSE, -- For Q&A threads
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    is_edited BOOLEAN DEFAULT FALSE,
    edit_history JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Study Groups
CREATE TABLE study_groups (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Group Settings
    type VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'school'
    max_members INTEGER DEFAULT 50,
    join_approval_required BOOLEAN DEFAULT FALSE,
    
    -- Requirements
    min_level INTEGER,
    target_university VARCHAR(255),
    target_major VARCHAR(255),
    
    -- Group Stats
    member_count INTEGER DEFAULT 0,
    total_group_points INTEGER DEFAULT 0,
    activity_score DECIMAL(5,2) DEFAULT 0,
    
    -- Ownership
    creator_id UUID REFERENCES users(id),
    moderator_ids UUID[],
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Study Group Members
CREATE TABLE study_group_members (
    id UUID PRIMARY KEY,
    group_id UUID REFERENCES study_groups(id),
    user_id UUID REFERENCES users(id),
    
    role VARCHAR(20) DEFAULT 'member', -- 'creator', 'moderator', 'member'
    
    -- Member Stats
    contribution_points INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    answers_provided INTEGER DEFAULT 0,
    resources_shared INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'banned'
    
    joined_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(group_id, user_id)
);

-- Study Sessions (Group Activities)
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY,
    group_id UUID REFERENCES study_groups(id),
    organizer_id UUID REFERENCES users(id),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Session Details
    session_type VARCHAR(20) NOT NULL, -- 'group_study', 'tryout_together', 'discussion', 'tutoring'
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER,
    
    -- Virtual Meeting
    meeting_url TEXT,
    meeting_password VARCHAR(50),
    
    -- Resources
    materials JSONB, -- Links to study materials
    tryout_package_id UUID, -- For group tryout sessions
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'ongoing', 'completed', 'cancelled'
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Session Participants
CREATE TABLE session_participants (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES study_sessions(id),
    user_id UUID REFERENCES users(id),
    
    -- Participation
    rsvp_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'attending', 'not_attending'
    attended BOOLEAN DEFAULT FALSE,
    participation_score INTEGER, -- 0-100 based on engagement
    
    -- Feedback
    session_rating INTEGER, -- 1-5 stars
    feedback TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(session_id, user_id)
);

-- Community Reputation System
CREATE TABLE user_community_reputation (
    user_id UUID REFERENCES users(id) PRIMARY KEY,
    
    -- Reputation Scores
    total_reputation INTEGER DEFAULT 0,
    helpful_answers INTEGER DEFAULT 0,
    quality_questions INTEGER DEFAULT 0,
    resource_contributions INTEGER DEFAULT 0,
    mentorship_score INTEGER DEFAULT 0,
    
    -- Community Roles
    roles VARCHAR(20)[] DEFAULT ARRAY['member'], -- 'member', 'contributor', 'mentor', 'moderator', 'expert'
    badges VARCHAR(50)[], -- Community-specific badges
    
    -- Activity Stats
    posts_count INTEGER DEFAULT 0,
    threads_count INTEGER DEFAULT 0,
    likes_received INTEGER DEFAULT 0,
    best_answers INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Ekspansi Konten (Scalability)

#### Scalable Content Architecture

```typescript
// Unified Exam System
interface ExamSystem {
  exam_types: {
    snbt: SNBTExam;
    ujian_mandiri: {
      [university: string]: UjianMandiriExam;
    };
    simak_ui: SIMAKExam;
    utul_ugm: UTULExam;
    // Future: SBMPTN, STAN, CPNS, etc.
  };
  
  content_management: {
    question_bank: UnifiedQuestionBank;
    material_library: MaterialLibrary;
    video_courses: VideoCourseLibrary;
  };
  
  analytics_engine: {
    cross_exam_analysis: boolean;
    university_prediction: boolean;
    adaptive_learning: boolean;
  };
}

// Content Versioning & Management
interface ContentVersion {
  id: string;
  content_type: 'question' | 'material' | 'video' | 'explanation';
  version_number: string;
  changes: ContentChange[];
  approved_by: string;
  published_at: string;
  is_active: boolean;
}
```

#### Database Schema untuk Scalable Content

```sql
-- Exam Types (Scalable for multiple exams)
CREATE TABLE exam_types (
    id UUID PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL, -- 'SNBT', 'SIMAK_UI', 'UTUL_UGM', 'UM_ITB'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Exam Configuration
    subtest_config JSONB NOT NULL, -- Different subtests for each exam type
    scoring_method VARCHAR(50) DEFAULT 'IRT', -- 'IRT', 'raw_score', 'weighted'
    duration_config JSONB, -- Different timing rules
    
    -- University Association
    associated_universities VARCHAR(255)[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    launch_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- University Programs (for prediction)
CREATE TABLE university_programs (
    id UUID PRIMARY KEY,
    university_name VARCHAR(255) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255),
    
    -- Admission Requirements
    exam_types_accepted VARCHAR(20)[], -- ['SNBT', 'SIMAK_UI']
    min_score_requirements JSONB, -- {"overall": 600, "PU": 550, "PPU": 580}
    
    -- Historical Data
    passing_grades JSONB, -- Historical passing grades by year
    acceptance_rate DECIMAL(5,2), -- Percentage
    total_quota INTEGER,
    
    -- Program Details
    accreditation VARCHAR(5),
    tuition_fee_range JSONB, -- {"min": 5000000, "max": 15000000}
    
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Unified Question Bank (supports multiple exam types)
CREATE TABLE unified_questions (
    id UUID PRIMARY KEY,
    exam_type_id UUID REFERENCES exam_types(id),
    subtest_type VARCHAR(50) NOT NULL,
    
    -- Question Content
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    options JSONB NOT NULL,
    correct_answer VARCHAR(1) NOT NULL,
    
    -- Multi-language Support
    translations JSONB, -- {"en": {...}, "id": {...}}
    
    -- Enhanced Metadata
    topic_hierarchy JSONB, -- {"subject": "Math", "chapter": "Algebra", "subtopic": "Linear Equations"}
    difficulty_level VARCHAR(20),
    cognitive_level VARCHAR(20),
    bloom_taxonomy VARCHAR(20), -- 'remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'
    
    -- IRT Parameters (can vary by exam type)
    irt_parameters JSONB, -- {"SNBT": {"a": 1.2, "b": 0.5, "c": 0.2}, "SIMAK_UI": {...}}
    
    -- Content Management
    version_number VARCHAR(20) DEFAULT '1.0',
    content_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published', 'archived'
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    
    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Categories (hierarchical)
CREATE TABLE content_categories (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES content_categories(id),
    exam_type_id UUID REFERENCES exam_types(id),
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_type VARCHAR(50), -- 'subject', 'chapter', 'topic', 'subtopic'
    
    -- Hierarchy Path (for efficient queries)
    path VARCHAR(500), -- e.g., "Math/Algebra/Linear Equations"
    level INTEGER, -- Depth in hierarchy
    
    -- Metadata
    icon_url TEXT,
    color_code VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Material Library (supports multiple formats)
CREATE TABLE material_library (
    id UUID PRIMARY KEY,
    category_id UUID REFERENCES content_categories(id),
    
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Content
    content_type VARCHAR(50) NOT NULL, -- 'text', 'video', 'interactive', 'pdf', 'presentation'
    content_url TEXT,
    content_data JSONB, -- For interactive content
    
    -- Metadata
    duration_minutes INTEGER, -- For videos
    difficulty_level VARCHAR(20),
    prerequisites VARCHAR(255)[],
    learning_objectives TEXT[],
    
    -- Access Control
    access_level VARCHAR(20) DEFAULT 'free', -- 'free', 'premium', 'exclusive'
    
    -- Engagement
    view_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,
    
    -- Content Management
    author_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'published',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Dashboard Orang Tua

#### Parent Dashboard Features

```typescript
// Parent Dashboard Interface
interface ParentDashboard {
  student_overview: {
    basic_info: StudentInfo;
    current_performance: PerformanceSummary;
    study_habits: StudyHabitsAnalysis;
    goal_progress: GoalProgress;
  };
  
  detailed_analytics: {
    score_trends: ScoreTrendData[];
    subject_breakdown: SubjectPerformance[];
    time_management: TimeAnalysis;
    comparison_data: PeerComparison;
  };
  
  engagement_tools: {
    goal_setting: GoalSetting;
    reward_system: ParentRewards;
    communication: ParentStudentChat;
    progress_notifications: NotificationSettings;
  };
  
  reports: {
    weekly_summary: WeeklyReport;
    monthly_detailed: MonthlyReport;
    custom_reports: CustomReport[];
  };
}

// Parent-Student Relationship
interface ParentStudentRelation {
  parent_id: string;
  student_id: string;
  relationship_type: 'parent' | 'guardian' | 'tutor';
  permissions: {
    view_scores: boolean;
    view_study_time: boolean;
    set_goals: boolean;
    receive_notifications: boolean;
    access_detailed_analytics: boolean;
  };
  verification_status: 'pending' | 'verified' | 'rejected';
}
```

#### Database Schema untuk Parent Dashboard

```sql
-- Parent Accounts
CREATE TABLE parent_accounts (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Subscription
    subscription_status VARCHAR(20) DEFAULT 'trial', -- 'trial', 'active', 'expired', 'cancelled'
    subscription_expires_at TIMESTAMP,
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{
        "weekly_reports": true,
        "goal_achievements": true,
        "performance_alerts": true,
        "study_reminders": false
    }',
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    language VARCHAR(5) DEFAULT 'id',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Parent-Student Relationships
CREATE TABLE parent_student_relationships (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES parent_accounts(id),
    student_id UUID REFERENCES users(id),
    
    -- Relationship Details
    relationship_type VARCHAR(20) NOT NULL, -- 'parent', 'guardian', 'tutor'
    
    -- Verification
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_code VARCHAR(10),
    verification_expires_at TIMESTAMP,
    verified_at TIMESTAMP,
    
    -- Permissions
    permissions JSONB DEFAULT '{
        "view_scores": true,
        "view_study_time": true,
        "view_detailed_analytics": true,
        "set_goals": true,
        "receive_notifications": true,
        "access_reports": true
    }',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(parent_id, student_id)
);

-- Parent Goals for Students
CREATE TABLE parent_student_goals (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES parent_accounts(id),
    student_id UUID REFERENCES users(id),
    
    -- Goal Details
    goal_type VARCHAR(50) NOT NULL, -- 'target_score', 'study_hours', 'tryout_frequency', 'university_target'
    goal_title VARCHAR(255) NOT NULL,
    goal_description TEXT,
    
    -- Target Values
    target_value JSONB NOT NULL, -- Flexible structure for different goal types
    current_progress JSONB,
    
    -- Timeline
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Rewards
    reward_description TEXT,
    reward_claimed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Parent Reports
CREATE TABLE parent_reports (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES parent_accounts(id),
    student_id UUID REFERENCES users(id),
    
    -- Report Details
    report_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'custom', 'goal_progress'
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    
    -- Report Data
    report_data JSONB NOT NULL, -- Contains all analytics and insights
    
    -- Metadata
    generated_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP
);

-- Parent Notifications
CREATE TABLE parent_notifications (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES parent_accounts(id),
    student_id UUID REFERENCES users(id),
    
    -- Notification Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'goal_achievement', 'performance_alert', 'weekly_report', 'study_reminder'
    
    -- Data
    data JSONB, -- Additional context data
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Portal Kerjasama B2B

#### B2B Portal Architecture

```typescript
// B2B Organization Structure
interface B2BOrganization {
  id: string;
  type: 'school' | 'tutoring_center' | 'educational_institution';
  
  basic_info: {
    name: string;
    address: string;
    contact_person: string;
    email: string;
    phone: string;
  };
  
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    student_quota: number;
    features_included: string[];
    billing_cycle: 'monthly' | 'yearly';
  };
  
  management_features: {
    student_management: boolean;
    custom_tryouts: boolean;
    analytics_dashboard: boolean;
    bulk_operations: boolean;
    api_access: boolean;
  };
}

// B2B Analytics Dashboard
interface B2BAnalytics {
  organization_overview: {
    total_students: number;
    active_students: number;
    average_performance: number;
    improvement_rate: number;
  };
  
  class_performance: {
    class_id: string;
    class_name: string;
    student_count: number;
    average_score: number;
    top_performers: Student[];
    struggling_students: Student[];
  }[];
  
  subject_analysis: {
    subject: string;
    class_average: number;
    national_average: number;
    improvement_areas: string[];
  }[];
  
  custom_reports: {
    report_templates: ReportTemplate[];
    scheduled_reports: ScheduledReport[];
  };
}
```

#### Database Schema untuk B2B Portal

```sql
-- B2B Organizations
CREATE TABLE b2b_organizations (
    id UUID PRIMARY KEY,
    
    -- Organization Details
    name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(50) NOT NULL, -- 'school', 'tutoring_center', 'educational_institution'
    
    -- Contact Information
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Legal Information
    tax_id VARCHAR(50),
    business_license VARCHAR(100),
    
    -- Subscription
    subscription_plan VARCHAR(20) DEFAULT 'basic', -- 'basic', 'premium', 'enterprise'
    student_quota INTEGER DEFAULT 50,
    subscription_starts_at TIMESTAMP,
    subscription_expires_at TIMESTAMP,
    
    -- Features
    features_enabled JSONB DEFAULT '{
        "student_management": true,
        "basic_analytics": true,
        "custom_tryouts": false,
        "advanced_analytics": false,
        "api_access": false,
        "white_label": false
    }',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'trial', 'active', 'suspended', 'cancelled'
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- B2B Organization Admins
CREATE TABLE b2b_organization_admins (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES b2b_organizations(id),
    
    -- Admin Details
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Permissions
    role VARCHAR(20) DEFAULT 'admin', -- 'super_admin', 'admin', 'teacher', 'viewer'
    permissions JSONB DEFAULT '{
        "manage_students": true,
        "create_tryouts": true,
        "view_analytics": true,
        "manage_classes": true,
        "export_data": true
    }',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- B2B Classes/Groups
CREATE TABLE b2b_classes (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES b2b_organizations(id),
    
    -- Class Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_level VARCHAR(20), -- '12', 'alumni', 'gap_year'
    academic_year VARCHAR(10), -- '2024/2025'
    
    -- Class Settings
    max_students INTEGER DEFAULT 40,
    current_student_count INTEGER DEFAULT 0,
    
    -- Assigned Teachers
    teacher_ids UUID[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- B2B Student Enrollments
CREATE TABLE b2b_student_enrollments (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES b2b_organizations(id),
    class_id UUID REFERENCES b2b_classes(id),
    student_id UUID REFERENCES users(id),
    
    -- Enrollment Details
    student_identifier VARCHAR(50), -- School's internal student ID
    enrollment_date DATE NOT NULL,
    
    -- Academic Info
    target_university VARCHAR(255),
    target_major VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'graduated', 'transferred'
    
    -- Performance Tracking
    initial_assessment_score INTEGER,
    current_average_score INTEGER,
    improvement_percentage DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(organization_id, student_id)
);

-- B2B Custom Tryouts
CREATE TABLE b2b_custom_tryouts (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES b2b_organizations(id),
    created_by UUID REFERENCES b2b_organization_admins(id),
    
    -- Tryout Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Configuration
    exam_type_id UUID REFERENCES exam_types(id),
    question_selection_method VARCHAR(20) DEFAULT 'auto', -- 'auto', 'manual', 'mixed'
    difficulty_distribution JSONB,
    topic_focus JSONB, -- Specific topics to emphasize
    
    -- Scheduling
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    duration_minutes INTEGER NOT NULL,
    
    -- Access Control
    target_classes UUID[], -- Which classes can access
    access_code VARCHAR(20),
    
    -- Settings
    show_results_immediately BOOLEAN DEFAULT FALSE,
    allow_review BOOLEAN DEFAULT TRUE,
    randomize_questions BOOLEAN DEFAULT TRUE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'completed', 'cancelled'
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- B2B Analytics Reports
CREATE TABLE b2b_analytics_reports (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES b2b_organizations(id),
    generated_by UUID REFERENCES b2b_organization_admins(id),
    
    -- Report Configuration
    report_type VARCHAR(50) NOT NULL, -- 'class_performance', 'student_progress', 'subject_analysis', 'custom'
    report_name VARCHAR(255) NOT NULL,
    
    -- Filters
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    class_ids UUID[],
    student_ids UUID[],
    subject_filters VARCHAR(50)[],
    
    -- Report Data
    report_data JSONB NOT NULL,
    
    -- Metadata
    generated_at TIMESTAMP DEFAULT NOW(),
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_config JSONB, -- For recurring reports
    
    -- Access
    shared_with UUID[], -- Admin IDs who can access this report
    is_public BOOLEAN DEFAULT FALSE
);
```

#### B2B API Endpoints

```typescript
// Organization Management
GET /api/v1/b2b/organization/dashboard
Response: {
  organization: OrganizationInfo,
  statistics: {
    total_students: number,
    active_students: number,
    total_classes: number,
    this_month_tryouts: number
  },
  recent_activity: Activity[]
}

// Student Management
GET /api/v1/b2b/students
Query: ?class_id=uuid&status=active&page=1&limit=50
Response: {
  students: [
    {
      id: string,
      name: string,
      email: string,
      class_name: string,
      current_score: number,
      last_activity: string,
      performance_trend: 'improving' | 'stable' | 'declining'
    }
  ],
  pagination: PaginationInfo
}

POST /api/v1/b2b/students/bulk-invite
Body: {
  class_id: string,
  students: [
    {
      name: string,
      email: string,
      student_identifier?: string
    }
  ]
}
Response: {
  invited: number,
  failed: {
    email: string,
    reason: string
  }[]
}

// Custom Tryouts
POST /api/v1/b2b/tryouts/create
Body: {
  title: string,
  description: string,
  exam_type_id: string,
  duration_minutes: number,
  target_classes: string[],
  question_config: {
    selection_method: string,
    difficulty_distribution: object,
    topic_focus?: object
  },
  schedule: {
    start_time: string,
    end_time: string
  }
}
Response: {
  tryout_id: string,
  access_code: string,
  preview_url: string
}

// Analytics
GET /api/v1/b2b/analytics/class-performance
Query: ?class_id=uuid&date_range=30d
Response: {
  class_info: ClassInfo,
  performance_metrics: {
    average_score: number,
    improvement_rate: number,
    completion_rate: number,
    top_performers: Student[],
    struggling_students: Student[]
  },
  subject_breakdown: SubjectPerformance[],
  trends: TrendData[]
}

POST /api/v1/b2b/reports/generate
Body: {
  report_type: string,
  filters: {
    date_range: { start: string, end: string },
    class_ids?: string[],
    student_ids?: string[]
  },
  format: 'json' | 'pdf' | 'excel'
}
Response: {
  report_id: string,
  download_url?: string,
  estimated_completion: string
}
```

---

## REKOMENDASI TECH STACK

### Frontend Stack

```typescript
// Web Application
const webTechStack = {
  framework: "Next.js 14", // React-based, SSR/SSG, App Router
  reasoning: "SEO optimization, performance, developer experience",
  
  ui_library: "React 18",
  styling: "Tailwind CSS + Shadcn/ui",
  state_management: "Zustand + React Query",
  
  additional_libraries: [
    "Framer Motion", // Animations
    "React Hook Form", // Form handling
    "Zod", // Schema validation
    "Chart.js/Recharts", // Data visualization
    "Socket.io-client" // Real-time features
  ]
};

// Mobile Application
const mobileTechStack = {
  framework: "React Native 0.73+",
  reasoning: "Code sharing with web, mature ecosystem, performance",
  
  navigation: "React Navigation 6",
  state_management: "Zustand + React Query",
  local_database: "SQLite + Drizzle ORM",
  
  additional_libraries: [
    "React Native Reanimated", // Smooth animations
    "React Native Gesture Handler", // Touch interactions
    "React Native MMKV", // Fast key-value storage
    "React Native Push Notification", // Local notifications
    "@react-native-firebase/messaging" // Push notifications
  ]
};
```

### Backend Stack

```typescript
const backendTechStack = {
  runtime: "Node.js 20 LTS",
  framework: "Fastify", // High performance, TypeScript-first
  reasoning: "Better performance than Express, excellent TypeScript support",
  
  database: {
    primary: "PostgreSQL 16",
    reasoning: "ACID compliance, JSON support, excellent performance for analytics",
    
    orm: "Drizzle ORM",
    reasoning: "Type-safe, lightweight, excellent performance",
    
    caching: "Redis 7",
    reasoning: "Session storage, caching, real-time features"
  },
  
  authentication: "Supabase Auth",
  file_storage: "Supabase Storage / AWS S3",
  
  additional_services: [
    "Bull Queue", // Background jobs
    "Socket.io", // Real-time communication
    "Nodemailer", // Email services
    "Sharp", // Image processing
    "Joi/Zod", // Input validation
    "Winston", // Logging
    "Helmet", // Security headers
    "Rate Limiter Flexible" // Rate limiting
  ]
};
```

### Infrastructure & DevOps

```typescript
const infrastructureStack = {
  cloud_provider: "AWS / Google Cloud Platform",
  reasoning: "Scalability, reliability, comprehensive services",
  
  containerization: "Docker + Docker Compose",
  orchestration: "Kubernetes (for production scale)",
  
  ci_cd: "GitHub Actions",
  monitoring: "Grafana + Prometheus",
  error_tracking: "Sentry",
  
  cdn: "CloudFlare",
  load_balancer: "AWS ALB / GCP Load Balancer"
};
```

### Analytics & Monitoring

```typescript
const analyticsStack = {
  web_analytics: "Google Analytics 4 + Mixpanel",
  reasoning: "Comprehensive user behavior tracking",
  
  application_monitoring: "New Relic / DataDog",
  log_aggregation: "ELK Stack (Elasticsearch, Logstash, Kibana)",
  
  real_time_analytics: "Apache Kafka + ClickHouse",
  reasoning: "High-performance analytics for educational data"
};
```

### Payment & Communication

```typescript
const externalServices = {
  payment_gateways: [
    "Midtrans", // Primary for Indonesian market
    "Xendit" // Backup and additional payment methods
  ],
  
  communication: {
    email: "SendGrid / AWS SES",
    sms: "Twilio / AWS SNS",
    push_notifications: "Firebase Cloud Messaging",
    video_calls: "Agora.io / Zoom SDK" // For tutoring sessions
  },
  
  content_delivery: {
    video_streaming: "AWS CloudFront + S3",
    image_optimization: "Cloudinary",
    file_storage: "AWS S3 / Google Cloud Storage"
  }
};
```

---

## INTEGRASI ANTAR MODUL

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATED PLATFORM FLOW                │
├─────────────────────────────────────────────────────────────┤
│  Mobile Apps ←→ Web App ←→ Parent Dashboard ←→ B2B Portal   │
│       ↓              ↓              ↓              ↓        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              API Gateway (Fastify)                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│       ↓              ↓              ↓              ↓        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Core Services                           │ │
│  │  • Tryout Engine    • Gamification   • Community       │ │
│  │  • Analytics        • Payment        • Notifications   │ │
│  │  • Content Mgmt     • User Mgmt      • Reporting       │ │
│  └─────────────────────────────────────────────────────────┘ │
│       ↓              ↓              ↓              ↓        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Data Layer                                 │ │
│  │  PostgreSQL  •  Redis  •  S3/Storage  •  Search Engine │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Security Implementation

```typescript
const securityMeasures = {
  authentication: {
    method: "JWT + Refresh Tokens",
    mfa: "TOTP (Google Authenticator)",
    social_login: "Google, Facebook OAuth"
  },
  
  authorization: {
    model: "RBAC (Role-Based Access Control)",
    permissions: "Granular permissions per feature",
    api_security: "Rate limiting + API keys for B2B"
  },
  
  data_protection: {
    encryption: "AES-256 for sensitive data",
    database: "Encrypted at rest + in transit",
    pii_handling: "GDPR compliant data processing",
    backup_encryption: "Encrypted backups with key rotation"
  },
  
  infrastructure: {
    network: "VPC with private subnets",
    ssl: "TLS 1.3 with HSTS",
    waf: "Web Application Firewall",
    ddos_protection: "CloudFlare DDoS protection"
  }
};
```

---

## ROADMAP IMPLEMENTASI

### Phase 1: Foundation (Bulan 1-3)
- Setup infrastructure dan CI/CD
- Implementasi core authentication & user management
- Basic tryout engine dengan IRT
- Mobile app MVP (offline capability)
- Payment gateway integration

### Phase 2: Core Features (Bulan 4-6)
- Advanced analytics dashboard
- Gamification system lengkap
- Community features (forum, study groups)
- Parent dashboard MVP
- Smart notifications system

### Phase 3: Expansion (Bulan 7-9)
- B2B portal dan custom tryouts
- Multi-exam support (Ujian Mandiri)
- Advanced AI recommendations
- Video content integration
- Advanced reporting system

### Phase 4: Scale & Optimize (Bulan 10-12)
- Performance optimization
- Advanced analytics dengan ML
- White-label solutions
- API marketplace
- International expansion preparation

---

## KESIMPULAN

Platform SNBTKU dengan arsitektur 4 modul ini dirancang untuk:

1. **Skalabilitas**: Mendukung pertumbuhan dari ribuan hingga jutaan pengguna
2. **Fleksibilitas**: Mudah ditambahkan fitur dan jenis ujian baru
3. **Performa**: Optimized untuk pengalaman pengguna yang cepat dan responsif
4. **Keamanan**: Implementasi security best practices di semua layer
5. **Monetisasi**: Multiple revenue streams (premium, B2B, partnerships)

Dengan tech stack modern dan arsitektur yang solid, platform ini siap untuk menjadi leader di pasar EdTech Indonesia dan berpotensi ekspansi regional.