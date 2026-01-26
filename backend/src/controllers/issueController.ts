import { Request, Response } from "express";
import { IssueService } from "../services/issueServices";
import { CreateIssueRequest, UpdateIssueRequest, CreateCommentRequest } from "../types";

export class IssueController {
    static async createIssue(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid Project Id' });
            }

            const data = req.body as CreateIssueRequest;

            const issue = await IssueService.createIssue(projectId, userId, data);
            res.status(201).json({
                message: 'Issue created successfully',
                issue
            });

        } catch (error) {
            console.error('Create issue error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Project not found' || error.message === 'Assignee not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }

    static async getProjectIssues(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const projectId = parseInt(req.params.projectId as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID' });
            }

            const issues = await IssueService.getProjectIssues(projectId, userId);

            res.json({ issues });
        } catch (error) {
            console.error('Get project issues error:', error);

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

    static async getIssueById(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const issueId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(issueId)) {
                return res.status(400).json({ error: 'Invalid issue ID' });
            }

            const issue = await IssueService.getIssueById(issueId, userId);

            res.json({ issue });
        } catch (error) {
            console.error('Get issue by ID error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Issue not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateIssue(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const issueId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(issueId)) {
                return res.status(400).json({ error: 'Invalid issue ID' });
            }

            const data = req.body as UpdateIssueRequest;

            const issue = await IssueService.updateIssue(issueId, userId, data);

            res.json({
                message: 'Issue updated successfully',
                issue
            });
        } catch (error) {
            console.error('Update issue error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Issue not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteIssue(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const issueId = parseInt(req.params.id as string);

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (isNaN(issueId)) {
                return res.status(400).json({ error: 'Invalid issue ID' });
            }

            await IssueService.deleteIssue(issueId, userId);

            res.json({ message: 'Issue deleted successfully' });
        } catch (error) {
            console.error('Delete issue error:', error);

            if (error instanceof Error) {
                if (error.message === 'You are not a member of this project') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Only issue reporter or project admin can delete issue') {
                    return res.status(403).json({ error: error.message });
                }
                if (error.message === 'Issue not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    //Comment
     static async addComment(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const issueId = parseInt(req.params.id as string);

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (isNaN(issueId)) {
        return res.status(400).json({ error: 'Invalid issue ID' });
      }

      const data = req.body as CreateCommentRequest;

      const comment = await IssueService.addComment(issueId, userId, data);

      res.status(201).json({
        message: 'Comment added successfully',
        comment
      });
    } catch (error) {
      console.error('Add comment error:', error);

      if (error instanceof Error) {
        if (error.message === 'You are not a member of this project') {
          return res.status(403).json({ error: error.message });
        }
        if (error.message === 'Issue not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getIssueComments(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const issueId = parseInt(req.params.id as string);

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (isNaN(issueId)) {
        return res.status(400).json({ error: 'Invalid issue ID' });
      }

      const comments = await IssueService.getIssueComments(issueId, userId);

      res.json({ comments });
    } catch (error) {
      console.error('Get issue comments error:', error);

      if (error instanceof Error) {
        if (error.message === 'You are not a member of this project') {
          return res.status(403).json({ error: error.message });
        }
        if (error.message === 'Issue not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const commentId = parseInt(req.params.commentId as string);

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid comment ID' });
      }

      await IssueService.deleteComment(commentId, userId);

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);

      if (error instanceof Error) {
        if (error.message === 'You are not a member of this project') {
          return res.status(403).json({ error: error.message });
        }
        if (error.message === 'Only comment author or project admin can delete comment') {
          return res.status(403).json({ error: error.message });
        }
        if (error.message === 'Comment not found' || error.message === 'Issue not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Server error' });
    }
  }
}
