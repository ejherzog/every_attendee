import pg, { type QueryResult } from 'pg';
import { DATABASE_URL } from '$env/static/private';

const pool = new pg.Pool({
    max: 5,
    connectionString: DATABASE_URL
});

type PostgresQueryResult = (sql: string, params?: any[]) => Promise<QueryResult<any>>
const query: PostgresQueryResult = (sql, params?) => pool.query(sql, params);

// ** READ OPERATIONS ** //
export async function lookupEvent(code: string): Promise<any> {
    const result = await executeQuery(`SELECT * FROM events WHERE id='${code}'`);

    if (result.rowCount != 1) console.log(result);
    console.log(result.rows[0]);
    return result.rows[0];
}

export async function getAllEventCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM events');
    console.log(result.rows);
    return ['ABCABC', 'DEFDEF'];
}

export async function getAllRsvpCodes(): Promise<string[]> {
    const result = await executeQuery('SELECT id FROM rsvps');
    console.log(result.rows);
    return ['XYZXYZ', 'ABC'];
}

// ** WRITE OPERATIONS ** //
import type { Person } from "$lib/types/People";

export async function createPerson(person: Person): Promise<QueryResult> {
    const insertPerson = 'INSERT INTO people(short_name, full_name, phone, email) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [`${person.name}`, `${person.full_name}`, `${person.phone}`, `${person.email}`];
    return await executeQuery(insertPerson, values);
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