import pg, { type QueryResult } from 'pg';
import { DATABASE_URL } from '$env/static/private';
import type { Person } from '$lib/types/People';
import { dev } from '$app/environment';
import type { Session } from './auth';
import type { DB_AppUser } from '$lib/types/db/DB_AppUser';

let pool_settings: pg.PoolConfig = {
	max: 5,
	connectionString: DATABASE_URL
};
if (!dev) {
	pool_settings.ssl = { rejectUnauthorized: false };
}

const pool = new pg.Pool(pool_settings);

type PostgresQueryResult = (sql: string, params?: any[]) => Promise<QueryResult<any>>;
const query: PostgresQueryResult = (sql, params?) => pool.query(sql, params);

// ** USER AUTH OPERATIONS ** //
export async function getUser(username: string): Promise<DB_AppUser> {
	const result = await executeQuery(`SELECT * FROM app_users WHERE username = '${username}'`);
	return result.rows[0] as DB_AppUser;
}

export async function getUsername(user_id: number): Promise<string> {
	const result = await executeQuery(`SELECT username FROM app_users WHERE id = ${user_id}`);
	return result.rows[0].username;
}

export async function insertSession(session: Session) {
	const insertQuery = 'INSERT INTO user_sessions(id, user_id, expires_at) VALUES ($1, $2, $3)';
	await executeQuery(insertQuery, [
		session.id,
		`${session.userId}`,
		session.expiresAt.toUTCString()
	]);
}

export async function retrieveSession(sessionId: string): Promise<any> {
	const result =
		await executeQuery(`SELECT user_sessions.id, user_sessions.user_id, user_sessions.expires_at 
        FROM user_sessions WHERE user_sessions.id = '${sessionId}'`);

	return result.rows[0];
}

export async function updateSessionExpiration(session: Session) {
	await executeQuery(
		`UPDATE user_sessions SET expires_at = ${session.expiresAt} WHERE id = ${session.id}`
	);
}

export async function deleteSession(sessionId: string) {
	await executeQuery(`DELETE FROM user_sessions WHERE id = '${sessionId}'`);
}

// ** READ OPERATIONS ** //
export async function findEventById(code: string): Promise<any[]> {
	const result = await executeQuery(`SELECT * FROM events WHERE id = '${code}'`);
	return result.rows;
}

export async function validateEventId(code: string): Promise<boolean> {
	const result = await executeQuery(`SELECT id FROM events WHERE id = '${code}'`);
	return result.rowCount != null && result.rowCount > 0;
}

export async function findHostsByEventId(code: string): Promise<any[]> {
	const result = await executeQuery(`SELECT p.short_name AS name
        FROM hosts h JOIN people p ON p.id = h.host_id
        WHERE h.event_id = '${code}'`);
	return result.rows;
}

export async function getPersonFromUser(app_user_id: string): Promise<string> {
	const result = await executeQuery(`SELECT person_id FROM app_users
        WHERE id = ${app_user_id}`);
	return result.rows[0].person_id;
}

export async function findRsvp(event_code: string, confirmation_code: string): Promise<any[]> {
	const result = await executeQuery(`SELECT r.id, r.guest_id, 
        p.short_name AS name, p.full_name, p.phone, p.email, r.attending, r.comments
        FROM responses r JOIN people p ON p.id = r.respondent_id
        WHERE r.id = '${confirmation_code}' AND r.event_id = '${event_code}'`);
	return result.rows;
}

export async function validateRsvpId(
	event_code: string,
	confirmation_code: string
): Promise<boolean> {
	const result = await executeQuery(`SELECT id FROM responses 
        WHERE id = '${confirmation_code}' AND event_id = '${event_code}'`);
	return result.rowCount != null && result.rowCount > 0;
}

export async function findResponsesByEventId(event_code: string): Promise<any[]> {
	const result = await executeQuery(`SELECT r.id, r.guest_id, 
        p.short_name AS name, p.full_name, p.phone, p.email, r.attending, r.comments
        FROM responses r JOIN people p ON p.id = r.respondent_id
        WHERE r.event_id = '${event_code}'`);
	return result.rows;
}

