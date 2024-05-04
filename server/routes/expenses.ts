import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, sum } from 'drizzle-orm';
import { Hono } from 'hono';
import { createExpenseSchema } from '../commonTypes';
import { db } from '../db';
import { expenses as expenseTable, insertExpenseSchema } from '../db/schema/expenses';
import { getUser } from '../kinde';

export const expenseRouter = new Hono()
	.get('/', getUser, async (c) => {
		const user = c.var.user;
		const expenses = await db
			.select()
			.from(expenseTable)
			.where(eq(expenseTable.userId, user.id))
			.orderBy(desc(expenseTable.createdAt))
			.limit(100);

		return c.json(expenses);
	})
	.post('/', getUser, zValidator('json', createExpenseSchema), async (c) => {
		const expense = await c.req.valid('json');
		const user = c.var.user;
		const validateExpenses = insertExpenseSchema.parse({ ...expense, userId: user.id });

		const result = await db.insert(expenseTable).values(validateExpenses);
		c.status(201);
		return c.json(result);
	})
	.get('/totalSpent', getUser, async (c) => {
		const user = c.var.user;
		const total = await db
			.select({ total: sum(expenseTable.amount) })
			.from(expenseTable)
			.where(eq(expenseTable.userId, user.id))
			.limit(1)
			.then((res) => res[0]);

		return c.json(total);
	})
	.get('/:id{[0-9]+}', getUser, async (c) => {
		const id = Number.parseInt(c.req.param('id'));
		const user = c.var.user;
		const expenses = await db
			.select()
			.from(expenseTable)
			.where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
			.orderBy(desc(expenseTable.createdAt))
			.then((res) => res[0]);

		if (!expenses) return c.notFound();
		return c.json(expenses);
	})
	.delete('/:id{[0-9]+}', getUser, async (c) => {
		const id = Number.parseInt(c.req.param('id'));
		const user = c.var.user;
		const expense = await db
			.delete(expenseTable)
			.where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
			.returning()
			.then((res) => res[0]);

		if (!expense) return c.notFound();
		return c.json(expense);
	});
