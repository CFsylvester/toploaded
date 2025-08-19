import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { inventoryItems } from './inventoryItems';

export const barcodes = pgTable('barcodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  inventoryId: uuid('inventory_id')
    .references(() => inventoryItems.id, { onDelete: 'cascade' })
    .notNull(),
  symbology: varchar('symbology', { length: 20 }).default('CODE128').notNull(),
  value: varchar('value', { length: 120 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
