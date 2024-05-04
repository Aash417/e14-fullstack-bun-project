import type { Config } from 'drizzle-kit';

export default {
	schema: './server/db/schema/*',
	out: './drizzle',
	driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		connectionString: process.env.DatabaseUrl!,
	},
} satisfies Config;
