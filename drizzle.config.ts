import { defineConfig } from 'drizzle-kit';

// Heroku Postgres requires SSL; local Postgres often does not. Only enable SSL for non-local URLs.
const url = process.env.DATABASE_URL ?? '';
const isLocal =
	url.includes('localhost') ||
	url.includes('127.0.0.1') ||
	url.startsWith('postgresql:///');
const urlWithSsl =
	!isLocal && url && !url.includes('sslmode=')
		? `${url}${url.includes('?') ? '&' : '?'}sslmode=require`
		: url;

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: urlWithSsl,
		...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
	},
	migrations: {
		table: '__drizzle_migrations__',
		schema: 'public'
	}
});
