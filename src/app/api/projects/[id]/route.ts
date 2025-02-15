import { NextRequest, NextResponse } from 'next/server';
import * as projectsDb from '@/db/projects';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = parseInt(params.id);
        const data = await request.json();

        if (data.status) {
            await projectsDb.updateProjectStatus(projectId, data.status);
        }

        if (data.retrospective) {
            await projectsDb.closeProject(projectId, data.retrospective);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = parseInt(params.id);
        const project = await projectsDb.getProject(projectId);
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}