export async function findEventsByUserId(app_user_id: number) {
	const result = await executeQuery(`SELECT * FROM events e 
        JOIN app_users_events u ON e.id = u.event_id WHERE u.app_user_id = ${app_user_id}`);
	return result.rows;
}

export async function getAllEventCodes(): Promise<string[]> {
	const result = await executeQuery('SELECT id FROM events');
	return result.rows;
}

export async function getAllResponseCodes(): Promise<string[]> {
	const result = await executeQuery('SELECT id FROM responses');
	return result.rows;
}

export async function getBasicPronouns(): Promise<any[]> {
	const result = await executeQuery(`SELECT id, nickname FROM pronouns WHERE custom = false`);
	return result.rows;
}

export async function getPronounsForPerson(person_id: number): Promise<any[]> {
	const result = await executeQuery(`SELECT n.id, n.nickname FROM pronouns n
        JOIN person_pronouns pp ON pp.pronoun_id = n.id
        JOIN people p ON pp.person_id = p.id WHERE p.id = ${person_id}`);
	return result.rows;
}

export async function getPronounsForPeople(people_ids: number[]): Promise<any[]> {
	const result = await executeQuery(`SELECT p.id, n.nickname FROM pronouns n
        JOIN person_pronouns pp ON pp.pronoun_id = n.id
        JOIN people p ON pp.person_id = p.id WHERE p.id IN (${people_ids.join(',')})`);
	return result.rows;
}

export async function getBasicDiets(): Promise<any[]> {
	const result = await executeQuery(`SELECT id, details FROM diets WHERE custom = false`);
	return result.rows;
}

export async function getDietsForPerson(person_id: number): Promise<any[]> {
	const result = await executeQuery(`SELECT d.id, d.details FROM diets d
        JOIN person_diets pd ON pd.diet_id = d.id
        JOIN people p ON pd.person_id = p.id WHERE p.id = ${person_id}`);
	return result.rows;
}

export async function getDietsForPeople(people_ids: number[]): Promise<any[]> {
	const result = await executeQuery(`SELECT p.id, d.details FROM diets d
        JOIN person_diets pd ON pd.diet_id = d.id
        JOIN people p ON pd.person_id = p.id WHERE p.id IN (${people_ids.join(',')})`);
	return result.rows;
}

// ** WRITE OPERATIONS ** //
export async function createPerson(person: Person): Promise<string> {
	const insertPerson =
		'INSERT INTO people(short_name, full_name, phone, email) VALUES($1, $2, $3, $4) RETURNING id';
	const values = [`${person.name}`, `${person.full_name}`, `${person.phone}`, `${person.email}`];
	const result = await executeQuery(insertPerson, values);
	return result.rows[0].id;
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
	const updateClauses: string[] = [];
	if (params.short_name) updateClauses.push(`short_name = '${params.short_name}'`);
	if (params.full_name) updateClauses.push(`full_name = '${params.full_name}'`);
	if (params.phone) updateClauses.push(`phone = '${params.phone}'`);
	if (params.email) updateClauses.push(`email = '${params.email}'`);

	let updatePerson = 'UPDATE people SET ';
	updatePerson = updatePerson.concat(updateClauses.join(', '));
	updatePerson = updatePerson.concat(` WHERE id = ${id}`);

	await executeQuery(updatePerson);
}

export async function addPronounToPerson(person_id: string, pronoun_id: string) {
	const insertPersonPronoun = 'INSERT INTO person_pronouns(person_id, pronoun_id) VALUES($1, $2)';
	await executeQuery(insertPersonPronoun, [`${person_id}`, `${pronoun_id}`]);
}

