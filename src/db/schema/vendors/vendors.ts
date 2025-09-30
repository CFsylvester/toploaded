import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  vendorType: text('vendor_type').notNull(), // 'ebay', 'card_shop', 'individual', 'pack_pull', 'trade'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
