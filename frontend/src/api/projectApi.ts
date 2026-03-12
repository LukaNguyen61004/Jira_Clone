import api from './axios';

export const projectApi={
    getProjects: async ()=>{
        const response = await api.get('/projects');
        return response.data;
    },

    getProjectById: async(id: number)=>{
        const response =await api.get(`/projects/${id}`);
        return response.data;
    },
    
    createProject: async (data: {name: string, key: string, description?:string})=>{
        const response=await api.post('/projects',data);
        return response.data;
    },

    updateProject: async(id: number, data:{name?: string, description?: string})=>{
        const response =await api.put(`/projects/${id}`, data);
        return response.data;
    },

    deleteProject: async (id: number)=>{
        const response= await api.delete(`/projects/${id}`);
        return response.data;
    }
}