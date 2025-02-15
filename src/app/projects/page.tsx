export default function ProjectsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          <div className="text-3xl font-bold text-indigo-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Completed Projects</h2>
          <div className="text-3xl font-bold text-green-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="text-3xl font-bold text-orange-600">0</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Project List</h2>
        <div className="text-gray-600">No projects found</div>
      </div>
    </div>
  );
}
