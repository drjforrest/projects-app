import { NextResponse } from 'next/server';
import { pool } from '@/config/database';

export async function GET() {
    try {
        const result = await pool.query('SELECT NOW()');
        return NextResponse.json({ time: result.rows[0].now });
    } catch {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
} 