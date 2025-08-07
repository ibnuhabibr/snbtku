import { pgTable, uuid, varchar, timestamp, integer, decimal, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { questions } from './questions';

export const questionStats = pgTable('question_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Reference
  question_id: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }).unique(),
  
  // Basic Usage Statistics
  total_attempts: integer('total_attempts').default(0),
  correct_attempts: integer('correct_attempts').default(0),
  incorrect_attempts: integer('incorrect_attempts').default(0),
  skipped_attempts: integer('skipped_attempts').default(0),
  
  // Performance Metrics
  success_rate: decimal('success_rate', { precision: 5, scale: 2 }).default('0'), // Percentage
  average_time_seconds: decimal('average_time_seconds', { precision: 8, scale: 2 }).default('0'),
  median_time_seconds: decimal('median_time_seconds', { precision: 8, scale: 2 }).default('0'),
  
  // Time Distribution
  fastest_time_seconds: integer('fastest_time_seconds'),
  slowest_time_seconds: integer('slowest_time_seconds'),
  time_percentiles: jsonb('time_percentiles').default({
    p25: 0,
    p50: 0,
    p75: 0,
    p90: 0,
    p95: 0
  }),
  
  // IRT Parameters (Updated based on responses)
  current_difficulty: decimal('current_difficulty', { precision: 10, scale: 6 }).default('0'), // b parameter
  current_discrimination: decimal('current_discrimination', { precision: 10, scale: 6 }).default('1'), // a parameter
  current_guessing: decimal('current_guessing', { precision: 10, scale: 6 }).default('0.25'), // c parameter
  
  // IRT Parameter Confidence
  difficulty_standard_error: decimal('difficulty_standard_error', { precision: 10, scale: 6 }),
  discrimination_standard_error: decimal('discrimination_standard_error', { precision: 10, scale: 6 }),
  guessing_standard_error: decimal('guessing_standard_error', { precision: 10, scale: 6 }),
  
  // Parameter Estimation Quality
  parameter_estimation_iterations: integer('parameter_estimation_iterations').default(0),
  parameter_convergence_achieved: boolean('parameter_convergence_achieved').default(false),
  log_likelihood: decimal('log_likelihood', { precision: 12, scale: 6 }),
  
  // Response Pattern Analysis
  option_distribution: jsonb('option_distribution').default({}), // Distribution of selected options
  distractor_analysis: jsonb('distractor_analysis').default({}), // Analysis of wrong options
  
  // Ability Level Performance
  performance_by_ability: jsonb('performance_by_ability').default({
    low: { attempts: 0, correct: 0, avg_time: 0 },
    medium: { attempts: 0, correct: 0, avg_time: 0 },
    high: { attempts: 0, correct: 0, avg_time: 0 }
  }),
  
  // Demographic Performance
  performance_by_grade: jsonb('performance_by_grade').default({}),
  performance_by_school_type: jsonb('performance_by_school_type').default({}),
  
  // Quality Indicators
  discrimination_quality: varchar('discrimination_quality', { length: 20 }), // 'excellent', 'good', 'fair', 'poor'
  difficulty_appropriateness: varchar('difficulty_appropriateness', { length: 20 }), // 'too_easy', 'appropriate', 'too_hard'
  
  // Flagging and Review
  needs_review: boolean('needs_review').default(false),
  review_reasons: jsonb('review_reasons').default([]), // Array of reasons why question needs review
  last_reviewed_at: timestamp('last_reviewed_at'),
  reviewed_by: uuid('reviewed_by'), // Admin who reviewed
  
  // Trend Analysis
  performance_trend: varchar('performance_trend', { length: 20 }), // 'improving', 'stable', 'declining'
  trend_confidence: decimal('trend_confidence', { precision: 5, scale: 2 }), // 0-1 confidence in trend
  
  // Usage Context
  used_in_packages: jsonb('used_in_packages').default([]), // Array of package IDs where this question is used
  usage_frequency_rank: integer('usage_frequency_rank'), // Rank among all questions by usage
  
  // Cheating Detection
  suspicious_response_count: integer('suspicious_response_count').default(0),
  anomaly_score: decimal('anomaly_score', { precision: 5, scale: 2 }).default('0'), // 0-1 score
  
  // Timestamps
  last_calculated_at: timestamp('last_calculated_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    questionIdIdx: index('question_stats_question_id_idx').on(table.question_id),
    successRateIdx: index('question_stats_success_rate_idx').on(table.success_rate),
    difficultyIdx: index('question_stats_difficulty_idx').on(table.current_difficulty),
    discriminationIdx: index('question_stats_discrimination_idx').on(table.current_discrimination),
    totalAttemptsIdx: index('question_stats_total_attempts_idx').on(table.total_attempts),
    needsReviewIdx: index('question_stats_needs_review_idx').on(table.needs_review),
    lastCalculatedIdx: index('question_stats_last_calculated_idx').on(table.last_calculated_at),
    usageRankIdx: index('question_stats_usage_rank_idx').on(table.usage_frequency_rank),
  };
});

