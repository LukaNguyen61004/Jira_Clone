-- Add table epic
CREATE TABLE epics (
    epic_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    epic_name VARCHAR(200) NOT NULL,
    epic_description TEXT,
    epic_color VARCHAR(7) DEFAULT '#8B5CF6', 
    created_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    epic_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    epic_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_epics_project ON epics(project_id);

-- Add table sprint

CREATE TYPE sprint_status AS ENUM ('planned', 'active', 'completed');

CREATE TABLE sprints (
    sprint_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    sprint_name VARCHAR(200) NOT NULL,
    sprint_goal TEXT,
    sprint_status sprint_status NOT NULL DEFAULT 'planned',
    start_date DATE,
    end_date DATE,
    created_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    sprint_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sprint_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sprints_project ON sprints(project_id);

-- Update table issues (add epic_id, sprint_id)


ALTER TABLE issues ADD COLUMN epic_id INTEGER REFERENCES epics(epic_id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN sprint_id INTEGER REFERENCES sprints(sprint_id) ON DELETE SET NULL;

CREATE INDEX idx_issues_epic ON issues(epic_id);
CREATE INDEX idx_issues_sprint ON issues(sprint_id);