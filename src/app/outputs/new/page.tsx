import { OutputForm } from '@/components/OutputForm';
import { useProject } from '@/context/ProjectContext';

export default function NewOutput() {
    const { currentProject } = useProject();

    if (!currentProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-navy-900">Record Project Output</h1>
                <div className="bg-rust-50 p-4 rounded-md">
                    <p className="text-rust-800">
                        Please select a project before creating an output.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-sage-200 pb-4">
                <h1 className="text-3xl font-bold text-navy-900">Record Project Output</h1>
                <p className="mt-2 text-sage-600">
                    Recording output for: {currentProject.name}
                </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in">
                <OutputForm 
                    projectId={currentProject.id}
                    onSubmit={(outputId) => {
                        // Redirect to output details or back to project
                        window.location.href = `/projects/${currentProject.id}/outputs/${outputId}`;
                    }}
                />
            </div>
        </div>
    );
}
