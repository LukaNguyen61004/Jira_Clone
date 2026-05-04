import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";
import { CreatedProjectRequest, UpdateProjectRequest, Project, ProjectMemberWithUser, ProjectWithDetails } from "../types";
import  {setCache, getCache, deleteCache, deleteCachePattern} from '../utils/cache'

export class ProjectService {
    static async createProject(userId: number, data: CreatedProjectRequest): Promise<ProjectWithDetails> {
        const { name, key, description } = data;

        const existingProject = await ProjectModel.findByKey(key);
        if (existingProject) {
            throw new Error('Project already exist');
        }

        const keyRegex = /^[A-Z0-9]{2,10}$/;
        if (!keyRegex.test(key)) {
            throw new Error('Project key must be 2-10 uppercase letters/numbers (e.g. PROJ, BLOG)');
        }

        const project = await ProjectModel.create(name, key, description || null, userId);

        await ProjectModel.addMember(project.project_id, userId, 'admin');

        const user = await UserModel.findById(userId);

        return {
            ...project,
            creator_name: user!.user_name,
            creator_email: user!.user_email,
            your_role: 'admin'
        }
    }

    static async getUserProjects(userId: number): Promise<ProjectWithDetails[]> {
       
        const projects= await ProjectModel.findByUserId(userId);

        return projects;
    }

    static async getProjectById(projectId: number, userId: number): Promise<ProjectWithDetails> {
        const role = await ProjectModel.getMemberRole(projectId, userId);
        if (!role) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const creator = await UserModel.findById(project.created_by);

        return {
            ...project,
            creator_name: creator!.user_name,
            creator_email: creator!.user_email,
            your_role: role
        };

    }

    static async updateProject(projectId: number, userId: number, data: UpdateProjectRequest): Promise<Project> {
        const role = await ProjectModel.getMemberRole(projectId, userId);
        if (role !== 'admin') {
            throw new Error('Only project admins can update project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const updatedProject = await ProjectModel.update(
            projectId,
            data.name,
            data.description
        );

        if (!updatedProject) {
            throw new Error('Failed to update project');
        }

        return updatedProject;
    }

    static async deleteProject(projectId: number, userId: number): Promise<void> {
        const role = await ProjectModel.getMemberRole(projectId, userId);
        if (role !== 'admin') {
            throw new Error('Only project admins can delete project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const deleted = await ProjectModel.delete(projectId);
        if (!deleted) {
            throw new Error('Failed to delete project');
        }
    }

    static async addMember(projectId: number, userId: number, targetUserId: number, role: 'admin' | 'member'): Promise<ProjectMemberWithUser> {
        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (userRole !== 'admin') {
            throw new Error('Only project admins can add members');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const targetUser = await UserModel.findById(targetUserId);
        if (!targetUser) {
            throw new Error('User not found');
        }

        const existingRole = await ProjectModel.getMemberRole(projectId, targetUserId);
        if (existingRole) {
            throw new Error('User is already a member of this project');
        }

        await ProjectModel.addMember(projectId, targetUserId, role);
        return {
            user_id: targetUser.user_id,
            user_name: targetUser.user_name,
            user_email: targetUser.user_email,
            user_avatar_url: targetUser.user_avatar_url,
            role: role,
            joined_at: new Date()
        };
    }

    static async removeMember(projectId: number, userId: number, targetUserId: number): Promise<void> {
        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (userRole !== 'admin') {
            throw new Error('Only project admins can remove members');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        if (project.created_by === targetUserId) {
            throw new Error('Cannot remove project creator');
        }

        const removed = await ProjectModel.removeMember(projectId, targetUserId);
        if (!removed) {
            throw new Error('Failed to remove member');
        }
    }

    static async getProjectMembers(projectId: number, userId: number): Promise<ProjectMemberWithUser[]> {
        const role = await ProjectModel.getMemberRole(projectId, userId);
        if (!role) {
            throw new Error('You are not a member of this project');
        }
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        return await ProjectModel.getMembers(projectId);
    }
}