export async function createOrFindCustomPronoun(pronoun_nickname: string): Promise<string> {
	// check if custom pronoun nickname already exists
	const customPronouns = await executeQuery(
		'SELECT id, nickname FROM pronouns WHERE custom = true'
	);
	const customPronoun = customPronouns.rows.find((item) => item.nickname === pronoun_nickname);

	if (customPronoun) return customPronoun.id;

	// if custom pronoun is brand new, add it to the database
	const insertPronoun = `INSERT INTO pronouns(nickname, custom) VALUES('${pronoun_nickname}', true) RETURNING id`;
	const result = await executeQuery(insertPronoun);
	return result.rows[0].id;
}

export async function removeAllPronounsFromPerson(person_id: string) {
	const deletePersonPronoun = `DELETE FROM person_pronouns WHERE person_id = ${person_id}`;
	await executeQuery(deletePersonPronoun);
}

export async function addDietToPerson(person_id: string, diet_id: string) {
	const insertPersonDiet = 'INSERT INTO person_diets(person_id, diet_id) VALUES($1, $2)';
	await executeQuery(insertPersonDiet, [`${person_id}`, `${diet_id}`]);
}

export async function createOrFindCustomDiet(diet_details: string): Promise<string> {
	// check if custom diet details already exists
	const customPronouns = await executeQuery('SELECT id, details FROM diets WHERE custom = true');
	const customPronoun = customPronouns.rows.find((item) => item.details === diet_details);

	if (customPronoun) return customPronoun.id;

	// if custom diate is brand new, add it to the database
	const insertPronoun = `INSERT INTO diets(details, custom) VALUES('${diet_details}', true) RETURNING id`;
	const result = await executeQuery(insertPronoun);
	return result.rows[0].id;
}

export async function removeAllDietsFromPerson(person_id: string) {
	const deletePersonDiet = `DELETE FROM person_diets WHERE person_id = ${person_id}`;
	await executeQuery(deletePersonDiet);
}

export async function addEventToAppUser(event_id: string, app_user_id: string) {
	const insertUserEvent = `INSERT INTO app_users_events(event_id, app_user_id) VALUES($1, $2)`;
	const values = [`${event_id}`, `${app_user_id}`];
	await executeQuery(insertUserEvent, values);
}

export async function insertResponse(
	response_id: string,
	event_id: string,
	respondent_id: string,
	comments: string
) {
	const insertRsvp =
		'INSERT INTO responses(id, respondent_id, event_id, comments) VALUES($1, $2, $3, $4)';
	const values = [
		`${response_id}`,
		`${respondent_id}`,
		`${event_id}`,
		`${comments}`
	];
	await executeQuery(insertRsvp, values);
}

export async function insertGuest(
	response_id: string,
	guest_id: string,
	attending: string
) {

}

export async function updateRsvp(rsvp_id: string, attending: string, comments: string) {
	const updateRsvp = `UPDATE responses SET attending = '${attending}', comments = '${comments}' WHERE id = '${rsvp_id}'`;
	await executeQuery(updateRsvp);
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
	const createEvent = `INSERT INTO events(id, title, start_time, end_time, location, address, description, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
	const values = [
		`${event_code}`,
		`${title}`,
		`${start_time}`,
		`${end_time}`,
		`${location}`,
		`${address}`,
		`${description}`,
		`${image_url}`
	];
	await executeQuery(createEvent, values);

	const addHost = `INSERT INTO hosts(event_id, host_id) VALUES('${event_code}', '${host_id}')`;
	await executeQuery(addHost);
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
	const updateEvent = `UPDATE events SET 
        title = $1, location = $2, address = $3,
        description = $4, image_url = '${image_url}',
        start_time = '${start_time}', end_time = '${end_time}'
        WHERE id = '${event_id}'`;
	const values = [`${title}`, `${location}`, `${address}`, `${description}`];
	await executeQuery(updateEvent, values);
}

// ** UTILITY FUNCTIONS ** //
async function executeQuery(query_string: string, values?: string[]): Promise<QueryResult> {
	try {
		return await query(query_string, values);
	} catch (err) {
		console.log(err);
		throw err;
	}
}
