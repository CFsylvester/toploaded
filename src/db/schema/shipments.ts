import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const shipments = pgTable('shipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  carrier: varchar('carrier', { length: 40 }), // 'usps','ups','fedex'
  service: varchar('service', { length: 40 }), // 'first_class','priority'
  tracking: varchar('tracking', { length: 60 }),
  shippedAt: timestamp('shipped_at', { withTimezone: true }),
});
