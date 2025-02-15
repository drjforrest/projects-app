-- Initialize database with proper extensions and settings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for better type safety
CREATE TYPE project_status AS ENUM ('active', 'completed', 'cancelled', 'on_hold');
CREATE TYPE project_category AS ENUM ('Personal', 'Professional Development', 'Professional Project', 'Side Hustle');

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    category project_category NOT NULL,
    project_types TEXT[] NOT NULL,
    background_context TEXT,
    objective TEXT NOT NULL,
    main_deliverable TEXT NOT NULL,
    to_whom VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    number_of_milestones INTEGER NOT NULL DEFAULT 0,
    milestones JSONB NOT NULL DEFAULT '[]',
    resources JSONB NOT NULL DEFAULT '[]',
    anticipated_difficulty INTEGER NOT NULL CHECK (anticipated_difficulty BETWEEN 0 AND 10),
    additional_notes TEXT,
    status project_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the outputs table
CREATE TABLE IF NOT EXISTS outputs (
    output_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
    output_name VARCHAR(255) NOT NULL,
    description TEXT,
    version_number VARCHAR(50),
    tags TEXT[],
    next_action TEXT,
    feedback_to VARCHAR(255),
    time_allocated INTEGER CHECK (time_allocated >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the meetings table
CREATE TABLE IF NOT EXISTS meetings (
    meeting_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
    meeting_name VARCHAR(255) NOT NULL,
    description TEXT,
    attendees TEXT[],
    quick_notes TEXT,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    transcript_path TEXT,
    summary_path TEXT,
    summary_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_outputs_project_id ON outputs(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_project_id ON meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date_time ON meetings(date_time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_outputs_updated_at ON outputs;
CREATE TRIGGER update_outputs_updated_at
    BEFORE UPDATE ON outputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful comments
COMMENT ON TABLE projects IS 'Stores main project information and metadata';
COMMENT ON TABLE outputs IS 'Stores project deliverables and outputs';
COMMENT ON TABLE meetings IS 'Stores project meeting information and summaries';

-- Create a function to clean up old data (optional)
CREATE OR REPLACE FUNCTION cleanup_old_data(days INTEGER)
RETURNS void AS $$
BEGIN
    DELETE FROM meetings 
    WHERE status = 'completed' 
    AND updated_at < CURRENT_DATE - days;
    
    DELETE FROM outputs 
    WHERE created_at < CURRENT_DATE - days
    AND NOT EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.project_id = outputs.project_id 
        AND p.status = 'active'
    );
END;
$$ LANGUAGE plpgsql;

-- First, create the schema_history table
CREATE TABLE IF NOT EXISTS schema_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    script_name VARCHAR(255),
    checksum VARCHAR(255),
    applied_by VARCHAR(100) DEFAULT CURRENT_USER,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    execution_time INTEGER,
    success BOOLEAN DEFAULT true
);

-- Create a unique index on version to prevent duplicate migrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_history_version ON schema_history(version);

-- Update schema version with more detail
INSERT INTO schema_history 
    (version, description, script_name, checksum)
VALUES 
    ('1.0.0', 
     'Initial schema creation', 
     'db-init.sql',
     md5(current_timestamp::text)
    )
ON CONFLICT (version) DO UPDATE
SET 
    applied_at = CURRENT_TIMESTAMP,
    execution_time = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - schema_history.applied_at))::INTEGER; 