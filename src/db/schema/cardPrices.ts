import { pgTable, uuid, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';
import { cardVariants } from './cardVariants';
import { gradedCards } from './gradedCards';

export const cardPrices = pgTable('card_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  // price for a raw variant OR a graded card (one of these should be set)
  variantId: uuid('variant_id').references(() => cardVariants.id, { onDelete: 'cascade' }),
  gradedId: uuid('graded_id').references(() => gradedCards.id, { onDelete: 'cascade' }),

  source: varchar('source', { length: 60 }).notNull(), // 'ebay','tcgplayer','manual'
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
});
