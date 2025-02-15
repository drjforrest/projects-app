import { NextRequest, NextResponse } from 'next/server';
import * as meetingsDb from '@/db/meetings';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const meetingId = parseInt(params.id);
        const data = await request.json();

        if (data.summary_content) {
            await meetingsDb.updateMeetingSummary(
                meetingId,
                data.summary_content,
                data.summary_path
            );
        } else if (data.transcript_path) {
            await meetingsDb.updateMeetingTranscript(
                meetingId,
                data.transcript_path
            );
        } else {
            await meetingsDb.updateMeeting(meetingId, data);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating meeting:', error);
        return NextResponse.json(
            { error: 'Failed to update meeting' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const meetingId = parseInt(params.id);
        const meeting = await meetingsDb.getMeeting(meetingId);
        return NextResponse.json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meeting' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const meetingId = parseInt(params.id);
        await meetingsDb.deleteMeeting(meetingId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return NextResponse.json(
            { error: 'Failed to delete meeting' },
            { status: 500 }
        );
    }
}
