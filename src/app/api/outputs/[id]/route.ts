import { NextRequest, NextResponse } from 'next/server';
import * as outputsDb from '@/db/outputs';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const outputId = parseInt(params.id);
        const data = await request.json();
        await outputsDb.updateOutput(outputId, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating output:', error);
        return NextResponse.json(
            { error: 'Failed to update output' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const outputId = parseInt(params.id);
        const output = await outputsDb.getOutput(outputId);
        return NextResponse.json(output);
    } catch (error) {
        console.error('Error fetching output:', error);
        return NextResponse.json(
            { error: 'Failed to fetch output' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const outputId = parseInt(params.id);
        await outputsDb.deleteOutput(outputId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting output:', error);
        return NextResponse.json(
            { error: 'Failed to delete output' },
            { status: 500 }
        );
    }
}
