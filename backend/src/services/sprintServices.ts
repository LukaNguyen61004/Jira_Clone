import { UserModel } from '../models/userModel';
import { SprintModel } from '../models/sprintModel';
import { ProjectModel } from '../models/projectModel';
import { NotificationService } from './notificationServices';
import { CreateSprintRequest, UpdateSprintRequest, SprintWithDetails, Sprint } from '../types';

export class SprintService {
    static async createSprint(projectId: number, userId: number, data: CreateSprintRequest): Promise<SprintWithDetails> {
        const { name, goal, startDate, endDate } = data;

        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end && start >= end) {
            throw new Error('Start date must be before end date');
        }

        const sprint = await SprintModel.create(projectId, name, goal || null, start, end, userId);

        const sprintWithDetails = await SprintModel.findByIdWithDetails(sprint.sprint_id);
        if (!sprintWithDetails) {
            throw new Error('Failed to create sprint');
        }

        return sprintWithDetails;
    }

    static async getProjectSprints(projectId: number, userId: number): Promise<SprintWithDetails[]> {
        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        return await SprintModel.findByProjectId(projectId);
    }

    static async getSprintById(sprintId: number, userId: number): Promise<SprintWithDetails> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const sprintWithDetails = await SprintModel.findByIdWithDetails(sprintId);
        if (!sprintWithDetails) {
            throw new Error('Sprint not found');
        }

        return sprintWithDetails;
    }

    static async updateSprint(sprintId: number, userId: number, data: UpdateSprintRequest): Promise<Sprint> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (sprint.sprint_status === 'completed' && data.status !== 'completed') {
            throw new Error('Cannot modify completed sprint');
        }

        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            if (start >= end) {
                throw new Error('Start date must be before end date');
            }
        }

        const updatedSprint = await SprintModel.update(sprintId, {
            name: data.name,
            goal: data.goal,
            status: data.status,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined
        });

        if (!updatedSprint) {
            throw new Error('Failed to update sprint');
        }

        return updatedSprint;
    }

    static async startSprint(sprintId: number, userId: number): Promise<Sprint> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (sprint.sprint_status !== 'planned') {
            throw new Error('Only planned sprints can be started');
        }

        // Check có sprint active khác không
        const activeSprint = await SprintModel.hasActiveSprint(sprint.project_id);
        if (activeSprint) {
            throw new Error('Cannot start sprint. Another sprint is already active.');
        }

        // Start sprint
        const startedSprint = await SprintModel.startSprint(sprintId, new Date());
        if (!startedSprint) {
            throw new Error('Failed to start sprint');
        }

        const [starter, members, project] = await Promise.all([
            UserModel.findById(userId),
            ProjectModel.getMembers(sprint.project_id),
            ProjectModel.findById(sprint.project_id),
        ]);

        NotificationService.notifySprintStarted({
            starterId: userId,
            starterName: starter?.user_name ?? 'Someone',
            sprintName: startedSprint.sprint_name,
            sprintId: startedSprint.sprint_id,
            projectId: sprint.project_id,
            projectName: project?.project_name ?? 'project',
            memberIds: members.map((m: any) => m.user_id),
        }).catch(console.error);

        return startedSprint;
    }

    static async completeSprint(sprintId: number, userId: number, moveToSprintId?: number): Promise<{ sprint: Sprint; movedIssues: number }> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (sprint.sprint_status !== 'active') {
            throw new Error('Only active sprints can be completed');
        }

        // Nếu có moveToSprintId, check sprint đó tồn tại và cùng project
        if (moveToSprintId) {
            const targetSprint = await SprintModel.findById(moveToSprintId);
            if (!targetSprint) {
                throw new Error('Target sprint not found');
            }
            if (targetSprint.project_id !== sprint.project_id) {
                throw new Error('Target sprint must be in the same project');
            }
            if (targetSprint.sprint_status === 'completed') {
                throw new Error('Cannot move issues to completed sprint');
            }
        }

        // Move incomplete issues
        const movedCount = await SprintModel.moveIncompleteIssues(
            sprintId,
            moveToSprintId || null
        );

        // Complete sprint
        const completedSprint = await SprintModel.completeSprint(sprintId);
        if (!completedSprint) {
            throw new Error('Failed to complete sprint');
        }

        const [completer, membersForNotif, projectForNotif] = await Promise.all([
            UserModel.findById(userId),
            ProjectModel.getMembers(sprint.project_id),
            ProjectModel.findById(sprint.project_id),
        ]);

        NotificationService.notifySprintCompleted({
            completerId: userId,
            completerName: completer?.user_name ?? 'Someone',
            sprintName: completedSprint.sprint_name,
            sprintId: completedSprint.sprint_id,
            projectId: sprint.project_id,
            projectName: projectForNotif?.project_name ?? 'project',
            memberIds: membersForNotif.map((m: any) => m.user_id),
        }).catch(console.error);

        return {
            sprint: completedSprint,
            movedIssues: movedCount
        };
    }

    static async deleteSprint(sprintId: number, userId: number): Promise<void> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (userRole !== 'admin') {
            throw new Error('Only project admin can delete sprint');
        }

        if (sprint.sprint_status === 'active') {
            throw new Error('Cannot delete active sprint. Please complete it first.');
        }

        const deleted = await SprintModel.delete(sprintId);
        if (!deleted) {
            throw new Error('Failed to delete sprint');
        }
    }

    static async getSprintIssues(sprintId: number, userId: number): Promise<any[]> {
        const sprint = await SprintModel.findById(sprintId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        const userRole = await ProjectModel.getMemberRole(sprint.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        return await SprintModel.getSprintIssues(sprintId);
    }


}