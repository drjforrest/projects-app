'use client';

import { ProjectProvider } from '@/context/ProjectContext';
import { SettingsProvider } from '@/context/SettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <ProjectProvider>
                {children}
            </ProjectProvider>
        </SettingsProvider>
    );
} 