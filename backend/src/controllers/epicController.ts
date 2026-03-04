import { Request, Response } from 'express';
import { EpicServices } from '../services/epicServices';
import { CreateEpicRequest, UpdateEpicRequest } from '../types';

export class EpicController {
    static async createEpic(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const data = req.body as CreateEpicRequest;
            const epic = await EpicServices.createEpic(projectId, userId, data)

            res.status(201).json({
                message: 'Epic created successfully',
                epic
            });
        } catch (error) {
            console.error('Create epic error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async getProjectEpics(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const epics = await EpicServices.getProjectEpics(projectId, userId);

            res.json({ epics });
        } catch (error) {
            console.error('Get project epics error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getEpicById(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const epicId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(epicId)) {
                return res.status(400).json({ error: 'Invalid epic ID' });
            }

            const epic = await EpicServices.getEpicById(epicId, userId);

            res.json({ epic });
        } catch (error) {
            console.error('Get epic by ID error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Epic not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateEpic(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const epicId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(epicId)) {
                return res.status(400).json({ error: 'Invalid epic ID' });
            }

            const data = req.body as UpdateEpicRequest;

            const epic = await EpicServices.updateEpic(epicId, userId, data);

            res.json({
                message: 'Epic updated successfully',
                epic
            });
        } catch (error) {
            console.error('Update epic error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Epic not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteEpic(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const epicId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(epicId)) {
                return res.status(400).json({ error: 'Invalid epic ID' });
            }

            await EpicServices.deleteEpic(epicId, userId);

            res.json({ message: 'Epic deleted successfully' });
        } catch (error) {
            console.error('Delete epic error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Only epic creator or project admin can delete epic') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Epic not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getEpicIssues(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const epicId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(epicId)) {
                return res.status(400).json({ error: 'Invalid epic ID' });
            }

            const issues = await EpicServices.getEpicIssues(epicId, userId);

            res.json({ issues });
        } catch (error) {
            console.error('Get epic issues error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Epic not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

}