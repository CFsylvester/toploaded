import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { notes } from './notes';

export const notePhotos = pgTable('note_photos', {
  id: text('id').primaryKey(),

  noteId: text('note_id')
    .notNull()
    .references(() => notes.id, { onDelete: 'cascade' }),

  photoUrl: text('photo_url').notNull(),
  description: text('description'), // Optional description of what the photo shows
  sortOrder: integer('sort_order').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
