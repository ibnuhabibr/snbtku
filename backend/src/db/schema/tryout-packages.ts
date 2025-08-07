import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const tryoutPackages = pgTable('tryout_packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Package Information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  thumbnail_url: text('thumbnail_url'),
  
  // Package Type and Category
  package_type: varchar('package_type', { length: 50 }).notNull(), // 'utbk_snbt', 'simak_ui', 'utul_ugm', 'sbmptn', etc.
  category: varchar('category', { length: 50 }).notNull(), // 'saintek', 'soshum', 'campuran'
  
  // Difficulty and Academic Info
  difficulty_level: varchar('difficulty_level', { length: 20 }).notNull(), // 'mudah', 'sedang', 'sulit', 'campuran'
  target_score: integer('target_score'), // Target score for this package
  
  // Question Configuration
  total_questions: integer('total_questions').notNull(),
  duration_minutes: integer('duration_minutes').notNull(), // Total duration in minutes
  
  // Subject Distribution (for UTBK SNBT)
  subject_distribution: jsonb('subject_distribution').default({
    matematika: 15,
    fisika: 12,
    kimia: 12,
    biologi: 12,
    bahasa_indonesia: 20,
    bahasa_inggris: 20
  }),
  
  // Question Selection Strategy
  question_selection_strategy: varchar('question_selection_strategy', { length: 50 }).default('adaptive'), // 'random', 'adaptive', 'fixed'
  
  // Pricing and Access
  is_free: boolean('is_free').default(false),
  price: decimal('price', { precision: 10, scale: 2 }).default('0'),
  premium_only: boolean('premium_only').default(false),
  
  // Availability
  is_active: boolean('is_active').default(true),
  is_featured: boolean('is_featured').default(false),
  available_from: timestamp('available_from'),
  available_until: timestamp('available_until'),
  
  // Usage Statistics
  total_attempts: integer('total_attempts').default(0),
  average_score: decimal('average_score', { precision: 5, scale: 2 }).default('0'),
  completion_rate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0'), // Percentage
  
  // Content Management
  created_by: uuid('created_by'), // Reference to admin/content creator
  reviewed_by: uuid('reviewed_by'),
  review_status: varchar('review_status', { length: 20 }).default('draft'), // 'draft', 'under_review', 'approved', 'rejected'
  
  // SEO and Marketing
  tags: jsonb('tags').default([]), // Array of strings
  keywords: text('keywords'),
  meta_description: text('meta_description'),
  
  // Scheduling and Automation
  auto_publish_at: timestamp('auto_publish_at'),
  auto_archive_at: timestamp('auto_archive_at'),
  
  // Analytics and Tracking
  view_count: integer('view_count').default(0),
  bookmark_count: integer('bookmark_count').default(0),
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    packageTypeIdx: index('tryout_packages_type_idx').on(table.package_type),
    categoryIdx: index('tryout_packages_category_idx').on(table.category),
    difficultyIdx: index('tryout_packages_difficulty_idx').on(table.difficulty_level),
    isActiveIdx: index('tryout_packages_is_active_idx').on(table.is_active),
    isFeaturedIdx: index('tryout_packages_is_featured_idx').on(table.is_featured),
    availabilityIdx: index('tryout_packages_availability_idx').on(table.available_from, table.available_until),
    reviewStatusIdx: index('tryout_packages_review_status_idx').on(table.review_status),
  };
});

// Zod schemas for validation
const subjectDistributionSchema = z.object({
  matematika: z.number().int().min(0).optional(),
  fisika: z.number().int().min(0).optional(),
  kimia: z.number().int().min(0).optional(),
  biologi: z.number().int().min(0).optional(),
  bahasa_indonesia: z.number().int().min(0).optional(),
  bahasa_inggris: z.number().int().min(0).optional(),
});

export const insertTryoutPackageSchema = createInsertSchema(tryoutPackages, {
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  package_type: z.enum(['utbk_snbt', 'simak_ui', 'utul_ugm', 'sbmptn', 'custom']),
  category: z.enum(['saintek', 'soshum', 'campuran']),
  difficulty_level: z.enum(['mudah', 'sedang', 'sulit', 'campuran']),
  target_score: z.number().int().min(0).max(1000).optional(),
  total_questions: z.number().int().min(1).max(200),
  duration_minutes: z.number().int().min(30).max(300),
  subject_distribution: subjectDistributionSchema.optional(),
  question_selection_strategy: z.enum(['random', 'adaptive', 'fixed']).default('adaptive'),
  price: z.number().min(0).default(0),
  available_from: z.date().optional(),
  available_until: z.date().optional(),
  review_status: z.enum(['draft', 'under_review', 'approved', 'rejected']).default('draft'),
  tags: z.array(z.string()).default([]),
  keywords: z.string().optional(),
  meta_description: z.string().max(160).optional(),
});

export const selectTryoutPackageSchema = createSelectSchema(tryoutPackages);

export const updateTryoutPackageSchema = insertTryoutPackageSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
  total_attempts: true,
  average_score: true,
  completion_rate: true,
  view_count: true,
  bookmark_count: true,
});

// Schema for public package display
export const publicTryoutPackageSchema = selectTryoutPackageSchema.pick({
  id: true,
  title: true,
  description: true,
  thumbnail_url: true,
  package_type: true,
  category: true,
  difficulty_level: true,
  target_score: true,
  total_questions: true,
  duration_minutes: true,
  subject_distribution: true,
  is_free: true,
  price: true,
  premium_only: true,
  is_featured: true,
  available_from: true,
  available_until: true,
  total_attempts: true,
  average_score: true,
  completion_rate: true,
  tags: true,
  view_count: true,
  bookmark_count: true,
  created_at: true,
});

// Schema for package summary (for lists)
export const tryoutPackageSummarySchema = selectTryoutPackageSchema.pick({
  id: true,
  title: true,
  thumbnail_url: true,
  package_type: true,
  category: true,
  difficulty_level: true,
  total_questions: true,
  duration_minutes: true,
  is_free: true,
  price: true,
  premium_only: true,
  is_featured: true,
  total_attempts: true,
  average_score: true,
  created_at: true,
});

// Type exports
export type TryoutPackage = typeof tryoutPackages.$inferSelect;
export type NewTryoutPackage = typeof tryoutPackages.$inferInsert;
export type UpdateTryoutPackage = z.infer<typeof updateTryoutPackageSchema>;
export type PublicTryoutPackage = z.infer<typeof publicTryoutPackageSchema>;
export type TryoutPackageSummary = z.infer<typeof tryoutPackageSummarySchema>;
export type SubjectDistribution = z.infer<typeof subjectDistributionSchema>;