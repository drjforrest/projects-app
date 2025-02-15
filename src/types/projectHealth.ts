export interface ProjectHealthData {
    completed_milestones: number;
    total_milestones: number;
    start_date: Date;
    due_date: Date;
    output_count: number;
    avg_time_allocated: number;
    resources: Array<{ usage_count: number }>;
    meeting_count: number;
}

export interface HealthScore {
    overall: number;
    timeline: number;
    quality: number;
    risk: number;
    components: {
        milestonesOnTrack: boolean;
        outputQuality: number;
        meetingFrequency: number;
        resourceUtilization: number;
        feedbackScore: number;
    };
} 