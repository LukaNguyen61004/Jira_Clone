import { useParams } from "react-router-dom";
import { projectApi } from "@/api/projectApi";
import { useQuery} from "@tanstack/react-query";


export default function MemberPage(){
    const {id}= useParams();
    const projectId= Number(id);

    const {data, isLoading, error}= useQuery({
        queryKey: ['members', projectId],
        queryFn: ()=> projectApi.getProjectMembers(projectId)
    });
    const projectMembers= data?.members ??[];

    if(isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Something went wrong</div>;

    return (
    <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Project Members</h1>
        <div className="border rounded-lg overflow-hidden">
            <div className="divide-y">
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                {projectMembers.map((member: any) => (
                    <div key={member.user_id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                                {member.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{member.user_name}</p>
                                <p className="text-xs text-gray-400">{member.user_email}</p>
                            </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            member.role === 'admin' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {member.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
}