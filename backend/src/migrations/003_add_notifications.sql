CREATE TYPE notification_type AS ENUM('issue_assigned', 'issue_update', 'comment_added', 'sprint_started', 'sprint_completed', 'member_added');

CREATE TABLE notifications (
    notifi_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notifi_type notification_type NOT NULL,
    notifi_title VARCHAR(255) NOT NULL,
    notifi_content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_issue_id INTEGER REFERENCES issues(issue_id) ON DELETE SET NULL,
    related_project_id INTEGER REFERENCES projects(project_id) ON DELETE SET NULL,
    related_sprint_id INTEGER REFERENCES sprints(sprint_id) ON DELETE SET NULL,
    notifi_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(notifi_created_at DESC);