import { query } from '@/config/database';
import { logger } from '@/utils/logger';
import { HealthScore } from '@/types/projectHealth';

export async function calculateProjectHealth(projectId: number): Promise<HealthScore> {
    try {
        // Get project data
        const projectData = await query(`
            WITH MilestoneStats AS (
                SELECT 
                    COUNT(CASE WHEN m->>'status' = 'completed' THEN 1 END) as completed_milestones,
                    COUNT(*) as total_milestones
                FROM projects p,
                    jsonb_array_elements(p.milestones) as m
                WHERE p.project_id = $1
            ),
            OutputStats AS (
                SELECT 
                    COUNT(*) as output_count,
                    AVG(time_allocated) as avg_time_allocated
                FROM outputs
                WHERE project_id = $1
            ),
            MeetingStats AS (
                SELECT COUNT(*) as meeting_count
                FROM meetings
                WHERE project_id = $1
                AND date_time > CURRENT_DATE - INTERVAL '30 days'
            )
            SELECT 
                p.*,
                ms.*,
                os.*,
                mts.meeting_count
            FROM projects p
            CROSS JOIN MilestoneStats ms
            CROSS JOIN OutputStats os
            CROSS JOIN MeetingStats mts
            WHERE p.project_id = $1
        `, [projectId]);

        if (projectData.rows.length === 0) {
            throw new Error('Project not found');
        }

        const data = projectData.rows[0];
        
        // Calculate component scores
        const milestonesOnTrack = calculateMilestoneProgress(data);
        const outputQuality = calculateOutputQuality(data);
        const meetingFrequency = calculateMeetingFrequency(data.meeting_count);
        const resourceUtilization = calculateResourceUtilization(data);
        const feedbackScore = await calculateFeedbackScore(projectId);

        // Calculate overall scores
        const timeline = calculateTimelineScore(data);
        const quality = calculateQualityScore(outputQuality, feedbackScore);
        const risk = calculateRiskScore(data);

        // Calculate overall health score
        const overall = Math.round((timeline + quality + risk) / 3);

        return {
            overall,
            timeline,
            quality,
            risk,
            components: {
                milestonesOnTrack,
                outputQuality,
                meetingFrequency,
                resourceUtilization,
                feedbackScore
            }
        };
    } catch (error) {
        logger.error('Error calculating project health:', error);
        throw error;
    }
}

// Helper functions for calculations
function calculateMilestoneProgress(data: any): boolean {
    const { completed_milestones, total_milestones } = data;
    const expectedProgress = calculateExpectedProgress(data.start_date, data.due_date);
    const actualProgress = completed_milestones / total_milestones;
    return actualProgress >= expectedProgress;
}

function calculateExpectedProgress(startDate: Date, dueDate: Date): number {
    const totalDays = (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(elapsedDays / totalDays, 1);
}

// ... implement other calculation functions ... 