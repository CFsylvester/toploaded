import { pgTable, text, timestamp, boolean, unique } from 'drizzle-orm/pg-core';
import { masterSets } from './masterSets';
import { cards } from '../base/cards';

export const masterSetCards = pgTable(
  'master_set_cards',
  {
    id: text('id').primaryKey(),

    masterSetId: text('master_set_id')
      .notNull()
      .references(() => masterSets.id, { onDelete: 'cascade' }),

    cardId: text('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),

    // Simple boolean tracking
    collected: boolean('collected').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => [
    // One record per card per master set - use array syntax
    unique().on(table.masterSetId, table.cardId),
  ]
);
