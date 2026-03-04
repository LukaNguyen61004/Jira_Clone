import { IssueModel } from "../models/issueModel";
import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";
import { NotificationService } from "./notificationServices";
import { CreateIssueRequest, UpdateIssueRequest, IssueWithDetails, Issue, CommentWithUser, CreateCommentRequest } from "../types";

export class IssueService {
    static async createIssue(projectId: number, userId: number, data: CreateIssueRequest): Promise<IssueWithDetails> {
        const { name, description, type, priority = 'medium', assigneeId, epicId, sprintId } = data;

        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        if (assigneeId !== undefined) {
            const assigneedRole = await ProjectModel.getMemberRole(projectId, assigneeId);
            if (!assigneedRole) {
                throw new Error('Assignee must be a member of this project');
            }
            const assignee = await UserModel.findById(assigneeId);
            if (!assignee) {
                throw new Error('Assignee not found');
            }
        }

        if (epicId) {
            const { EpicModel } = await import('../models/epicModel');
            const epic = await EpicModel.findById(epicId);
            if (!epic) {
                throw new Error('Epic not found');
            }
            if (epic.project_id !== projectId) {
                throw new Error('Epic must be in the same project');
            }
        }

        if (sprintId) {
            const { SprintModel } = await import('../models/sprintModel');
            const sprint = await SprintModel.findById(sprintId);
            if (!sprint) {
                throw new Error('Sprint not found');
            }
            if (sprint.project_id !== projectId) {
                throw new Error('Sprint must be in the same project');
            }

            if (sprint.sprint_status === 'completed') {
                throw new Error('Cannot add issues to completed sprint');
            }
        }

        const issueNumber = await IssueModel.getNextIssueNumber(projectId);
        const issueKey = `${project.project_key}-${issueNumber}`;
        const issue = await IssueModel.create(
            projectId,
            issueKey,
            name,
            description || null,
            type,
            priority,
            userId, // reporter
            assigneeId || null,
            epicId || null,
            sprintId || null
        );

        const issueWithDetails = await IssueModel.findByIdWithDetails(issue.issue_id);
        if (!issueWithDetails) {
            throw new Error('Failed to create issue');
        }

        if (assigneeId && assigneeId !== userId) {
            const assigner = await UserModel.findById(userId);
            NotificationService.notifyIssueAssigned({
                assigneeId,
                assignerName: assigner?.user_name ?? 'Someone',
                issueKey: issueWithDetails.issue_key,
                issueName: issueWithDetails.issue_name,
                issueId: issueWithDetails.issue_id,
                projectId,
            }).catch(console.error); // fire-and-forget, không block response
        }

        return issueWithDetails;
    }


    static async getProjectIssues(projectId: number, userId: number): Promise<IssueWithDetails[]> {

        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        return await IssueModel.findByProjectId(projectId);
    }

    static async getIssueById(issueId: number, userId: number): Promise<IssueWithDetails> {
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            throw new Error('Issue not found');
        }

        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const issueWithDetails = await IssueModel.findByIdWithDetails(issueId);
        if (!issueWithDetails) {
            throw new Error('Issue not found');
        }

