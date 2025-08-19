import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { sets } from './sets';
import { tenants } from './tenants';

export const cards = pgTable('cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  setId: uuid('set_id')
    .references(() => sets.id, { onDelete: 'cascade' })
    .notNull(),
  numberInSet: varchar('number_in_set', { length: 40 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  rarity: varchar('rarity', { length: 60 }), // optional
  collectorNumber: integer('collector_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
