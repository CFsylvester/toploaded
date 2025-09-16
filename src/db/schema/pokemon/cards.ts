import { pgTable, text, integer, json, timestamp } from 'drizzle-orm/pg-core';
import { cards } from '../base/cards';

export const pokemonCards = pgTable('pokemon_cards', {
  id: text('id').primaryKey(),
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id),

  // Pokemon-specific type system
  cardType: text('card_type'), // "Water", "Fire", etc.
  cardSupertype: text('card_supertype'), // "Pokémon", "Trainer", "Energy"
  cardSubtype: text('card_subtype'), // "Basic", "Stage 1", "Stage 2", "EX", etc.
  cardRarity: text('card_rarity'), // "Illustration Rare", "Common", etc.
  cardVariant: json('card_variant').$type<string[]>(), // ["holofoil"]

  // Pokedex data
  pokedexNumber: integer('pokedex_number'), // 779
  pokedexName: text('pokedex_name'), // "bruxish"
  pokemonSpriteUrl: text('pokemon_sprite_url'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
