import { query } from '@/config/database';
import { logger } from '@/utils/logger';
import { HealthScore, ProjectHealthData } from '@/types/projectHealth';

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
function calculateMilestoneProgress(data: ProjectHealthData): boolean {
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

function calculateOutputQuality(data: ProjectHealthData): number {
    const { output_count, avg_time_allocated } = data;
    if (output_count === 0) return 0;

    // Quality score based on time invested and output count
    const timePerOutput = avg_time_allocated || 0;
    const qualityScore = Math.min(timePerOutput / 60, 10) * 10; // Score out of 100
    return Math.round(qualityScore);
}

function calculateMeetingFrequency(meetingCount: number): number {
    // Score based on monthly meeting frequency
    // Assuming 4 meetings per month is optimal
    return Math.min((meetingCount / 4) * 100, 100);
}

function calculateResourceUtilization(data: ProjectHealthData): number {
    const resourceCount = data.resources?.length || 0;
    const resourceUsage = resourceCount > 0 ? 
        data.resources.filter((r: { usage_count: number }) => r.usage_count > 0).length / resourceCount : 0;
    return Math.round(resourceUsage * 100);
}

async function calculateFeedbackScore(projectId: number): Promise<number> {
    try {
        const result = await query(`
            SELECT 
                AVG(CASE WHEN f.rating IS NOT NULL THEN f.rating ELSE NULL END) as avg_rating,
                COUNT(f.rating) as feedback_count
            FROM outputs o
            LEFT JOIN output_feedback f ON o.output_id = f.output_id
            WHERE o.project_id = $1
        `, [projectId]);

        const { avg_rating, feedback_count } = result.rows[0];
        if (!avg_rating || feedback_count === 0) return 0;

        return Math.round(avg_rating * 20); // Convert 1-5 scale to percentage
    } catch (error) {
        logger.error('Error calculating feedback score:', error);
        return 0;
    }
}

function calculateTimelineScore(data: ProjectHealthData): number {
    const { start_date, due_date, completed_milestones, total_milestones } = data;
    
    // Calculate expected vs actual progress
    const expectedProgress = calculateExpectedProgress(new Date(start_date), new Date(due_date));
    const actualProgress = completed_milestones / total_milestones;
    
    // Score based on how close actual progress is to expected
    const progressRatio = actualProgress / expectedProgress;
    return Math.round(Math.min(progressRatio * 100, 100));
}

function calculateQualityScore(outputQuality: number, feedbackScore: number): number {
    // Weighted average: 60% output quality, 40% feedback
    return Math.round((outputQuality * 0.6) + (feedbackScore * 0.4));
}

function calculateRiskScore(data: ProjectHealthData): number {
    let riskFactors = 0;
    let totalFactors = 0;

    // Timeline risk
    if (calculateTimelineScore(data) < 70) {
        riskFactors++;
    }
    totalFactors++;

    // Resource risk
    if (calculateResourceUtilization(data) < 50) {
        riskFactors++;
    }
    totalFactors++;

    // Meeting frequency risk
    if (data.meeting_count < 2) {
        riskFactors++;
    }
    totalFactors++;

    // Output risk
    if (data.output_count < data.total_milestones * 0.5) {
        riskFactors++;
    }
    totalFactors++;

    // Convert to a score where 100 is lowest risk
    return Math.round((1 - (riskFactors / totalFactors)) * 100);
} 