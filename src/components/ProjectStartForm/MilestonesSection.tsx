import React from 'react';
import { Milestone } from '@/types/project';

interface MilestonesSectionProps {
  numberOfMilestones: number;
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  onNumberChange: (number: number) => void;
  error?: string;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  numberOfMilestones,
  milestones,
  onChange,
  onNumberChange,
  error
}) => {
  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | Date) => {
    const newMilestones = [...milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value
    };
    onChange(newMilestones);
  };

  const handleNumberChange = (value: number) => {
    const newNumber = Math.max(0, value);
    onNumberChange(newNumber);
    
    if (newNumber > milestones.length) {
      onChange([
        ...milestones,
        ...Array(newNumber - milestones.length).fill(null).map(() => ({
          description: '',
          dueDate: new Date()
        }))
      ]);
    } else if (newNumber < milestones.length) {
      onChange(milestones.slice(0, newNumber));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="form-label">
          Number of Milestones
        </label>
        <input
          type="number"
          min="0"
          value={numberOfMilestones}
          onChange={(e) => handleNumberChange(parseInt(e.target.value) || 0)}
          className="mt-1 block w-32 rounded-md border-sage-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200"
        />
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div 
            key={index} 
            className="animate-scale-in bg-white p-4 border border-sage-200 rounded-lg hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h4 className="font-medium text-navy-700 mb-3">Milestone {index + 1}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-navy-600">Description</label>
                <textarea
                  value={milestone.description}
                  onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-navy-600">Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate instanceof Date ? milestone.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleMilestoneChange(index, 'dueDate', new Date(e.target.value))}
                  className="mt-1 block w-full rounded-md border-sage-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-rust-500 animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
};
