export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy-900 animate-fade-in">
        Welcome to Projects App
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="hover-card bg-white p-6 rounded-lg shadow-md animate-scale-in">
          <h2 className="text-xl font-semibold mb-4 text-navy-800">Quick Actions</h2>
          <ul className="space-y-2">
            <li className="animate-slide-in" style={{ animationDelay: '100ms' }}>
              <a href="/start-project" className="link flex items-center">
                <span className="mr-2">→</span>
                Start New Project
              </a>
            </li>
            <li className="animate-slide-in" style={{ animationDelay: '200ms' }}>
              <a href="/meetings/new" className="link flex items-center">
                <span className="mr-2">→</span>
                Schedule Meeting
              </a>
            </li>
            <li className="animate-slide-in" style={{ animationDelay: '300ms' }}>
              <a href="/outputs/new" className="link flex items-center">
                <span className="mr-2">→</span>
                Record Project Output
              </a>
            </li>
          </ul>
        </div>
        
        <div className="hover-card bg-white p-6 rounded-lg shadow-md animate-scale-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-xl font-semibold mb-4 text-navy-800">Recent Projects</h2>
          <div className="space-y-3">
            <div className="animate-slide-in flex items-center justify-between p-3 rounded-md bg-sage-50">
              <span className="text-navy-700">No projects yet</span>
              <span className="text-sage-400">→</span>
            </div>
          </div>
        </div>
        
        <div className="hover-card bg-white p-6 rounded-lg shadow-md animate-scale-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-semibold mb-4 text-navy-800">Upcoming Meetings</h2>
          <div className="space-y-3">
            <div className="animate-slide-in flex items-center justify-between p-3 rounded-md bg-sage-50">
              <span className="text-navy-700">No upcoming meetings</span>
              <span className="text-sage-400">→</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <a 
          href="/start-project" 
          className="btn-highlight text-lg font-semibold animate-bounce-in"
          style={{ animationDelay: '500ms' }}
        >
          Create Your First Project
        </a>
      </div>
    </div>
  )
}
