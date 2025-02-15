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

export const validateProjectStartForm = (data: ProjectStartFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  const projectNameError = validateProjectName(data.projectName);
  if (projectNameError) errors.projectName = projectNameError;

  const startDateError = validateDate(data.startDate, 'Start date');
  if (startDateError) errors.startDate = startDateError;

  const dueDateError = validateDate(data.dueDate, 'Due date');
  if (dueDateError) errors.dueDate = dueDateError;

  if (!data.category) errors.category = 'Category is required';
  if (!data.types.length) errors.types = 'At least one project type must be selected';
  if (!data.objective.trim()) errors.objective = 'Objective is required';
  if (!data.mainDeliverable.trim()) errors.mainDeliverable = 'Main deliverable is required';
  if (!data.toWhom.trim()) errors.toWhom = 'To whom field is required';

  const milestonesError = validateMilestones(data.milestones);
  if (milestonesError) errors.milestones = milestonesError;

  const resourcesError = validateResources(data.resources);
  if (resourcesError) errors.resources = resourcesError;

  if (data.anticipatedDifficulty < 0 || data.anticipatedDifficulty > 10) {
    errors.anticipatedDifficulty = 'Difficulty must be between 0 and 10';
  }

  return errors;
};
