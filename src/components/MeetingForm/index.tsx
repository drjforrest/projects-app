'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { DBMeeting } from '@/types/database';

interface MeetingFormProps {
    projectId: number;
    onSubmit?: (meetingId: number) => void;
    initialData?: Partial<DBMeeting>;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
    projectId,
    onSubmit,
    initialData
}) => {
    const { createMeeting, updateMeeting } = useProject();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<Partial<DBMeeting>>({
        project_id: projectId,
        meeting_name: '',
        description: '',
        attendees: [],
        quick_notes: '',
        date_time: new Date(),
        transcript_path: '',
        summary_path: '',
        summary_content: '',
        ...initialData
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.meeting_name?.trim()) {
            newErrors.meeting_name = 'Meeting name is required';
        }
        
        if (!formData.date_time) {
            newErrors.date_time = 'Date and time are required';
        }
        
        if (!formData.attendees?.length) {
            newErrors.attendees = 'At least one attendee is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            let meetingId;
            if (initialData?.meeting_id) {
                await updateMeeting(initialData.meeting_id, formData);
                meetingId = initialData.meeting_id;
            } else {
                const meetingData = {
                    project_id: projectId,
                    meeting_name: formData.meeting_name || '',
                    description: formData.description || '',
                    attendees: formData.attendees || [],
                    quick_notes: formData.quick_notes || '',
                    date_time: formData.date_time || new Date(),
                    transcript_path: formData.transcript_path || '',
                    summary_path: formData.summary_path || '',
                    summary_content: formData.summary_content || ''
                };
                meetingId = await createMeeting(meetingData);
            }
            onSubmit?.(meetingId);
        } catch (error) {
            console.error('Error saving meeting:', error);
            setErrors({
                submit: 'Failed to save meeting. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAttendeesChange = (attendeesString: string) => {
        const attendees = attendeesString.split(',').map(email => email.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, attendees }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
                <label className="form-label" htmlFor="meeting_name">
                    Meeting Name
                </label>
                <input
                    id="meeting_name"
                    type="text"
                    value={formData.meeting_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, meeting_name: e.target.value }))}
                    className={`input-field ${errors.meeting_name ? 'border-rust-500' : 'hover:border-teal-400'}`}
                    placeholder="Enter meeting title"
                />
                {errors.meeting_name && (
                    <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.meeting_name}</p>
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
                    rows={3}
                    className="input-field hover:border-teal-400"
                    placeholder="Enter meeting description or agenda items"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="form-label" htmlFor="date">
                        Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={formData.date_time ? new Date(formData.date_time).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const time = formData.date_time ? new Date(formData.date_time).toTimeString() : '00:00';
                            const newDateTime = new Date(`${e.target.value}T${time}`).toISOString();
                            setFormData(prev => ({ ...prev, date_time: new Date(newDateTime) }));
                        }}
                        className={`input-field ${errors.date_time ? 'border-rust-500' : 'hover:border-teal-400'}`}
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="time">
                        Time
                    </label>
                    <input
                        id="time"
                        type="time"
                        value={formData.date_time ? new Date(formData.date_time).toTimeString().slice(0, 5) : ''}
                        onChange={(e) => {
                            const date = formData.date_time ? new Date(formData.date_time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                            const newDateTime = new Date(`${date}T${e.target.value}`).toISOString();
                            setFormData(prev => ({ ...prev, date_time: new Date(newDateTime) }));
                        }}
                        className={`input-field ${errors.date_time ? 'border-rust-500' : 'hover:border-teal-400'}`}
                    />
                </div>
            </div>

            <div>
                <label className="form-label" htmlFor="attendees">
                    Attendees
                </label>
                <input
                    id="attendees"
                    type="text"
                    value={formData.attendees?.join(', ')}
                    onChange={(e) => handleAttendeesChange(e.target.value)}
                    className={`input-field ${errors.attendees ? 'border-rust-500' : 'hover:border-teal-400'}`}
                    placeholder="Enter email addresses, separated by commas"
                />
                {errors.attendees && (
                    <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.attendees}</p>
                )}
            </div>

            <div>
                <label className="form-label" htmlFor="quick_notes">
                    Quick Notes
                </label>
                <textarea
                    id="quick_notes"
                    value={formData.quick_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, quick_notes: e.target.value }))}
                    rows={4}
                    className="input-field hover:border-teal-400"
                    placeholder="Enter any preliminary notes or discussion points"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-navy-800">Meeting Documents</h3>
                
                <div>
                    <label className="form-label" htmlFor="transcript_path">
                        Transcript Location
                    </label>
                    <input
                        id="transcript_path"
                        type="text"
                        value={formData.transcript_path}
                        onChange={(e) => setFormData(prev => ({ ...prev, transcript_path: e.target.value }))}
                        className="input-field hover:border-teal-400"
                        placeholder="Path to meeting transcript (if available)"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="summary_path">
                        Summary Document Location
                    </label>
                    <input
                        id="summary_path"
                        type="text"
                        value={formData.summary_path}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary_path: e.target.value }))}
                        className="input-field hover:border-teal-400"
                        placeholder="Path to meeting summary document (if available)"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="summary_content">
                        Meeting Summary
                    </label>
                    <textarea
                        id="summary_content"
                        value={formData.summary_content}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary_content: e.target.value }))}
                        rows={6}
                        className="input-field hover:border-teal-400"
                        placeholder="Enter or paste meeting summary here"
                    />
                </div>
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
                    ) : initialData ? 'Update Meeting' : 'Schedule Meeting'}
                </button>
            </div>
        </form>
    );
};
