import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { tryoutPackages } from './tryout-packages';

export const tryoutSessions = pgTable('tryout_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // References
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  package_id: uuid('package_id').notNull().references(() => tryoutPackages.id, { onDelete: 'cascade' }),
  
  // Session Status
  status: varchar('status', { length: 20 }).notNull().default('not_started'), // 'not_started', 'in_progress', 'paused', 'completed', 'abandoned', 'expired'
  
  // Timing Information
  started_at: timestamp('started_at'),
  completed_at: timestamp('completed_at'),
  paused_at: timestamp('paused_at'),
  expires_at: timestamp('expires_at'), // Session expiration time
  
  // Duration Tracking
  total_duration_seconds: integer('total_duration_seconds').default(0), // Actual time spent
  pause_duration_seconds: integer('pause_duration_seconds').default(0), // Time spent paused
  remaining_time_seconds: integer('remaining_time_seconds'), // Remaining time when paused
  
  // Question Management
  selected_questions: jsonb('selected_questions').notNull().default([]), // Array of question IDs in order
  current_question_index: integer('current_question_index').default(0),
  total_questions: integer('total_questions').notNull(),
  
  // Progress Tracking
  questions_answered: integer('questions_answered').default(0),
  questions_skipped: integer('questions_skipped').default(0),
  questions_flagged: jsonb('questions_flagged').default([]), // Array of question indices that are flagged for review
  
  // Scoring and Results
  raw_score: integer('raw_score').default(0), // Number of correct answers
  scaled_score: decimal('scaled_score', { precision: 6, scale: 2 }), // IRT-based scaled score
  percentile_rank: decimal('percentile_rank', { precision: 5, scale: 2 }), // Percentile among all users
  
  // Subject-wise Scores (for UTBK SNBT)
  subject_scores: jsonb('subject_scores').default({
    matematika: { raw: 0, scaled: 0, total_questions: 0 },
    fisika: { raw: 0, scaled: 0, total_questions: 0 },
    kimia: { raw: 0, scaled: 0, total_questions: 0 },
    biologi: { raw: 0, scaled: 0, total_questions: 0 },
    bahasa_indonesia: { raw: 0, scaled: 0, total_questions: 0 },
    bahasa_inggris: { raw: 0, scaled: 0, total_questions: 0 }
  }),
  
  // IRT Analysis Results
  estimated_ability: decimal('estimated_ability', { precision: 8, scale: 4 }), // Theta (θ) parameter
  ability_standard_error: decimal('ability_standard_error', { precision: 8, scale: 4 }), // Standard error of ability estimate
  
  // Performance Analytics
  average_time_per_question: decimal('average_time_per_question', { precision: 6, scale: 2 }), // In seconds
  fastest_question_time: integer('fastest_question_time'), // In seconds
  slowest_question_time: integer('slowest_question_time'), // In seconds
  
  // Behavioral Data
  total_clicks: integer('total_clicks').default(0),
  total_scrolls: integer('total_scrolls').default(0),
  window_focus_lost_count: integer('window_focus_lost_count').default(0),
  copy_paste_attempts: integer('copy_paste_attempts').default(0),
  
  // Session Configuration
  allow_review: boolean('allow_review').default(true), // Can review answers before submit
  allow_pause: boolean('allow_pause').default(true),
  show_timer: boolean('show_timer').default(true),
  randomize_questions: boolean('randomize_questions').default(false),
  randomize_options: boolean('randomize_options').default(false),
  
  // Proctoring and Security
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  screen_resolution: varchar('screen_resolution', { length: 20 }),
  browser_info: jsonb('browser_info'),
  suspicious_activities: jsonb('suspicious_activities').default([]), // Array of suspicious activity logs
  
  // Feedback and Notes
  user_feedback: text('user_feedback'),
  user_rating: integer('user_rating'), // 1-5 rating of the tryout
  admin_notes: text('admin_notes'),
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('tryout_sessions_user_id_idx').on(table.user_id),
    packageIdIdx: index('tryout_sessions_package_id_idx').on(table.package_id),
    statusIdx: index('tryout_sessions_status_idx').on(table.status),
    completedAtIdx: index('tryout_sessions_completed_at_idx').on(table.completed_at),
    userPackageIdx: index('tryout_sessions_user_package_idx').on(table.user_id, table.package_id),
    createdAtIdx: index('tryout_sessions_created_at_idx').on(table.created_at),
  };
});

