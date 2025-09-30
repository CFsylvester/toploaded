import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { inventory } from '../base/inventory';

export const grading = pgTable('grading', {
  id: text('id').primaryKey(),

  inventoryId: text('inventory_id')
    .notNull()
    .references(() => inventory.id, { onDelete: 'cascade' }),

  // Grading company
  gradingCompany: text('grading_company').notNull(), // 'PSA', 'BGS', 'CGC', etc.

  // Universal grading process
  status: text('status').notNull(), // 'preparing', 'en_route_to_grader', 'received_by_grader', 'grading', 'en_route_from_grader', 'completed'

  // Tracking info
  trackingNumberToGrader: text('tracking_number_to_grader'),
  trackingNumberFromGrader: text('tracking_number_from_grader'),

  // Expectations vs reality
  expectedGrade: text('expected_grade'), // What you think it'll get
  actualGrade: text('actual_grade'), // What it actually got

  // Costs and timeline
  gradingFee: integer('grading_cost'), // In cents
  gradingShipmentCost: integer('grading_shipment_cost'), // In cents
  gradingTotalCost: integer('grading_total_cost'), // In cents
  submissionDate: timestamp('submission_date'),
  receivedByGraderDate: timestamp('received_by_grader_date'),
  gradingCompletedDate: timestamp('grading_completed_date'),
  receivedBackDate: timestamp('received_back_date'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
