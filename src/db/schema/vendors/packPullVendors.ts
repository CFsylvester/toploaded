import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { vendors } from './vendors';
import { sets } from '../base/sets';

export const packPullVendors = pgTable('pack_pull_vendors', {
  id: text('id')
    .primaryKey()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  packType: text('pack_type').notNull(), // 'booster_pack', 'elite_trainer_box'
  setId: text('set_id').references(() => sets.id),
  purchaseLocation: text('purchase_location'), // Where you bought the pack
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
