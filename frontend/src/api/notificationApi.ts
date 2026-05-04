import api from "axios";


export const notificationApi={
     getNotifications: async() =>{
          const response = await api.get(`/notifications`);
          return response.data;
        
     },

     deleteNotifications: async(id:number)=>{
          const response= await api.delete(`/notifications/${id}`);
          return response.data;
     },

     markAsRead: async(id:number)=>{
          const response= await api.patch(`/notifications/${id}/read`);
          return response.data;

     },
     markAllAsRead: async()=>{
          const response= await  api.patch('notifications/read-all');
          return response.data;
     }
}