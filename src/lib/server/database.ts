import { eq, and, inArray, ne, sql } from 'drizzle-orm';
import { db } from './db';
import {
	people,
	events,
	hosts,
	responses,
	guests,
	pronouns,
	personPronouns,
	diets,
	personDiets,
	appUsers,
	userSessions,
	appUsersEvents,
	hostInvites
} from './db';
import type { Person } from '$lib/types/People';
import type { Session } from './auth';
import type { DB_AppUser } from '$lib/types/db/DB_AppUser';
import type { Reply } from '$lib/types/Reply';
type DbOrTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ** USER AUTH OPERATIONS ** //
export async function getUser(username: string): Promise<DB_AppUser> {
	const u = await getUserOptional(username);
	if (!u) throw new Error('User not found');
	return u;
}

export async function getUserOptional(username: string): Promise<DB_AppUser | null> {
	const rows = await db.select().from(appUsers).where(eq(appUsers.username, username));
	const row = rows[0];
	if (!row) return null;
	return {
		id: row.id,
		username: row.username,
		password_hash: row.passwordHash,
		person_id: row.personId ?? undefined
	} as DB_AppUser;
}

export async function getUsername(user_id: number): Promise<string> {
	const rows = await db.select({ username: appUsers.username }).from(appUsers).where(eq(appUsers.id, user_id));
	return rows[0]?.username ?? '';
}

export async function insertSession(session: Session) {
	await db.insert(userSessions).values({
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt
	});
}

export async function retrieveSession(sessionId: string): Promise<{ id: string; user_id: number; expires_at: Date } | undefined> {
	const rows = await db.select().from(userSessions).where(eq(userSessions.id, sessionId));
	const row = rows[0];
	if (!row) return undefined;
	return { id: row.id, user_id: row.userId, expires_at: row.expiresAt };
}

export async function updateSessionExpiration(session: Session) {
	await db.update(userSessions).set({ expiresAt: session.expiresAt }).where(eq(userSessions.id, session.id));
}

export async function deleteSession(sessionId: string) {
	await db.delete(userSessions).where(eq(userSessions.id, sessionId));
}

// ** HOST INVITES ** //
export async function insertHostInvite(
	email: string,
	token: string,
	expiresAt: Date,
	createdByUserId?: number
): Promise<void> {
	await db.insert(hostInvites).values({
		email,
		token,
		expiresAt,
		createdByUserId: createdByUserId ?? null
	});
}

export async function getHostInviteByToken(token: string): Promise<{
	id: number;
	email: string;
	token: string;
	expires_at: Date;
	created_at: Date;
	created_by_user_id: number | null;
} | null> {
	const rows = await db
		.select()
		.from(hostInvites)
		.where(eq(hostInvites.token, token));
	const row = rows[0];
	if (!row) return null;
	if (row.expiresAt.getTime() <= Date.now()) return null;
	return {
		id: row.id,
		email: row.email,
		token: row.token,
		expires_at: row.expiresAt,
		created_at: row.createdAt,
		created_by_user_id: row.createdByUserId ?? null
	};
}

export async function deleteHostInviteByToken(token: string): Promise<void> {
	await db.delete(hostInvites).where(eq(hostInvites.token, token));
}

export async function insertAppUser(
	username: string,
	passwordHash: string,
	personId: number | null = null
): Promise<number> {
	const [row] = await db
		.insert(appUsers)
		.values({ username, passwordHash, personId })
		.returning({ id: appUsers.id });
	if (!row) throw new Error('Insert app_user failed');
	return row.id;
}

// ** READ OPERATIONS ** //
function eventRowToSnake(row: typeof events.$inferSelect) {
	return {
		id: row.id,
		title: row.title,
		start_time: row.startTime,
		end_time: row.endTime,
		location: row.location,
		address: row.address,
		description: row.description,
		image_url: row.imageUrl
	};
}

export async function findEventById(code: string): Promise<any[]> {
	const rows = await db.select().from(events).where(eq(events.id, code));
	return rows.map(eventRowToSnake);
}

