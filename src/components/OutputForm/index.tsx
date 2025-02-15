import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { DBOutput } from '@/types/database';

interface OutputFormProps {
    projectId: number;
    onSubmit?: (outputId: number) => void;
    initialData?: Partial<DBOutput>;
}

export const OutputForm: React.FC<OutputFormProps> = ({
    projectId,
    onSubmit,
    initialData
}) => {
    const { createOutput, updateOutput } = useProject();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<Partial<DBOutput>>({
        project_id: projectId,
        output_name: '',
        description: '',
        version_number: '',
        tags: [],
        next_action: '',
        feedback_to: '',
        time_allocated: 0,
        ...initialData
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.output_name?.trim()) {
            newErrors.output_name = 'Output name is required';
        }
        
        if (!formData.description?.trim()) {
            newErrors.description = 'Description is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            let outputId;
            if (initialData?.output_id) {
                await updateOutput(initialData.output_id, formData);
                outputId = initialData.output_id;
            } else {
                outputId = await createOutput(formData);
            }
            onSubmit?.(outputId);
        } catch (error) {
            console.error('Error saving output:', error);
            setErrors({
                submit: 'Failed to save output. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTagsChange = (tagString: string) => {
        const tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, tags }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
                <label className="form-label" htmlFor="output_name">
                    Output Name
                </label>
                <input
                    id="output_name"
                    type="text"
                    value={formData.output_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, output_name: e.target.value }))}
                    className={`input-field ${errors.output_name ? 'border-rust-500' : 'hover:border-teal-400'}`}
                />
                {errors.output_name && (
                    <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.output_name}</p>
                )}
            </div>

            <div>
                <label className="form-label" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`input-field ${errors.description ? 'border-rust-500' : 'hover:border-teal-400'}`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.description}</p>
                )}
            </div>

            <div>
                <label className="form-label" htmlFor="version_number">
                    Version Number
                </label>
                <input
                    id="version_number"
                    type="text"
                    value={formData.version_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, version_number: e.target.value }))}
                    className="input-field hover:border-teal-400"
                    placeholder="e.g., 1.0.0"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="tags">
                    Tags
                </label>
                <input
                    id="tags"
                    type="text"
                    value={formData.tags?.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="input-field hover:border-teal-400"
                    placeholder="Enter tags separated by commas"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="next_action">
                    Next Action
                </label>
                <input
                    id="next_action"
                    type="text"
                    value={formData.next_action}
                    onChange={(e) => setFormData(prev => ({ ...prev, next_action: e.target.value }))}
                    className="input-field hover:border-teal-400"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="feedback_to">
                    Feedback To
                </label>
                <input
                    id="feedback_to"
                    type="text"
                    value={formData.feedback_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback_to: e.target.value }))}
                    className="input-field hover:border-teal-400"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="time_allocated">
                    Time Allocated (minutes)
                </label>
                <input
                    id="time_allocated"
                    type="number"
                    min="0"
                    value={formData.time_allocated}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_allocated: parseInt(e.target.value) || 0 }))}
                    className="input-field hover:border-teal-400"
                />
            </div>

            {errors.submit && (
                <div className="rounded-md bg-rust-50 p-4 animate-slide-in">
                    <p className="text-sm text-rust-500">{errors.submit}</p>
                </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-sage-200">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : initialData ? 'Update Output' : 'Create Output'}
                </button>
            </div>
        </form>
    );
};
