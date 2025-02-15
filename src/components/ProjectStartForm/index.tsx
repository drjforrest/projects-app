import React, { useState } from 'react';
import { ProjectStartFormData, ProjectCategory, ProjectType } from '@/types/project';
import { validateProjectStartForm } from '@/utils/validation';
import { CategorySelect } from './CategorySelect';
import { TypeMultiSelect } from './TypeMultiSelect';
import { ResourcesSection } from './ResourcesSection';
import { MilestonesSection } from './MilestonesSection';
import { DifficultySlider } from './DifficultySlider';

interface ProjectStartFormProps {
  onSubmit: (data: ProjectStartFormData) => Promise<void>;
}

export const ProjectStartForm: React.FC<ProjectStartFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ProjectStartFormData>({
    projectName: '',
    startDate: new Date(),
    category: 'Personal',
    types: [],
    backgroundContext: '',
    objective: '',
    mainDeliverable: '',
    toWhom: '',
    dueDate: new Date(),
    numberOfMilestones: 0,
    milestones: [],
    resources: [],
    anticipatedDifficulty: 5,
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProjectStartForm(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const updateFormData = (field: keyof ProjectStartFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="animate-slide-in">
        <label className="form-label" htmlFor="projectName">Project Name</label>
        <input
          id="projectName"
          type="text"
          value={formData.projectName}
          onChange={(e) => updateFormData('projectName', e.target.value)}
          className={`input-field ${errors.projectName ? 'border-rust-500' : 'hover:border-teal-400'}`}
        />
        {errors.projectName && (
          <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.projectName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <label className="form-label">Start Date</label>
          <input
            type="date"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => updateFormData('startDate', new Date(e.target.value))}
            className="input-field hover:border-teal-400"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.startDate}</p>
          )}
        </div>

        <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <label className="form-label">Due Date</label>
          <input
            type="date"
            value={formData.dueDate.toISOString().split('T')[0]}
            onChange={(e) => updateFormData('dueDate', new Date(e.target.value))}
            className="input-field hover:border-teal-400"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <CategorySelect
        value={formData.category}
        onChange={(value: ProjectCategory) => updateFormData('category', value)}
        error={errors.category}
      />

      <TypeMultiSelect
        value={formData.types}
        onChange={(value: ProjectType[]) => updateFormData('types', value)}
        error={errors.types}
      />

      <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
        <label className="form-label">Background & Context</label>
        <textarea
          value={formData.backgroundContext}
          onChange={(e) => updateFormData('backgroundContext', e.target.value)}
          rows={4}
          className="input-field hover:border-teal-400"
        />
      </div>

      <div className="animate-slide-in" style={{ animationDelay: '400ms' }}>
        <label className="form-label">Objective</label>
        <textarea
          value={formData.objective}
          onChange={(e) => updateFormData('objective', e.target.value)}
          rows={3}
          className={`input-field ${errors.objective ? 'border-rust-500' : 'hover:border-teal-400'}`}
        />
        {errors.objective && (
          <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.objective}</p>
        )}
      </div>

      <div className="animate-slide-in" style={{ animationDelay: '500ms' }}>
        <label className="form-label">Main Deliverable</label>
        <textarea
          value={formData.mainDeliverable}
          onChange={(e) => updateFormData('mainDeliverable', e.target.value)}
          rows={3}
          className={`input-field ${errors.mainDeliverable ? 'border-rust-500' : 'hover:border-teal-400'}`}
        />
        {errors.mainDeliverable && (
          <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.mainDeliverable}</p>
        )}
      </div>

      <div className="animate-slide-in" style={{ animationDelay: '600ms' }}>
        <label className="form-label">To Whom?</label>
        <input
          type="text"
          value={formData.toWhom}
          onChange={(e) => updateFormData('toWhom', e.target.value)}
          className={`input-field ${errors.toWhom ? 'border-rust-500' : 'hover:border-teal-400'}`}
        />
        {errors.toWhom && (
          <p className="mt-1 text-sm text-rust-500 animate-slide-in">{errors.toWhom}</p>
        )}
      </div>

      <MilestonesSection
        numberOfMilestones={formData.numberOfMilestones}
        milestones={formData.milestones}
        onChange={(milestones) => updateFormData('milestones', milestones)}
        onNumberChange={(number) => updateFormData('numberOfMilestones', number)}
        error={errors.milestones}
      />

      <ResourcesSection
        resources={formData.resources}
        onChange={(resources) => updateFormData('resources', resources)}
        error={errors.resources}
      />

      <DifficultySlider
        value={formData.anticipatedDifficulty}
        onChange={(value) => updateFormData('anticipatedDifficulty', value)}
        error={errors.anticipatedDifficulty}
      />

      <div className="animate-slide-in" style={{ animationDelay: '700ms' }}>
        <label className="form-label">Additional Notes</label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData('additionalNotes', e.target.value)}
          rows={4}
          className="input-field hover:border-teal-400"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-sage-200">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''} 
                     hover:shadow-lg transform transition-all duration-200 
                     hover:-translate-y-0.5 active:translate-y-0`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Project...
            </span>
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};