export async function validateEventId(code: string): Promise<boolean> {
	const rows = await db.select({ id: events.id }).from(events).where(eq(events.id, code));
	return rows.length > 0;
}

export async function findHostsByEventId(code: string): Promise<{ name: string }[]> {
	const rows = await db
		.select({ name: people.shortName })
		.from(hosts)
		.innerJoin(people, eq(hosts.hostId, people.id))
		.where(eq(hosts.eventId, code));
	return rows;
}

export async function getPersonFromUser(app_user_id: string): Promise<string> {
	const rows = await db
		.select({ personId: appUsers.personId })
		.from(appUsers)
		.where(eq(appUsers.id, parseInt(app_user_id, 10)));
	const personId = rows[0]?.personId;
	return personId != null ? String(personId) : '';
}

export async function findOtherGuestIds(response_id: string, respondent_id: string): Promise<number[]> {
	const rows = await db
		.select({ guestId: guests.guestId })
		.from(guests)
		.where(
			and(eq(guests.responseId, response_id), ne(guests.guestId, parseInt(respondent_id, 10)))
		);
	return rows.map((r) => r.guestId);
}

/** Returns all guests for a response (respondent first, then others). */
export async function findResponseWithGuests(
	event_code: string,
	confirmation_code: string
): Promise<any[]> {
	const rows = await db
		.select({
			id: responses.id,
			respondent_id: responses.respondentId,
			comments: responses.comments,
			guest_id: guests.guestId,
			name: people.shortName,
			full_name: people.fullName,
			phone: people.phone,
			email: people.email,
			attending: guests.attending
		})
		.from(responses)
		.innerJoin(guests, eq(guests.responseId, responses.id))
		.innerJoin(people, eq(people.id, guests.guestId))
		.where(and(eq(responses.id, confirmation_code), eq(responses.eventId, event_code)))
		.orderBy(
			sql`CASE WHEN ${guests.guestId} = ${responses.respondentId} THEN 0 ELSE 1 END`,
			guests.id
		);
	return rows;
}

export async function validateRsvpId(
	event_code: string,
	confirmation_code: string
): Promise<boolean> {
	const rows = await db
		.select({ id: responses.id })
		.from(responses)
		.where(and(eq(responses.id, confirmation_code), eq(responses.eventId, event_code)));
	return rows.length > 0;
}

export async function findResponsesByEventId(event_code: string): Promise<any[]> {
	const rows = await db
		.select({
			id: responses.id,
			guest_id: guests.guestId,
			name: people.shortName,
			full_name: people.fullName,
			phone: people.phone,
			email: people.email,
			attending: guests.attending,
			comments: responses.comments
		})
		.from(responses)
		.innerJoin(guests, eq(guests.responseId, responses.id))
		.innerJoin(people, eq(people.id, guests.guestId))
		.where(eq(responses.eventId, event_code));
	return rows;
}

export async function findEventsByUserId(app_user_id: number) {
	const rows = await db
		.select()
		.from(events)
		.innerJoin(appUsersEvents, eq(events.id, appUsersEvents.eventId))
		.where(eq(appUsersEvents.appUserId, app_user_id));
	return rows.map((r: { events: typeof events.$inferSelect }) => eventRowToSnake(r.events));
}

export async function getAllEventCodes(): Promise<string[]> {
	const rows = await db.select({ id: events.id }).from(events);
	return rows.map((r) => r.id);
}

export async function getAllResponseCodes(): Promise<string[]> {
	const rows = await db.select({ id: responses.id }).from(responses);
	return rows.map((r) => r.id);
}

export async function getBasicPronouns(): Promise<{ id: number; nickname: string }[]> {
	const rows = await db
		.select({ id: pronouns.id, nickname: pronouns.nickname })
		.from(pronouns)
		.where(eq(pronouns.custom, false));
	return rows;
}

export async function getPronounsForPerson(person_id: number): Promise<{ id: number; nickname: string }[]> {
	const rows = await db
		.select({ id: pronouns.id, nickname: pronouns.nickname })
		.from(pronouns)
		.innerJoin(personPronouns, eq(personPronouns.pronounId, pronouns.id))
		.where(eq(personPronouns.personId, person_id));
	return rows;
}

