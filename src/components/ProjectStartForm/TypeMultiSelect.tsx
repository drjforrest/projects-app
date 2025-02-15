import React from 'react';
import { ProjectType } from '@/types/project';

interface TypeMultiSelectProps {
  value: ProjectType[];
  onChange: (types: ProjectType[]) => void;
  error?: string;
}

const projectTypes: ProjectType[] = [
  'Proposal',
  'Report',
  'Manuscript',
  'Script',
  'Software',
  'Design',
  'Presentation',
  'Analysis'
];

export const TypeMultiSelect: React.FC<TypeMultiSelectProps> = ({
  value,
  onChange,
  error
}) => {
  const handleTypeChange = (type: ProjectType) => {
    const newTypes = value.includes(type)
      ? value.filter((t) => t !== type)
      : [...value, type];
    onChange(newTypes);
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <label className="form-label">
        Project Types
      </label>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
        {projectTypes.map((type, index) => (
          <div 
            key={type} 
            className="animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <label className="relative flex items-center p-3 rounded-lg border border-sage-200 bg-white hover:bg-sage-50 cursor-pointer transition-all duration-200 hover:shadow-md">
              <input
                type="checkbox"
                checked={value.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 rounded border-sage-300 text-teal-600 focus:ring-teal-500 transition-all duration-200"
              />
              <span className="ml-3 text-sm font-medium text-navy-700">{type}</span>
            </label>
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
