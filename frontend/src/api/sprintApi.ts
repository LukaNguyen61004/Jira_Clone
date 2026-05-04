import api from "./axios";


export const sprintApi ={
    getProjectSprints: async(projectId: number)=>{
        const response = await api.get(`/projects/${projectId}/sprints`);
        return response.data;
    },

    createSprint: async ( projectId: number, data: {name: string; goal?: string, startDate?: string, endDate?: string})=>{
        const response= await api.post(`/projects/${projectId}/sprints`,data);
        return response.data;
    },

    startSprint: async(sprintId: number)=>{
        const response= await api.post(`/sprints/${sprintId}/start`);
        return response.data;
    },

    completeSprint:async(sprintId: number)=>{
        const response =await api.post(`/sprints/${sprintId}/complete`,{});
        return response.data;
    }

}