import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	boolean,
	timestamp,
	primaryKey
} from 'drizzle-orm/pg-core';

export const people = pgTable('people', {
	id: serial('id').primaryKey(),
	shortName: varchar('short_name', { length: 50 }).notNull(),
	fullName: varchar('full_name', { length: 200 }),
	email: varchar('email', { length: 400 }),
	phone: varchar('phone', { length: 20 })
});

export const events = pgTable('events', {
	id: varchar('id', { length: 6 }).primaryKey(),
	title: varchar('title', { length: 200 }).notNull(),
	startTime: varchar('start_time', { length: 30 }),
	endTime: varchar('end_time', { length: 30 }),
	location: text('location'),
	address: text('address'),
	description: text('description'),
	imageUrl: text('image_url')
});

export const hosts = pgTable('hosts', {
	id: serial('id').primaryKey(),
	eventId: varchar('event_id', { length: 6 }).references(() => events.id),
	hostId: integer('host_id').references(() => people.id)
});

export const responses = pgTable('responses', {
	id: varchar('id', { length: 4 }).primaryKey(),
	respondentId: integer('respondent_id').references(() => people.id),
	guestId: integer('guest_id').references(() => people.id),
	eventId: varchar('event_id', { length: 6 }).references(() => events.id),
	attending: varchar('attending', { length: 20 }),
	comments: text('comments')
});

export const guests = pgTable('guests', {
	id: serial('id').primaryKey(),
	responseId: varchar('response_id', { length: 4 })
		.notNull()
		.references(() => responses.id),
	guestId: integer('guest_id')
		.notNull()
		.references(() => people.id),
	attending: varchar('attending', { length: 20 })
		.notNull()
		.$type<'Yes' | 'No' | 'Maybe'>()
});

export const pronouns = pgTable('pronouns', {
	id: serial('id').primaryKey(),
	subject: varchar('subject', { length: 20 }),
	object: varchar('object', { length: 20 }),
	possessive: varchar('possessive', { length: 20 }),
	determiner: varchar('determiner', { length: 20 }),
	reflexive: varchar('reflexive', { length: 20 }),
	nickname: varchar('nickname', { length: 100 }).notNull(),
	custom: boolean('custom')
});

export const personPronouns = pgTable('person_pronouns', {
	id: serial('id').primaryKey(),
	personId: integer('person_id').references(() => people.id),
	pronounId: integer('pronoun_id').references(() => pronouns.id)
});

export const diets = pgTable('diets', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 30 }),
	details: varchar('details', { length: 100 }),
	custom: boolean('custom')
});

export const personDiets = pgTable('person_diets', {
	id: serial('id').primaryKey(),
	personId: integer('person_id').references(() => people.id),
	dietId: integer('diet_id').references(() => diets.id)
});

export const appUsers = pgTable('app_users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	personId: integer('person_id').references(() => people.id)
});

export const userSessions = pgTable('user_sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => appUsers.id),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const appUsersEvents = pgTable('app_users_events', {
	id: serial('id').primaryKey(),
	appUserId: integer('app_user_id')
		.notNull()
		.references(() => appUsers.id),
	eventId: varchar('event_id', { length: 6 }).references(() => events.id)
});
