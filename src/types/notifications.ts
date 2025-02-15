export type AlertType = 'deadline' | 'milestone' | 'meeting' | 'inactivity' | 'risk';
export type AlertPriority = 'low' | 'medium' | 'high';

export interface ProjectAlert {
    type: AlertType;
    priority: AlertPriority;
    message: string;
    projectId: number;
    actionRequired: boolean;
} 