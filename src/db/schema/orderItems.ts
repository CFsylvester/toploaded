import { pgTable, uuid, integer, numeric, varchar } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { inventoryItems } from './inventoryItems';

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  inventoryId: uuid('inventory_id').references(() => inventoryItems.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 200 }).notNull(),
  qty: integer('qty').default(1).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
});
