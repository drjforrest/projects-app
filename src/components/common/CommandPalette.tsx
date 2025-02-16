'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { CommandLineIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { Route } from 'next';

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const commands = [
        { id: 'new-project', name: 'New Project', shortcut: '⌘N', href: '/start-project' as Route },
        { id: 'new-meeting', name: 'Schedule Meeting', shortcut: '⌘M', href: '/meetings/new' as Route },
        { id: 'projects', name: 'View Projects', shortcut: '⌘P', href: '/projects' as Route },
        { id: 'settings', name: 'Settings', shortcut: '⌘,', href: '/settings' as Route },
    ];

    const filteredCommands = commands.filter(command =>
        command.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-sage-300 hover:text-gold-400"
                title="Command Palette (⌘K)"
            >
                <CommandLineIcon className="h-6 w-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Dialog
                        as={motion.div}
                        static
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
                    >
                        <div className="fixed inset-0 bg-navy-900 bg-opacity-50" />

                        <div className="relative mx-auto max-w-xl rounded-xl bg-white shadow-2xl">
                            <div className="flex items-center px-4 border-b">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                    className="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                                    placeholder="Search commands..."
                                    autoFocus
                                />
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto">
                                {filteredCommands.map((command) => (
                                    <motion.button
                                        key={command.id}
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push(command.href);
                                        }}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                                        whileHover={{ x: 4 }}
                                    >
                                        <span>{command.name}</span>
                                        <span className="text-xs text-gray-400">{command.shortcut}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}; 