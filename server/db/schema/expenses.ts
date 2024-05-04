import { date, index, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const expenses = pgTable(
	'expenses',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id').notNull(),
		title: text('title').notNull(),
		amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
		date: date('date').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(expenses) => {
		return {
			userIdIndex: index('name_idx').on(expenses.userId),
		};
	}
);

export const insertExpenseSchema = createInsertSchema(expenses, {
	title: z.string().min(3, 'title must be at least 3 character'),
	amount: z
		.string()
		.regex(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/, { message: 'amount must be positve' }),
});
export const selectUserSchema = createSelectSchema(expenses);
