import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// for migrations
const migrationClient = postgres(process.env.DatabaseUrl!, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
