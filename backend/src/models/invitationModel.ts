import pool from '../config/database';
import { ProjectInvitation  } from '../types';

export class InvitationModel{
    static async create(projectId: number, email:string, token:string, role: 'admin' | 'member', invitedBy: number, expireAt: Date): Promise<ProjectInvitation>{
        const result = await pool.query(`INSERT INTO project_invitations (project_id, email, token, role_member, invited_by, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,[projectId, email, token, role, invitedBy, expireAt]);
        return result.rows[0];
    }

    static async findByToken(token: string): Promise<ProjectInvitation | null>{
         const result = await pool.query(`SELECT * FROM project_invitations WHERE token= $1`, [token]);
        return result.rows[0];
    }
    
    static async findPendingByEmailAndProject(email:string, projectId: number): Promise<ProjectInvitation | null>{
        const result = await pool.query(`SELECT * FROM project_invitations WHERE email = $1 AND project_id = $2 AND accepted_at IS NULL AND expires_at > NOW()`,[email, projectId]);
        return result.rows[0];
    }

    static async deleteById(invitationId: number): Promise<boolean>{
        const result =await pool.query(`DELETE FROM project_invitations WHERE invitation_id = $1`, [invitationId]);
        return  result.rowCount !== null && result.rowCount > 0;
    }

    static async accept(invitationId: number): Promise<ProjectInvitation | null>{
        const result=await pool.query('UPDATE project_invitations SET accepted_at= NOW() WHERE invitation_id = $1 RETURNING *', [invitationId]);
        return result.rows[0];
    }
}