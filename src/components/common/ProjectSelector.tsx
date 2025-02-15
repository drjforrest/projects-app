import { DBProject } from '@/types/database';

interface ProjectSelectorProps {
    projects: DBProject[];
    selectedId?: number;
    onSelect: (project: DBProject) => void;
}

export const ProjectSelector = ({ projects, selectedId, onSelect }: ProjectSelectorProps) => {
    return (
        <div className="w-full">
            <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedId || ''}
                onChange={(e) => {
                    const project = projects.find(p => p.id === parseInt(e.target.value));
                    if (project) {
                        onSelect(project);
                    }
                }}
            >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                    <option 
                        key={project.id} 
                        value={project.id}
                        disabled={project.status !== 'active'}
                    >
                        {project.name} 
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
