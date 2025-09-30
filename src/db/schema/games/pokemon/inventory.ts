import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { inventory } from '../../base/inventory';

export const pokemonInventory = pgTable('pokemon_inventory', {
  id: text('id')
    .primaryKey()
    .references(() => inventory.id, { onDelete: 'cascade' }),

  // Pokemon-specific details
  variant: text('variant'), // 'holo', 'reverse_holo', 'normal', 'first_edition'

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
