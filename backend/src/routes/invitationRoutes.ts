import {Router} from 'express';
import { InvitationController } from '../controllers/invitationController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateSendInvitation } from '../middlewares/validation';

const router=Router();

router.use(authMiddleware);

router.post('/projects/:id/invitations', validateSendInvitation, InvitationController.sendInvitation);

router.post('/invitations/accept',InvitationController.acceptInvitation);

export default router;