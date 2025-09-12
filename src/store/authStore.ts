import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import { mockUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      permissions: ['dashboard:read', 'cards:read', 'cards:write', 'sharing:read', 'reconciliation:read', 'partners:read', 'reports:read', 'settings:read'],
      isAuthenticated: true,

      login: (authData: AuthResponse) => {
        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          permissions: authData.permissions,
          isAuthenticated: true,
        });
      },

      register: async (userData: any) => {
        // Mock registration - in real app this would be an API call
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          permissions: [],
          isAuthenticated: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      hasPermission: (permission: string) => {
        const { permissions } = get();
        return permissions.includes(permission) || permissions.includes('admin:all');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);