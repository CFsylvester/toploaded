import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: text('id').primaryKey(),

  // Generic reference - can point to any table
  entityType: text('entity_type').notNull(), // 'inventory', 'master_set', 'grading', etc.
  entityId: text('entity_id').notNull(), // The ID of whatever you're noting

  note: text('note').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
