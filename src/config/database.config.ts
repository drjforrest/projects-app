import { z } from 'zod';
import dotenv from 'dotenv';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DB_HOST: z.string(),
    DB_PORT: z.string().transform(Number),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_SSL: z.string().optional().transform(v => v === 'true'),
    DB_POOL_SIZE: z.string().optional().transform(v => Number(v) || 20),
    DB_IDLE_TIMEOUT: z.string().optional().transform(v => Number(v) || 30000),
});

export type DatabaseConfig = z.infer<typeof envSchema>;

export function getDatabaseConfig(): DatabaseConfig {
    dotenv.config();
    
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors
                .map(err => err.path.join('.'))
                .join(', ');
            throw new Error(`Missing or invalid environment variables: ${missingVars}`);
        }
        throw error;
    }
} 