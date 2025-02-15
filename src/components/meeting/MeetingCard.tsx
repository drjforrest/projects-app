import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { DBMeeting } from '@/types/database';

export function MeetingCard({ meeting }: { meeting: DBMeeting }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
            <Link 
                href={`/meetings/${meeting.meeting_id}`}
                className="block p-6"
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-navy-900 group-hover:text-teal-600 transition-colors">
                            {meeting.meeting_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(meeting.date_time).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {new Date(meeting.date_time).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                            <span className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                {meeting.attendees.length} attendees
                            </span>
                        </div>
                        {meeting.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {meeting.description}
                            </p>
                        )}
                    </div>
                    <motion.div 
                        className="h-2 w-2 rounded-full bg-teal-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </Link>
        </motion.div>
    );
} 