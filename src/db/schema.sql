-- Main Projects Table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    category TEXT NOT NULL,
    project_types TEXT[], -- Array of types
    background_context TEXT,
    objective TEXT NOT NULL,
    main_deliverable TEXT NOT NULL,
    to_whom TEXT NOT NULL,
    due_date DATE NOT NULL,
    number_of_milestones INTEGER,
    milestones JSONB,  -- Storing as JSONB for flexibility
    resources JSONB,   -- Storing as JSONB for flexibility
    anticipated_difficulty INTEGER CHECK (anticipated_difficulty BETWEEN 0 AND 10),
    additional_notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Outputs Table
CREATE TABLE outputs (
    output_id SERIAL PRIMARY KEY,
    project_id INTEGER,
    output_name TEXT NOT NULL,
    description TEXT,
    version_number TEXT,
    tags TEXT[],  -- Changed to array for better querying
    next_action TEXT,
    feedback_to TEXT,
    time_allocated INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

-- Meetings Table
CREATE TABLE meetings (
    meeting_id SERIAL PRIMARY KEY,
    project_id INTEGER,
    meeting_name TEXT NOT NULL,
    description TEXT,
    attendees TEXT[],  -- Changed to array for better querying
    quick_notes TEXT,
    date_time TIMESTAMP WITH TIME ZONE,
    transcript_path TEXT,
    summary_path TEXT,
    summary_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outputs_updated_at
    BEFORE UPDATE ON outputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
