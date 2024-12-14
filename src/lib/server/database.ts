import pg, { type QueryResult } from 'pg';
import { DATABASE_URL } from '$env/static/private';

const pool = new pg.Pool({
    max: 5,
    connectionString: DATABASE_URL
});

type PostgresQueryResult = (sql: string, params?: any[]) => Promise<QueryResult<any>>
export const query: PostgresQueryResult = (sql, params?) => pool.query(sql, params);