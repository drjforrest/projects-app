import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    N8N_WEBHOOK_URL: z.string().url().optional(),
    N8N_API_KEY: z.string().min(1).optional(),
});

export function validateEnv() {
    try {
        envSchema.parse(process.env);
    } catch (error) {
        console.error('❌ Invalid environment variables:', error);
        process.exit(1);
    }
} 