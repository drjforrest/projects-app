import { Pool, PoolClient, QueryResult } from 'pg';

let pool: Pool;

if (typeof window === 'undefined') {
    pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    });
}

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

export { pool }; 