import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { notificationApi } from "@/api/notificationApi";
import { useParams } from "react-router-dom";

export default function Notification() {
    const { id } = useParams();
    const userId = Number(id);
    const dropdownRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const { data: notiData } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: () => notificationApi.getNotifications(),
        refetchInterval: 30000,
    });

    const notifications = notiData?.notifications ?? [];
    const unreadCount = notiData?.notifications ?? 0;
    

    useEffect(()=>{
        const handleClickOutSide=(e:MouseEvent) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutSide);
        return ()=> document.removeEventListener('mousedown', handleClickOutSide);
    },[]);

        const markAsReadMutation= useMutation({
            mutationFn: (notificationId: number) => notificationApi.markAsRead(notificationId),
            onSuccess: ()=>{
                queryClient.invalidateQueries({queryKey: ['notifications']});
            }
        });

        const markAllAsReadMutation = useMutation({
            mutationFn:()=> notificationApi.markAllAsRead(),
            onSuccess: ()=>{
                queryClient.invalidateQueries({queryKey: ['notifications']});

            }
        });
        
        return (
            <div className= "relative" ref={dropdownRef}>
                <button onClick={()=> setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-gray-100">
                    <span className="text-xl">🔔</span>
                    {
                        unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center  font-bold">
                                {unreadCount > 9 ? '9 +' : unreadCount}
                            </span>
                        )
                    }
                </button>

                {open && (
                    <div className="absolute right-0 top-10 w-80 bg-white border rounded-lg shadow-lg z-50">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h3 className="font-semibold text-sm">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <button onClick={()=>markAllAsReadMutation.mutate()}
                                className="text-xs text-blue-600 hover:underline">
                                    Mark all as read
                                </button>
                            )}

                        </div>

                        <div className="max-h-96 overflow-y-auto divide-y">
                            {notifications.length===0 ? (
                                 <p className="text-sm text-gray-400 text-center py-8">
                                No notifications
                            </p>
                            ): (
                                notifications.map((n:any)=>(
                                    <div key={n.notifi_id} onClick={()=>{if(!n.is_read) markAsReadMutation.mutate(n.notifi_id);   
                                    }}
                                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50' : ''}`}>
                                    <p className="text-sm font-medium">{n.notifi_title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{n.notifi_content}</p>
                                     <p className="text-xs text-gray-400 mt-1">
                                        {new Date(n.notifi_created_at).toLocaleString()}
                                    </p>
                                        
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
}