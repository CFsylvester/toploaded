import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { cards } from '@/db/schema/base';

export const pokemonCards = pgTable('pokemon_cards', {
  id: text('id')
    .primaryKey()
    .references(() => cards.id, { onDelete: 'cascade' }),

  // specific card properties
  details: jsonb('details').$type<{
    type: string;
    supertype: string;
    subtype: string;
    rarity: string;
    variant: string[];
  }>(),

  // Pokedex data - either void or complete object with all fields
  pokedex: jsonb('pokedex').$type<{
    number: number;
    name: string;
    sprite: string;
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
