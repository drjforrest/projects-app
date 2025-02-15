'use client';

import { useSettings } from '@/context/SettingsContext';
import { ProjectCategory } from '@/types/project';

export default function Settings() {
  const { settings, updateProjectSettings, updateNotificationSettings, updateDisplaySettings } = useSettings();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Defaults</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Category
              </label>
              <select 
                value={settings.project.defaultCategory}
                onChange={(e) => updateProjectSettings({
                  defaultCategory: e.target.value as ProjectCategory
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Meeting Duration (minutes)
              </label>
              <select 
                value={settings.project.defaultMeetingDuration}
                onChange={(e) => updateProjectSettings({
                  defaultMeetingDuration: Number(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Milestone Interval (days)
              </label>
              <input
                type="number"
                value={settings.project.defaultMilestoneInterval}
                onChange={(e) => updateProjectSettings({
                  defaultMilestoneInterval: Number(e.target.value)
                })}
                min={1}
                max={30}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-create Milestones
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.project.autoCreateMilestones}
                    onChange={(e) => updateProjectSettings({
                      autoCreateMilestones: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">Enable automatic milestone creation</span>
                </label>
              </div>
            </div>

            {/* Feedback Settings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Feedback & Retrospectives</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Auto-prompt for feedback
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.project.autoPromptFeedback}
                        onChange={(e) => updateProjectSettings({
                          autoPromptFeedback: e.target.checked
                        })}
                        className="rounded border-gray-300 text-indigo-600"
                      />
                      <span className="ml-2">Prompt for feedback after milestone completion</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Default Retrospective Template
                  </label>
                  <select
                    value={settings.project.retrospectiveTemplate}
                    onChange={(e) => updateProjectSettings({
                      retrospectiveTemplate: e.target.value as 'standard' | 'detailed' | 'minimal'
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </form>
            </div>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateNotificationSettings({
                    emailNotifications: e.target.checked
                  })}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2">Enable email notifications</span>
              </label>
            </div>
            
            {settings.notifications.emailNotifications && (
              <div className="space-y-3 ml-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settings.notifications.notifyOn.approachingDeadlines}
                    onChange={(e) => updateNotificationSettings({
                      notifyOn: {
                        ...settings.notifications.notifyOn,
                        approachingDeadlines: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">Approaching deadlines</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settings.notifications.weeklyProjectSummary}
                    onChange={(e) => updateNotificationSettings({
                      weeklyProjectSummary: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">Weekly project summary</span>
                </label>
              </div>
            )}
          </form>
        </div>
        
        {/* Display Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Display</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select 
                value={settings.display.theme}
                onChange={(e) => updateDisplaySettings({
                  theme: e.target.value as 'light' | 'dark' | 'system'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={settings.display.showCompletedProjects}
                  onChange={(e) => updateDisplaySettings({
                    showCompletedProjects: e.target.checked
                  })}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2">Show completed projects</span>
              </label>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Connected to n8n automation</span>
        </div>
        <button 
          onClick={() => window.open(process.env.NEXT_PUBLIC_N8N_DASHBOARD_URL)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          View Workflows
        </button>
      </div>
    </div>
  );
}
