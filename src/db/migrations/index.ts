import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface Migration {
    version: string;
    description: string;
    filename: string;
}

export class DatabaseMigration {
    private pool: Pool;
    private migrationsPath: string;

    constructor(pool: Pool) {
        this.pool = pool;
        this.migrationsPath = path.join(__dirname, 'scripts');
    }

    private async getCurrentVersion(): Promise<string> {
        const result = await this.pool.query(
            'SELECT version FROM schema_history ORDER BY applied_at DESC LIMIT 1'
        );
        return result.rows[0]?.version || '0.0.0';
    }

    private async getMigrationFiles(): Promise<Migration[]> {
        const files = await fs.promises.readdir(this.migrationsPath);
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
    }

    private compareVersions(a: string, b: string): number {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (aPart !== bPart) return aPart - bPart;
        }
        return 0;
    }

    private calculateChecksum(content: string): string {
        return crypto.createHash('md5').update(content).digest('hex');
    }

    async migrate(): Promise<void> {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            const currentVersion = await this.getCurrentVersion();
            const migrations = await this.getMigrationFiles();
            const pendingMigrations = migrations.filter(
                m => this.compareVersions(m.version, currentVersion) > 0
            );

            for (const migration of pendingMigrations) {
                const startTime = Date.now();
                console.log(`Applying migration ${migration.version}: ${migration.description}`);

                const scriptPath = path.join(this.migrationsPath, migration.filename);
                const scriptContent = await fs.promises.readFile(scriptPath, 'utf8');
                const checksum = this.calculateChecksum(scriptContent);

                try {
                    // Execute migration
                    await client.query(scriptContent);

                    // Record successful migration
                    await client.query(
                        `INSERT INTO schema_history 
                        (version, description, script_name, checksum, execution_time) 
                        VALUES ($1, $2, $3, $4, $5)`,
                        [
                            migration.version,
                            migration.description,
                            migration.filename,
                            checksum,
                            Date.now() - startTime
                        ]
                    );

                    console.log(`Successfully applied migration ${migration.version}`);
                } catch (error) {
                    console.error(`Error applying migration ${migration.version}:`, error);
                    throw error;
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
} 