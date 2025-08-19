import { pgTable, uuid, numeric, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { inventoryItems } from './inventoryItems';

export const listings = pgTable('listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  inventoryId: uuid('inventory_id')
    .references(() => inventoryItems.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  active: boolean('active').default(true).notNull(),
  channel: varchar('channel', { length: 40 }).default('storefront'), // 'ebay','offerup'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
