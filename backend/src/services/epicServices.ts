import { EpicModel } from '../models/epicModel';
import { ProjectModel } from '../models/projectModel';
import { CreateEpicRequest, UpdateEpicRequest, EpicWithDetails, Epic } from '../types';

export class EpicServices {

    static async createEpic(projectId: number, userId: number, data: CreateEpicRequest): Promise<EpicWithDetails> {

        const { name, description, color = '#8B5CF6' } = data;

        const userRole = await ProjectModel.getMemberRole(projectId, userId);

        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const colorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!colorRegex.test(color)) {
            throw new Error('Color must be in hex format (e.g., #8B5CF6)');
        }

        const epic = await EpicModel.create(projectId, name, description || null, color, userId);

        const epicWithDetails = await EpicModel.findByIdWithDetails(epic.epic_id);
        if (!epicWithDetails) {
            throw new Error('Failed to create epic');
        }
        return epicWithDetails;
    }

    // lay tat ca cac epic trong project
    static async getProjectEpics(projectId: number, userId: number): Promise<EpicWithDetails[]> {
        const userRole = await ProjectModel.getMemberRole(projectId, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        return await EpicModel.findByProjectId(projectId);
    }

    static async getEpicById(epicId: number, userId: number): Promise<EpicWithDetails> {
        const epic = await EpicModel.findById(epicId);
        if (!epic) {
            throw new Error('Epic not found');
        }
        const userRole = await ProjectModel.getMemberRole(epic.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }
        const epicWithDetails = await EpicModel.findByIdWithDetails(epicId);
        if (!epicWithDetails) {
            throw new Error('Epic not found');
        }
        return epicWithDetails;
    }

    static async updateEpic(epicId: number, userId: number, data: UpdateEpicRequest): Promise<Epic> {
        const epic = await EpicModel.findById(epicId);
        if (!epic) {
            throw new Error('Epic not found');
        }

        const userRole = await ProjectModel.getMemberRole(epic.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (data.color) {
            const colorRegex = /^#[0-9A-Fa-f]{6}$/;
            if (!colorRegex.test(data.color)) {
                throw new Error('Color must be in hex format (e.g., #8B5CF6)');
            }
        }

        const updatedEpic = await EpicModel.update(epicId, {
            name: data.name,
            description: data.description,
            color: data.color
        });

        if (!updatedEpic) {
            throw new Error('Failed to update epic');
        }

        return updatedEpic;
    }

    static async deleteEpic(epicId: number, userId: number): Promise<void> {
        const epic = await EpicModel.findById(epicId);
        if (!epic) {
            throw new Error('Epic not found');
        }

        const userRole = await ProjectModel.getMemberRole(epic.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        if (epic.created_by !== userId && userRole !== 'admin') {
            throw new Error('Only epic creator or project admin can delete epic');
        }

        const deleted = await EpicModel.delete(epicId);
        if (!deleted) {
            throw new Error('Failed to delete epic');
        }
    }
    
    static async getEpicIssues(epicId: number, userId: number): Promise<any[]> {
        const epic = await EpicModel.findById(epicId);
        if (!epic) {
            throw new Error('Epic not found');
        }

        // Check user có phải member không
        const userRole = await ProjectModel.getMemberRole(epic.project_id, userId);
        if (!userRole) {
            throw new Error('You are not a member of this project');
        }

        return await EpicModel.getEpicIssues(epicId);
    }
}