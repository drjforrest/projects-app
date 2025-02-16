import { NextResponse } from 'next/server';
import { DatabaseConnection } from '@/db/connection';

export async function GET() {
    try {
        const client = await DatabaseConnection.getInstance().connect();
        try {
            const result = await client.query('SELECT NOW()');
            return NextResponse.json({ time: result.rows[0].now });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
} 