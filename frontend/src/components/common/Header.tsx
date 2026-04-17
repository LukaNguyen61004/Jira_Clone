import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/authApi";
import { useNavigate, Link } from "react-router-dom";


export default function Header() {
    const { user, logout } = useAuthStore();
   
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authApi.logout();
        logout();
        navigate('/logout');

    };
     if (!user) return null;


    return (
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
            <Link to="/projects" className="font-bold text-blue-600 text-lg">
                Jira Clone
            </Link>

            <div className="flex items-center gap-3">
              
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {user?.user_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.user_name}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}