export async function getPronounsForPeople(people_ids: number[]): Promise<any[]> {
	if (people_ids.length === 0) return [];
	const rows = await db
		.select({
			id: people.id,
			pronoun_id: pronouns.id,
			nickname: pronouns.nickname
		})
		.from(people)
		.innerJoin(personPronouns, eq(personPronouns.personId, people.id))
		.innerJoin(pronouns, eq(pronouns.id, personPronouns.pronounId))
		.where(inArray(people.id, people_ids));
	return rows;
}

export async function getBasicDiets(): Promise<{ id: number; details: string | null }[]> {
	const rows = await db
		.select({ id: diets.id, details: diets.details })
		.from(diets)
		.where(eq(diets.custom, false));
	return rows;
}

export async function getDietsForPerson(person_id: number): Promise<{ id: number; details: string | null }[]> {
	const rows = await db
		.select({ id: diets.id, details: diets.details })
		.from(diets)
		.innerJoin(personDiets, eq(personDiets.dietId, diets.id))
		.where(eq(personDiets.personId, person_id));
	return rows;
}

export async function getDietsForPeople(people_ids: number[]): Promise<any[]> {
	if (people_ids.length === 0) return [];
	const rows = await db
		.select({
			id: people.id,
			diet_id: diets.id,
			details: diets.details
		})
		.from(people)
		.innerJoin(personDiets, eq(personDiets.personId, people.id))
		.innerJoin(diets, eq(diets.id, personDiets.dietId))
		.where(inArray(people.id, people_ids));
	return rows;
}

// ** WRITE OPERATIONS ** //
export async function createPerson(person: Person): Promise<string> {
	const [row] = await db
		.insert(people)
		.values({
			shortName: person.name,
			fullName: person.full_name ?? null,
			phone: person.phone ?? null,
			email: person.email ?? null
		})
		.returning({ id: people.id });
	if (!row) throw new Error('Insert person failed');
	return String(row.id);
}

async function insertPersonWithTx(
	tx: DbOrTx,
	person: Person
): Promise<string> {
	const [row] = await tx
		.insert(people)
		.values({
			shortName: person.name,
			fullName: person.full_name ?? null,
			phone: person.phone ?? null,
			email: person.email ?? null
		})
		.returning({ id: people.id });
	if (!row) throw new Error('Insert person failed');
	return String(row.id);
}

export async function insertPerson(tx: DbOrTx, person: Person): Promise<string> {
	return insertPersonWithTx(tx, person);
}

export async function updatePerson(
	id: number,
	params: {
		short_name?: string;
		full_name?: string;
		phone?: string;
		email?: string;
	}
) {
	const set: Record<string, string | null> = {};
	if (params.short_name !== undefined) set.shortName = params.short_name;
	if (params.full_name !== undefined) set.fullName = params.full_name;
	if (params.phone !== undefined) set.phone = params.phone;
	if (params.email !== undefined) set.email = params.email;
	if (Object.keys(set).length === 0) return;
	await db.update(people).set(set).where(eq(people.id, id));
}

async function addPronounToPersonWithTx(
	tx: DbOrTx,
	person_id: string,
	pronoun_id: string
) {
	await tx.insert(personPronouns).values({
		personId: parseInt(person_id, 10),
		pronounId: parseInt(pronoun_id, 10)
	});
}

async function addDietToPersonWithTx(tx: DbOrTx, person_id: string, diet_id: string) {
	await tx.insert(personDiets).values({
		personId: parseInt(person_id, 10),
		dietId: parseInt(diet_id, 10)
	});
}

async function createOrFindCustomPronounWithTx(
	tx: DbOrTx,
	pronoun_nickname: string
): Promise<string> {
	const customRows = await tx
		.select({ id: pronouns.id, nickname: pronouns.nickname })
		.from(pronouns)
		.where(eq(pronouns.custom, true));
	const existing = customRows.find((r) => r.nickname === pronoun_nickname);
	if (existing) return String(existing.id);
	const [row] = await tx
		.insert(pronouns)
		.values({ nickname: pronoun_nickname, custom: true })
		.returning({ id: pronouns.id });
	if (!row) throw new Error('Insert pronoun failed');
	return String(row.id);
}

