export interface DBProject {
    project_id: number;
    project_name: string;
    start_date: Date;
    category: string;
    project_types: string[];
    background_context?: string;
    objective: string;
    main_deliverable: string;
    to_whom: string;
    due_date: Date;
    number_of_milestones: number;
    milestones: {
        description: string;
        dueDate: Date;
        completed?: boolean;
    }[];
    resources: {
        type: string;
        description: string;
    }[];
    anticipated_difficulty: number;
    additional_notes?: string;
    status: 'active' | 'completed' | 'cancelled' | 'on_hold';
    created_at: Date;
    updated_at: Date;
}

export interface DBOutput {
    output_id: number;
    project_id: number;
    output_name: string;
    description?: string;
    version_number?: string;
    tags: string[];
    next_action?: string;
    feedback_to?: string;
    time_allocated?: number;
    created_at: Date;
    updated_at: Date;
}

export interface DBMeeting {
    meeting_id: number;
    project_id: number;
    meeting_name: string;
    description?: string;
    attendees: string[];
    quick_notes?: string;
    date_time: Date;
    transcript_path?: string;
    summary_path?: string;
    summary_content?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProjectRetrospective {
    what_went_well: string;
    challenges: string;
    different_next_time: string;
    final_difficulty: number;
}
