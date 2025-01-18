import pg, { type QueryResult } from 'pg';
import { DATABASE_URL } from '$env/static/private';
import type { Person } from "$lib/types/People";

const pool = new pg.Pool({
    max: 5,
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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

export async function findRsvp(event_code: string, confirmation_code: string): Promise<any[]> {
    const result = await executeQuery(`SELECT r.id, r.guest_id, 
        p.short_name AS name, p.full_name, p.phone, p.email, r.attending, r.comments
        FROM rsvps r JOIN people p ON p.id = r.respondent_id
        WHERE r.id = '${confirmation_code}' AND r.event_id = '${event_code}'`);
    return result.rows;
}

export async function getAllEventCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM events');
    return result.rows;
}

export async function getAllRsvpCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM rsvps');
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

// ** WRITE OPERATIONS ** //
export async function createPerson(person: Person): Promise<string> {
    const insertPerson = 'INSERT INTO people(short_name, full_name, phone, email) VALUES($1, $2, $3, $4) RETURNING id';
    const values = [`${person.name}`, `${person.full_name}`, `${person.phone}`, `${person.email}`];
    const result = await executeQuery(insertPerson, values);
    return result.rows[0].id;
}

export async function updatePerson(id: number, params: {
    short_name?: string, full_name?: string, phone?: string, email?: string
}) {

    const updateClauses: string[] = [];
    if (params.short_name) updateClauses.push(`short_name = '${params.short_name}'`);
    if (params.full_name) updateClauses.push(`full_name = '${params.full_name}'`);
    if (params.phone) updateClauses.push(`phone = '${params.phone}'`);
    if (params.email) updateClauses.push(`email = '${params.email}'`);

    let updatePerson = 'UPDATE people SET ';
    updatePerson = updatePerson.concat(updateClauses.join(', '));
    updatePerson= updatePerson.concat(` WHERE id = ${id}`);

    await executeQuery(updatePerson);
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
    const customPronoun = customPronouns.rows.find(item => item.details === diet_details);

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

export async function createRsvp(rsvp_id: string, event_id: string, guest_id: string, respondent_id: string, attending: string, comments: string) {
    const insertRsvp = 'INSERT INTO rsvps(id, respondent_id, guest_id, event_id, attending, comments) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [`${rsvp_id}`, `${respondent_id}`, `${guest_id}`, `${event_id}`, `${attending}`, `${comments}`];
    await executeQuery(insertRsvp, values);
}

export async function updateRsvp(rsvp_id: string, attending: string, comments: string) {
    const updateRsvp = `UPDATE rsvps SET attending = '${attending}', comments = '${comments}' WHERE id = '${rsvp_id}'`;
    await executeQuery(updateRsvp);
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