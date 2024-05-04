import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, sum } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { expenses as expenseTable } from '../db/schema/expenses';
import { getUser } from '../kinde';

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3),
	amount: z.string(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = z.object({
	title: z.string(),
	amount: z.string(),
});

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
	.post('/', getUser, zValidator('json', createPostSchema), async (c) => {
		const expense = await c.req.valid('json');
		const user = c.var.user;

		const result = await db.insert(expenseTable).values({ ...expense, userId: user.id });
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
