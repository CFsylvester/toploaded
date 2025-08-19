import { pgTable, uuid, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  provider: varchar('provider', { length: 40 }).notNull(), // 'stripe','paypal'
  status: varchar('status', { length: 30 }).default('authorized').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
