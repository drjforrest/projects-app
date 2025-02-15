import { useProject } from '@/context/ProjectContext';
import Link from 'next/link';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export const ProjectMenu = () => {
    const { currentProject, loading } = useProject();
    
    if (loading) {
        return (
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        );
    }
    
    if (!currentProject) return null;
    
    return (
        <motion.div 
            className="mb-6 bg-white rounded-lg shadow-sm p-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold group">
                        {currentProject.name}
                        <ChevronRightIcon className="h-4 w-4 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <ProjectStatusBadge status={currentProject.status} />
                </div>
                <div className="flex space-x-4">
                    <motion.div whileHover={{ y: -2 }}>
                        <Link 
                            href={`/projects/${currentProject.id}/outputs`}
                            className="btn-secondary"
                        >
                            Outputs
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }}>
                        <Link 
                            href={`/projects/${currentProject.id}/meetings`}
                            className="btn-secondary"
                        >
                            Meetings
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }}>
                        <Link 
                            href={`/projects/${currentProject.project_id}/close`}
                            className="btn-primary"
                        >
                            Close Project
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}; 