import { motion } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ProgressRing } from '@/components/ui/ProgressRing';
import Link from 'next/link';
import type { Route } from 'next';
import { DBProject } from '@/types/database';

export function ProjectCard({ project }: { project: DBProject }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
            <Link 
                href={`/projects/${project.id}` as Route}
                className="block p-6"
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <h3 className="text-lg font-medium text-navy-900 group-hover:text-teal-600 transition-colors">
                                {project.name}
                            </h3>
                            <ChevronRightIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(project.start_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                {project.teamSize} members
                            </span>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            {project.project_types.map((type) => (
                                <span 
                                    key={type}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-800"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                    <ProgressRing progress={project.progress} />
                </div>
                
                <div className="mt-4 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </Link>
        </motion.div>
    );
} 