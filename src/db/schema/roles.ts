import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 60 }).notNull(), // owner, manager, clerk
});
