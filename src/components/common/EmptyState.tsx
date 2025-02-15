import React from 'react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon,
    action
}) => {
    return (
        <div className="text-center py-12 px-4 animate-fade-in">
            {icon && (
                <div className="flex justify-center mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-navy-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-sage-600 max-w-sm mx-auto">
                {message}
            </p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-6 btn-primary"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

// Predefined empty states
export const NoProjectsEmptyState: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => (
    <EmptyState
        title="No Projects Yet"
        message="Get started by creating your first project"
        icon={
            <svg 
                className="w-12 h-12 text-sage-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        }
        action={{
            label: "Create Project",
            onClick: onCreateClick
        }}
    />
);

export const NoOutputsEmptyState: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => (
    <EmptyState
        title="No Outputs Recorded"
        message="Start tracking your project outputs"
        icon={
            <svg 
                className="w-12 h-12 text-sage-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        }
        action={{
            label: "Add Output",
            onClick: onCreateClick
        }}
    />
);

export const NoMeetingsEmptyState: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => (
    <EmptyState
        title="No Meetings Scheduled"
        message="Schedule your first project meeting"
        icon={
            <svg 
                className="w-12 h-12 text-sage-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        }
        action={{
            label: "Schedule Meeting",
            onClick: onCreateClick
        }}
    />
);
