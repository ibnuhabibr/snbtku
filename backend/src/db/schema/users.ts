import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Basic Information
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }),
  
  // Profile Information
  avatar_url: text('avatar_url'),
  date_of_birth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 10 }), // 'male', 'female', 'other'
  
  // Academic Information
  school_name: varchar('school_name', { length: 255 }),
  grade_level: varchar('grade_level', { length: 20 }), // '12', 'alumni', 'gap_year'
  target_university: varchar('target_university', { length: 255 }),
  target_major: varchar('target_major', { length: 255 }),
  
  // Account Status
  email_verified: boolean('email_verified').default(false),
  phone_verified: boolean('phone_verified').default(false),
  is_active: boolean('is_active').default(true),
  is_premium: boolean('is_premium').default(false),
  premium_expires_at: timestamp('premium_expires_at'),
  role: varchar('role', { length: 20 }).default('student'), // 'student', 'admin', 'super_admin'
  
  // Authentication
  last_login_at: timestamp('last_login_at'),
  password_reset_token: varchar('password_reset_token', { length: 255 }),
  password_reset_expires: timestamp('password_reset_expires'),
  email_verification_token: varchar('email_verification_token', { length: 255 }),
  
  // Preferences
  timezone: varchar('timezone', { length: 50 }).default('Asia/Jakarta'),
  language: varchar('language', { length: 5 }).default('id'),
  notification_preferences: jsonb('notification_preferences').default({
    email_notifications: true,
    push_notifications: true,
    study_reminders: true,
    achievement_notifications: true,
    leaderboard_updates: true
  }),
  
  // Privacy Settings
  profile_visibility: varchar('profile_visibility', { length: 20 }).default('public'), // 'public', 'friends', 'private'
  show_real_name: boolean('show_real_name').default(true),
  show_school: boolean('show_school').default(true),
  
  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email('Invalid email format'),
  password_hash: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone_number: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  grade_level: z.enum(['12', 'alumni', 'gap_year']).optional(),
  role: z.enum(['student', 'admin', 'super_admin']).default('student'),
  profile_visibility: z.enum(['public', 'friends', 'private']).default('public'),
  timezone: z.string().default('Asia/Jakarta'),
  language: z.string().length(2).default('id'),
});

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = insertUserSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const publicUserSchema = selectUserSchema.pick({
  id: true,
  full_name: true,
  avatar_url: true,
  school_name: true,
  grade_level: true,
  created_at: true,
}).extend({
  // Add computed fields that might be needed for public profile
  display_name: z.string().optional(),
  is_online: z.boolean().optional(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;