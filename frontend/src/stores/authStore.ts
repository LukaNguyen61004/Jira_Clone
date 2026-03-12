import { create } from 'zustand';

interface UserInfo {
    user_id: number;
    user_name: string;
    user_email: string;
    user_avatar_url: string | null;
}

interface AuthState {
    user: UserInfo | null;

    isAuthenticated: boolean;

    setUser: (user: UserInfo) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({
        user: user,
        isAuthenticated: true
    }),
    logout: () => set({
        user: null,
        isAuthenticated: false
    }),
}));