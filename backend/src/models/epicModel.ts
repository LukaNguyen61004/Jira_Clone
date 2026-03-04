import pool from '../config/database';
import { Epic, EpicWithDetails } from '../types';

export class EpicModel {
    static async create(projectId: number, name: string, description: string | null, color: string, createdBy: number): Promise<Epic> {
        const result = await pool.query(`INSERT INTO epics (project_id, epic_name, epic_description, epic_color, created_by) 
                                         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [projectId, name, description, color, createdBy]);
        return result.rows[0];
    }

    static async findById(epicId: number): Promise<Epic | null> {
        const result = await pool.query(`SELECT * FROM epics WHERE epic_id= $1`, [epicId]);
        return result.rows[0] || null;
    }

    static async findByProjectId(projectId: number): Promise<EpicWithDetails[]> {
        const result = await pool.query(`SELECT e.*, u.user_name as creator_name, COUNT(i.issue_id) as issue_count
                                       FROM epics e JOIN users u ON e.created_by= u.user_id
                                                    LEFT JOIN issues i ON e.epic_id = i.epic_id
                                        WHERE e.project_id= $1
                                        GROUP BY e.epic_id, u.user_name
                                        ORDER BY e.epic_created_at DESC`, [projectId]);
        return result.rows;
    }

    static async findByIdWithDetails(epicId: number): Promise<EpicWithDetails | null> {
        const result = await pool.query(`SELECT e.*, u.user_name as creator_name, COUNT(i.issue_id) as issue_count
                                       FROM epics e JOIN users u ON e.created_by= u.user_id
                                                    LEFT JOIN issues i ON e.epic_id = i.epic_id
                                        WHERE e.epic_id= $1
                                        GROUP BY e.epic_id, u.user_name
                                        ORDER BY e.epic_created_at DESC`, [epicId]);
        return result.rows[0] || null;
    }

    static async update(epicId: number, data: { name?: string; description?: string | null; color?: string; }): Promise<Epic | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            updates.push(`epic_name = $${paramCount}`);
            values.push(data.name);
            paramCount++;
        }

        if (data.description !== undefined) {
            updates.push(`epic_description = $${paramCount}`);
            values.push(data.description);
            paramCount++;
        }

        if (data.color !== undefined) {
            updates.push(`epic_color = $${paramCount}`);
            values.push(data.color);
            paramCount++;
        }

        if (updates.length === 0) {
            return this.findById(epicId);
        }

        updates.push(`epic_updated_at = CURRENT_TIMESTAMP`);
        values.push(epicId);

        const result = await pool.query(`UPDATE epics  SET ${updates.join(', ')}  WHERE epic_id = $${paramCount} RETURNING *`, values);

        return result.rows[0] || null;
    }

    static async delete(epicId: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM epics WHERE epic_id = $1', [epicId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async getEpicIssues(epicId: number): Promise<any[]> {
        const result = await pool.query(`SELECT i.*, reporter.user_name as reporter_name, assignee.user_name as assignee_name
                                         FROM issues i JOIN users reporter ON i.reporter_id = reporter.user_id
                                                       LEFT JOIN users assignee ON i.assignee_id = assignee.user_id
                                         WHERE i.epic_id = $1
                                         ORDER BY i.issue_created_at DESC`, [epicId]);
        return result.rows;
    }

}