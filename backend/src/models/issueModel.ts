
import pool from "../config/database";
import { Issue, IssueWithDetails, Comment, CommentWithUser } from "../types";

export class IssueModel {
    static async create(
        projectId: number, issueKey: string, name: string,
        description: string | null,
        type: 'task' | 'bug' | 'story',
        priority: 'low' | 'medium' | 'high',
        preporterId: number,
        assgineeId: number | null
    ): Promise<Issue> {
        const result = await pool.query(`INSERT INTO issues (project_id, issue_key, issue_name, issue_description, issue_type, issue_priority, reporter_id, assignee_id) 
                                                     VALUES ($1,$2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [projectId, issueKey, name, description, type, priority, preporterId, assgineeId]);
        return result.rows[0];
    }

    static async findById(issueId: number): Promise<Issue | null> {
        const result = await pool.query(`SELECT * FROM issues WHERE issue_id = $1`, [issueId]);
        return result.rows[0] || null;
    }

    static async findByIdWithDetails(issueId: number): Promise<IssueWithDetails | null> {
        const result = await pool.query(`SELECT i.*, u.user_name as reporter_name,
                                                     u.user_email as reporter_email,
                                                     a.user_name as assignee_name,
                                                     a.user_email as assignee_email 
                                        FROM issues i JOIN users u ON i.reporter_id=u.user_id
                                                      LEFT JOIN users a ON i.assignee_id=a.user_id 
                                        WHERE i.issue_id = $1`, [issueId]);
        return result.rows[0] || null;
    }

    static async deleteIssue(issueId: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM issues WHERE issue_id = $1`, [issueId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async findByProjectId(projectId: number): Promise<IssueWithDetails[]> {
        const result = await pool.query(`SELECT i.*, u.user_name as reporter_name,
                                                    u.user_email as reporter_email,
                                                    a.user_name as assignee_name,
                                                    a.user_email as assignee_email 
                                        FROM issues i JOIN users u ON i.reporter_id=u.user_id
                                                      LEFT JOIN users a ON i.assignee_id=a.user_id 
                                        WHERE i.project_id = $1
                                        ORDER BY i.issue_created_at DESC`, [projectId]);
        return result.rows;

    }

    static async getNextIssueNumber(projectId: number): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM issues WHERE project_id = $1`,
            [projectId]
        );
        return parseInt(result.rows[0].count) + 1;
    }

    static async update(issueId: number,
        data: {
            name?: string;
            description?: string | null;
            type?: 'task' | 'bug' | 'story';
            priority?: 'low' | 'medium' | 'high';
            status?: 'todo' | 'in_process' | 'done';
            assigneeId?: number | null;
        }
    ): Promise<Issue | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;


        if (data.name !== undefined) {
            updates.push(`issue_name = $${paramCount}`);
            values.push(data.name);
            paramCount++;
        }

        if (data.description !== undefined) {
            updates.push(`issue_description = $${paramCount}`);
            values.push(data.description);
            paramCount++;
        }

        if (data.type !== undefined) {
            updates.push(`issue_type = $${paramCount}`);
            values.push(data.type);
            paramCount++;
        }

        if (data.status !== undefined) {
            updates.push(`issue_status = $${paramCount}`);
            values.push(data.status);
            paramCount++;
        }

        if (data.priority !== undefined) {
            updates.push(`issue_priority = $${paramCount}`);
            values.push(data.priority);
            paramCount++;
        }

        if (data.assigneeId !== undefined) {
            updates.push(`assignee_id = $${paramCount}`);
            values.push(data.assigneeId);
            paramCount++;
        }

        if (updates.length === 0) {
            return this.findById(issueId);
        }
        updates.push(`issue_updated_at = CURRENT_TIMESTAMP`);

        values.push(issueId);
        const result = await pool.query(`UPDATE issues SET ${updates.join(', ')} WHERE issue_id = $${paramCount} RETURNING *`, values);

        return result.rows[0] || null;

    }


    static async createComment(issueId: number, userId: number, content: string): Promise<Comment> {
        const result = await pool.query(`INSERT INTO comments(issue_id, user_id, comment_content) VALUES($1, $2, $3) RETURNING *`, [issueId, userId, content]);
        return result.rows[0];
    }

    static async findCommentsByIssueId(issueId: number): Promise<CommentWithUser[]> {
        const result = await pool.query(`SELECT c.*,
                                              u.user_name, 
                                              u.user_email, 
                                              u.user_avatar_url FROM comments c
                                              JOIN users u ON c.user_id = u.user_id
                                      WHERE c.issue_id = $1
                                      ORDER BY c.comment_created_at ASC`, [issueId]);
        return result.rows;
    }

    static async findCommentById(commentId: number): Promise<Comment | null> {
        const result = await pool.query(
            'SELECT * FROM comments WHERE comment_id = $1',
            [commentId]
        );
        return result.rows[0] || null;
    }

    static async updateComment(commentId: number, commentContent: string): Promise<Comment | null> {
        const result = await pool.query(`UPDATE comments 
                                         SET comment_content = $1, comment_updated_at = CURRENT_TIMESTAMP
                                         WHERE comment_id = $2 RETURNING *`, [commentContent, commentId]
        );
        return result.rows[0] || null;
    }

    static async deleteComment(commentId: number): Promise<boolean> {
        const result = await pool.query(
            'DELETE FROM comments WHERE comment_id = $1',
            [commentId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
}
