import { ProjectStartFormData } from '@/types/project';

export const validateProjectName = (name: string): string | null => {
  if (!name.trim()) return 'Project name is required';
  if (name.length > 100) return 'Project name must be less than 100 characters';
  return null;
};

export const validateDate = (date: Date, fieldName: string): string | null => {
  if (!date) return `${fieldName} is required`;
  if (isNaN(date.getTime())) return `Invalid ${fieldName}`;
  return null;
};

export const validateMilestones = (milestones: ProjectStartFormData['milestones']): string | null => {
  for (const milestone of milestones) {
    if (!milestone.description.trim()) return 'Milestone description is required';
    if (!milestone.dueDate) return 'Milestone due date is required';
    if (isNaN(milestone.dueDate.getTime())) return 'Invalid milestone due date';
  }
  return null;
};

export const validateResources = (resources: ProjectStartFormData['resources']): string | null => {
  for (const resource of resources) {
    if (!resource.description.trim()) return `Description for ${resource.type} is required`;
  }
  return null;
};

export function validateProjectStartForm(data: ProjectStartFormData): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.projectName.trim()) {
        errors.projectName = 'Project name is required';
    }

    if (!data.objective.trim()) {
        errors.objective = 'Project objective is required';
    }

    if (!data.mainDeliverable.trim()) {
        errors.mainDeliverable = 'Main deliverable is required';
    }

    if (!data.toWhom.trim()) {
        errors.toWhom = 'Recipient information is required';
    }

    if (data.types.length === 0) {
        errors.types = 'At least one project type must be selected';
    }

    if (data.startDate > data.dueDate) {
        errors.dueDate = 'Due date must be after start date';
    }

    if (data.numberOfMilestones > 0 && data.milestones.length === 0) {
        errors.milestones = 'Please add milestone details';
    }

    return errors;
}
