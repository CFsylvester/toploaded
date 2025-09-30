import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { inventory } from './inventory';

export const inventoryPhotos = pgTable('inventory_photos', {
  id: text('id').primaryKey(), // UUID

  inventoryId: text('inventory_id')
    .notNull()
    .references(() => inventory.id, { onDelete: 'cascade' }),

  // Photo details
  photoUrl: text('photo_url').notNull(),
  photoType: text('photo_type').notNull(), // 'front', 'back', 'edge', 'corner', 'surface', 'additional'
  description: text('description'), // 'Shows minor edge wear', 'Centering detail', etc.

  // Order for display
  sortOrder: integer('sort_order').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
