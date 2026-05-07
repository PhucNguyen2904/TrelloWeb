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
  token: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: tokenManager.getAccessToken(),
      login: (user, accessToken, refreshToken) => {
        tokenManager.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, token: accessToken });
      },
      logout: () => {
        tokenManager.clearTokens();
        set({ user: null, isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'trello-auth-storage',
      // Only persist user info and auth status, not the token itself 
      // (TokenManager handles token persistence separately)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

