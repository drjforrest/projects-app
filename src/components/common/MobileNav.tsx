import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from './NavLink';
import { AnimatePresence, motion } from 'framer-motion';

export const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="lg:hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-sage-300 hover:text-gold-400"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="fixed inset-0 z-50 bg-navy-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.95 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col p-4">
                            <motion.button 
                                onClick={() => setIsOpen(false)}
                                className="self-end p-2 text-sage-300 hover:text-gold-400 mb-4"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </motion.button>
                            <motion.div 
                                className="flex flex-col space-y-4"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <NavLink href="/" mobile>Home</NavLink>
                                <NavLink href="/projects" mobile>Projects</NavLink>
                                <NavLink href="/start-project" mobile>Start Project</NavLink>
                                <NavLink href="/outputs" mobile>Outputs</NavLink>
                                <NavLink href="/meetings" mobile>Meetings</NavLink>
                                <NavLink href="/settings" mobile>Settings</NavLink>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; 