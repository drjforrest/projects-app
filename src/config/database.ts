import { DatabaseConnection } from '@/db/connection';
import { PoolClient } from 'pg';

export type QueryParam = string | number | boolean | Date | string[] | null;

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'projects_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
};

try {
    DatabaseConnection.initialize(dbConfig);
} catch (error) {
    console.error('Failed to initialize database connection:', error);
}

export async function query(text: string, params?: QueryParam[]) {
    try {
        const client = await DatabaseConnection.getInstance().connect();
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database operation failed');
    }
}

export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await DatabaseConnection.getInstance().connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
} 