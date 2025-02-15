import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from './index';

export const pool = new Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
});

// Add error handling
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = async (text: string, params?: (string | number | boolean | Date | null | string[])[]): Promise<QueryResult> => {
    const client = await pool.connect();
    try {
        const start = Date.now();
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } finally {
        client.release();
    }
};

export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export default pool; 