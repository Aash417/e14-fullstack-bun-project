import { Hono } from 'hono';

export const expenseRouter = new Hono();

type Expense = {
	id: number;
	title: string;
	amount: number;
};
const fakeExpanse: Expense[] = [
	{ id: 1, title: 'one', amount: 30 },
	{ id: 2, title: 'two', amount: 60 },
	{ id: 3, title: 'three', amount: 90 },
];

expenseRouter.get('/', (c) => {
	return c.json({
		expenses: fakeExpanse,
	});
});

expenseRouter.post('/expenses', async (c) => {
	const data = await c.req.json();
	console.log('data  :', data);
	return c.json({ msg: 'get' });
});
