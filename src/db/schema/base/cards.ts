import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { games, sets } from '@/db/schema/base';

export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => games.id),
  setId: text('set_id')
    .notNull()
    .references(() => sets.id),

  // Card data
  name: text('name').notNull(),
  searchableName: text('searchable_name').notNull(), // uses the util toSearchableFormat + fromSearchableFormat
  number: text('number').notNull(), // Required - all cards have a number in their set
  slug: text('slug').notNull(),

  // External identifiers
  externalId: text('external_id').notNull(),

  // Images object with card art
  images: jsonb('images')
    .$type<{
      cardArt: string;
    }>()
    .notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
