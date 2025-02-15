export const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'projects_db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    app: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    },
    n8n: {
        webhookUrl: process.env.N8N_WEBHOOK_URL,
        apiKey: process.env.N8N_API_KEY,
    }
};
