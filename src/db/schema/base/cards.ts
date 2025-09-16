import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { games } from './games';

export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => games.id),
  setId: text('set_id').notNull(),

  // Universal card properties
  cardName: text('card_name').notNull(),
  cardNumber: text('card_number'),

  // External identifiers
  externalId: text('external_id'), // Original API ID

  // Single high-quality card art URL
  cardArtUrl: text('card_art_url'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
