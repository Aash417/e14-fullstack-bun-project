import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { expenseRouter } from './routes/expenses';




const app = new Hono();

app.use('*', logger())
app.get('/text', (c) => c.json({ msg: 'doing it ' }));
app.route('/api',expenseRouter )

export default app;
