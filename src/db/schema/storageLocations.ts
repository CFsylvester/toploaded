import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const storageLocations = pgTable('storage_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  label: varchar('label', { length: 80 }).notNull(), // e.g., 'Shelf A / Bin 3'
  note: varchar('note', { length: 200 }),
});