// Zod schemas for validation
const subjectScoreSchema = z.object({
  raw: z.number().int().min(0),
  scaled: z.number().min(0),
  total_questions: z.number().int().min(0),
});

const subjectScoresSchema = z.object({
  matematika: subjectScoreSchema.optional(),
  fisika: subjectScoreSchema.optional(),
  kimia: subjectScoreSchema.optional(),
  biologi: subjectScoreSchema.optional(),
  bahasa_indonesia: subjectScoreSchema.optional(),
  bahasa_inggris: subjectScoreSchema.optional(),
});

const suspiciousActivitySchema = z.object({
  type: z.string(),
  timestamp: z.string(),
  details: z.record(z.any()).optional(),
});

export const insertTryoutSessionSchema = createInsertSchema(tryoutSessions, {
  user_id: z.string().uuid(),
  package_id: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'paused', 'completed', 'abandoned', 'expired']).default('not_started'),
  selected_questions: z.array(z.string().uuid()),
  total_questions: z.number().int().min(1),
  current_question_index: z.number().int().min(0).default(0),
  questions_flagged: z.array(z.number().int()).default([]),
  subject_scores: subjectScoresSchema.optional(),
  estimated_ability: z.number().optional(),
  ability_standard_error: z.number().optional(),
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
  screen_resolution: z.string().optional(),
  browser_info: z.record(z.any()).optional(),
  suspicious_activities: z.array(suspiciousActivitySchema).default([]),
  user_rating: z.number().int().min(1).max(5).optional(),
});

export const selectTryoutSessionSchema = createSelectSchema(tryoutSessions);

export const updateTryoutSessionSchema = insertTryoutSessionSchema.partial().omit({
  id: true,
  user_id: true,
  package_id: true,
  created_at: true,
  updated_at: true,
});

// Schema for session progress (for real-time updates)
export const sessionProgressSchema = selectTryoutSessionSchema.pick({
  id: true,
  status: true,
  current_question_index: true,
  questions_answered: true,
  questions_skipped: true,
  questions_flagged: true,
  remaining_time_seconds: true,
  total_duration_seconds: true,
  updated_at: true,
});

// Schema for session results
export const sessionResultsSchema = selectTryoutSessionSchema.pick({
  id: true,
  user_id: true,
  package_id: true,
  status: true,
  started_at: true,
  completed_at: true,
  total_duration_seconds: true,
  raw_score: true,
  scaled_score: true,
  percentile_rank: true,
  subject_scores: true,
  estimated_ability: true,
  ability_standard_error: true,
  average_time_per_question: true,
  total_questions: true,
  questions_answered: true,
  user_rating: true,
  created_at: true,
});

// Schema for session summary (for lists)
export const sessionSummarySchema = selectTryoutSessionSchema.pick({
  id: true,
  package_id: true,
  status: true,
  started_at: true,
  completed_at: true,
  raw_score: true,
  scaled_score: true,
  total_questions: true,
  questions_answered: true,
  created_at: true,
});

// Type exports
export type TryoutSession = typeof tryoutSessions.$inferSelect;
export type NewTryoutSession = typeof tryoutSessions.$inferInsert;
export type UpdateTryoutSession = z.infer<typeof updateTryoutSessionSchema>;
export type SessionProgress = z.infer<typeof sessionProgressSchema>;
export type SessionResults = z.infer<typeof sessionResultsSchema>;
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
export type SubjectScore = z.infer<typeof subjectScoreSchema>;
export type SubjectScores = z.infer<typeof subjectScoresSchema>;
export type SuspiciousActivity = z.infer<typeof suspiciousActivitySchema>;