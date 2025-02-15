export type ProjectCategory = 'Personal' | 'Professional Development' | 'Professional Project' | 'Side Hustle';

export type ProjectType = 'Proposal' | 'Report' | 'Manuscript' | 'Script' | 'Software' | 'Design' | 'Presentation' | 'Analysis';

export type ResourceType = 'People' | 'Organizations' | 'Documents' | 'Links' | 'Finances' | 'Other';

export interface ResourceEntry {
  type: ResourceType;
  description: string;
}

export interface Milestone {
  description: string;
  dueDate: Date;
}

export interface ProjectStartFormData {
  projectName: string;
  startDate: Date;
  category: ProjectCategory;
  types: ProjectType[];
  backgroundContext: string;
  objective: string;
  mainDeliverable: string;
  toWhom: string;
  dueDate: Date;
  numberOfMilestones: number;
  milestones: Milestone[];
  resources: ResourceEntry[];
  anticipatedDifficulty: number;
  additionalNotes?: string;
}
