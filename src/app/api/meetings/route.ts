import { NextRequest, NextResponse } from 'next/server';
import * as meetingsDb from '@/db/meetings';
import { DBMeeting } from '@/types/database';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const meetingId = await meetingsDb.createMeeting(data);
        return NextResponse.json({ meetingId }, { status: 201 });
    } catch (error) {
        console.error('Error creating meeting:', error);
        return NextResponse.json(
            { error: 'Failed to create meeting' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const search = searchParams.get('search');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        if (search) {
            const meetings = await meetingsDb.searchMeetings(search);
            return NextResponse.json(meetings);
        } else if (projectId) {
            const meetings = await meetingsDb.getProjectMeetings(parseInt(projectId));
            return NextResponse.json(meetings);
        } else if (startDate && endDate) {
            const meetings = await meetingsDb.getMeetingsByDateRange(
                new Date(startDate),
                new Date(endDate)
            );
            return NextResponse.json(meetings);
        } else {
            const meetings = await meetingsDb.getUpcomingMeetings();
            return NextResponse.json(meetings);
        }
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meetings' },
            { status: 500 }
        );
    }
}
