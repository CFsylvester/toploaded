import { pgTable, uuid, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';
import { cardPrints } from './cardPrints';
import { gradedCards } from './gradedCards';

export const priceSnapshots = pgTable('price_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  printId: uuid('print_id').references(() => cardPrints.id, { onDelete: 'cascade' }),
  gradedId: uuid('graded_id').references(() => gradedCards.id, { onDelete: 'cascade' }),
  source: varchar('source', { length: 60 }).notNull(), // 'ebay','tcgplayer','manual'
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
});
