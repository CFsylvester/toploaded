import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sets } from '../base/sets';

export const masterSets = pgTable('master_sets', {
  id: text('id').primaryKey(), // UUID

  // Reference to the game set being tracked
  setId: text('set_id')
    .notNull()
    .references(() => sets.id, { onDelete: 'cascade' }),

  // Basic tracking info
  name: text('name').notNull(), // "My Base Set Collection"
  isActive: boolean('is_active').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
