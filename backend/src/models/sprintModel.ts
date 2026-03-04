import pool from '../config/database';
import { Sprint, SprintWithDetails } from '../types';

export class SprintModel {
    static async create(projectId: number, name: string, goal: string | null, startDate: Date | null, endDate: Date | null, createdBy: number): Promise<Sprint> {
        const result = await pool.query(`INSERT INTO sprints (project_id, sprint_name, sprint_goal, start_date, end_date, created_by)
                                           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [projectId, name, goal, startDate, endDate, createdBy]);
        return result.rows[0];
    }

    static async findById(sprintId: number): Promise<Sprint | null> {
        const result = await pool.query('SELECT * FROM sprints WHERE sprint_id = $1', [sprintId]);
        return result.rows[0] || null;
    }

    static async findByProjectId(projectId: number): Promise<SprintWithDetails[]> {
        const result = await pool.query(`SELECT s.*,u.user_name as creator_name, COUNT(i.issue_id) as issue_count, COUNT(CASE WHEN i.issue_status = 'done' THEN 1 END) as completed_count
                                        FROM sprints s JOIN users u ON s.created_by = u.user_id
                                                       LEFT JOIN issues i ON s.sprint_id = i.sprint_id
                                        WHERE s.project_id = $1
                                        GROUP BY s.sprint_id, u.user_name
                                        ORDER BY 
                                            CASE s.sprint_status
                                                WHEN 'active' THEN 1
                                                WHEN 'planned' THEN 2
                                                WHEN 'completed' THEN 3
                                            END,
                                            s.sprint_created_at DESC`, [projectId]);
        return result.rows;
    }


    static async findByIdWithDetails(sprintId: number): Promise<SprintWithDetails | null> {
        const result = await pool.query(`SELECT  s.*, u.user_name as creator_name, COUNT(i.issue_id) as issue_count, COUNT(CASE WHEN i.issue_status = 'done' THEN 1 END) as completed_count
                                        FROM sprints s JOIN users u ON s.created_by = u.user_id
                                                       LEFT JOIN issues i ON s.sprint_id = i.sprint_id
                                        WHERE s.sprint_id = $1
                                        GROUP BY s.sprint_id, u.user_name`, [sprintId]);
        return result.rows[0] || null;
    }

    static async update(sprintId: number,
        data: { name?: string; goal?: string | null; status?: 'planned' | 'active' | 'completed'; startDate?: Date | null, endDate?: Date | null }): Promise<Sprint | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            updates.push(`sprint_name = $${paramCount}`);
            values.push(data.name);
            paramCount++;
        }

        if (data.goal !== undefined) {
            updates.push(`sprint_goal = $${paramCount}`);
            values.push(data.goal);
            paramCount++;
        }

        if (data.status !== undefined) {
            updates.push(`sprint_status = $${paramCount}`);
            values.push(data.status);
            paramCount++;
        }

        if (data.startDate !== undefined) {
            updates.push(`start_date = $${paramCount}`);
            values.push(data.startDate);
            paramCount++;
        }

        if (data.endDate !== undefined) {
            updates.push(`end_date = $${paramCount}`);
            values.push(data.endDate);
            paramCount++;
        }

        if (updates.length === 0) {
            return this.findById(sprintId);
        }

        updates.push(`sprint_updated_at = CURRENT_TIMESTAMP`);
        values.push(sprintId);

        const result = await pool.query(`UPDATE sprints SET ${updates.join(', ')} WHERE sprint_id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }

    static async delete(sprintId: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM sprints WHERE sprint_id = $1', [sprintId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async getSprintIssues(sprintId: number): Promise<any[]> {
        const result = await pool.query(`SELECT i.*, reporter.user_name as reporter_name, assignee.user_name as assignee_name, e.epic_name,
                                                    e.epic_color 
                                        FROM issues i JOIN users reporter ON i.reporter_id = reporter.user_id
                                                      LEFT JOIN users assignee ON i.assignee_id = assignee.user_id
                                                      LEFT JOIN epics e ON i.epic_id = e.epic_id
                                        WHERE i.sprint_id = $1 
                                        ORDER BY i.issue_status, i.issue_created_at DESC`, [sprintId]);
        return result.rows;
    }

    static async hasActiveSprint(projectId: number): Promise<Sprint | null> {
        const result = await pool.query(`SELECT * FROM sprints  WHERE project_id = $1 AND sprint_status = 'active'LIMIT 1`, [projectId]);
        return result.rows[0] || null;
    }

    static async startSprint(sprintId: number, startDate: Date): Promise<Sprint | null> {
        const result = await pool.query(`UPDATE sprints SET sprint_status = 'active',  start_date = $1, sprint_updated_at = CURRENT_TIMESTAMP
                                         WHERE sprint_id = $2 RETURNING *`, [startDate, sprintId]);
        return result.rows[0] || null;
    }

    static async completeSprint(sprintId: number): Promise<Sprint | null> {
        const result = await pool.query(`UPDATE sprints  SET sprint_status = 'completed', sprint_updated_at = CURRENT_TIMESTAMP
                                         WHERE sprint_id = $1 RETURNING *`, [sprintId]);
        return result.rows[0] || null;
    }

    static async moveIncompleteIssues(fromSprintId: number, toSprintId: number | null): Promise<number> {
        const result = await pool.query(`UPDATE issues  SET sprint_id = $1 WHERE sprint_id = $2 AND issue_status != 'done'`, [toSprintId, fromSprintId]);
        return result.rowCount || 0;
    }

}