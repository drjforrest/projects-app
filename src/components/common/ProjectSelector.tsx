import React, { useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import { DBProject } from '@/types/database';

interface ProjectSelectorProps {
    onSelect: (project: DBProject) => void;
    selectedId?: number;
    className?: string;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
    onSelect,
    selectedId,
    className = ''
}) => {
    const { projects, loadProjects, loading } = useProject();

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-sage-200 rounded"></div>
            </div>
        );
    }

    if (!projects.length) {
        return (
            <div className="bg-rust-50 p-4 rounded-md">
                <p className="text-rust-800">
                    No active projects found. Please create a project first.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="form-label">Select Project</label>
            <select
                value={selectedId || ''}
                onChange={(e) => {
                    const project = projects.find(p => p.project_id === parseInt(e.target.value));
                    if (project) {
                        onSelect(project);
                    }
                }}
                className={`input-field hover:border-teal-400 ${className}`}
            >
                <option value="">Select a project</option>
                {projects.map((project) => (
                    <option 
                        key={project.project_id} 
                        value={project.project_id}
                        disabled={project.status !== 'active'}
                    >
                        {project.project_name} 
                        {project.status !== 'active' ? ` (${project.status})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Helper component for project status badge
export const ProjectStatusBadge: React.FC<{ status: DBProject['status'] }> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'active':
                return 'bg-teal-100 text-teal-800';
            case 'completed':
                return 'bg-sage-100 text-sage-800';
            case 'cancelled':
                return 'bg-rust-100 text-rust-800';
            case 'on_hold':
                return 'bg-gold-100 text-gold-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </span>
    );
};