        return issueWithDetails;
    }

    static async updateIssue(issueId: number, userId: number, data: UpdateIssueRequest): Promise<Issue> {
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            throw new Error('Issue not found');
        }

        // Check user có phải member không
        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        // Nếu update assigneeId, check assignee có phải member không
        if (data.assigneeId !== undefined && data.assigneeId !== null) {
            const assigneeRole = await ProjectModel.getMemberRole(issue.project_id, data.assigneeId);
            if (!assigneeRole) {
                throw new Error('Assignee must be a member of this project');
            }
        }

        if (data.epicId !== undefined && data.epicId !== null) {
            const { EpicModel } = await import('../models/epicModel');
            const epic = await EpicModel.findById(data.epicId);
            if (!epic) {
                throw new Error('Epic not found');
            }
            if (epic.project_id !== issue.project_id) {
                throw new Error('Epic must be in the same project');
            }
        }

        if (data.sprintId !== undefined && data.sprintId !== null) {
            const { SprintModel } = await import('../models/sprintModel');
            const sprint = await SprintModel.findById(data.sprintId);
            if (!sprint) {
                throw new Error('Sprint not found');
            }
            if (sprint.project_id !== issue.project_id) {
                throw new Error('Sprint must be in the same project');
            }
            if (sprint.sprint_status === 'completed') {
                throw new Error('Cannot add issues to completed sprint');
            }
        }


        const updatedIssue = await IssueModel.update(issueId, {
            name: data.name,
            description: data.description,
            type: data.type,
            status: data.status,
            priority: data.priority,
            assigneeId: data.assigneeId,
            epicId: data.epicId,
            sprintId: data.sprintId
        });

        if (!updatedIssue) {
            throw new Error('Failed to update issue');
        }

        // Notify khi có assignee mới (khác người update)
        if (
            data.assigneeId !== undefined &&
            data.assigneeId !== null &&
            data.assigneeId !== userId &&
            data.assigneeId !== issue.assignee_id // chỉ notify khi assignee thay đổi
        ) {
            console.log('>>> Triggering notification for assigneeId:', data.assigneeId);
            const updater = await UserModel.findById(userId);
            NotificationService.notifyIssueAssigned({
                assigneeId: data.assigneeId,
                assignerName: updater?.user_name ?? 'Someone',
                issueKey: issue.issue_key,
                issueName: issue.issue_name,
                issueId: issue.issue_id,
                projectId: issue.project_id,
            }).catch(console.error);
        }

        return updatedIssue;
    }

    static async deleteIssue(issueId: number, userId: number): Promise<void> {
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            throw new Error('Issue not found');
        }

        // Check user có phải member không
        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        // Chỉ reporter hoặc project admin mới xóa được
        if (issue.reporter_id !== userId && userRole !== 'admin') {
            throw new Error('Only issue reporter or project admin can delete issue');
        }

        const deleted = await IssueModel.deleteIssue(issueId);
        if (!deleted) {
            throw new Error('Failed to delete issue');
        }
    }


    //Comment
    static async addComment(
        issueId: number,
        userId: number,
        data: CreateCommentRequest
    ): Promise<CommentWithUser> {
        const { content } = data;

        // Check issue tồn tại
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            throw new Error('Issue not found');
        }

        // Check user có phải member của project không
        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        // Create comment
        const comment = await IssueModel.createComment(issueId, userId, content);

        // Get user info
        const user = await UserModel.findById(userId);
         NotificationService.notifyCommentAdded({
            commenterName: user?.user_name ?? 'Someone',
            commenterId: userId,
            issueKey: issue.issue_key,
            issueName: issue.issue_name,
            issueId: issue.issue_id,
            projectId: issue.project_id,
            reporterId: issue.reporter_id,
            assigneeId: issue.assignee_id,
        }).catch(console.error);

        return {
            comment_id: comment.comment_id,
            issue_id: comment.issue_id,
            user_id: comment.user_id,
            user_name: user!.user_name,
            user_email: user!.user_email,
            user_avatar_url: user!.user_avatar_url,
            comment_content: comment.comment_content,
            comment_created_at: comment.comment_created_at,
            comment_updated_at: comment.comment_updated_at
        };
    }
    static async getIssueComments(
        issueId: number,
        userId: number
    ): Promise<CommentWithUser[]> {

        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            throw new Error('Issue not found');
        }

        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        return await IssueModel.findCommentsByIssueId(issueId);
    }

    static async deleteComment(
        commentId: number,
        userId: number
    ): Promise<void> {

        const comment = await IssueModel.findCommentById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        const issue = await IssueModel.findById(comment.issue_id);
        if (!issue) {
            throw new Error('Issue not found');
        }

        const userRole = await ProjectModel.getMemberRole(issue.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (comment.user_id !== userId && userRole !== 'admin') {
            throw new Error('Only comment author or project admin can delete comment');
        }

        const deleted = await IssueModel.deleteComment(commentId);
        if (!deleted) {
            throw new Error('Failed to delete comment');
        }
    }



}