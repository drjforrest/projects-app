import { ProjectRetrospective as DBProjectRetrospective } from '@/types/database';
import { ProjectStartFormData } from '@/types/project';
import { ProjectRetrospective as FeedbackProjectRetrospective } from '@/types/feedback';

// We can use ProjectStartFormData directly since it matches our needs
export type ProjectCreateRequest = ProjectStartFormData;

export interface ProjectUpdateRequest {
    status?: 'completed' | 'cancelled' | 'on_hold';
    retrospective?: DBProjectRetrospective;
    project_name?: string;
    due_date?: Date;
    // Add other updatable fields as needed
}

export interface OutputRequestBody {
    projectId: number;
    outputName: string;
    description: string;
    versionNumber: string;
    tags: string[];
    nextAction: string;
    feedbackTo: string;
    timeAllocated: number;
} 

export interface ProjectRetrospectiveRequest {
    projectId: number;
    retrospective: FeedbackProjectRetrospective;
}