import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/config/database';
import { ProjectStartFormData } from '@/types/project';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let queryText = 'SELECT * FROM projects';
        const queryParams: any[] = [];

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

export async function POST(request: NextRequest) {
    try {
        const data: ProjectStartFormData = await request.json();

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
                    data.projectName,
                    data.startDate,
                    data.category,
                    data.types,
                    data.backgroundContext,
                    data.objective,
                    data.mainDeliverable,
                    data.toWhom,
                    data.dueDate,
                    data.numberOfMilestones,
                    JSON.stringify(data.milestones),
                    JSON.stringify(data.resources),
                    data.anticipatedDifficulty,
                    data.additionalNotes
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
