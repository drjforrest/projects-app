import { cn } from '@/lib/utils';
import { DBProject } from '@/types/database';

interface ProjectStatusBadgeProps {
    status: DBProject['status'];
    className?: string;
}

export const ProjectStatusBadge = ({ status, className }: ProjectStatusBadgeProps) => {
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
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getStatusColor(),
            className
        )}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </span>
    );
}; 