import { Pool } from 'pg';
import { config } from '@/config';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@/utils/logger';

export async function initializeDatabase() {
    const pool = new Pool({
        user: config.db.user,
        password: config.db.password,
        host: config.db.host,
        port: config.db.port,
        database: config.db.database,
    });

    try {
        // Read and execute the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        logger.info('Database schema initialized successfully');
        
        return pool;
    } catch (error) {
        logger.error('Failed to initialize database', { error });
        throw error;
    }
}

// Run if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export default initializeDatabase; 