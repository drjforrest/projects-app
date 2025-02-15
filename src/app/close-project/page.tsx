import { useProject } from '@/context/ProjectContext';
import { useState, useEffect } from 'react';
import { MarkdownField } from '@/components/MarkdownField';
import { addProjectRetrospective } from '@/services/feedback';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

interface FormData {
    completionStatus: 'completed' | 'partially_completed' | 'cancelled' | 'on_hold';
    completionDate: string;
    deliverablesSummary: string;
    keyAchievements: string;
    challengesFaced: string;
    lessonsLearned: string;
    improvements: string;
    nextSteps: string;
}

export default function CloseProject() {
    const router = useRouter();
    const { currentProject } = useProject();
    const [formData, setFormData] = useState<FormData>({
        completionStatus: 'completed',
        completionDate: new Date().toISOString().split('T')[0],
        deliverablesSummary: '',
        keyAchievements: '',
        challengesFaced: '',
        lessonsLearned: '',
        improvements: '',
        nextSteps: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof FormData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProject) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addProjectRetrospective({
                projectId: currentProject.project_id,
                completionDate: new Date(formData.completionDate),
                completionStatus: formData.completionStatus,
                deliverablesSummary: formData.deliverablesSummary,
                keyAchievements: formData.keyAchievements,
                challengesFaced: formData.challengesFaced,
                successMetrics: {
                    timelineAdherence: 100, // TODO: Calculate these
                    qualityScore: 100,
                    learningValue: 100
                },
                lessonsLearned: formData.lessonsLearned,
                improvements: formData.improvements,
                kudos: [], // TODO: Add kudos field
                nextSteps: formData.nextSteps
            });

            router.push(`/projects/${currentProject.project_id}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to close project');
            console.error('Failed to close project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-save draft every 30 seconds
    useEffect(() => {
        const saveTimeout = setTimeout(() => {
            if (isSubmitting) return;
            localStorage.setItem(`project-close-draft-${currentProject?.project_id}`, JSON.stringify(formData));
        }, 30000);

        return () => clearTimeout(saveTimeout);
    }, [formData, currentProject?.project_id, isSubmitting]);

    // Load draft on mount
    useEffect(() => {
        if (!currentProject?.project_id) return;
        const draft = localStorage.getItem(`project-close-draft-${currentProject.project_id}`);
        if (draft) {
            setFormData(JSON.parse(draft));
        }
    }, [currentProject?.project_id]);

    if (!currentProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Close Project</h1>
                <div className="bg-rust-50 p-4 rounded-md">
                    <p className="text-rust-800">
                        Please select a project before closing it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Close Project</h1>
            
            {error && (
                <Alert variant="destructive">
                    <p>{error}</p>
                </Alert>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Project</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option value="">Select a project to close</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Completion Status</label>
                        <select 
                            value={formData.completionStatus}
                            onChange={(e) => handleChange('completionStatus')(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="completed">Completed</option>
                            <option value="partially_completed">Partially Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Actual Completion Date</label>
                        <input 
                            type="date" 
                            value={formData.completionDate}
                            onChange={(e) => handleChange('completionDate')(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Final Deliverables Summary</label>
                        <textarea 
                            value={formData.deliverablesSummary}
                            onChange={(e) => handleChange('deliverablesSummary')(e.target.value)}
                            rows={4} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    
                    <MarkdownField
                        label="Key Achievements"
                        value={formData.keyAchievements}
                        onChange={handleChange('keyAchievements')}
                        placeholder="## Technical Achievements
- Achieved X technology
- Improved Y skill

## Process Achievements
- Better estimation needed
- Documentation importance"
                    />
                    
                    <MarkdownField
                        label="Challenges Faced"
                        value={formData.challengesFaced}
                        onChange={handleChange('challengesFaced')}
                        placeholder="## Technical Challenges
- Learned X technology
- Improved Y skill

## Process Challenges
- Better estimation needed
- Documentation importance"
                    />
                    
                    <MarkdownField
                        label="Lessons Learned"
                        value={formData.lessonsLearned}
                        onChange={handleChange('lessonsLearned')}
                        placeholder="## Technical Learnings
- Learned X technology
- Improved Y skill

## Process Learnings
- Better estimation needed
- Documentation importance"
                    />
                    
                    <MarkdownField
                        label="Improvements for Next Time"
                        value={formData.improvements}
                        onChange={handleChange('improvements')}
                        placeholder="1. Start with better requirements
2. More frequent check-ins
3. Better time tracking"
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Next Steps/Follow-up Actions</label>
                        <textarea 
                            value={formData.nextSteps}
                            onChange={(e) => handleChange('nextSteps')(e.target.value)}
                            rows={4} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            disabled={isSubmitting}
                        >
                            Save Draft
                        </button>
                        <button 
                            type="submit" 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className="w-4 h-4" />}
                            <span>{isSubmitting ? 'Closing Project...' : 'Close Project'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}