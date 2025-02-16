import { query } from './db';
import { DBProject, ProjectRetrospective } from '@/types/database';
import { ProjectStartFormData } from '@/types/project';

export async function createProject(projectData: ProjectStartFormData) {
    const {
        projectName,
        startDate,
        category,
        types,
        backgroundContext,
        objective,
        mainDeliverable,
        toWhom,
        dueDate,
        numberOfMilestones,
        milestones,
        resources,
        anticipatedDifficulty,
        additionalNotes
    } = projectData;

    const result = await query(
        `INSERT INTO projects (
            project_name,
            start_date,
            category,
            project_types,
            background_context,
            objective,
            main_deliverable,
            to_whom,
            due_date,
            number_of_milestones,
            milestones,
            resources,
            anticipated_difficulty,
            additional_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING project_id`,
        [
            projectName,
            startDate,
            category,
            types,
            backgroundContext,
            objective,
            mainDeliverable,
            toWhom,
            dueDate,
            numberOfMilestones,
            JSON.stringify(milestones),
            JSON.stringify(resources),
            anticipatedDifficulty,
            additionalNotes ?? null
        ]
    );

    return result.rows[0].project_id;
}

export async function getProject(projectId: number): Promise<DBProject> {
    const result = await query(
        'SELECT * FROM projects WHERE project_id = $1',
        [projectId]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0];
}

export async function getActiveProjects(): Promise<DBProject[]> {
    const result = await query(
        'SELECT * FROM projects WHERE status = $1 ORDER BY created_at DESC',
        ['active']
    );
    
    return result.rows;
}

export async function closeProject(projectId: number, retrospective: ProjectRetrospective) {
    const { what_went_well, challenges, different_next_time, final_difficulty } = retrospective;
    
    const retrospectiveText = `
[Retrospective]
- What went well: ${what_went_well}
- Challenges: ${challenges}
- Improvements: ${different_next_time}`;

    await query(
        `UPDATE projects 
        SET status = $1,
            milestones = milestones || $2::jsonb,
            anticipated_difficulty = $3
        WHERE project_id = $4`,
        ['completed', retrospectiveText, final_difficulty, projectId]
    );
}

export async function updateProjectStatus(projectId: number, status: DBProject['status']) {
    await query(
        'UPDATE projects SET status = $1 WHERE project_id = $2',
        [status, projectId]
    );
}
