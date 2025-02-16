'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ProjectSettings, NotificationSettings, DisplaySettings } from '@/types/settings';

interface Settings {
    project: ProjectSettings;
    notifications: NotificationSettings;
    display: DisplaySettings;
}

const defaultSettings: Settings = {
    project: {
        defaultCategory: 'Personal',
        defaultMilestoneInterval: 7,
        defaultMeetingDuration: 30,
        autoCreateMilestones: true,
        reminderLeadTime: 2,
        autoPromptFeedback: true,
        retrospectiveTemplate: 'standard'
    },
    notifications: {
        emailNotifications: true,
        notifyOn: {
            approachingDeadlines: true,
            missedDeadlines: true,
            newMeetings: true,
            projectUpdates: true
        },
        dailyDigest: false,
        weeklyProjectSummary: true
    },
    display: {
        theme: 'system',
        compactView: false,
        defaultProjectView: 'list',
        showCompletedProjects: true
    }
};

interface SettingsContextType {
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
    updateProjectSettings: (updates: Partial<ProjectSettings>) => void;
    updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
    updateDisplaySettings: (updates: Partial<DisplaySettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        const stored = localStorage.getItem('projectAppSettings');
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem('projectAppSettings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const updateProjectSettings = (updates: Partial<ProjectSettings>) => {
        updateSettings({ project: { ...settings.project, ...updates } });
    };

    const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
        updateSettings({ notifications: { ...settings.notifications, ...updates } });
    };

    const updateDisplaySettings = (updates: Partial<DisplaySettings>) => {
        updateSettings({ display: { ...settings.display, ...updates } });
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            updateProjectSettings,
            updateNotificationSettings,
            updateDisplaySettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
} 