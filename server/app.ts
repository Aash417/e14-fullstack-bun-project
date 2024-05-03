import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { expenseRouter } from './routes/expenses';

const app = new Hono();

app.use('*', logger());

const apiRoute = app.basePath('/api').route('/expense', expenseRouter);

app.get('*', serveStatic({ root: '../client/dist' }));
app.get('*', serveStatic({ path: '../client/dist/index.html' }));

export default app;
export type ApiRoute = typeof apiRoute;