import api from "./axios";

export const issueApi={
    getProjectIssues: async (projectId: number )=>{
        const response=await api.get(`/projects/${projectId}/issues`);
        return response.data;
    },

    updateIssues:  async (issueId: number , data:{status?:string; assigneeId?: number | null})=>{
        const response = await api.put(`/issues/${issueId}`,data);
        return response.data;
    },
}