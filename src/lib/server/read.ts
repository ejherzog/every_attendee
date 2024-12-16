import type { QueryResult } from "pg";
import { query } from "./database";

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

async function executeQuery(query_string: string): Promise<QueryResult> {
    try {
        return await query(query_string);
    } catch (err) {
        console.log(err);
        throw err;
    }
}