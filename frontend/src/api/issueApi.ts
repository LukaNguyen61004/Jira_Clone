import api from "./axios";

export const issueApi = {
    createIssues: async (projectId: number, data: { name: string, description?: string, type: 'task' | 'bug' | 'story', priority?: 'low' | 'medium' | 'high', assignedId?: number, epicId?: number, sprintId?: number }) => {
        const response = await api.post(`/projects/${projectId}/issues`, data);
        return response.data;
    },

    getProjectIssues: async (projectId: number) => {
        const response = await api.get(`/projects/${projectId}/issues`);
        return response.data;
    },

    updateIssues: async (issueId: number, data: { status?: string; assigneeId?: number | null }) => {
        const response = await api.put(`/issues/${issueId}`, data);
        return response.data;
    },

    getIssueById: async (issueId: number) => {
        const response = await api.get(`/issues/${issueId}`);
        return response.data;
    },

    getIssueComments: async (issueId: number) => {
        const response = await api.get(`/issues/${issueId}/comments`);
        return response.data;
    },

    addComment: async (issueId: number, content: string) => {
        const response = await api.post(`/issues/${issueId}/comments`, { content });
        return response.data;
    },
}