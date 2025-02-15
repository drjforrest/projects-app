export default function MeetingsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meetings Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
          <div className="text-3xl font-bold text-indigo-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <div className="text-3xl font-bold text-green-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">By Project</h2>
          <div className="space-y-2 text-gray-600">
            <div>No meetings scheduled</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Meeting Calendar</h2>
          <a href="/meetings/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Schedule Meeting
          </a>
        </div>
        <div className="text-gray-600">No meetings scheduled</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Meeting Notes</h2>
        <div className="text-gray-600">No meeting notes available</div>
      </div>
    </div>
  );
}
