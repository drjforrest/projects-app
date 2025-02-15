import { ProjectStartFormData } from '@/types/project';
import { DBOutput, DBMeeting, ProjectRetrospective, DBProject } from '@/types/database';
import { pool } from '@/config/database';

// Project API calls
export async function createProject(data: ProjectStartFormData) {
    const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    
    return response.json();
}

export async function getProjects() {
    const response = await fetch('/api/projects');
    
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    
    return response.json();
}

export async function getProject(id: number) {
    const response = await fetch(`/api/projects/${id}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    
    return response.json();
}

export async function closeProject(id: number, retrospective: ProjectRetrospective) {
    const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: 'completed',
            retrospective,
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to close project');
    }
    
    return response.json();
}

// Output API calls
export async function createOutput(data: Omit<DBOutput, 'output_id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/outputs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Failed to create output');
    }
    
    return response.json();
}

export async function getProjectOutputs(projectId: number) {
    const response = await fetch(`/api/outputs?projectId=${projectId}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch outputs');
    }
    
    return response.json();
}

export async function searchOutputs(searchTerm: string) {
    const response = await fetch(`/api/outputs?search=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
        throw new Error('Failed to search outputs');
    }
    
    return response.json();
}

export async function updateOutput(id: number, data: Partial<DBOutput>) {
    const response = await fetch(`/api/outputs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update output');
    }
    
    return response.json();
}

export async function deleteOutput(id: number) {
    const response = await fetch(`/api/outputs/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete output');
    }
    
    return response.json();
}

export async function getOutput(id: number) {
    const response = await fetch(`/api/outputs/${id}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch output');
    }
    
    return response.json();
}

// Meeting API calls
export async function createMeeting(data: Omit<DBMeeting, 'meeting_id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Failed to create meeting');
    }
    
    return response.json();
}

export async function getProjectMeetings(projectId: number) {
    const response = await fetch(`/api/meetings?projectId=${projectId}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch meetings');
    }
    
    return response.json();
}

export async function getUpcomingMeetings() {
    const response = await fetch('/api/meetings');
    
    if (!response.ok) {
        throw new Error('Failed to fetch upcoming meetings');
    }
    
    return response.json();
}

export async function updateMeetingSummary(
    meetingId: number,
    summaryContent: string,
    summaryPath?: string
) {
    const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            summary_content: summaryContent,
            summary_path: summaryPath,
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update meeting summary');
    }
    
    return response.json();
}

export async function searchMeetings(searchTerm: string) {
    const response = await fetch(`/api/meetings?search=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
        throw new Error('Failed to search meetings');
    }
    
    return response.json();
}

export async function getMeetingsByDateRange(startDate: Date, endDate: Date) {
    const response = await fetch(
        `/api/meetings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch meetings by date range');
    }
    
    return response.json();
}

export async function updateMeeting(id: number, data: Partial<DBMeeting>) {
    const response = await fetch(`/api/meetings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update meeting');
    }
    
    return response.json();
}

export async function deleteMeeting(id: number) {
    const response = await fetch(`/api/meetings/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete meeting');
    }
    
    return response.json();
}

export async function getMeeting(id: number) {
    const response = await fetch(`/api/meetings/${id}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch meeting');
    }
    
    return response.json();
}

export async function getActiveProjects(): Promise<DBProject[]> {
    const result = await pool.query<DBProject>(
        `SELECT 
            id,
            name,
            start_date as "startDate",
            progress,
            total_hours as "totalHours"
        FROM projects 
        WHERE status = 'active' 
        ORDER BY start_date DESC`
    );
    
    return result.rows;
}
