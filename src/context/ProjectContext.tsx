'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { DBProject, DBOutput, DBMeeting, ProjectRetrospective } from '@/types/database';
import * as api from '@/lib/api';
import { ProjectStartFormData } from '@/types/project';

interface ProjectContextType {
    currentProject: DBProject | null;
    projects: DBProject[];
    outputs: DBOutput[];
    meetings: DBMeeting[];
    loading: boolean;
    error: Error | null;
    loadProject: (id: number) => Promise<void>;
    loadProjects: () => Promise<void>;
    createNewProject: (data: ProjectStartFormData) => Promise<number>;
    closeProject: (id: number, retrospective: ProjectRetrospective) => Promise<void>;
    createOutput: (data: Omit<DBOutput, 'output_id' | 'created_at' | 'updated_at'>) => Promise<number>;
    updateOutput: (id: number, data: Partial<DBOutput>) => Promise<void>;
    deleteOutput: (id: number) => Promise<void>;
    createMeeting: (data: Omit<DBMeeting, 'meeting_id' | 'created_at' | 'updated_at'>) => Promise<number>;
    updateMeeting: (id: number, data: Partial<DBMeeting>) => Promise<void>;
    deleteMeeting: (id: number) => Promise<void>;
}

interface ProjectState {
    currentProject: DBProject | null;
    projects: DBProject[];
    outputs: DBOutput[];
    meetings: DBMeeting[];
    loading: boolean;
    error: Error | null;
}

type ProjectAction =
    | { type: 'SET_CURRENT_PROJECT'; payload: DBProject }
    | { type: 'SET_PROJECTS'; payload: DBProject[] }
    | { type: 'SET_OUTPUTS'; payload: DBOutput[] }
    | { type: 'SET_MEETINGS'; payload: DBMeeting[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error | null }
    | { type: 'ADD_PROJECT'; payload: DBProject }
    | { type: 'UPDATE_PROJECT'; payload: DBProject }
    | { type: 'ADD_OUTPUT'; payload: DBOutput }
    | { type: 'UPDATE_OUTPUT'; payload: DBOutput }
    | { type: 'DELETE_OUTPUT'; payload: number }
    | { type: 'ADD_MEETING'; payload: DBMeeting }
    | { type: 'UPDATE_MEETING'; payload: DBMeeting }
    | { type: 'DELETE_MEETING'; payload: number };

const initialState: ProjectState = {
    currentProject: null,
    projects: [],
    outputs: [],
    meetings: [],
    loading: false,
    error: null,
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProject: action.payload };
        case 'SET_PROJECTS':
            return { ...state, projects: action.payload };
        case 'SET_OUTPUTS':
            return { ...state, outputs: action.payload };
        case 'SET_MEETINGS':
            return { ...state, meetings: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_PROJECT':
            return {
                ...state,
                projects: [...state.projects, action.payload],
            };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload.id ? action.payload : project
                ),
                currentProject: state.currentProject?.id === action.payload.id
                    ? action.payload
                    : state.currentProject,
            };
        case 'ADD_OUTPUT':
            return {
                ...state,
                outputs: [...state.outputs, action.payload],
            };
        case 'UPDATE_OUTPUT':
            return {
                ...state,
                outputs: state.outputs.map(output =>
                    output.output_id === action.payload.output_id ? action.payload : output
                ),
            };
        case 'DELETE_OUTPUT':
            return {
                ...state,
                outputs: state.outputs.filter(output => output.output_id !== action.payload),
            };
        case 'ADD_MEETING':
            return {
                ...state,
                meetings: [...state.meetings, action.payload],
            };
        case 'UPDATE_MEETING':
            return {
                ...state,
                meetings: state.meetings.map(meeting =>
                    meeting.meeting_id === action.payload.meeting_id ? action.payload : meeting
                ),
            };
        case 'DELETE_MEETING':
            return {
                ...state,
                meetings: state.meetings.filter(meeting => meeting.meeting_id !== action.payload),
            };
        default:
            return state;
    }
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(projectReducer, initialState);

    const loadProject = useCallback(async (id: number) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const project = await api.getProject(id);
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
            
            // Load associated data
            const [outputs, meetings] = await Promise.all([
                api.getProjectOutputs(id),
                api.getProjectMeetings(id),
            ]);
            
            dispatch({ type: 'SET_OUTPUTS', payload: outputs });
            dispatch({ type: 'SET_MEETINGS', payload: meetings });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const loadProjects = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const projects = await api.getProjects();
            dispatch({ type: 'SET_PROJECTS', payload: projects });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const createNewProject = useCallback(async (data: ProjectStartFormData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const projectId = await api.createProject(data);
            const newProject = await api.getProject(projectId);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_ERROR', payload: null });
            return projectId;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const closeProject = useCallback(async (id: number, retrospective: ProjectRetrospective) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await api.closeProject(id, retrospective);
            const updatedProject = await api.getProject(id);
            dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const createOutput = useCallback(async (data: Omit<DBOutput, 'output_id' | 'created_at' | 'updated_at'>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const outputId = await api.createOutput(data);
            const newOutput = await api.getOutput(outputId);
            dispatch({ type: 'ADD_OUTPUT', payload: newOutput });
            dispatch({ type: 'SET_ERROR', payload: null });
            return outputId;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const updateOutput = useCallback(async (id: number, data: Partial<DBOutput>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await api.updateOutput(id, data);
            const updatedOutput = await api.getOutput(id);
            dispatch({ type: 'UPDATE_OUTPUT', payload: updatedOutput });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const deleteOutput = useCallback(async (id: number) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await api.deleteOutput(id);
            dispatch({ type: 'DELETE_OUTPUT', payload: id });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const createMeeting = useCallback(async (data: Omit<DBMeeting, 'meeting_id' | 'created_at' | 'updated_at'>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const meetingId = await api.createMeeting(data);
            const newMeeting = await api.getMeeting(meetingId);
            dispatch({ type: 'ADD_MEETING', payload: newMeeting });
            dispatch({ type: 'SET_ERROR', payload: null });
            return meetingId;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const updateMeeting = useCallback(async (id: number, data: Partial<DBMeeting>) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await api.updateMeeting(id, data);
            const updatedMeeting = await api.getMeeting(id);
            dispatch({ type: 'UPDATE_MEETING', payload: updatedMeeting });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const deleteMeeting = useCallback(async (id: number) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await api.deleteMeeting(id);
            dispatch({ type: 'DELETE_MEETING', payload: id });
            dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const value = {
        ...state,
        loadProject,
        loadProjects,
        createNewProject,
        closeProject,
        createOutput,
        updateOutput,
        deleteOutput,
        createMeeting,
        updateMeeting,
        deleteMeeting,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
