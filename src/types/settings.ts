export interface ProjectSettings {
    defaultCategory: ProjectCategory;
    defaultMilestoneInterval: number; // days
    defaultMeetingDuration: number; // minutes
    autoCreateMilestones: boolean;
    reminderLeadTime: number; // days before deadline
}

export interface NotificationSettings {
    emailNotifications: boolean;
    notifyOn: {
        approachingDeadlines: boolean;
        missedDeadlines: boolean;
        newMeetings: boolean;
        projectUpdates: boolean;
    };
    dailyDigest: boolean;
    weeklyProjectSummary: boolean;
}

export interface DisplaySettings {
    theme: 'light' | 'dark' | 'system';
    compactView: boolean;
    defaultProjectView: 'list' | 'board' | 'calendar';
    showCompletedProjects: boolean;
} 