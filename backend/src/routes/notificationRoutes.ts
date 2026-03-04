import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', NotificationController.getMyNotifications);

router.patch('/:id/read', NotificationController.markAsRead);

router.patch('/read-all', NotificationController.markAllAsRead);

router.delete('/:id', NotificationController.deleteNotification);

export default router;