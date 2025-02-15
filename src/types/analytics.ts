export interface ProjectMetrics {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    averageDifficulty: number;
    onTrackPercentage: number;
    averageCompletionTime: number;
    mostCommonTypes: string[];
}

export interface TimelineMetrics {
    upcomingDeadlines: Array<{
        project_name: string;
        due_date: Date;
    }>;
    recentActivity: Array<{
        type: 'output' | 'meeting';
        description: string;
        date: Date;
    }>;
    milestoneProgress: Array<{
        project_name: string;
        completed: number;
        total: number;
    }>;
} 