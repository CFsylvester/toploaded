import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { cardPrints } from './cardPrints';

export const gradedCards = pgTable('graded_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  printId: uuid('print_id')
    .references(() => cardPrints.id, { onDelete: 'cascade' })
    .notNull(),
  grader: varchar('grader', { length: 20 }).notNull(), // 'PSA','BGS','CGC'
  grade: varchar('grade', { length: 10 }).notNull(), // '10','9.5','9','Authentic'
  certNumber: varchar('cert_number', { length: 64 }).unique(),
  subgrades: varchar('subgrades', { length: 200 }), // optionally CSV/JSON string
  slabLabel: varchar('slab_label', { length: 120 }), // optional descriptor
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
