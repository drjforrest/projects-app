import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/config/database';
import { DBMeeting } from '@/types/database';

type QueryParam = string | number | Date;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const search = searchParams.get('search');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let queryText = 'SELECT * FROM meetings';
        const queryParams: QueryParam[] = [];
        let paramCounter = 1;

        const conditions: string[] = [];

        if (projectId) {
            conditions.push(`project_id = $${paramCounter++}`);
            queryParams.push(projectId);
        }

        if (search) {
            conditions.push(`(
                meeting_name ILIKE $${paramCounter} OR 
                description ILIKE $${paramCounter} OR 
                quick_notes ILIKE $${paramCounter} OR
                summary_content ILIKE $${paramCounter} OR
                $${paramCounter} = ANY(attendees)
            )`);
            queryParams.push(`%${search}%`);
            paramCounter++;
        }

        if (startDate && endDate) {
            conditions.push(`date_time BETWEEN $${paramCounter} AND $${paramCounter + 1}`);
            queryParams.push(startDate, endDate);
            paramCounter += 2;
        }

        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }

        queryText += ' ORDER BY date_time ASC';

        const result = await query(queryText, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meetings' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: Omit<DBMeeting, 'meeting_id' | 'created_at' | 'updated_at'> = await request.json();

        const result = await transaction(async (client) => {
            const insertResult = await client.query(
                `INSERT INTO meetings (
                    project_id, meeting_name, description,
                    attendees, quick_notes, date_time,
                    transcript_path, summary_path, summary_content
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING meeting_id`,
                [
                    data.project_id,
                    data.meeting_name,
                    data.description,
                    data.attendees,
                    data.quick_notes,
                    data.date_time,
                    data.transcript_path,
                    data.summary_path,
                    data.summary_content
                ]
            );

            return insertResult.rows[0].meeting_id;
        });

        return NextResponse.json({ meeting_id: result });
    } catch (error) {
        console.error('Error creating meeting:', error);
        return NextResponse.json(
            { error: 'Failed to create meeting' },
            { status: 500 }
        );
    }
}
