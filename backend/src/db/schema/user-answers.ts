import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { questions } from './questions';
import { tryoutSessions } from './tryout-sessions';

export const userAnswers = pgTable('user_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // References
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  session_id: uuid('session_id').notNull().references(() => tryoutSessions.id, { onDelete: 'cascade' }),
  question_id: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  
  // Question Context
  question_order: integer('question_order').notNull(), // Order of question in the session (0-based)
  subject: varchar('subject', { length: 50 }).notNull(), // Denormalized for faster queries
  
  // Answer Information
  user_answer: text('user_answer'), // User's selected answer (option ID for MC, text for essay)
  correct_answer: text('correct_answer').notNull(), // Correct answer (denormalized for performance)
  is_correct: boolean('is_correct').notNull(),
  is_skipped: boolean('is_skipped').default(false),
  is_flagged: boolean('is_flagged').default(false), // Flagged for review
  
  // Timing Data
  time_spent_seconds: integer('time_spent_seconds').notNull(), // Time spent on this question
  answered_at: timestamp('answered_at').notNull(),
  first_interaction_at: timestamp('first_interaction_at'), // When user first interacted with question
  
  // Behavioral Data
  interaction_count: integer('interaction_count').default(0), // Number of times user interacted with question
  option_changes: integer('option_changes').default(0), // How many times user changed their answer
  
  // Answer Confidence and Patterns
  confidence_level: integer('confidence_level'), // 1-5 scale, if collected
  answer_pattern: jsonb('answer_pattern'), // Detailed interaction pattern
  
  // IRT Analysis Data
  question_difficulty: decimal('question_difficulty', { precision: 10, scale: 6 }), // Denormalized b parameter
  question_discrimination: decimal('question_discrimination', { precision: 10, scale: 6 }), // Denormalized a parameter
  question_guessing: decimal('question_guessing', { precision: 10, scale: 6 }), // Denormalized c parameter
  
  // Response Analysis
  response_probability: decimal('response_probability', { precision: 8, scale: 6 }), // P(θ) - probability of correct response given ability
  information_value: decimal('information_value', { precision: 8, scale: 6 }), // Information function value I(θ)
  
  // Answer Quality Metrics
  response_time_percentile: decimal('response_time_percentile', { precision: 5, scale: 2 }), // How fast compared to others
  difficulty_appropriateness: decimal('difficulty_appropriateness', { precision: 5, scale: 2 }), // How appropriate was this question difficulty
  
  // Contextual Information
  device_type: varchar('device_type', { length: 20 }), // 'desktop', 'tablet', 'mobile'
  browser_type: varchar('browser_type', { length: 50 }),
  
  // Quality Assurance
  is_suspicious: boolean('is_suspicious').default(false), // Flagged by anti-cheating system
  suspicious_reasons: jsonb('suspicious_reasons').default([]), // Array of reasons why flagged
  
  // Review and Feedback
  reviewed_by_user: boolean('reviewed_by_user').default(false), // Did user review this in results
  user_feedback: text('user_feedback'), // User's feedback on this question
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('user_answers_user_id_idx').on(table.user_id),
    sessionIdIdx: index('user_answers_session_id_idx').on(table.session_id),
    questionIdIdx: index('user_answers_question_id_idx').on(table.question_id),
    subjectIdx: index('user_answers_subject_idx').on(table.subject),
    isCorrectIdx: index('user_answers_is_correct_idx').on(table.is_correct),
    answeredAtIdx: index('user_answers_answered_at_idx').on(table.answered_at),
    sessionQuestionIdx: index('user_answers_session_question_idx').on(table.session_id, table.question_order),
    userSubjectIdx: index('user_answers_user_subject_idx').on(table.user_id, table.subject),
    isSuspiciousIdx: index('user_answers_is_suspicious_idx').on(table.is_suspicious),
  };
});

