import { MeetingForm } from '@/components/MeetingForm';
import { useProject } from '@/context/ProjectContext';

export default function NewMeeting() {
    const { currentProject } = useProject();

    if (!currentProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-navy-900">Schedule New Meeting</h1>
                <div className="bg-rust-50 p-4 rounded-md">
                    <p className="text-rust-800">
                        Please select a project before scheduling a meeting.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-sage-200 pb-4">
                <h1 className="text-3xl font-bold text-navy-900">Schedule New Meeting</h1>
                <p className="mt-2 text-sage-600">
                    Scheduling meeting for: {currentProject.project_name}
                </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in">
                <MeetingForm 
                    projectId={currentProject.project_id}
                    onSubmit={(meetingId) => {
                        // Redirect to meeting details or back to project
                        window.location.href = `/projects/${currentProject.project_id}/meetings/${meetingId}`;
                    }}
                />
            </div>
        </div>
    );
}
