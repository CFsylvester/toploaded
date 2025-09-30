import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { vendors } from './vendors';

export const individualVendors = pgTable('individual_vendors', {
  id: text('id')
    .primaryKey()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  sellerName: text('seller_name'),
  platform: text('platform'), // 'discord', 'reddit', 'facebook', 'local'
  contactInfo: text('contact_info'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
