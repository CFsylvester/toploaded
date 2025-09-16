import { pgTable, text, date, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { games } from '../base/games';

export const pokemonSets = pgTable('pokemon_sets', {
  id: text('id').primaryKey(), // Pokemon API set ID (e.g., "base1", "gym1")
  gameId: text('game_id')
    .notNull()
    .references(() => games.id), // Always 'pokemon'

  // Set information
  name: text('name').notNull(), // "Base Set", "Jungle", "Team Rocket"
  series: text('series'), // "Base", "Gym", "Neo"
  releaseDate: timestamp('release_date'),
  totalCards: integer('total_cards'),

  // Set images
  logoUrl: text('logo_url'),
  symbolUrl: text('symbol_url'),

  // Processing status flags (from your original processSet logic)
  setImagesDownloaded: boolean('set_images_downloaded').default(false),
  setImagesUploaded: boolean('set_images_uploaded').default(false),
  cardArtDownloaded: boolean('card_art_downloaded').default(false),
  cardArtUploaded: boolean('card_art_uploaded').default(false),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
