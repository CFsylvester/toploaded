import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { cards } from '@/db/schema/base/cards';
import { vendors } from '@/db/schema/vendors';

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(), // UUID

  // What card this is
  cardId: text('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),

  // Purchase source - ADD THIS
  vendorId: text('vendor_id').references(() => vendors.id),

  // Condition (physical state)
  condition: text('condition'), // 'mint', 'near_mint', 'lightly_played', etc.

  // Financial tracking (what you paid)
  purchasePrice: integer('purchase_price'), // In cents
  purchaseDate: timestamp('purchase_date'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
