import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const tenantDomains = pgTable('tenant_domains', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  domain: varchar('domain', { length: 255 }).notNull().unique(),
});
