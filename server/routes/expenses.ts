import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3),
	amount: z.number(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = z.object({
	title: z.string(),
	amount: z.number(),
});

const fakeExpanses: Expense[] = [
	{ id: 1, title: 'one', amount: 30 },
	{ id: 2, title: 'two', amount: 60 },
	{ id: 3, title: 'three', amount: 90 },
];

export const expenseRouter = new Hono()
	.get('/', (c) => {
		return c.json({
			expenses: fakeExpanses,
		});
	})
	.post('/', zValidator('json', createPostSchema), async (c) => {
		const data = await c.req.valid('json');
		const expense = createPostSchema.parse(data);
		c.status(201);
		fakeExpanses.push({ ...expense, id: fakeExpanses.length + 1 });
		return c.json({ msg: fakeExpanses });
	})
	.get('/totalSpent', (c) => {
		const total = fakeExpanses.reduce((acc, cur) => acc + cur.amount, 0);
		return c.json({ total });
	})
	.get('/:id{[0-9]+}', (c) => {
		const id = Number.parseInt(c.req.param('id'));
		const expense = fakeExpanses.find((expense) => expense.id === id);

		if (!expense) return c.notFound();

		return c.json({
			msg: expense,
		});
	})
	.delete('/:id{[0-9]+}', (c) => {
		const id = Number.parseInt(c.req.param('id'));
		const index = fakeExpanses.findIndex((expense) => expense.id === id);

		if (index === -1) return c.notFound();
		const deletedExpense = fakeExpanses.splice(index, 1)[0];
		return c.json({
			msg: deletedExpense,
		});
	});
