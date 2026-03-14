import { defineConfig } from 'drizzle-kit';

// Heroku Postgres requires SSL. Ensure sslmode=require so migrate works in production.
const url = process.env.DATABASE_URL ?? '';
const urlWithSsl =
	url && !url.includes('sslmode=')
		? `${url}${url.includes('?') ? '&' : '?'}sslmode=require`
		: url;

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: urlWithSsl,
		ssl: { rejectUnauthorized: false }
	},
	migrations: {
		table: '__drizzle_migrations__',
		schema: 'public'
	}
});
