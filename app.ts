import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { expenseRouter } from './routes/expenses';




const app = new Hono();

app.use('*', logger())
app.get('/test', (c) => c.json({ msg: 'doing it ' }));
app.route('/api/expense', expenseRouter);

export default app;
