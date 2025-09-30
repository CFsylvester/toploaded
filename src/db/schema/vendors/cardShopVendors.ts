import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { vendors } from './vendors';

export const cardShopVendors = pgTable('card_shop_vendors', {
  id: text('id')
    .primaryKey()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  shopName: text('shop_name').notNull(),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