// Zod schemas for validation
const timePercentilesSchema = z.object({
  p25: z.number().min(0),
  p50: z.number().min(0),
  p75: z.number().min(0),
  p90: z.number().min(0),
  p95: z.number().min(0),
});

const performanceByAbilitySchema = z.object({
  low: z.object({
    attempts: z.number().int().min(0),
    correct: z.number().int().min(0),
    avg_time: z.number().min(0),
  }),
  medium: z.object({
    attempts: z.number().int().min(0),
    correct: z.number().int().min(0),
    avg_time: z.number().min(0),
  }),
  high: z.object({
    attempts: z.number().int().min(0),
    correct: z.number().int().min(0),
    avg_time: z.number().min(0),
  }),
});

const reviewReasonsSchema = z.array(z.object({
  reason: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  detected_at: z.string(),
  details: z.record(z.any()).optional(),
}));

export const insertQuestionStatsSchema = createInsertSchema(questionStats, {
  question_id: z.string().uuid(),
  total_attempts: z.number().int().min(0).default(0),
  correct_attempts: z.number().int().min(0).default(0),
  incorrect_attempts: z.number().int().min(0).default(0),
  skipped_attempts: z.number().int().min(0).default(0),
  success_rate: z.number().min(0).max(100).default(0),
  average_time_seconds: z.number().min(0).default(0),
  median_time_seconds: z.number().min(0).default(0),
  time_percentiles: timePercentilesSchema.optional(),
  current_difficulty: z.number().min(-4).max(4).default(0),
  current_discrimination: z.number().min(0.1).max(3).default(1),
  current_guessing: z.number().min(0).max(1).default(0.25),
  performance_by_ability: performanceByAbilitySchema.optional(),
  discrimination_quality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  difficulty_appropriateness: z.enum(['too_easy', 'appropriate', 'too_hard']).optional(),
  performance_trend: z.enum(['improving', 'stable', 'declining']).optional(),
  trend_confidence: z.number().min(0).max(1).optional(),
  review_reasons: reviewReasonsSchema.default([]),
  anomaly_score: z.number().min(0).max(1).default(0),
});

export const selectQuestionStatsSchema = createSelectSchema(questionStats);

export const updateQuestionStatsSchema = insertQuestionStatsSchema.partial().omit({
  id: true,
  question_id: true,
  created_at: true,
  updated_at: true,
});

// Schema for IRT parameters only
export const irtParametersSchema = selectQuestionStatsSchema.pick({
  question_id: true,
  current_difficulty: true,
  current_discrimination: true,
  current_guessing: true,
  difficulty_standard_error: true,
  discrimination_standard_error: true,
  guessing_standard_error: true,
  parameter_convergence_achieved: true,
  last_calculated_at: true,
});

// Schema for performance summary
export const performanceSummarySchema = selectQuestionStatsSchema.pick({
  question_id: true,
  total_attempts: true,
  correct_attempts: true,
  success_rate: true,
  average_time_seconds: true,
  median_time_seconds: true,
  discrimination_quality: true,
  difficulty_appropriateness: true,
  performance_trend: true,
  last_calculated_at: true,
});

// Schema for quality analysis
export const qualityAnalysisSchema = selectQuestionStatsSchema.pick({
  question_id: true,
  discrimination_quality: true,
  difficulty_appropriateness: true,
  needs_review: true,
  review_reasons: true,
  anomaly_score: true,
  suspicious_response_count: true,
  parameter_convergence_achieved: true,
  usage_frequency_rank: true,
});

// Type exports
export type QuestionStats = typeof questionStats.$inferSelect;
export type NewQuestionStats = typeof questionStats.$inferInsert;
export type UpdateQuestionStats = z.infer<typeof updateQuestionStatsSchema>;
export type IrtParameters = z.infer<typeof irtParametersSchema>;
export type PerformanceSummary = z.infer<typeof performanceSummarySchema>;
export type QualityAnalysis = z.infer<typeof qualityAnalysisSchema>;
export type TimePercentiles = z.infer<typeof timePercentilesSchema>;
export type PerformanceByAbility = z.infer<typeof performanceByAbilitySchema>;
export type ReviewReasons = z.infer<typeof reviewReasonsSchema>;