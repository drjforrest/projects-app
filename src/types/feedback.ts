export interface OutputFeedback {
    feedback_id?: number;
    outputId: number;
    reviewer: string;
    rating: number;
    comments: string;
    areas: {
        quality: number;
        completeness: number;
        clarity: number;
    };
    actionItems: string[];
    followUpDate?: Date;
    created_at?: Date;
}

export interface ProjectRetrospective {
    projectId: number;
    completionDate: Date;
    completionStatus: 'completed' | 'partially_completed' | 'cancelled' | 'on_hold';
    deliverablesSummary: string;
    keyAchievements: string;
    challengesFaced: string;
    successMetrics: {
        timelineAdherence: number;
        qualityScore: number;
        learningValue: number;
    };
    lessonsLearned: string;
    improvements: string;
    kudos: string[];
    nextSteps: string;
} 