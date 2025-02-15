'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications] = useState([
        { id: 1, message: 'Project deadline approaching', type: 'warning' },
        { id: 2, message: 'New meeting scheduled', type: 'info' },
    ]);

    return (
        <div className="relative">
            <motion.button
                className="p-2 text-sage-300 hover:text-gold-400 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                    <motion.span
                        className="absolute top-1 right-1 h-3 w-3 bg-rust-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                    />
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50"
                    >
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                className="px-4 py-3 hover:bg-gray-50"
                                whileHover={{ x: 4 }}
                            >
                                <p className="text-sm text-gray-900">{notification.message}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; 