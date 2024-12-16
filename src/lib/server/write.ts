import type { QueryResult } from "pg";
import { query } from "./database";
import type { Person } from "$lib/types/People";

export async function createPerson(person: Person): Promise<QueryResult> {
    const insertPerson = 'INSERT INTO people(short_name, full_name, phone, email) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [`${person.name}`, `${person.full_name}`, `${person.phone}`, `${person.email}`];
    return await executeQuery(insertPerson, values);
}

async function executeQuery(query_string: string, values: string[]): Promise<QueryResult> {
    try {
        return await query(query_string, values);
    } catch (err) {
        console.log(err);
        throw err;
    }
}