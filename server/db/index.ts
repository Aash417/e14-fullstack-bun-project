import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// for query purposes
const queryClient = postgres(process.env.DatabaseUrl!);
export const db = drizzle(queryClient);
