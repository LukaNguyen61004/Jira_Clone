import axios from 'axios';

const api= axios.create({
    baseURL:'http://localhost:5000/api',
    withCredentials:true,
}) // tao URL base => tranh viet lai nhieu lan 

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            window.location.href='/login';
        }

    return Promise.reject(error);
    }
) //Xu ly response neu loi => se dua tro lai ttrang login

export default api;