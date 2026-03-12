import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useInitAuth } from "../../hooks/useInitAuth";

interface Props {
    children: React.ReactNode;
}

export default function ProjectedRoute({ children }: Props) {
    const { isAuthenticated } = useAuthStore();
    const { isLoading } = useInitAuth();

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