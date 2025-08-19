import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { cardPrints } from './cardPrints';
import { gradedCards } from './gradedCards';

export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  printId: uuid('print_id').references(() => cardPrints.id, { onDelete: 'set null' }),
  gradedId: uuid('graded_id').references(() => gradedCards.id, { onDelete: 'set null' }),
  condition: varchar('condition', { length: 40 }), // 'NM','LP','MP' etc.
  quantity: integer('quantity').default(1).notNull(),
  isListed: boolean('is_listed').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
