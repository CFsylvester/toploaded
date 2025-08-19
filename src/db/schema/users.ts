import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // mirror auth.users.id
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  displayName: varchar('display_name', { length: 120 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
