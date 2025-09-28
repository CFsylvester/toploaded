import { pgTable, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { games } from './games';

export const sets = pgTable('sets', {
  // Internal identifiers
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => games.id),

  // External identifiers
  externalId: text('external_id').notNull(),

  // Base set information
  name: text('name').notNull(),
  searchableName: text('searchable_name').notNull(), // uses the util toSearchableFormat + fromSearchableFormat
  slug: text('slug').notNull(),
  totalCards: integer('total_cards'),

  // Timestamps
  releaseDate: timestamp('release_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
