import React from 'react';
import { ResourceType, ResourceEntry } from '@/types/project';

interface ResourcesSectionProps {
  resources: ResourceEntry[];
  onChange: (resources: ResourceEntry[]) => void;
  error?: string;
}

const resourceTypes: ResourceType[] = [
  'People',
  'Organizations',
  'Documents',
  'Links',
  'Finances',
  'Other'
];

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  resources,
  onChange,
  error
}) => {
  const handleResourceChange = (type: ResourceType, checked: boolean) => {
    if (checked) {
      onChange([...resources, { type, description: '' }]);
    } else {
      onChange(resources.filter(r => r.type !== type));
    }
  };

  const handleDescriptionChange = (type: ResourceType, description: string) => {
    onChange(
      resources.map(r =>
        r.type === type ? { ...r, description } : r
      )
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <label className="form-label">
        Resources
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourceTypes.map((type, index) => {
          const resource = resources.find(r => r.type === type);
          return (
            <div 
              key={type} 
              className="space-y-2 animate-scale-in bg-white rounded-lg p-4 border border-sage-200 hover:shadow-md transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={!!resource}
                  onChange={(e) => handleResourceChange(type, e.target.checked)}
                  className="h-4 w-4 rounded border-sage-300 text-teal-600 focus:ring-teal-500 transition-all duration-200"
                />
                <label className="ml-2 text-sm font-medium text-navy-700">{type}</label>
              </div>
              {resource && (
                <div className="animate-slide-in">
                  <textarea
                    value={resource.description}
                    onChange={(e) => handleDescriptionChange(type, e.target.value)}
                    className="mt-2 block w-full rounded-md border-sage-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200"
                    rows={3}
                    placeholder={`Describe ${type.toLowerCase()} resources...`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-sm text-rust-500 animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
};