async function createOrFindCustomDietWithTx(
	tx: DbOrTx,
	diet_details: string
): Promise<string> {
	const customRows = await tx
		.select({ id: diets.id, details: diets.details })
		.from(diets)
		.where(eq(diets.custom, true));
	const existing = customRows.find((r) => r.details === diet_details);
	if (existing) return String(existing.id);
	const [row] = await tx
		.insert(diets)
		.values({ details: diet_details, custom: true })
		.returning({ id: diets.id });
	if (!row) throw new Error('Insert diet failed');
	return String(row.id);
}

type PronounDietItem = { value?: number; label?: string };

async function addPronounsAndDietsForPersonWithTx(
	tx: DbOrTx,
	person_id: string,
	person: { pronouns?: (PronounDietItem | string)[]; diets?: (PronounDietItem | string)[] }
) {
	const pronounsList = person?.pronouns ?? [];
	for (const item of pronounsList) {
		if (item == null) continue;
		const label = typeof item === 'string' ? item : (item as PronounDietItem).label;
		const value = typeof item === 'object' ? (item as PronounDietItem).value : null;
		if (value != null && value !== ('' as any)) {
			await addPronounToPersonWithTx(tx, person_id, String(value));
		} else if (label) {
			const pronounId = await createOrFindCustomPronounWithTx(tx, String(label));
			await addPronounToPersonWithTx(tx, person_id, pronounId);
		}
	}
	const dietsList = person?.diets ?? [];
	for (const item of dietsList) {
		if (item == null) continue;
		const label = typeof item === 'string' ? item : (item as PronounDietItem).label;
		const value = typeof item === 'object' ? (item as PronounDietItem).value : null;
		if (value != null && value !== ('' as any)) {
			await addDietToPersonWithTx(tx, person_id, String(value));
		} else if (label) {
			const dietId = await createOrFindCustomDietWithTx(tx, String(label));
			await addDietToPersonWithTx(tx, person_id, dietId);
		}
	}
}

export async function createOrFindCustomPronoun(pronoun_nickname: string): Promise<string> {
	const customRows = await db
		.select({ id: pronouns.id, nickname: pronouns.nickname })
		.from(pronouns)
		.where(eq(pronouns.custom, true));
	const existing = customRows.find((r) => r.nickname === pronoun_nickname);
	if (existing) return String(existing.id);
	const [row] = await db
		.insert(pronouns)
		.values({ nickname: pronoun_nickname, custom: true })
		.returning({ id: pronouns.id });
	if (!row) throw new Error('Insert pronoun failed');
	return String(row.id);
}

export async function removeAllPronounsFromPerson(person_id: string) {
	await db.delete(personPronouns).where(eq(personPronouns.personId, parseInt(person_id, 10)));
}

export async function addPronounToPerson(person_id: string, pronoun_id: string) {
	await db.insert(personPronouns).values({
		personId: parseInt(person_id, 10),
		pronounId: parseInt(pronoun_id, 10)
	});
}

export async function addDietToPerson(person_id: string, diet_id: string) {
	await db.insert(personDiets).values({
		personId: parseInt(person_id, 10),
		dietId: parseInt(diet_id, 10)
	});
}

export async function createOrFindCustomDiet(diet_details: string): Promise<string> {
	const customRows = await db
		.select({ id: diets.id, details: diets.details })
		.from(diets)
		.where(eq(diets.custom, true));
	const existing = customRows.find((r) => r.details === diet_details);
	if (existing) return String(existing.id);
	const [row] = await db
		.insert(diets)
		.values({ details: diet_details, custom: true })
		.returning({ id: diets.id });
	if (!row) throw new Error('Insert diet failed');
	return String(row.id);
}

export async function removeAllDietsFromPerson(person_id: string) {
	await db.delete(personDiets).where(eq(personDiets.personId, parseInt(person_id, 10)));
}

export async function addEventToAppUser(event_id: string, app_user_id: string) {
	await db.insert(appUsersEvents).values({
		eventId: event_id,
		appUserId: parseInt(app_user_id, 10)
	});
}

