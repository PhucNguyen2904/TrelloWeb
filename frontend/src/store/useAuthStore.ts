import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '@/lib/TokenManager';

export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        tokenManager.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        tokenManager.clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'trello-auth-storage',
      // Only persist user info, not tokens
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

