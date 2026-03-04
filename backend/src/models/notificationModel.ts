import pool from '../config/database';
import { Notification, NotificationWithMeta, NotificationType } from '../types';

export class NotificationModel {

    static async create(data: {
        userId: number;
        type: NotificationType;
        title: string;
        content: string;
        relatedIssueId?: number | null;
        relatedProjectId?: number | null;
        relatedSprintId?: number | null;
    }): Promise<Notification> {
        const result = await pool.query(`INSERT INTO notifications (user_id, notifi_type, notifi_title, notifi_content, related_issue_id, related_project_id, related_sprint_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [
            data.userId,
            data.type,
            data.title,
            data.content,
            data.relatedIssueId ?? null,
            data.relatedProjectId ?? null,
            data.relatedSprintId ?? null,
        ]);
        return result.rows[0];
    }
    static async createMany(data: {
        userId: number;
        type: NotificationType;
        title: string;
        content: string;
        relatedIssueId?: number | null;
        relatedProjectId?: number | null;
        relatedSprintId?: number | null;
    }[]): Promise<void> {
        if (data.length === 0) return;
        const values: any[] = [];
        const placeholders = data.map((n, i) => {
            const base = i * 7;
            values.push(
                n.userId,
                n.type,
                n.title,
                n.content,
                n.relatedIssueId,
                n.relatedProjectId,
                n.relatedSprintId
            );
            return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7})`;
        });
        await pool.query(`INSERT INTO notifications (user_id, notifi_type, notifi_title, notifi_content, related_issue_id, related_project_id, related_sprint_id)  VALUES ${placeholders.join(', ')}`, values);
    }

    static async findByUserId(userId: number, limit = 30, offset = 0): Promise<NotificationWithMeta[]> {
        const result = await pool.query(`SELECT n.*  
                                        FROM notifications n LEFT JOIN issues i ON n.related_issue_id= i.issue_id
                                                             LEFT JOIN projects p ON n.related_project_id=p.project_id
                                                             LEFT JOIN sprints sp ON n.related_sprint_id=sp.sprint_id
                                        WHERE n.user_id = $1
                                        ORDER BY n.notifi_created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        return result.rows;
    }

    static async countUnread(userId: number): Promise<number> {
        const result = await pool.query(`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`, [userId]);
        return parseInt(result.rows[0].count);
    }

    static async markAsRead(notificationId: number, userId: number): Promise<boolean> {
        const result = await pool.query(`UPDATE notifications SET is_read = true WHERE notifi_id = $1 AND user_id = $2`, [notificationId, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    static async markAllAsRead(userId: number): Promise<number> {
        const result = await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`, [userId]);
        return result.rowCount ?? 0;
    }

    static async deleteById(notificationId: number, userId: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM notifications WHERE  notifi_id = $1 AND user_id = $2`, [notificationId, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

}