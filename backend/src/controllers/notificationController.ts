import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationServices';


export class NotificationController {
    static async getMyNotifications(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const limit = parseInt(req.query.limit as string) || 30;
            const offset = parseInt(req.query.offset as string) || 0;

            const result = await NotificationService.getMyNotifications(userId, limit, offset);
            res.json(result);

        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async markAsRead(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const notificationId = parseInt(req.params.id as string);
            if (isNaN(notificationId)) {
                return res.status(400).json({ error: 'Invalid notification ID' });
            }

            await NotificationService.markAsRead(notificationId, userId);

            res.json({ message: 'Notification marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);

            if (error instanceof Error) {
                if (error.message === 'Notification not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const result = await NotificationService.markAllAsRead(userId);

            res.json({ message: 'All notifications marked as read', ...result });
        } catch (error) {
            console.error('Mark all as read error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteNotification(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const notificationId = parseInt(req.params.id as string);
            if (isNaN(notificationId)) {
                return res.status(400).json({ error: 'Invalid notification ID' });
            }

            await NotificationService.deleteNotification(notificationId, userId);

            res.json({ message: 'Notification deleted successfully' });
        } catch (error) {
            console.error('Delete notification error:', error);

            if (error instanceof Error) {
                if (error.message === 'Notification not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }
}