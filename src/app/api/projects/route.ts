import { NextRequest, NextResponse } from 'next/server';
import * as projectsDb from '@/db/projects';
import { ProjectStartFormData } from '@/types/project';

export async function POST(request: NextRequest) {
    try {
        const data: ProjectStartFormData = await request.json();
        const projectId = await projectsDb.createProject(data);
        return NextResponse.json({ projectId }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');

        if (projectId) {
            const project = await projectsDb.getProject(parseInt(projectId));
            return NextResponse.json(project);
        } else {
            const projects = await projectsDb.getActiveProjects();
            return NextResponse.json(projects);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
