import { Pool } from 'pg';
import { config } from '@/config';
import { logger } from '@/utils/logger';

async function seedDatabase() {
    const pool = new Pool(config.db);

    try {
        // First, clear existing data
        await pool.query(`
            TRUNCATE projects, outputs, meetings CASCADE;
        `);

        // Add test projects
        const projectResult = await pool.query(`
            INSERT INTO projects (
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
                additional_notes,
                status
            ) VALUES 
            (
                'Personal Website Redesign', 
                CURRENT_DATE, 
                'Personal', 
                ARRAY['Design', 'Development', 'Content'],
                'Current website is outdated and needs a refresh',
                'Create a modern, responsive personal website', 
                'Deployed website with portfolio and blog', 
                'Self and potential clients',
                CURRENT_DATE + 30,
                3,
                '[
                    {"description": "Design mockups completed", "dueDate": "2024-03-15"},
                    {"description": "Core functionality implemented", "dueDate": "2024-03-30"},
                    {"description": "Content migration and launch", "dueDate": "2024-04-15"}
                ]'::jsonb,
                '[
                    {"type": "Tool", "name": "Figma"},
                    {"type": "Reference", "name": "Design inspiration board"},
                    {"type": "Skill", "name": "React"}
                ]'::jsonb,
                7,
                'Focus on minimalist design with good typography',
                'active'
            ),
            (
                'SwiftUI Learning Project', 
                CURRENT_DATE - 10, 
                'Professional Development', 
                ARRAY['Learning', 'iOS', 'Swift'],
                'Need to learn SwiftUI for upcoming projects',
                'Master SwiftUI fundamentals', 
                'Complete course and build demo app', 
                'Self',
                CURRENT_DATE + 45,
                2,
                '[
                    {"description": "Complete SwiftUI basics", "dueDate": "2024-03-20"},
                    {"description": "Build sample application", "dueDate": "2024-04-10"}
                ]'::jsonb,
                '[
                    {"type": "Course", "name": "SwiftUI Masterclass"},
                    {"type": "Tool", "name": "Xcode"},
                    {"type": "Reference", "name": "Apple Documentation"}
                ]'::jsonb,
                6,
                'Focus on practical exercises and real-world examples',
                'active'
            )
            RETURNING project_id;
        `);

        const projectIds = projectResult.rows.map(row => row.project_id);

        // Add test outputs
        await pool.query(`
            INSERT INTO outputs (
                project_id,
                output_name,
                description,
                version_number,
                tags,
                next_action,
                feedback_to,
                time_allocated
            ) VALUES 
            ($1, 'Website Design Mockup', 'Initial homepage design', 'v1.0', 
             ARRAY['design', 'homepage'], 'Review with mentor', 'Design advisor', 120),
            ($1, 'Component Library', 'Reusable UI components', 'v0.1', 
             ARRAY['components', 'development'], 'Add documentation', null, 180),
            ($2, 'SwiftUI Notes', 'Course notes and code examples', 'v1', 
             ARRAY['notes', 'swift'], 'Review and organize', null, 60)
        `, [projectIds[0]]);

        // Add test meetings
        await pool.query(`
            INSERT INTO meetings (
                project_id,
                meeting_name,
                description,
                attendees,
                quick_notes,
                date_time,
                summary_content
            ) VALUES 
            ($1, 'Design Review', 'Initial design feedback session', 
             ARRAY['Mentor', 'Self'], 'Discussed color scheme and typography',
             CURRENT_TIMESTAMP + interval '2 days',
             'Need to refine the color palette and add more whitespace'),
            ($2, 'SwiftUI Study Group', 'Weekly learning session', 
             ARRAY['Study Group'], 'Covered navigation and state management',
             CURRENT_TIMESTAMP + interval '7 days',
             'Focus on @State and @Binding next session')
        `, [projectIds[0]]);

        logger.info('Database seeded successfully');
    } catch (error) {
        logger.error('Error seeding database', { error });
        throw error;
    } finally {
        await pool.end();
    }
}

// Run if executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

export default seedDatabase; 