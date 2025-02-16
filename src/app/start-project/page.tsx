'use client';

import { ProjectStartForm } from '@/components/ProjectStartForm';
import { ProjectStartFormData } from '@/types/project';

export default function StartProject() {
  const handleSubmit = async (data: ProjectStartFormData) => {
    // TODO: Implement project creation logic
    console.log('Form submitted:', data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-sage-200 pb-4">
        <h1 className="text-3xl font-bold text-navy-900">Start New Project</h1>
        <p className="mt-2 text-sage-600">Fill in the details below to create a new project.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in">
        <ProjectStartForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
