import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 120 }),
  line1: varchar('line1', { length: 120 }).notNull(),
  line2: varchar('line2', { length: 120 }),
  city: varchar('city', { length: 80 }).notNull(),
  region: varchar('region', { length: 80 }),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 2 }).default('US').notNull(),
});
