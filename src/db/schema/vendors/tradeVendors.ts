import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { vendors } from './vendors';

export const tradeVendors = pgTable('trade_vendors', {
  id: text('id')
    .primaryKey()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  traderName: text('trader_name'),
  platform: text('platform'), // 'discord', 'reddit', 'local'
  contactInfo: text('contact_info'),
  reputation: text('reputation'), // Notes about their trading reputation
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
