import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: text('id').primaryKey(), // 'pokemon', 'magic', 'yugioh'
  name: text('name').notNull(), // 'Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
