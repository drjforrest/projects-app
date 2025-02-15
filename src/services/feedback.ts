import { query } from '@/config/database';
import { logger } from '@/utils/logger';
import { OutputFeedback, ProjectRetrospective } from '@/types/feedback';

export async function addOutputFeedback(feedback: Omit<OutputFeedback, 'feedback_id' | 'created_at'>): Promise<number> {
    try {
        const result = await query(`
            INSERT INTO output_feedback (
                output_id,
                reviewer,
                rating,
                comments,
                quality_rating,
                completeness_rating,
                clarity_rating,
                action_items,
                follow_up_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING feedback_id
        `, [
            feedback.outputId,
            feedback.reviewer,
            feedback.rating,
            feedback.comments,
            feedback.areas.quality,
            feedback.areas.completeness,
            feedback.areas.clarity,
            feedback.actionItems || [],
            feedback.followUpDate || null
        ]);

        return result.rows[0].feedback_id;
    } catch (error) {
        logger.error('Error adding output feedback:', error);
        throw error;
    }
}

export async function addProjectRetrospective(
    retrospective: Omit<ProjectRetrospective, 'created_at'>
): Promise<void> {
    try {
        await query(`
            UPDATE projects
            SET 
                status = 'completed',
                retrospective = $1::jsonb,
                updated_at = CURRENT_TIMESTAMP
            WHERE project_id = $2
        `, [
            JSON.stringify({
                completionDate: retrospective.completionDate,
                successMetrics: retrospective.successMetrics,
                lessonsLearned: retrospective.lessonsLearned,
                improvements: retrospective.improvements,
                kudos: retrospective.kudos
            }),
            retrospective.projectId
        ]);
    } catch (error) {
        logger.error('Error adding project retrospective:', error);
        throw error;
    }
} 