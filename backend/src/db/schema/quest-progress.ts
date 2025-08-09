import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const questProgress = pgTable('quest_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Relations
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questId: varchar('quest_id', { length: 100 }).notNull(),
  
  // Progress tracking
  progress: integer('progress').default(0),
  target: integer('target').notNull(),
  completed: boolean('completed').default(false),
  claimed: boolean('claimed').default(false),
  
  // Timestamps
  completedAt: timestamp('completed_at'),
  claimedAt: timestamp('claimed_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const questRewards = pgTable('quest_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Relations
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questId: varchar('quest_id', { length: 100 }).notNull(),
  
  // Reward details
  coins: integer('coins').default(0),
  xp: integer('xp').default(0),
  
  // Timestamps
  claimedAt: timestamp('claimed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod schemas for validation
export const insertQuestProgressSchema = createInsertSchema(questProgress, {
  userId: z.string().uuid('Invalid user ID'),
  questId: z.string().min(1, 'Quest ID is required'),
  progress: z.number().min(0, 'Progress cannot be negative'),
  target: z.number().min(1, 'Target must be at least 1'),
});

export const selectQuestProgressSchema = createSelectSchema(questProgress);

export const updateQuestProgressSchema = insertQuestProgressSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestRewardSchema = createInsertSchema(questRewards, {
  userId: z.string().uuid('Invalid user ID'),
  questId: z.string().min(1, 'Quest ID is required'),
  coins: z.number().min(0, 'Coins cannot be negative'),
  xp: z.number().min(0, 'XP cannot be negative'),
});

export const selectQuestRewardSchema = createSelectSchema(questRewards);

// Type exports
export type QuestProgress = typeof questProgress.$inferSelect;
export type NewQuestProgress = typeof questProgress.$inferInsert;
export type UpdateQuestProgress = z.infer<typeof updateQuestProgressSchema>;

export type QuestReward = typeof questRewards.$inferSelect;
export type NewQuestReward = typeof questRewards.$inferInsert;