export async function recordResponse(event_id: string, response_id: string, response: Reply) {
	await db.transaction(async (tx) => {
		const respondent_id = await insertPersonWithTx(tx, response.respondent.person);
		await addPronounsAndDietsForPersonWithTx(tx, respondent_id, response.respondent.person);

		await tx.insert(responses).values({
			id: response_id,
			respondentId: parseInt(respondent_id, 10),
			eventId: event_id,
			comments: response.note ?? null
		});

		await tx.insert(guests).values({
			responseId: response_id,
			guestId: parseInt(respondent_id, 10),
			attending: response.respondent.attending as 'Yes' | 'No' | 'Maybe'
		});

		for (const guest of response.other_guests) {
			const person_id = await insertPersonWithTx(tx, guest.person);
			await addPronounsAndDietsForPersonWithTx(tx, person_id, guest.person);
			await tx.insert(guests).values({
				responseId: response_id,
				guestId: parseInt(person_id, 10),
				attending: guest.attending as 'Yes' | 'No' | 'Maybe'
			});
		}
	});
}

export async function insertResponse(
	tx: DbOrTx,
	response_id: string,
	event_id: string,
	respondent_id: string,
	comments: string
) {
	await tx.insert(responses).values({
		id: response_id,
		respondentId: parseInt(respondent_id, 10),
		eventId: event_id,
		comments: comments || null
	});
}

export async function insertGuest(
	tx: DbOrTx,
	response_id: string,
	guest_id: string,
	attending: string
) {
	await tx.insert(guests).values({
		responseId: response_id,
		guestId: parseInt(guest_id, 10),
		attending: attending as 'Yes' | 'No' | 'Maybe'
	});
}

export async function insertGuestStandalone(
	response_id: string,
	guest_id: string,
	attending: string
) {
	await db.insert(guests).values({
		responseId: response_id,
		guestId: parseInt(guest_id, 10),
		attending: attending as 'Yes' | 'No' | 'Maybe'
	});
}

export async function updateRsvp(
	response_id: string,
	guest_id: string,
	attending: string,
	comments: string
) {
	await db.transaction(async (tx) => {
		await tx.update(responses).set({ comments: comments || null }).where(eq(responses.id, response_id));
		await tx
			.update(guests)
			.set({ attending: attending as 'Yes' | 'No' | 'Maybe' })
			.where(and(eq(guests.responseId, response_id), eq(guests.guestId, parseInt(guest_id, 10))));
	});
}

export async function updateResponseComments(response_id: string, comments: string) {
	await db.update(responses).set({ comments: comments || null }).where(eq(responses.id, response_id));
}

export async function updateGuestAttending(
	response_id: string,
	guest_id: string,
	attending: string
) {
	await db
		.update(guests)
		.set({ attending: attending as 'Yes' | 'No' | 'Maybe' })
		.where(and(eq(guests.responseId, response_id), eq(guests.guestId, parseInt(guest_id, 10))));
}

export async function deleteGuest(response_id: string, guest_id: string) {
	await db
		.delete(guests)
		.where(and(eq(guests.responseId, response_id), eq(guests.guestId, parseInt(guest_id, 10))));
}

export async function createEvent(
	event_code: string,
	title: string,
	host_id: string,
	start_time: string,
	end_time: string,
	location: string,
	address: string,
	description: string,
	image_url: string
) {
	await db.insert(events).values({
		id: event_code,
		title,
		startTime: start_time,
		endTime: end_time,
		location,
		address,
		description,
		imageUrl: image_url
	});
	await db.insert(hosts).values({
		eventId: event_code,
		hostId: parseInt(host_id, 10)
	});
}

export async function updateEvent(
	event_id: string,
	title: string,
	start_time: string,
	end_time: string,
	location: string,
	address: string,
	description: string,
	image_url: string
) {
	await db
		.update(events)
		.set({
			title,
			startTime: start_time,
			endTime: end_time,
			location,
			address,
			description,
			imageUrl: image_url
		})
		.where(eq(events.id, event_id));
}
