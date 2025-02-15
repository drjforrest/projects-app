import { logger } from '@/utils/logger';
import { ProjectAlert } from '@/types/notifications';
import { query } from '@/config/database';
import { getProjectHealthIndicators } from './utils';
import { calculateProjectHealth } from './projectHealth';

export async function checkProjectAlerts(projectId: number): Promise<ProjectAlert[]> {
    try {
        const alerts: ProjectAlert[] = [];
        const project = await getProjectHealthIndicators(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        // Check deadline proximity
        const dueDate = new Date(project.due_date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 3) {
            alerts.push({
                type: 'deadline',
                priority: 'high',
                message: `Project due in ${daysUntilDue} days`,
                projectId,
                actionRequired: true
            });
        } else if (daysUntilDue <= 7) {
            alerts.push({
                type: 'deadline',
                priority: 'medium',
                message: `Project due in ${daysUntilDue} days`,
                projectId,
                actionRequired: false
            });
        }

        // Check overdue milestones
        if (project.overdue_milestones > 0) {
            alerts.push({
                type: 'milestone',
                priority: 'high',
                message: `${project.overdue_milestones} overdue milestone(s)`,
                projectId,
                actionRequired: true
            });
        }

        // Check upcoming milestones
        if (project.upcoming_milestones > 0) {
            alerts.push({
                type: 'milestone',
                priority: 'medium',
                message: `${project.upcoming_milestones} milestone(s) due soon`,
                projectId,
                actionRequired: false
            });
        }

        // Check project inactivity
        const lastActivity = new Date(Math.max(
            new Date(project.last_output || 0).getTime(),
            new Date(project.last_meeting || 0).getTime()
        ));

        const daysSinceActivity = Math.ceil((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceActivity > 7) {
            alerts.push({
                type: 'inactivity',
                priority: 'medium',
                message: `No activity for ${daysSinceActivity} days`,
                projectId,
                actionRequired: true
            });
        }

        // Check project health
        const healthScore = await calculateProjectHealth(projectId);
        if (healthScore.risk > 70) {
            alerts.push({
                type: 'risk',
                priority: 'high',
                message: 'Project at high risk',
                projectId,
                actionRequired: true
            });
        }

        return alerts;
    } catch (error) {
        logger.error('Error checking project alerts:', error);
        throw error;
    }
}

export async function getProjectNotifications(): Promise<ProjectAlert[]> {
    // Get all active projects since there's only one user
    const activeProjects = await query(`
        SELECT project_id 
        FROM projects 
        WHERE status = 'active'
    `);

    const alerts: ProjectAlert[] = [];
    for (const project of activeProjects.rows) {
        const projectAlerts = await checkProjectAlerts(project.project_id);
        alerts.push(...projectAlerts);
    }

    return alerts;
}