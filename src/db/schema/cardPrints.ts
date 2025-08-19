import { pgTable, uuid, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { cards } from './cards';

export const cardPrints = pgTable('card_prints', {
  id: uuid('id').defaultRandom().primaryKey(),
  cardId: uuid('card_id')
    .references(() => cards.id, { onDelete: 'cascade' })
    .notNull(),
  kind: varchar('kind', { length: 60 }).notNull(), // 'normal','reverse_holo','holo','parallel','promo'
  language: varchar('language', { length: 16 }).default('EN'),
  printRun: integer('print_run'),
  isLimited: boolean('is_limited').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
