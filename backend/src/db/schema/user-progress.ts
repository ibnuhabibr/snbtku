import { pgTable, uuid, varchar, timestamp, integer, decimal, jsonb, index, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Reference
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // Overall Progress Metrics
  total_tryouts_taken: integer('total_tryouts_taken').default(0),
  total_tryouts_completed: integer('total_tryouts_completed').default(0),
  total_questions_answered: integer('total_questions_answered').default(0),
  total_correct_answers: integer('total_correct_answers').default(0),
  
  // Overall Performance
  overall_accuracy: decimal('overall_accuracy', { precision: 5, scale: 2 }).default('0'), // Percentage
  average_score: decimal('average_score', { precision: 6, scale: 2 }).default('0'),
  best_score: decimal('best_score', { precision: 6, scale: 2 }).default('0'),
  latest_score: decimal('latest_score', { precision: 6, scale: 2 }).default('0'),
  
  // IRT-based Ability Estimates
  current_ability: decimal('current_ability', { precision: 8, scale: 4 }).default('0'), // Overall θ (theta)
  ability_standard_error: decimal('ability_standard_error', { precision: 8, scale: 4 }).default('1'),
  ability_confidence_interval: jsonb('ability_confidence_interval').default({ lower: -2, upper: 2 }),
  
  // Subject-wise Abilities (for UTBK SNBT)
  subject_abilities: jsonb('subject_abilities').default({
    matematika: { ability: 0, standard_error: 1, attempts: 0, correct: 0 },
    fisika: { ability: 0, standard_error: 1, attempts: 0, correct: 0 },
    kimia: { ability: 0, standard_error: 1, attempts: 0, correct: 0 },
    biologi: { ability: 0, standard_error: 1, attempts: 0, correct: 0 },
    bahasa_indonesia: { ability: 0, standard_error: 1, attempts: 0, correct: 0 },
    bahasa_inggris: { ability: 0, standard_error: 1, attempts: 0, correct: 0 }
  }),
  
  // Performance Trends
  performance_trend: varchar('performance_trend', { length: 20 }).default('stable'), // 'improving', 'stable', 'declining'
  trend_strength: decimal('trend_strength', { precision: 5, scale: 2 }).default('0'), // 0-1 confidence
  
  // Learning Analytics
  learning_velocity: decimal('learning_velocity', { precision: 8, scale: 4 }).default('0'), // Rate of improvement
  consistency_score: decimal('consistency_score', { precision: 5, scale: 2 }).default('0'), // 0-1 score
  
  // Time-based Analytics
  total_study_time_minutes: integer('total_study_time_minutes').default(0),
  average_session_duration: decimal('average_session_duration', { precision: 8, scale: 2 }).default('0'), // minutes
  average_time_per_question: decimal('average_time_per_question', { precision: 6, scale: 2 }).default('0'), // seconds
  
  // Difficulty Progression
  comfortable_difficulty_range: jsonb('comfortable_difficulty_range').default({ min: -1, max: 1 }),
  challenge_level_preference: varchar('challenge_level_preference', { length: 20 }).default('balanced'), // 'easy', 'balanced', 'challenging'
  
  // Strengths and Weaknesses
  strongest_subjects: jsonb('strongest_subjects').default([]), // Array of subjects ordered by performance
  weakest_subjects: jsonb('weakest_subjects').default([]), // Array of subjects that need improvement
  improvement_areas: jsonb('improvement_areas').default([]), // Specific topics/skills to work on
  
  // Goal Tracking
  target_score: integer('target_score'),
  target_university: varchar('target_university', { length: 255 }),
  target_major: varchar('target_major', { length: 255 }),
  target_exam_date: timestamp('target_exam_date'),
  
  // Progress Towards Goals
  goal_progress_percentage: decimal('goal_progress_percentage', { precision: 5, scale: 2 }).default('0'),
  estimated_readiness: decimal('estimated_readiness', { precision: 5, scale: 2 }).default('0'), // 0-100%
  days_until_target: integer('days_until_target'),
  
  // Streaks and Engagement
  current_streak_days: integer('current_streak_days').default(0),
  longest_streak_days: integer('longest_streak_days').default(0),
  last_activity_date: timestamp('last_activity_date'),
  
  // Weekly/Monthly Progress
  weekly_progress: jsonb('weekly_progress').default({
    tryouts_completed: 0,
    questions_answered: 0,
    accuracy: 0,
    study_time_minutes: 0
  }),
  monthly_progress: jsonb('monthly_progress').default({
    tryouts_completed: 0,
    questions_answered: 0,
    accuracy: 0,
    study_time_minutes: 0
  }),
  
  // Comparative Performance
  percentile_rank_overall: decimal('percentile_rank_overall', { precision: 5, scale: 2 }).default('50'),
  percentile_rank_by_grade: decimal('percentile_rank_by_grade', { precision: 5, scale: 2 }).default('50'),
  percentile_rank_by_target: decimal('percentile_rank_by_target', { precision: 5, scale: 2 }).default('50'),
  
  // Adaptive Learning Data
  optimal_question_difficulty: decimal('optimal_question_difficulty', { precision: 8, scale: 4 }).default('0'),
  recommended_study_intensity: varchar('recommended_study_intensity', { length: 20 }).default('moderate'), // 'light', 'moderate', 'intensive'
  
  // Behavioral Patterns
  preferred_study_times: jsonb('preferred_study_times').default([]), // Array of hour ranges
  average_session_questions: decimal('average_session_questions', { precision: 6, scale: 2 }).default('0'),
  completion_rate: decimal('completion_rate', { precision: 5, scale: 2 }).default('100'), // % of started tryouts completed
  
  // Prediction Models
  predicted_utbk_score: integer('predicted_utbk_score'),
  prediction_confidence: decimal('prediction_confidence', { precision: 5, scale: 2 }), // 0-100%
  prediction_last_updated: timestamp('prediction_last_updated'),
  
  // Milestones and Achievements
  milestones_achieved: jsonb('milestones_achieved').default([]), // Array of milestone IDs
  next_milestone: jsonb('next_milestone'), // Next milestone info
  
  // Data Quality
  data_reliability_score: decimal('data_reliability_score', { precision: 5, scale: 2 }).default('100'), // 0-100%
  last_major_update: timestamp('last_major_update'),
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('user_progress_user_id_idx').on(table.user_id),
    currentAbilityIdx: index('user_progress_current_ability_idx').on(table.current_ability),
    overallAccuracyIdx: index('user_progress_overall_accuracy_idx').on(table.overall_accuracy),
    averageScoreIdx: index('user_progress_average_score_idx').on(table.average_score),
    percentileRankIdx: index('user_progress_percentile_rank_idx').on(table.percentile_rank_overall),
    lastActivityIdx: index('user_progress_last_activity_idx').on(table.last_activity_date),
    targetExamDateIdx: index('user_progress_target_exam_date_idx').on(table.target_exam_date),
    updatedAtIdx: index('user_progress_updated_at_idx').on(table.updated_at),
  };
});

