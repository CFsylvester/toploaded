import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 40 }).notNull().unique(), // 'pokemon','mtg','yugioh'
  name: varchar('name', { length: 100 }).notNull(),
});
