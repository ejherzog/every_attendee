import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { dev } from '$app/environment';
import * as schema from './schema';

const pool = new Pool({
	connectionString: DATABASE_URL,
	max: 5,
	...(dev ? {} : { ssl: { rejectUnauthorized: false } })
});

export const db = drizzle(pool, { schema });
export * from './schema';
