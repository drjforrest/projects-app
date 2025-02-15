import { Pool, PoolClient } from 'pg';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from '@/utils/logger';
import { MigrationError } from '@/utils/errors';
import { Migration, MigrationStatus, MigrationOptions } from './types';
import { MigrationLock } from './MigrationLock';

export class DatabaseMigration {
    private pool: Pool;
    private migrationsPath: string;
    private options: MigrationOptions;

    constructor(pool: Pool, options: MigrationOptions = {}) {
        this.pool = pool;
        this.migrationsPath = path.join(__dirname, 'scripts');
        this.options = options;
    }

    async getStatus(): Promise<MigrationStatus> {
        const client = await this.pool.connect();
        try {
            const currentVersion = await this.getCurrentVersion(client);
            const migrations = await this.getMigrationFiles();
            const appliedMigrations = await this.getAppliedMigrations(client);

            const pending = migrations.filter(
                m => !appliedMigrations.find(am => am.version === m.version)
            );

            return {
                current: currentVersion,
                pending,
                applied: appliedMigrations,
                lastRun: appliedMigrations[0]?.appliedAt
            };
        } finally {
            client.release();
        }
    }

    async migrate(options: MigrationOptions = {}): Promise<void> {
        const client = await this.pool.connect();
        const lock = new MigrationLock(client);

        try {
            if (!await lock.acquire()) {
                throw new MigrationError(
                    'Migration is already in progress',
                    'current',
                    'lock'
                );
            }

            await client.query('BEGIN');

            const status = await this.getStatus();
            if (status.pending.length === 0) {
                logger.info('No pending migrations');
                return;
            }

            for (const migration of status.pending) {
                await this.applyMigration(client, migration, options);
            }

            if (!options.dryRun) {
                await client.query('COMMIT');
                logger.info('Successfully applied all migrations');
            } else {
                await client.query('ROLLBACK');
                logger.info('Dry run completed successfully');
            }
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            await lock.release();
            client.release();
        }
    }

    private async applyMigration(
        client: PoolClient,
        migration: Migration,
        options: MigrationOptions
    ): Promise<void> {
        const startTime = Date.now();
        logger.info(`Applying migration ${migration.version}: ${migration.description}`);

        const scriptPath = path.join(this.migrationsPath, migration.filename);
        const scriptContent = await fs.readFile(scriptPath, 'utf8');
        
        if (!this.validateMigrationFile(scriptContent)) {
            throw new MigrationError(
                'Invalid migration file format',
                migration.version,
                migration.filename
            );
        }

        const checksum = this.calculateChecksum(scriptContent);

        if (!options.dryRun) {
            try {
                await client.query(scriptContent);
                await this.recordMigration(client, {
                    ...migration,
                    checksum,
                    appliedAt: new Date()
                });
            } catch (error) {
                throw new MigrationError(
                    `Failed to apply migration: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    migration.version,
                    migration.filename,
                    error instanceof Error ? error : undefined
                );
            }
        }

        logger.info(`Migration ${migration.version} completed in ${Date.now() - startTime}ms`);
    }

    private async getCurrentVersion(client: PoolClient): Promise<string> {
        try {
            const result = await client.query(
                'SELECT version FROM schema_history ORDER BY applied_at DESC LIMIT 1'
            );
            return result.rows[0]?.version || '0.0.0';
        } catch (error) {
            logger.error('Error getting current version', { error });
            return '0.0.0';
        }
    }

    private async getAppliedMigrations(client: PoolClient): Promise<Migration[]> {
        const result = await client.query(
            'SELECT version, description, script_name as filename, checksum, applied_at as "appliedAt" FROM schema_history ORDER BY applied_at DESC'
        );
        return result.rows;
    }

    private async getMigrationFiles(): Promise<Migration[]> {
        try {
            const files = await fs.readdir(this.migrationsPath);
            return files
                .filter(f => f.endsWith('.sql'))
                .map(filename => {
                    const [version, ...descParts] = filename.replace('.sql', '').split('_');
                    return {
                        version,
                        description: descParts.join('_').replace(/-/g, ' '),
                        filename
                    };
                })
                .sort((a, b) => this.compareVersions(a.version, b.version));
        } catch (error) {
            logger.error('Error reading migration files', { error });
            throw new MigrationError(
                'Failed to read migration files',
                'unknown',
                'directory'
            );
        }
    }

    private validateMigrationFile(content: string): boolean {
        // Basic validation - can be extended based on requirements
        if (!content.trim()) {
            return false;
        }

        // Check for SQL syntax errors (basic check)
        const dangerousKeywords = ['DROP DATABASE', 'TRUNCATE', 'DELETE FROM'];
        if (!this.options?.force && dangerousKeywords.some(kw => content.toUpperCase().includes(kw))) {
            throw new MigrationError(
                'Migration contains dangerous operations',
                'validation',
                'content'
            );
        }

        return true;
    }

    private calculateChecksum(content: string): string {
        return crypto
            .createHash('md5')
            .update(content.replace(/\s+/g, ' ').trim())
            .digest('hex');
    }

    private async recordMigration(
        client: PoolClient,
        migration: Migration
    ): Promise<void> {
        await client.query(
            `INSERT INTO schema_history 
            (version, description, script_name, checksum, applied_at)
            VALUES ($1, $2, $3, $4, $5)`,
            [
                migration.version,
                migration.description,
                migration.filename,
                migration.checksum,
                migration.appliedAt
            ]
        );
    }

    async rollback(version?: string): Promise<void> {
        const client = await this.pool.connect();
        const lock = new MigrationLock(client);

        try {
            if (!await lock.acquire()) {
                throw new MigrationError('Rollback is already in progress', 'current', 'lock');
            }

            await client.query('BEGIN');

            const currentVersion = await this.getCurrentVersion(client);
            if (version && this.compareVersions(version, currentVersion) >= 0) {
                throw new MigrationError(
                    'Cannot rollback to a version ahead of current version',
                    version,
                    'rollback'
                );
            }

            const appliedMigrations = await this.getAppliedMigrations(client);
            const migrationsToRollback = version
                ? appliedMigrations.filter(m => this.compareVersions(m.version, version) > 0)
                : [appliedMigrations[0]];

            for (const migration of migrationsToRollback.reverse()) {
                await this.rollbackMigration(client, migration);
            }

            await client.query('COMMIT');
            logger.info('Rollback completed successfully');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            await lock.release();
            client.release();
        }
    }

    private async rollbackMigration(
        client: PoolClient,
        migration: Migration
    ): Promise<void> {
        const scriptPath = path.join(this.migrationsPath, migration.filename);
        const scriptContent = await fs.readFile(scriptPath, 'utf8');
        
        // Execute rollback section if it exists
        const rollbackMatch = scriptContent.match(/-- Rollback\s+([\s\S]+)$/i);
        if (!rollbackMatch) {
            throw new MigrationError(
                'No rollback section found in migration',
                migration.version,
                migration.filename
            );
        }

        try {
            await client.query(rollbackMatch[1]);
            await client.query(
                'DELETE FROM schema_history WHERE version = $1',
                [migration.version]
            );
            logger.info(`Rolled back migration ${migration.version}`);
        } catch (error) {
            throw new MigrationError(
                `Failed to rollback migration: ${error instanceof Error ? error.message : 'Unknown error'}`,
                migration.version,
                migration.filename,
                error instanceof Error ? error : undefined
            );
        }
    }

    private compareVersions(a: string, b: string): number {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (aPart !== bPart) {
                return aPart - bPart;
            }
        }
        return 0;
    }
} 