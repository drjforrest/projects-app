import { DatabaseMigration } from '../DatabaseMigration';
import { Pool, PoolClient } from 'pg';
import { MigrationError } from '@/utils/errors';
import * as fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('@/utils/logger');

describe('DatabaseMigration', () => {
    let pool: Pool;
    let client: PoolClient;
    let migration: DatabaseMigration;

    beforeEach(() => {
        client = {
            query: jest.fn(),
            release: jest.fn(),
        } as unknown as PoolClient;

        pool = {
            connect: jest.fn().mockResolvedValue(client),
        } as unknown as Pool;

        migration = new DatabaseMigration(pool);
    });

    describe('migrate', () => {
        it('should apply pending migrations in order', async () => {
            // Mock implementation
            (fs.readdir as jest.Mock).mockResolvedValue([
                '1.0.0_initial.sql',
                '1.0.1_update.sql'
            ]);

            (fs.readFile as jest.Mock).mockResolvedValue('-- Valid SQL content');
            (client.query as jest.Mock).mockResolvedValue({ rows: [] });

            await migration.migrate();

            expect(client.query).toHaveBeenCalledWith('BEGIN');
            expect(client.query).toHaveBeenCalledWith('COMMIT');
        });

        it('should handle migration errors and rollback', async () => {
            (fs.readdir as jest.Mock).mockResolvedValue(['1.0.0_error.sql']);
            (fs.readFile as jest.Mock).mockResolvedValue('-- Invalid SQL');
            (client.query as jest.Mock).mockRejectedValueOnce(new Error('SQL Error'));

            await expect(migration.migrate()).rejects.toThrow(MigrationError);
            expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        });
    });

    // Add more test cases...
}); 