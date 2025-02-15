import { query } from '@/config/database';
import { logger } from '@/utils/logger';
import { ProjectMetrics, TimelineMetrics } from '@/types/analytics';

export async function getProjectMetrics(): Promise<ProjectMetrics> {
    try {
        const result = await query(`
            WITH ProjectStats AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                    AVG(anticipated_difficulty) as avg_difficulty,
                    AVG(CASE 
                        WHEN status = 'completed' 
                        THEN EXTRACT(EPOCH FROM (updated_at - start_date))/86400.0 
                    END) as avg_completion_days
                FROM projects
            ),
            TypeStats AS (
                SELECT UNNEST(project_types) as type, COUNT(*) as type_count
                FROM projects
                GROUP BY type
                ORDER BY type_count DESC
                LIMIT 3
            )
            SELECT 
                ps.*,
                ARRAY_AGG(ts.type) as common_types
            FROM ProjectStats ps, TypeStats ts
            GROUP BY ps.total, ps.active, ps.completed, ps.avg_difficulty, ps.avg_completion_days
        `);

        const stats = result.rows[0];
        
        return {
            totalProjects: stats.total,
            activeProjects: stats.active,
            completedProjects: stats.completed,
            averageDifficulty: parseFloat(stats.avg_difficulty),
            onTrackPercentage: calculateOnTrackPercentage(),
            averageCompletionTime: parseFloat(stats.avg_completion_days),
            mostCommonTypes: stats.common_types
        };
    } catch (error) {
        logger.error('Error fetching project metrics:', error);
        throw error;
    }
}

export async function getTimelineMetrics(): Promise<TimelineMetrics> {
    try {
        const upcomingDeadlines = await query(`
            SELECT project_name, due_date
            FROM projects
            WHERE status = 'active' AND due_date > CURRENT_DATE
            ORDER BY due_date ASC
            LIMIT 5
        `);

        const recentActivity = await query(`
            SELECT 'output' as type, o.output_name as description, o.created_at as date
            FROM outputs o
            UNION ALL
            SELECT 'meeting' as type, m.meeting_name, m.date_time
            FROM meetings m
            ORDER BY date DESC
            LIMIT 10
        `);

        const milestoneProgress = await query(`
            SELECT 
                p.project_name,
                jsonb_array_length(p.milestones) as total,
                COUNT(CASE WHEN m->>'status' = 'completed' THEN 1 END) as completed
            FROM projects p,
                jsonb_array_elements(p.milestones) as m
            WHERE p.status = 'active'
            GROUP BY p.project_id, p.project_name
        `);

        return {
            upcomingDeadlines: upcomingDeadlines.rows,
            recentActivity: recentActivity.rows,
            milestoneProgress: milestoneProgress.rows
        };
    } catch (error) {
        logger.error('Error fetching timeline metrics:', error);
        throw error;
    }
}

function calculateOnTrackPercentage(): number {
    // Implementation depends on your specific criteria for "on track"
    return 0;
} 