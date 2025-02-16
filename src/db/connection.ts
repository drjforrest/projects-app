import { Pool, PoolConfig, PoolClient } from 'pg';
import { logger } from '@/utils/logger';

export class DatabaseConnection {
    private static instance: Pool;
    private static config: PoolConfig;

    static initialize(config: PoolConfig): void {
        this.config = {
            ...config,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };
    }

    static getInstance(): Pool {
        if (!this.instance) {
            this.instance = new Pool(this.config);
            this.setupErrorHandlers();
        }
        return this.instance;
    }

    static async getClient(): Promise<PoolClient> {
        const client = await this.getInstance().connect();
        const release = client.release;
        
        // Override release method
        client.release = () => {
            return release.apply(client);
        };
        return client;
    }

    private static setupErrorHandlers(): void {
        this.instance.on('error', (err) => {
            logger.error('Unexpected error on idle client', { error: err });
        });

        this.instance.on('connect', () => {
            logger.info('New client connected to the pool');
        });

        process.on('exit', () => {
            this.instance?.end();
        });
    }

    static async transaction<T>(
        callback: (client: PoolClient) => Promise<T>
    ): Promise<T> {
        const client = await this.getClient();
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
} 