import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sets } from '../../base/sets';

export const pokemonSets = pgTable('pokemon_sets', {
  id: text('id')
    .primaryKey()
    .references(() => sets.id, { onDelete: 'cascade' }),

  // Pokemon-specific set information
  series: text('series'), // "Base", "Gym", "Neo"
  searchableSeries: text('searchable_series'), // uses the util toSearchableFormat + fromSearchableFormat

  // Pokemon-specific images
  images: jsonb('images')
    .$type<{
      logo?: string | null;
      symbol?: string | null;
    }>()
    .notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
