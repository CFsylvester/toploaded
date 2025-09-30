import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { grading } from './grading';

export const psaGrading = pgTable('psa_grading', {
  id: text('id')
    .primaryKey()
    .references(() => grading.id, { onDelete: 'cascade' }),

  // PSA-specific details
  grade: integer('grade'), // 1-10 (null until graded)
  certNumber: text('cert_number'), // PSA certification number

  // PSA-specific features
  inGraderVault: boolean('in_grader_vault').default(false),
  itemAuthenticated: boolean('item_authenticated').default(false),
  psaServiceLevel: text('psa_service_level'), // 'Regular', 'Express', 'Super Express'
  submissionNumber: text('submission_number'), // PSA submission batch number

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
