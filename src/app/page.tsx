import Image from 'next/image';
import Link from 'next/link';
import { getActiveProjects, getUpcomingMeetings } from '@/lib/api';
import { CalendarIcon, ClockIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import { DBMeeting } from '@/types/database';

async function ProjectStats() {
  const activeProjects = await getActiveProjects();
  const upcomingMeetings = await getUpcomingMeetings();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-teal-600">{activeProjects.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Total Hours</h3>
          <p className="text-3xl font-bold text-sage-600">
            {activeProjects.reduce((acc, p) => acc + (p.totalHours || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-gold-600">
            {activeProjects.length ? Math.round((activeProjects.filter(p => p.progress >= 100).length / activeProjects.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Upcoming Meetings</h3>
          <p className="text-3xl font-bold text-rust-600">{upcomingMeetings.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-navy-900">Active Projects</h2>
            <Link 
              href="/projects" 
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {activeProjects.length > 0 ? (
              activeProjects.slice(0, 5).map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-navy-900">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Started {new Date(project.start_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {project.teamSize} members
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        Progress: {project.progress}%
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No active projects.</p>
                <Link 
                  href="/start-project"
                  className="mt-2 inline-block text-teal-600 hover:text-teal-700"
                >
                  Start your first project →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-navy-900">Upcoming Meetings</h2>
            <Link 
              href="/meetings" 
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.slice(0, 5).map((meeting: DBMeeting) => (
                <Link
                  key={meeting.meeting_id}
                  href={`/meetings/${meeting.meeting_id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-navy-900">
                        {meeting.meeting_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
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
                      </div>
                    </div>
                    <ChartBarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No upcoming meetings.</p>
                <Link 
                  href="/meetings/new"
                  className="mt-2 inline-block text-teal-600 hover:text-teal-700"
                >
                  Schedule a meeting →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-12 px-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">
            ProTrack: A Project Management Tool
          </h1>
          <p className="text-lg text-sage-600 max-w-2xl">
            Streamline your project workflow with our comprehensive management tools 
            for collecting data, tracking progress, and visualizing results.
          </p>
        </div>
        
        <div className="relative w-full max-w-4xl h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/control-panel.png"
            alt="Project Control Panel"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <Suspense fallback={
          <div className="flex justify-center p-12">
            <Spinner className="w-8 h-8 text-teal-600" />
          </div>
        }>
          <ProjectStats />
        </Suspense>
      </div>
    </div>
  );
}
