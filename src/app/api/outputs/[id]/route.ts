import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/config/database';
import { DBOutput } from '@/types/database';

type QueryParam = string | number | Date;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            'SELECT * FROM outputs WHERE output_id = $1',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Output not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching output:', error);
        return NextResponse.json(
            { error: 'Failed to fetch output' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data: Partial<DBOutput> = await request.json();
        const updateFields: string[] = [];
        const values: QueryParam[] = [];
        let valueCounter = 1;

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && !['output_id', 'created_at', 'updated_at'].includes(key)) {
                updateFields.push(`${key} = $${valueCounter}`);
                values.push(value);
                valueCounter++;
            }
        });

        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        values.push(params.id);
        await query(
            `UPDATE outputs 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE output_id = $${valueCounter}`,
            values
        );

        const result = await query(
            'SELECT * FROM outputs WHERE output_id = $1',
            [params.id]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating output:', error);
        return NextResponse.json(
            { error: 'Failed to update output' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            'DELETE FROM outputs WHERE output_id = $1 RETURNING *',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Output not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting output:', error);
        return NextResponse.json(
            { error: 'Failed to delete output' },
            { status: 500 }
        );
    }
}
