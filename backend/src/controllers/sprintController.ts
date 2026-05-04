import { Request, Response } from "express";
import { SprintService } from '../services/sprintServices';
import { CreateSprintRequest, UpdateSprintRequest } from '../types';

export class SprintController {
    static async createSprint(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const data = req.body as CreateSprintRequest;
            const sprint = await SprintService.createSprint(projectId, userId, data);

            res.status(201).json({
                message: 'Sprint created successfully',
                sprint
            });

        } catch (error) {
            console.error('Create sprint error:', error);

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

    static async getProjectSprints(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const sprints = await SprintService.getProjectSprints(projectId, userId);
            res.json({ sprints });

        } catch (error) {
            console.error('Get project sprints error:', error);

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

    static async getSprintById(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            const sprint = await SprintService.getSprintById(sprintId, userId);
            res.json({ sprint });

        } catch (error) {
            console.error('Get sprint by ID error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateSprint(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            const data = req.body as UpdateSprintRequest;

            const sprint = await SprintService.updateSprint(sprintId, userId, data);
            res.json({
                message: 'Sprint updated successfully',
                sprint
            });

        } catch (error) {
            console.error('Update sprint error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async startSprint(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            const sprint = await SprintService.startSprint(sprintId, userId);
            res.json({
                message: 'Sprint started successfully',
                sprint
            });

        } catch (error) {
            console.error('Start sprint error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Only planned sprints can be started') {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message.includes('Another sprint is already active')) {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === 'Sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async completeSprint(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            const { moveToSprintId } = req.body ?? {};

            const result = await SprintService.completeSprint(
                sprintId,
                userId,
                moveToSprintId
            );

            res.json({
                message: 'Sprint completed successfully',
                sprint: result.sprint,
                movedIssues: result.movedIssues
            });

        } catch (error) {
            console.error('Complete sprint error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Only active sprints can be completed') {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === 'Sprint not found' || error.message === 'Target sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteSprint(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            await SprintService.deleteSprint(sprintId, userId);

            res.json({ message: 'Sprint deleted successfully' });
        } catch (error) {
            console.error('Delete sprint error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Only project admin can delete sprint') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Cannot delete active sprint. Please complete it first.') {
                    return res.status(400).json({ error: error.message });
                }
                if (error.message === 'Sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getSprintIssues(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const sprintId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(sprintId)) {
                return res.status(400).json({ error: 'Invalid sprint ID' });
            }

            const issues = await SprintService.getSprintIssues(sprintId, userId);

            res.json({ issues });
        } catch (error) {
            console.error('Get sprint issues error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Sprint not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

}

