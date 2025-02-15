-- Initialize database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    retrospective JSONB
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

-- Create feedback tables
CREATE TABLE IF NOT EXISTS output_feedback (
    feedback_id SERIAL PRIMARY KEY,
    output_id INTEGER REFERENCES outputs(output_id) ON DELETE CASCADE,
    reviewer VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    completeness_rating INTEGER CHECK (completeness_rating BETWEEN 1 AND 5),
    clarity_rating INTEGER CHECK (clarity_rating BETWEEN 1 AND 5),
    action_items TEXT[] DEFAULT ARRAY[]::TEXT[],
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_outputs_project_id ON outputs(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_project_id ON meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date_time ON meetings(date_time);
CREATE INDEX IF NOT EXISTS idx_output_feedback_output_id ON output_feedback(output_id);
CREATE INDEX IF NOT EXISTS idx_output_feedback_rating ON output_feedback(rating);

-- Create updated_at trigger
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
