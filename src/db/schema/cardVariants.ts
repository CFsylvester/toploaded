import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { cards } from './cards';

export const cardVariants = pgTable(
  'card_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cardId: uuid('card_id')
      .references(() => cards.id, { onDelete: 'cascade' })
      .notNull(),
    kind: varchar('kind', { length: 60 }).notNull(), // e.g. 'normal','reverse_holo','holo','promo'
    language: varchar('language', { length: 16 }).default('EN').notNull(),
    printRun: integer('print_run'), // optional metadata
    isLimited: boolean('is_limited').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => ({
    // prevent duplicates of the same variant flavor per card
    uniqCardKindLang: uniqueIndex('card_variants_card_kind_lang_idx').on(
      t.cardId,
      t.kind,
      t.language
    ),
  })
);
