import pg, { type QueryResult } from 'pg';
import { DATABASE_URL } from '$env/static/private';
import type { Person } from "$lib/types/People";

const pool = new pg.Pool({
    max: 5,
    connectionString: DATABASE_URL
});

type PostgresQueryResult = (sql: string, params?: any[]) => Promise<QueryResult<any>>
const query: PostgresQueryResult = (sql, params?) => pool.query(sql, params);

// ** READ OPERATIONS ** //
export async function findEventById(code: string): Promise<any[]> {
    const result = await executeQuery(`SELECT * FROM events WHERE id = '${code}'`);
    return result.rows;
}

export async function findHostsByEventId(code: string): Promise<any[]> {
    const result = await executeQuery(`SELECT p.short_name AS name
        FROM hosts h JOIN people p ON p.id = h.host_id
        WHERE h.event_id = '${code}'`);
    return result.rows;
}

export async function getAllEventCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM events');
    return ['ABCABC', 'DEFDEF'];
}

export async function getAllRsvpCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM rsvps');
    return ['XYZXYZ', 'ABC'];
}

export async function getBasicPronouns(): Promise<any[]> {
    const result = await executeQuery(`SELECT id, nickname FROM pronouns WHERE custom = false`);
    return result.rows;
}

export async function getBasicDiets(): Promise<any[]> {
    const result = await executeQuery(`SELECT id, details FROM diets WHERE custom = false`);
    return result.rows;
}

// ** WRITE OPERATIONS ** //
export async function createPerson(person: Person): Promise<string> {
    const insertPerson = 'INSERT INTO people(short_name, full_name, phone, email) VALUES($1, $2, $3, $4) RETURNING id';
    const values = [`${person.name}`, `${person.full_name}`, `${person.phone}`, `${person.email}`];
    const result = await executeQuery(insertPerson, values);
    return result.rows[0].id;
}

export async function addPronounToPerson(person_id: string, pronoun_id: string) {
    const insertPersonPronoun = 'INSERT INTO person_pronouns(person_id, pronoun_id) VALUES($1, $2)';
    await executeQuery(insertPersonPronoun, [`${person_id}`, `${pronoun_id}`]);
}

export async function createOrFindCustomPronoun(pronoun_nickname: string): Promise<string> {
    // check if custom pronoun nickname already exists
    const customPronouns = await executeQuery('SELECT id, nickname FROM pronouns WHERE custom = true');
    const customPronoun = customPronouns.rows.find(item => item.nickname === pronoun_nickname);

    if (customPronoun) return customPronoun.id;

    // if custom pronoun is brand new, add it to the database
    const insertPronoun = `INSERT INTO pronouns(nickname, custom) VALUES('${pronoun_nickname}', true) RETURNING id`;
    const result = await executeQuery(insertPronoun);
    return result.rows[0].id;
}

export async function addDietToPerson(person_id: string, diet_id: string) {
    const insertPersonDiet = 'INSERT INTO person_diets(person_id, diet_id) VALUES($1, $2)';
    await executeQuery(insertPersonDiet, [`${person_id}`, `${diet_id}`]);
}

export async function createOrFindCustomDiet(diet_details: string): Promise<string> {
    // check if custom diet details already exists
    const customPronouns = await executeQuery('SELECT id, details FROM diets WHERE custom = true');
    const customPronoun = customPronouns.rows.find(item => item.details === diet_details);

    if (customPronoun) return customPronoun.id;

    // if custom diate is brand new, add it to the database
    const insertPronoun = `INSERT INTO diets(details, custom) VALUES('${diet_details}', true) RETURNING id`;
    const result = await executeQuery(insertPronoun);
    return result.rows[0].id;
}

export async function createRsvp(rsvp_id: string, event_id: string, guest_id: string, respondent_id: string, attending: string, comments: string) {
    const insertRsvp = 'INSERT INTO rsvps(id, respondent_id, guest_id, event_id, attending, comments) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [`${rsvp_id}`, `${respondent_id}`, `${guest_id}`, `${event_id}`, `${attending}`, `${comments}`];
    await executeQuery(insertRsvp, values);
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