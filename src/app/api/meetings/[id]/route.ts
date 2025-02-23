import { NextResponse } from 'next/server';
import * as meetingsDb from '@/db/meetings';
import { query, QueryParam } from '@/config/database';
import { DBMeeting } from '@/types/database';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const meeting = await meetingsDb.getMeeting(parseInt(id));
        return NextResponse.json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meeting' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const meetingId = parseInt(id);
        const data: Partial<DBMeeting> = await request.json();
        const updateFields: string[] = [];
        const values: QueryParam[] = [];
        let valueCounter = 1;

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && !['meeting_id', 'created_at', 'updated_at'].includes(key)) {
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

        values.push(meetingId);
        await query(
            `UPDATE meetings 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE meeting_id = $${valueCounter}`,
            values
        );

        const result = await query(
            'SELECT * FROM meetings WHERE meeting_id = $1',
            [meetingId]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating meeting:', error);
        return NextResponse.json(
            { error: 'Failed to update meeting' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const result = await query(
            'DELETE FROM meetings WHERE meeting_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Meeting not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return NextResponse.json(
            { error: 'Failed to delete meeting' },
            { status: 500 }
        );
    }
}
