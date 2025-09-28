import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { masterSetCards } from '../base/masterSetCards';

export const pokemonMasterSetCards = pgTable('pokemon_master_set_cards', {
  id: text('id')
    .primaryKey()
    .references(() => masterSetCards.id, { onDelete: 'cascade' }),

  // Pokemon-specific variant tracking
  variant: text('variant').notNull(), // "holo", "reverse_holo", "normal", etc.

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
