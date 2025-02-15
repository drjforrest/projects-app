import { Pool } from 'pg';
import { config } from '@/config';

const pool = new Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
});

export const query = async (
    text: string, 
    params?: (string | number | boolean | Date | null | string[])[]
) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export const getClient = () => pool.connect();

export const executeQuery = async (
    query: string, 
    params: (string | number | boolean | Date | null)[] = []
) => {
    const start = Date.now();
    try {
        const res = await pool.query(query, params);
        const duration = Date.now() - start;
        console.log('Executed query', { query, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
