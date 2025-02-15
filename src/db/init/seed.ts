import { pool } from '@/config/database';

export async function seedDatabase() {
    try {
        // Sample projects
        const projects = [
            {
                name: 'Research Project Alpha',
                category: 'Research',
                objective: 'Investigate new methodologies',
                main_deliverable: 'Research paper',
                to_whom: 'Research Team',
                progress: 75,
                team_size: 3,
                project_types: ['research', 'analysis'],
                milestones: JSON.stringify([
                    { description: 'Literature Review', dueDate: 'CURRENT_TIMESTAMP + INTERVAL \'7 days\'', completed: true },
                    { description: 'Data Collection', dueDate: 'CURRENT_TIMESTAMP + INTERVAL \'14 days\'', completed: true },
                    { description: 'Analysis', dueDate: 'CURRENT_TIMESTAMP + INTERVAL \'21 days\'', completed: false }
                ])
            },
            {
                name: 'Development Sprint',
                category: 'Development',
                objective: 'Implement new features',
                main_deliverable: 'Working prototype',
                to_whom: 'Product Team',
                progress: 30,
                team_size: 4,
                project_types: ['development', 'testing'],
                milestones: JSON.stringify([
                    { description: 'Design Phase', dueDate: 'CURRENT_TIMESTAMP + INTERVAL \'5 days\'', completed: true },
                    { description: 'Implementation', dueDate: 'CURRENT_TIMESTAMP + INTERVAL \'15 days\'', completed: false }
                ])
            }
        ];

        for (const project of projects) {
            const result = await pool.query(`
                INSERT INTO projects (
                    name, category, objective, main_deliverable, to_whom, due_date,
                    progress, team_size, project_types, milestones
                ) VALUES (
                    $1, $2, $3, $4, $5, CURRENT_TIMESTAMP + INTERVAL '30 days',
                    $6, $7, $8, $9
                ) RETURNING id
            `, [
                project.name, project.category, project.objective,
                project.main_deliverable, project.to_whom, project.progress,
                project.team_size, project.project_types, project.milestones
            ]);

            const projectId = result.rows[0].id;

            // Add meetings for each project
            await pool.query(`
                INSERT INTO meetings (
                    project_id, meeting_name, date_time, attendees, description
                ) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '1 day', $3, $4)
            `, [
                projectId,
                'Project Kickoff',
                ['John Doe', 'Jane Smith', 'Bob Wilson'],
                'Initial project planning and team alignment'
            ]);

            // Add some activities
            await pool.query(`
                INSERT INTO project_activities (
                    project_id, activity_type, description, hours_spent, performed_by
                ) VALUES ($1, $2, $3, $4, $5)
            `, [
                projectId,
                'planning',
                'Initial project setup and planning',
                4.5,
                'John Doe'
            ]);
        }

        console.log('✅ Seed data added successfully');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
} 