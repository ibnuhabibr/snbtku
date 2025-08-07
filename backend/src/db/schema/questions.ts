import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Question Content
  question_text: text('question_text').notNull(),
  question_image_url: text('question_image_url'),
  explanation: text('explanation'),
  explanation_image_url: text('explanation_image_url'),
  
  // Question Classification
  subject: varchar('subject', { length: 50 }).notNull(), // 'matematika', 'fisika', 'kimia', 'biologi', 'bahasa_indonesia', 'bahasa_inggris'
  sub_topic: varchar('sub_topic', { length: 100 }).notNull(),
  difficulty_level: varchar('difficulty_level', { length: 20 }).notNull(), // 'mudah', 'sedang', 'sulit'
  
  // Question Type
  question_type: varchar('question_type', { length: 20 }).notNull().default('multiple_choice'), // 'multiple_choice', 'essay', 'true_false'
  
  // Multiple Choice Options (for multiple choice questions)
  options: jsonb('options').default([]), // Array of {id: string, text: string, image_url?: string}
  correct_answer: varchar('correct_answer', { length: 10 }), // Option ID for multiple choice, or text for others
  
  // IRT Parameters (3PL Model)
  discrimination: decimal('discrimination', { precision: 10, scale: 6 }).default('1.0'), // a parameter
  difficulty: decimal('difficulty', { precision: 10, scale: 6 }).default('0.0'), // b parameter
  guessing: decimal('guessing', { precision: 10, scale: 6 }).default('0.25'), // c parameter (default 0.25 for 4-option MC)
  
  // Question Statistics
  times_used: integer('times_used').default(0),
  times_correct: integer('times_correct').default(0),
  average_time_spent: integer('average_time_spent').default(0), // in seconds
  
  // Question Metadata
  source: varchar('source', { length: 100 }), // 'UTBK 2023', 'SBMPTN 2022', etc.
  year: integer('year'),
  question_number: integer('question_number'),
  
  // Content Management
  created_by: uuid('created_by'), // Reference to admin/content creator
  reviewed_by: uuid('reviewed_by'), // Reference to reviewer
  review_status: varchar('review_status', { length: 20 }).default('draft'), // 'draft', 'under_review', 'approved', 'rejected'
  review_notes: text('review_notes'),
  
  // Status
  is_active: boolean('is_active').default(true),
  is_premium: boolean('is_premium').default(false),
  
  // SEO and Search
  tags: jsonb('tags').default([]), // Array of strings for better searchability
  keywords: text('keywords'), // Comma-separated keywords for search
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    subjectIdx: index('questions_subject_idx').on(table.subject),
    difficultyIdx: index('questions_difficulty_idx').on(table.difficulty_level),
    subTopicIdx: index('questions_sub_topic_idx').on(table.sub_topic),
    reviewStatusIdx: index('questions_review_status_idx').on(table.review_status),
    isActiveIdx: index('questions_is_active_idx').on(table.is_active),
    sourceYearIdx: index('questions_source_year_idx').on(table.source, table.year),
  };
});

// Zod schemas for validation
const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
  image_url: z.string().url().optional(),
});

export const insertQuestionSchema = createInsertSchema(questions, {
  question_text: z.string().min(10, 'Question text must be at least 10 characters'),
  question_image_url: z.string().url().optional(),
  explanation: z.string().optional(),
  explanation_image_url: z.string().url().optional(),
  subject: z.enum(['matematika', 'fisika', 'kimia', 'biologi', 'bahasa_indonesia', 'bahasa_inggris']),
  sub_topic: z.string().min(2, 'Sub topic must be specified'),
  difficulty_level: z.enum(['mudah', 'sedang', 'sulit']),
  question_type: z.enum(['multiple_choice', 'essay', 'true_false']).default('multiple_choice'),
  options: z.array(optionSchema).optional(),
  correct_answer: z.string().min(1, 'Correct answer must be specified'),
  discrimination: z.number().min(0.1).max(3.0).default(1.0),
  difficulty: z.number().min(-4.0).max(4.0).default(0.0),
  guessing: z.number().min(0.0).max(1.0).default(0.25),
  source: z.string().optional(),
  year: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
  question_number: z.number().int().positive().optional(),
  review_status: z.enum(['draft', 'under_review', 'approved', 'rejected']).default('draft'),
  tags: z.array(z.string()).default([]),
  keywords: z.string().optional(),
});

export const selectQuestionSchema = createSelectSchema(questions);

export const updateQuestionSchema = insertQuestionSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
  times_used: true,
  times_correct: true,
});

// Schema for public question display (without answers)
export const publicQuestionSchema = selectQuestionSchema.pick({
  id: true,
  question_text: true,
  question_image_url: true,
  subject: true,
  sub_topic: true,
  difficulty_level: true,
  question_type: true,
  options: true,
  source: true,
  year: true,
  question_number: true,
});

// Schema for question with answer (for results/review)
export const questionWithAnswerSchema = selectQuestionSchema.pick({
  id: true,
  question_text: true,
  question_image_url: true,
  subject: true,
  sub_topic: true,
  difficulty_level: true,
  question_type: true,
  options: true,
  correct_answer: true,
  explanation: true,
  explanation_image_url: true,
  source: true,
  year: true,
  question_number: true,
});

// Type exports
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type PublicQuestion = z.infer<typeof publicQuestionSchema>;
export type QuestionWithAnswer = z.infer<typeof questionWithAnswerSchema>;
export type QuestionOption = z.infer<typeof optionSchema>;