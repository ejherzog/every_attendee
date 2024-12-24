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

// ** UTILITY FUNCTIONS ** //
async function executeQuery(query_string: string, values?: string[]): Promise<QueryResult> {
    try {
        return await query(query_string, values);
    } catch (err) {
        console.log(err);
        throw err;
    }
}