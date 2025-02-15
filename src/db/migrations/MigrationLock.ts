import { PoolClient } from 'pg';
import { logger } from '@/utils/logger';
import { DatabaseError } from '@/utils/errors';

export class MigrationLock {
    private static readonly LOCK_ID = 1;
    private static readonly TIMEOUT = 5000; // 5 seconds

    constructor(private client: PoolClient) {}

    async acquire(): Promise<boolean> {
        try {
            // Create lock table if it doesn't exist
            await this.client.query(`
                CREATE TABLE IF NOT EXISTS migration_locks (
                    id INTEGER PRIMARY KEY,
                    locked BOOLEAN DEFAULT false,
                    locked_at TIMESTAMP WITH TIME ZONE,
                    locked_by TEXT
                )`
            );

            // Try to acquire lock
            const result = await this.client.query(
                `INSERT INTO migration_locks (id, locked, locked_at, locked_by)
                 VALUES ($1, true, CURRENT_TIMESTAMP, pg_backend_pid()::text)
                 ON CONFLICT (id) DO UPDATE
                 SET locked = true,
                     locked_at = CURRENT_TIMESTAMP,
                     locked_by = pg_backend_pid()::text
                 WHERE migration_locks.locked = false
                 OR migration_locks.locked_at < CURRENT_TIMESTAMP - interval '5 seconds'
                 RETURNING *`,
                [MigrationLock.LOCK_ID]
            );

            // Ensure result is not null before accessing rowCount
            return result && result.rowCount != null && result.rowCount > 0;
        } catch (error) {
            logger.error('Error acquiring migration lock', { error });
            throw new DatabaseError(
                'Failed to acquire migration lock',
                'LOCK_ERROR',
                'migration_locks'
            );
        }
    }

    async release(): Promise<void> {
        try {
            await this.client.query(
                `UPDATE migration_locks 
                 SET locked = false,
                     locked_at = NULL,
                     locked_by = NULL
                 WHERE id = $1`,
                [MigrationLock.LOCK_ID]
            );
        } catch (error) {
            logger.error('Error releasing migration lock', { error });
        }
    }
}