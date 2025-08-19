import { pgTable, uuid, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { addresses } from './addresses';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  status: varchar('status', { length: 30 }).default('pending').notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  shippingTotal: numeric('shipping_total', { precision: 12, scale: 2 }).default('0').notNull(),
  taxTotal: numeric('tax_total', { precision: 12, scale: 2 }).default('0').notNull(),
  grandTotal: numeric('grand_total', { precision: 12, scale: 2 }).notNull(),
  shipToId: uuid('ship_to_id').references(() => addresses.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
