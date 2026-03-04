import { InvitationService } from "../services/invitationServices";
import { Request, Response } from "express";


export class InvitationController {
    static async sendInvitation(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const projectId = parseInt(req.params.id as string);
            const email = req.body.email;

            const sendInvitation = await InvitationService.sendInvitation(email, userId, projectId)

            res.status(201).json({
                message: 'Invitation send successfully',
                sendInvitation
            })

        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User already in project' || error.message === 'Invitation already used' || error.message === 'Invitation has expired')
                    return res.status(400).json({ error: error.message });

                if (error.message === 'You are not admin of this project')
                    return res.status(403).json({ error: error.message });

                if (error.message === 'Project is not found' || error.message === 'User email does not exist')
                    return res.status(404).json({ error: error.message });

            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async acceptInvitation(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const token = req.body.token;

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (!token) {
                return res.status(404).json({ error: 'Invalid token' });
            }

            const accept = await InvitationService.acceptInvitation(token, userId);
            res.status(200).json({ message: 'Accept Invitation successful' });

        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invitation already used' || error.message === 'Invitation has expired')
                    return res.status(400).json({ error: error.message });

                if (error.message === 'Invalid invitation' || error.message === 'User not found')
                    return res.status(404).json({ error: error.message });

                if (error.message === 'This inivation does not belong to you')
                    return res.status(403).json({ error: error.message });

                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Server error' });

        }

    }
}