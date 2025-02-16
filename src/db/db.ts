import { DatabaseConnection } from './connection';
import { config } from '@/config';
import { QueryParam } from '@/config/database';

// Initialize the database connection
DatabaseConnection.initialize({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
});

export const query = async (
    text: string, 
    params?: QueryParam[]
) => {
    const start = Date.now();
    const client = await DatabaseConnection.getInstance().connect();
    try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } finally {
        client.release();
    }
};

export const getClient = () => DatabaseConnection.getInstance().connect();

export const executeQuery = async (
    query: string, 
    params: QueryParam[] = []
) => {
    const client = await DatabaseConnection.getInstance().connect();
    try {
        const res = await client.query(query, params);
        return res.rows;
    } finally {
        client.release();
    }
};
