CREATE TABLE project_invitations (
    invitation_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    role_member user_role NOT NULL DEFAULT 'member',
    invited_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invitations_project ON project_invitations(project_id);
CREATE INDEX idx_invitations_token ON project_invitations(token);
CREATE INDEX idx_invitations_email ON project_invitations(email);
ALTER TYPE issue_status ADD VALUE 'in_review' AFTER 'in_progress';