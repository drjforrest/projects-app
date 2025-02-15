CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    team_size INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    category VARCHAR(100) NOT NULL,
    project_types TEXT[] DEFAULT '{}',
    background_context TEXT,
    objective TEXT NOT NULL,
    main_deliverable TEXT NOT NULL,
    to_whom VARCHAR(255) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    number_of_milestones INTEGER DEFAULT 0,
    milestones JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    anticipated_difficulty INTEGER,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meetings (
    meeting_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    meeting_name VARCHAR(255) NOT NULL,
    description TEXT,
    attendees TEXT[] DEFAULT '{}',
    quick_notes TEXT,
    date_time TIMESTAMP NOT NULL,
    transcript_path TEXT,
    summary_path TEXT,
    summary_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outputs (
    output_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    output_name VARCHAR(255) NOT NULL,
    description TEXT,
    version_number VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    next_action TEXT,
    feedback_to TEXT,
    time_allocated INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    default_category VARCHAR(100) DEFAULT 'Research',
    default_milestone_interval INTEGER DEFAULT 14,
    default_meeting_duration INTEGER DEFAULT 60,
    auto_create_milestones BOOLEAN DEFAULT true,
    reminder_lead_time INTEGER DEFAULT 3,
    email_notifications BOOLEAN DEFAULT true,
    notify_deadlines BOOLEAN DEFAULT true,
    notify_meetings BOOLEAN DEFAULT true,
    notify_updates BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light',
    compact_view BOOLEAN DEFAULT false,
    default_project_view VARCHAR(20) DEFAULT 'list',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add project activity tracking
CREATE TABLE IF NOT EXISTS project_activities (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    hours_spent NUMERIC(5,2),
    performed_by VARCHAR(255),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add project comments
CREATE TABLE IF NOT EXISTS project_comments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    comment_text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add triggers
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outputs_updated_at
    BEFORE UPDATE ON outputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 