// Zod schemas for validation
const abilityConfidenceIntervalSchema = z.object({
  lower: z.number(),
  upper: z.number(),
});

const subjectAbilitySchema = z.object({
  ability: z.number(),
  standard_error: z.number().min(0),
  attempts: z.number().int().min(0),
  correct: z.number().int().min(0),
});

const subjectAbilitiesSchema = z.object({
  matematika: subjectAbilitySchema.optional(),
  fisika: subjectAbilitySchema.optional(),
  kimia: subjectAbilitySchema.optional(),
  biologi: subjectAbilitySchema.optional(),
  bahasa_indonesia: subjectAbilitySchema.optional(),
  bahasa_inggris: subjectAbilitySchema.optional(),
});

const difficultyRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

const progressPeriodSchema = z.object({
  tryouts_completed: z.number().int().min(0),
  questions_answered: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
  study_time_minutes: z.number().int().min(0),
});

const milestoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  achieved_at: z.string(),
  value: z.number().optional(),
});

const nextMilestoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  target_value: z.number(),
  current_value: z.number(),
  progress_percentage: z.number().min(0).max(100),
});

export const insertUserProgressSchema = createInsertSchema(userProgress, {
  user_id: z.string().uuid(),
  total_tryouts_taken: z.number().int().min(0).default(0),
  total_tryouts_completed: z.number().int().min(0).default(0),
  total_questions_answered: z.number().int().min(0).default(0),
  total_correct_answers: z.number().int().min(0).default(0),
  overall_accuracy: z.number().min(0).max(100).default(0),
  current_ability: z.number().min(-4).max(4).default(0),
  ability_standard_error: z.number().min(0).default(1),
  ability_confidence_interval: abilityConfidenceIntervalSchema.optional(),
  subject_abilities: subjectAbilitiesSchema.optional(),
  performance_trend: z.enum(['improving', 'stable', 'declining']).default('stable'),
  trend_strength: z.number().min(0).max(1).default(0),
  challenge_level_preference: z.enum(['easy', 'balanced', 'challenging']).default('balanced'),
  comfortable_difficulty_range: difficultyRangeSchema.optional(),
  strongest_subjects: z.array(z.string()).default([]),
  weakest_subjects: z.array(z.string()).default([]),
  improvement_areas: z.array(z.string()).default([]),
  target_score: z.number().int().min(0).max(1000).optional(),
  target_university: z.string().optional(),
  target_major: z.string().optional(),
  target_exam_date: z.date().optional(),
  weekly_progress: progressPeriodSchema.optional(),
  monthly_progress: progressPeriodSchema.optional(),
  recommended_study_intensity: z.enum(['light', 'moderate', 'intensive']).default('moderate'),
  preferred_study_times: z.array(z.number().int().min(0).max(23)).default([]),
  milestones_achieved: z.array(milestoneSchema).default([]),
  next_milestone: nextMilestoneSchema.optional(),
});

