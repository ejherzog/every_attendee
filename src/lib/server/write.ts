import { query } from "./database";

export async function createUser(name: string) {
    const insertUser = `INSERT INTO people (short_name) VALUES ('${name}')`;
    await executeQuery(insertUser);
}

async function executeQuery(query_string: string) {
    try {
        await query(query_string);
    } catch (err) {
        console.log(err);
        throw err;
    }
}