export default function CloseProject() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Close Project</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Project</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="">Select a project to close</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Completion Status</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="completed">Completed</option>
              <option value="partially_completed">Partially Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Completion Date</label>
            <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Final Deliverables Summary</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Challenges Faced</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Lessons Learned</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Next Steps/Follow-up Actions</label>
            <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Save Draft
            </button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Close Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
