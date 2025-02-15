export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Zone</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>UTC</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Save Profile
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <form className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                <span className="ml-2">Email notifications for new meetings</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                <span className="ml-2">Email notifications for approaching deadlines</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                <span className="ml-2">Weekly project summary</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calendar Integration</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>Google Calendar</option>
                <option>Apple Calendar</option>
                <option>Outlook Calendar</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Management Tools</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  <span className="ml-2">Things 3</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  <span className="ml-2">Agenda</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  <span className="ml-2">n8n</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Save Integrations
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Default Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Project Category</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>Personal</option>
                <option>Professional Development</option>
                <option>Professional Project</option>
                <option>Side Hustle</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Meeting Duration</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Save Defaults
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
