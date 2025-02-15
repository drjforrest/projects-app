import { NextRequest, NextResponse } from 'next/server';
import * as outputsDb from '@/db/outputs';
import { DBOutput } from '@/types/database';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const outputId = await outputsDb.createOutput(data);
        return NextResponse.json({ outputId }, { status: 201 });
    } catch (error) {
        console.error('Error creating output:', error);
        return NextResponse.json(
            { error: 'Failed to create output' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const search = searchParams.get('search');
        
        if (search) {
            const outputs = await outputsDb.searchOutputs(search);
            return NextResponse.json(outputs);
        } else if (projectId) {
            const outputs = await outputsDb.getProjectOutputs(parseInt(projectId));
            return NextResponse.json(outputs);
        } else {
            const outputs = await outputsDb.getRecentOutputs();
            return NextResponse.json(outputs);
        }
    } catch (error) {
        console.error('Error fetching outputs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch outputs' },
            { status: 500 }
        );
    }
}
