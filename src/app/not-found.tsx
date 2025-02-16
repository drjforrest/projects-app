'use client';

import Link from 'next/link';
import { useProject } from '@/context/ProjectContext';
import { Route } from 'next';

export default function NotFound() {
    const { currentProject } = useProject();
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-navy-900 mb-4">404 - Page Not Found</h1>
                <p className="text-sage-600 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link 
                    href={currentProject ? `/projects/${currentProject.id}` as Route : '/'}
                    className="text-teal-600 hover:text-teal-700"
                >
                    Return to {currentProject ? 'Current Project' : 'Home'} →
                </Link>
            </div>
        </div>
    );
} 