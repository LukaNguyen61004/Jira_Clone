
import { NotificationModel } from "../models/notificationModel";
import { NotificationType, NotificationWithMeta } from "../types";

export class NotificationService {

    // Tao thong bao moi cho nguoi dc assigne issue
    static async notifyIssueAssigned(data: {
        assigneeId: number;
        assignerName: string;
        issueKey: string;
        issueName: string;
        issueId: number;
        projectId: number;
    }): Promise<void> {
        await NotificationModel.create({
            userId: data.assigneeId,
            type: 'issue_assigned',
            title: 'You were assigned to an issue',
            content: `${data.assignerName} assigned you to [${data.issueKey}] ${data.issueName}`,
            relatedIssueId: data.issueId,
            relatedProjectId: data.projectId,
        });
    }

    //Tao thong bao moi khi co comment tren Issue
    static async notifyCommentAdded(data: {
        commenterName: string;
        commenterId: number;
        issueKey: string;
        issueName: string;
        issueId: number;
        projectId: number;
        reporterId: number;
        assigneeId: number | null;
    }): Promise<void> {
        const usersToNotify = new Set<number>();

        if (data.reporterId !== data.commenterId) {
            usersToNotify.add(data.reporterId);
        }

        if (data.assigneeId && data.assigneeId !== data.commenterId) {
            usersToNotify.add(data.assigneeId);
        }

        if (usersToNotify.size === 0) return;

        const notifications = Array.from(usersToNotify).map((userId) => ({
            userId,
            type: 'comment_added' as const,
            title: 'New comment on an issue',
            content: `${data.commenterName} commented on [${data.issueKey}] ${data.issueName}`,
            releatedIssueId: data.issueId,
            relatedProjectId: data.projectId,
        }));

        await NotificationModel.createMany(notifications);
    }

    //Tao thong bao moi khi sprint duoc start
    static async notifySprintStarted(data: {
        starterName: string;
        starterId: number;
        sprintName: string;
        sprintId: number;
        projectId: number;
        projectName: string;
        memberIds: number[];
    }): Promise<void> {
        const membersToNotify = data.memberIds.filter((id) => id !== data.starterId);
        if (membersToNotify.length === 0) return;

        const notifications = membersToNotify.map((userId) => ({
            userId,
            type: 'sprint_started' as const,
            title: 'Sprint started',
            content: `${data.starterName} started sprint "${data.sprintName}" in project ${data.projectName}`,
            relatedSprintId: data.sprintId,
            relatedProjectId: data.projectId,
        }));

        await NotificationModel.createMany(notifications);
    }

    static async notifySprintCompleted(data: {
        completerName: string;
        completerId: number;
        sprintName: string;
        sprintId: number;
        projectId: number;
        projectName: string;
        memberIds: number[];
    }): Promise<void> {
        const membersToNotify = data.memberIds.filter((id) => id !== data.completerId);
        if (membersToNotify.length === 0) return;

        const notifications = membersToNotify.map((userId) => ({
            userId,
            type: 'sprint_completed' as const,
            title: 'Sprint completed',
            content: `${data.completerName} completed sprint "${data.sprintName}" in project ${data.projectName}`,
            relatedSprintId: data.sprintId,
            relatedProjectId: data.projectId,
        }));

        await NotificationModel.createMany(notifications);
    }

    static async notifyMemberAdded(data: {
        newMemberId: number;
        adderName: string;
        projectName: string;
        projectId: number;
    }): Promise<void> {
        await NotificationModel.create({
            userId: data.newMemberId,
            type: 'member_added',
            title: 'Added to a project',
            content: `${data.adderName} added you to project "${data.projectName}"`,
            relatedProjectId: data.projectId,
        });
    }

    // Lay thong bao 
    static async getMyNotifications(userId: number, limit = 30, offset = 0): Promise<{ notifications: NotificationWithMeta[]; unreadCount: number }> {
        const [notifications, unreadCount] = await Promise.all([
            NotificationModel.findByUserId(userId, limit, offset),
            NotificationModel.countUnread(userId),
        ]);

        return { notifications, unreadCount };
    }

    static async markAsRead(notificationId: number, userId: number): Promise<void> {
        const updated = await NotificationModel.markAsRead(notificationId, userId);
        if (!updated) {
            throw new Error('Notification not found');
        }
    }

    static async markAllAsRead(userId: number): Promise<{ updated: number }> {
        const updated = await NotificationModel.markAllAsRead(userId);
        return { updated };
    }

    static async deleteNotification(notificationId: number, userId: number): Promise<void> {
        const deleted = await NotificationModel.deleteById(notificationId, userId);
        if (!deleted) {
            throw new Error('Notification not found');
        }
    }
}