// Zod schemas for validation
const answerPatternSchema = z.object({
  interactions: z.array(z.object({
    timestamp: z.string(),
    action: z.string(), // 'select', 'deselect', 'hover', 'focus', etc.
    target: z.string(), // option ID or element
    duration: z.number().optional(),
  })).optional(),
  mouse_movements: z.number().optional(),
  keyboard_events: z.number().optional(),
  scroll_events: z.number().optional(),
});

const suspiciousReasonsSchema = z.array(z.object({
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  details: z.record(z.any()).optional(),
}));

export const insertUserAnswerSchema = createInsertSchema(userAnswers, {
  user_id: z.string().uuid(),
  session_id: z.string().uuid(),
  question_id: z.string().uuid(),
  question_order: z.number().int().min(0),
  subject: z.enum(['matematika', 'fisika', 'kimia', 'biologi', 'bahasa_indonesia', 'bahasa_inggris']),
  user_answer: z.string().optional(),
  correct_answer: z.string(),
  is_correct: z.boolean(),
  time_spent_seconds: z.number().int().min(0),
  answered_at: z.date(),
  first_interaction_at: z.date().optional(),
  interaction_count: z.number().int().min(0).default(0),
  option_changes: z.number().int().min(0).default(0),
  confidence_level: z.number().int().min(1).max(5).optional(),
  answer_pattern: answerPatternSchema.optional(),
  question_difficulty: z.number().optional(),
  question_discrimination: z.number().optional(),
  question_guessing: z.number().optional(),
  response_probability: z.number().min(0).max(1).optional(),
  information_value: z.number().min(0).optional(),
  device_type: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  browser_type: z.string().optional(),
  suspicious_reasons: suspiciousReasonsSchema.default([]),
  user_feedback: z.string().optional(),
});

export const selectUserAnswerSchema = createSelectSchema(userAnswers);

export const updateUserAnswerSchema = insertUserAnswerSchema.partial().omit({
  id: true,
  user_id: true,
  session_id: true,
  question_id: true,
  created_at: true,
  updated_at: true,
});

// Schema for answer analysis (for detailed review)
export const answerAnalysisSchema = selectUserAnswerSchema.pick({
  id: true,
  question_id: true,
  question_order: true,
  subject: true,
  user_answer: true,
  correct_answer: true,
  is_correct: true,
  is_skipped: true,
  is_flagged: true,
  time_spent_seconds: true,
  answered_at: true,
  interaction_count: true,
  option_changes: true,
  confidence_level: true,
  question_difficulty: true,
  question_discrimination: true,
  response_probability: true,
  information_value: true,
  response_time_percentile: true,
  difficulty_appropriateness: true,
});

// Schema for performance summary
export const answerSummarySchema = selectUserAnswerSchema.pick({
  id: true,
  question_id: true,
  subject: true,
  is_correct: true,
  is_skipped: true,
  time_spent_seconds: true,
  question_difficulty: true,
  answered_at: true,
});

// Schema for behavioral analysis
export const behavioralDataSchema = selectUserAnswerSchema.pick({
  id: true,
  question_id: true,
  time_spent_seconds: true,
  interaction_count: true,
  option_changes: true,
  answer_pattern: true,
  device_type: true,
  browser_type: true,
  is_suspicious: true,
  suspicious_reasons: true,
  first_interaction_at: true,
  answered_at: true,
});

// Type exports
export type UserAnswer = typeof userAnswers.$inferSelect;
export type NewUserAnswer = typeof userAnswers.$inferInsert;
export type UpdateUserAnswer = z.infer<typeof updateUserAnswerSchema>;
export type AnswerAnalysis = z.infer<typeof answerAnalysisSchema>;
export type AnswerSummary = z.infer<typeof answerSummarySchema>;
export type BehavioralData = z.infer<typeof behavioralDataSchema>;
export type AnswerPattern = z.infer<typeof answerPatternSchema>;
export type SuspiciousReasons = z.infer<typeof suspiciousReasonsSchema>;