import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useProject } from '@/context/ProjectContext';
import { motion } from 'framer-motion';

export const QuickActions = () => {
    const { loading } = useProject();
    
    if (loading) return null;

    return (
        <motion.div 
            className="fixed bottom-4 right-4 flex flex-col space-y-2"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link 
                    href="/start-project"
                    className="p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
                    title="Start New Project"
                >
                    <PlusIcon className="h-6 w-6" />
                </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link 
                    href="/meetings/new"
                    className="p-3 bg-sage-600 text-white rounded-full shadow-lg hover:bg-sage-700 transition-colors"
                    title="Schedule Meeting"
                >
                    <CalendarIcon className="h-6 w-6" />
                </Link>
            </motion.div>
        </motion.div>
    );
}; 