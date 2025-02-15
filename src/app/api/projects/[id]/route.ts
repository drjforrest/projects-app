import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/config/database';
import { ProjectRetrospective } from '@/types/database';
import { ProjectUpdateRequest } from '@/types/api';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const result = await query(
            'SELECT * FROM projects WHERE project_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body: ProjectUpdateRequest = await request.json();
        const { status, retrospective } = body as { 
            status?: 'completed' | 'cancelled' | 'on_hold',
            retrospective?: ProjectRetrospective 
        };

        if (status === 'completed' && retrospective) {
            // Handle project completion with retrospective
            await transaction(async (client) => {
                const { what_went_well, challenges, different_next_time, final_difficulty } = retrospective;
                const retrospectiveText = `
                    [Retrospective]
                    - What went well: ${what_went_well}
                    - Challenges: ${challenges}
                    - Improvements: ${different_next_time}`;

                await client.query(
                    `UPDATE projects 
                    SET status = $1,
                        milestones = milestones || $2::jsonb,
                        anticipated_difficulty = $3,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE project_id = $4`,
                    ['completed', retrospectiveText, final_difficulty, id]
                );
            });
        } else {
            // Handle regular project update
            const updateFields: string[] = [];
            const values: (string | number | boolean | Date | null)[] = [];
            let valueCounter = 1;

            Object.entries(body).forEach(([key, value]) => {
                if (value !== undefined && !['project_id', 'created_at', 'updated_at'].includes(key)) {
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

            values.push(id);
            await query(
                `UPDATE projects 
                SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
                WHERE project_id = $${valueCounter}`,
                values
            );
        }

        const result = await query(
            'SELECT * FROM projects WHERE project_id = $1',
            [id]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const result = await query(
            'DELETE FROM projects WHERE project_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
