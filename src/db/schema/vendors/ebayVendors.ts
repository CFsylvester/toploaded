import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { vendors } from './vendors';

export const ebayVendors = pgTable('ebay_vendors', {
  id: text('id')
    .primaryKey()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  ebayUsername: text('ebay_username').notNull(),
  ebayFeedback: integer('ebay_feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
