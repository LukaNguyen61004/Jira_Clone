
import pool from "../config/database";
import { Project, ProjectMember, ProjectWithDetails, ProjectMemberWithUser } from "../types/index";


export class ProjectModel {
    static async create(name: string, key: string, description: string | null, createdBy: number): Promise<Project> {
        const result = await pool.query(`INSERT INTO projects (project_name, project_key,project_description,created_by) VALUES($1,$2,$3,$4) RETURNING *`, [name, key, description, createdBy]);
        return result.rows[0];
    }

    static async findById(projectId: number): Promise<Project | null> {
        const result = await pool.query(`SELECT * FROM projects WHERE project_id= $1`, [projectId]);
        return result.rows[0] || null;
    }

    static async findByKey(projectKey: string): Promise<Project | null> {
        const result = await pool.query(`SELECT * FROM projects WHERE project_key = $1`, [projectKey]);
        return result.rows[0];
    }

    static async delete(projectId: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM projects WHERE project_id= $1`, [projectId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async update(projectId: number, name?: string, description?: string): Promise<Project | null> {
        const update: string[] = [];
        const values: any[] = [];
        let paramCount = 1;


        if (name !== undefined) {
            update.push(`project_name= $${paramCount}`);
            values.push(name);
            paramCount++;
        }

        if (description !== undefined) {
            update.push(`project_description= $${paramCount}`)
            values.push(description);
            paramCount++;
        }

        if (update.length === 0) {
            return this.findById(projectId);
        }

        values.push(projectId);

        const result = await pool.query(
            `UPDATE projects SET ${update.join(',')} WHERE project_id= $${paramCount} RETURNING *`, values
        );
        return result.rows[0] || null;

    }

    static async addMember(projectId: number, userId: number, role: 'admin' | 'member'): Promise<ProjectMember> {
        const result = await pool.query(`INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *`, [projectId, userId, role]);
        return result.rows[0];
    }

    static async removeMember(projectId: number, userId: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM project_members WHERE project_id = $1 AND user_id = $2`, [projectId, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async getMemberRole(projectId: number, userId: number): Promise<'admin' | 'member' | null> {
        const result = await pool.query('SELECT role FROM project_members WHERE project_id= $1 AND user_id = $2', [projectId, userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0].role ;
    }

    static async getMembers(projectId: number): Promise<ProjectMemberWithUser[]> {
        const result = await pool.query(`SELECT u.user_id, u.user_name, u.user_email, u.user_avatar_url, pm.role, pm.joined_at
                                       FROM project_members pm JOIN users u ON pm.user_id= u.user_id
                                       WHERE pm.project_id = $1
                                       ORDER BY pm.joined_at ASC`, [projectId]);
        return result.rows;
    }

    static async findByUserId(userId: number): Promise<ProjectWithDetails[]> {
        const result = await pool.query(`SELECT p.*, u.user_name as creator_name, u.user_email as creator_email, pm.role as your_role FROM projects p JOIN users u ON p.created_by = u.user_id
                                                              JOIN project_members pm ON p.project_id = pm.project_id
                                              WHERE pm.user_id = $1
                                              ORDER BY p.project_created_at DESC`, [userId]);
        return result.rows;
    }

}
