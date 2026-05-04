import axios from 'axios';

const api= axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true,
}) // tao URL base => tranh viet lai nhieu lan 

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
    return Promise.reject(error);
    }
) //Xu ly response neu loi => se dua tro lai ttrang login

export default api;