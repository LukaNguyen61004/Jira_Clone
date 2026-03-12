import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";


export function  useInitAuth(){
    const {setUser} =useAuthStore();
    const [isLoading, setIsLoading]= useState(true); 

    useEffect(()=>{
        authApi.getMe()
          .then((data)=>{
            setUser(data.user);
          })
        .catch(()=>{
            //cookie het han hoac ko co -> ko lam gi het
        })
        .finally(()=>{
          setIsLoading(false);
        });
    },[]);
    return {isLoading};
}