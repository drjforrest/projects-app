import { query } from '@/config/database';
import { logger } from '@/utils/logger';

export const calculateProjectProgress = async (projectId: number) => {
    const result = await query(`
        SELECT 
            COUNT(*) FILTER (WHERE m->>'status' = 'completed') as completed,
            COUNT(*) as total
        FROM projects p,
            jsonb_array_elements(p.milestones) as m
        WHERE p.project_id = $1
    `, [projectId]);

    const { completed, total } = result.rows[0];
    return total > 0 ? (completed / total) * 100 : 0;
};

export const getProjectHealthIndicators = async (projectId: number) => {
    // Move shared health calculation logic here
    const result = await query(`
        WITH MilestoneStats AS (
            SELECT 
                COUNT(*) FILTER (WHERE m->>'status' = 'completed') as completed_milestones,
                COUNT(*) as total_milestones
            FROM projects p,
                jsonb_array_elements(p.milestones) as m
            WHERE p.project_id = $1
        )
        SELECT 
            p.*,
            ms.completed_milestones,
            ms.total_milestones
        FROM projects p
        CROSS JOIN MilestoneStats ms
        WHERE p.project_id = $1
    `, [projectId]);

    return result.rows[0];
}; 