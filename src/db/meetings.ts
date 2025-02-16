import { query } from './db';
import { DBMeeting } from '@/types/database';

export async function createMeeting(meetingData: Omit<DBMeeting, 'meeting_id' | 'created_at' | 'updated_at'>) {
    const {
        project_id,
        meeting_name,
        description,
        attendees,
        quick_notes,
        date_time,
        transcript_path,
        summary_path,
        summary_content
    } = meetingData;

    const result = await query(
        `INSERT INTO meetings (
            project_id,
            meeting_name,
            description,
            attendees,
            quick_notes,
            date_time,
            transcript_path,
            summary_path,
            summary_content
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING meeting_id`,
        [
            project_id,
            meeting_name,
            description ?? null,
            attendees,
            quick_notes ?? null,
            date_time,
            transcript_path ?? null,
            summary_path ?? null,
            summary_content ?? null
        ]
    );

    return result.rows[0].meeting_id;
}

export async function getProjectMeetings(projectId: number): Promise<DBMeeting[]> {
    const result = await query(
        'SELECT * FROM meetings WHERE project_id = $1 ORDER BY date_time DESC',
        [projectId]
    );
    
    return result.rows;
}

export async function getMeeting(meetingId: number): Promise<DBMeeting> {
    const result = await query(
        'SELECT * FROM meetings WHERE meeting_id = $1',
        [meetingId]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Meeting not found');
    }

    return result.rows[0];
}

export async function updateMeeting(meetingId: number, updateData: Partial<DBMeeting>) {
    const updateFields: string[] = [];
    const values: (string | number | Date | string[] | null)[] = [];
    let valueCounter = 1;

    Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && !['meeting_id', 'created_at', 'updated_at'].includes(key)) {
            updateFields.push(`${key} = $${valueCounter}`);
            values.push(value);
            valueCounter++;
        }
    });

    if (updateFields.length === 0) return;

    values.push(meetingId);
    await query(
        `UPDATE meetings 
        SET ${updateFields.join(', ')} 
        WHERE meeting_id = $${valueCounter}`,
        values
    );
}

export async function deleteMeeting(meetingId: number) {
    await query('DELETE FROM meetings WHERE meeting_id = $1', [meetingId]);
}

export async function getUpcomingMeetings(limit: number = 10): Promise<DBMeeting[]> {
    const result = await query(
        `SELECT m.*, p.project_name 
         FROM meetings m 
         JOIN projects p ON m.project_id = p.project_id 
         WHERE m.date_time > NOW() 
         ORDER BY m.date_time ASC 
         LIMIT $1`,
        [limit]
    );
    
    return result.rows;
}

export async function searchMeetings(searchTerm: string): Promise<DBMeeting[]> {
    const result = await query(
        `SELECT m.*, p.project_name 
         FROM meetings m 
         JOIN projects p ON m.project_id = p.project_id 
         WHERE 
            m.meeting_name ILIKE $1 OR 
            m.description ILIKE $1 OR 
            m.quick_notes ILIKE $1 OR
            m.summary_content ILIKE $1 OR
            $1 = ANY(m.attendees)
         ORDER BY m.date_time DESC`,
        [`%${searchTerm}%`]
    );
    
    return result.rows;
}

export async function updateMeetingSummary(
    meetingId: number, 
    summary_content: string, 
    summary_path?: string
) {
    await query(
        `UPDATE meetings 
        SET summary_content = $1, summary_path = $2 
        WHERE meeting_id = $3`,
        [summary_content ?? null, summary_path ?? null, meetingId]
    );
}

export async function updateMeetingTranscript(
    meetingId: number,
    transcript_path: string
) {
    await query(
        'UPDATE meetings SET transcript_path = $1 WHERE meeting_id = $2',
        [transcript_path, meetingId]
    );
}

export async function getMeetingsByDateRange(
    startDate: Date,
    endDate: Date
): Promise<DBMeeting[]> {
    const result = await query(
        `SELECT m.*, p.project_name 
         FROM meetings m 
         JOIN projects p ON m.project_id = p.project_id 
         WHERE m.date_time BETWEEN $1 AND $2 
         ORDER BY m.date_time ASC`,
        [startDate, endDate]
    );
    
    return result.rows;
}
