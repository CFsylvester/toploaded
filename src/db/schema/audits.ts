import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const audits = pgTable('audits', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  actorId: uuid('actor_id'), // users.id (nullable for system)
  action: varchar('action', { length: 80 }).notNull(), // 'inventory.adjust','order.create'
  subject: varchar('subject', { length: 80 }), // table/entity reference
  meta: varchar('meta', { length: 2000 }), // JSON string if you like
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
