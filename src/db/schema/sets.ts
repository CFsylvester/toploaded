import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { games } from './games';

export const sets = pgTable('sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  gameId: uuid('game_id')
    .references(() => games.id, { onDelete: 'restrict' })
    .notNull(),
  code: varchar('code', { length: 40 }).notNull(),
  name: varchar('name', { length: 160 }).notNull(),
  releaseYear: integer('release_year'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
