import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";


interface Props {
    children: React.ReactNode;
    isLoading: boolean;
}

export default function ProtectedRoute({ children , isLoading}: Props) {
    const { isAuthenticated } = useAuthStore();
   

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}