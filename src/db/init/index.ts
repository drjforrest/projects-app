import { DatabaseConnection } from '../connection';
import { readFileSync } from 'fs';
import { join } from 'path';

async function initDatabase() {
    try {
        // Read schema file
        const schemaPath = join(process.cwd(), 'src', 'db', 'init', 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');

        // Execute schema
        await DatabaseConnection.getInstance().query(schema);
        console.log('✅ Database schema initialized successfully');

        // Add some seed data if needed
        if (process.env.NODE_ENV === 'development') {
            await seedDatabase();
        }

    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    } finally {
        await DatabaseConnection.getInstance().end();
    }
}

async function seedDatabase() {
    // Add sample project
    const projectResult = await DatabaseConnection.getInstance().query(`
        INSERT INTO projects (
            name, category, objective, main_deliverable, to_whom, due_date
        ) VALUES (
            'Sample Project',
            'Research',
            'Create initial prototype',
            'Working MVP',
            'Development Team',
            CURRENT_TIMESTAMP + INTERVAL '30 days'
        ) RETURNING id
    `);

    const projectId = projectResult.rows[0].id;

    // Add sample meeting
    await DatabaseConnection.getInstance().query(`
        INSERT INTO meetings (
            project_id, meeting_name, date_time, attendees
        ) VALUES (
            $1,
            'Kickoff Meeting',
            CURRENT_TIMESTAMP + INTERVAL '1 day',
            ARRAY['John Doe', 'Jane Smith']
        )
    `, [projectId]);

    console.log('✅ Seed data added successfully');
}

// Run initialization
initDatabase(); 