export const selectUserProgressSchema = createSelectSchema(userProgress);

export const updateUserProgressSchema = insertUserProgressSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

// Schema for dashboard summary
export const progressSummarySchema = selectUserProgressSchema.pick({
  user_id: true,
  total_tryouts_completed: true,
  overall_accuracy: true,
  average_score: true,
  best_score: true,
  current_ability: true,
  performance_trend: true,
  current_streak_days: true,
  percentile_rank_overall: true,
  goal_progress_percentage: true,
  estimated_readiness: true,
  updated_at: true,
});

// Schema for detailed analytics
export const detailedAnalyticsSchema = selectUserProgressSchema.pick({
  user_id: true,
  subject_abilities: true,
  strongest_subjects: true,
  weakest_subjects: true,
  improvement_areas: true,
  learning_velocity: true,
  consistency_score: true,
  comfortable_difficulty_range: true,
  weekly_progress: true,
  monthly_progress: true,
  predicted_utbk_score: true,
  prediction_confidence: true,
});

// Schema for goal tracking
export const goalTrackingSchema = selectUserProgressSchema.pick({
  user_id: true,
  target_score: true,
  target_university: true,
  target_major: true,
  target_exam_date: true,
  goal_progress_percentage: true,
  estimated_readiness: true,
  days_until_target: true,
  predicted_utbk_score: true,
  prediction_confidence: true,
});

// Type exports
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type UpdateUserProgress = z.infer<typeof updateUserProgressSchema>;
export type ProgressSummary = z.infer<typeof progressSummarySchema>;
export type DetailedAnalytics = z.infer<typeof detailedAnalyticsSchema>;
export type GoalTracking = z.infer<typeof goalTrackingSchema>;
export type SubjectAbility = z.infer<typeof subjectAbilitySchema>;
export type SubjectAbilities = z.infer<typeof subjectAbilitiesSchema>;
export type ProgressPeriod = z.infer<typeof progressPeriodSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type NextMilestone = z.infer<typeof nextMilestoneSchema>;