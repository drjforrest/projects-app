import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/config/database';
import { DBOutput } from '@/types/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const search = searchParams.get('search');

        let queryText = 'SELECT * FROM outputs';
        const queryParams: any[] = [];

        if (projectId) {
            queryText += ' WHERE project_id = $1';
            queryParams.push(projectId);
        } else if (search) {
            queryText += ` WHERE 
                output_name ILIKE $1 OR 
                description ILIKE $1 OR 
                $1 = ANY(tags)`;
            queryParams.push(`%${search}%`);
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching outputs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch outputs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: Omit<DBOutput, 'output_id' | 'created_at' | 'updated_at'> = await request.json();

        const result = await transaction(async (client) => {
            const insertResult = await client.query(
                `INSERT INTO outputs (
                    project_id, output_name, description,
                    version_number, tags, next_action,
                    feedback_to, time_allocated
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING output_id`,
                [
                    data.project_id,
                    data.output_name,
                    data.description,
                    data.version_number,
                    data.tags,
                    data.next_action,
                    data.feedback_to,
                    data.time_allocated
                ]
            );

            return insertResult.rows[0].output_id;
        });

        return NextResponse.json({ output_id: result });
    } catch (error) {
        console.error('Error creating output:', error);
        return NextResponse.json(
            { error: 'Failed to create output' },
            { status: 500 }
        );
    }
}
