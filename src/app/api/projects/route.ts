import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/config/database';
import { ProjectCreateRequest } from '@/types/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let queryText = 'SELECT * FROM projects';
        const queryParams: (string | number)[] = [];

        if (status) {
            queryText += ' WHERE status = $1';
            queryParams.push(status);
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const body: ProjectCreateRequest = await request.json();

        const result = await transaction(async (client) => {
            const insertResult = await client.query(
                `INSERT INTO projects (
                    project_name, start_date, category, project_types,
                    background_context, objective, main_deliverable,
                    to_whom, due_date, number_of_milestones,
                    milestones, resources, anticipated_difficulty,
                    additional_notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING project_id`,
                [
                    body.projectName,
                    body.startDate,
                    body.category,
                    body.types,
                    body.backgroundContext,
                    body.objective,
                    body.mainDeliverable,
                    body.toWhom,
                    body.dueDate,
                    body.numberOfMilestones,
                    JSON.stringify(body.milestones),
                    JSON.stringify(body.resources),
                    body.anticipatedDifficulty,
                    body.additionalNotes
                ]
            );

            return insertResult.rows[0].project_id;
        });

        return NextResponse.json({ project_id: result });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
