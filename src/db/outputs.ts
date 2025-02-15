import { query } from './db';
import { DBOutput } from '@/types/database';

export async function createOutput(outputData: Omit<DBOutput, 'output_id' | 'created_at' | 'updated_at'>) {
    const {
        project_id,
        output_name,
        description,
        version_number,
        tags,
        next_action,
        feedback_to,
        time_allocated
    } = outputData;

    const result = await query(
        `INSERT INTO outputs (
            project_id,
            output_name,
            description,
            version_number,
            tags,
            next_action,
            feedback_to,
            time_allocated
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING output_id`,
        [
            project_id,
            output_name,
            description,
            version_number,
            tags,
            next_action,
            feedback_to,
            time_allocated
        ]
    );

    return result.rows[0].output_id;
}

export async function getProjectOutputs(projectId: number): Promise<DBOutput[]> {
    const result = await query(
        'SELECT * FROM outputs WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
    );
    
    return result.rows;
}

export async function getOutput(outputId: number): Promise<DBOutput> {
    const result = await query(
        'SELECT * FROM outputs WHERE output_id = $1',
        [outputId]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Output not found');
    }

    return result.rows[0];
}

export async function updateOutput(outputId: number, updateData: Partial<DBOutput>) {
    const updateFields: string[] = [];
    const values: (string | number | Date | string[] | null)[] = [];
    let valueCounter = 1;

    Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && !['output_id', 'created_at', 'updated_at'].includes(key)) {
            updateFields.push(`${key} = $${valueCounter}`);
            values.push(value);
            valueCounter++;
        }
    });

    if (updateFields.length === 0) return;

    values.push(outputId);
    await query(
        `UPDATE outputs 
        SET ${updateFields.join(', ')} 
        WHERE output_id = $${valueCounter}`,
        values
    );
}

export async function deleteOutput(outputId: number) {
    await query('DELETE FROM outputs WHERE output_id = $1', [outputId]);
}

export async function getRecentOutputs(limit: number = 10): Promise<DBOutput[]> {
    const result = await query(
        `SELECT o.*, p.project_name 
         FROM outputs o 
         JOIN projects p ON o.project_id = p.project_id 
         ORDER BY o.created_at DESC 
         LIMIT $1`,
        [limit]
    );
    
    return result.rows;
}

export async function searchOutputs(searchTerm: string): Promise<DBOutput[]> {
    const result = await query(
        `SELECT o.*, p.project_name 
         FROM outputs o 
         JOIN projects p ON o.project_id = p.project_id 
         WHERE 
            o.output_name ILIKE $1 OR 
            o.description ILIKE $1 OR 
            $1 = ANY(o.tags)
         ORDER BY o.created_at DESC`,
        [`%${searchTerm}%`]
    );
    
    return result.rows;
}
