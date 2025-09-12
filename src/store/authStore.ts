import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import { mockAdminUser, mockPartnerUser, adminPermissions, partnerPermissions } from '@/lib/mock-data';

// 开发环境默认状态配置
const isDevelopment = import.meta.env.DEV;

// 根据环境变量或其他条件决定默认用户
const getDefaultUser = () => {
  // 开发环境可以有默认用户，生产环境应该是null
  return isDevelopment ? mockPartnerUser : null; 
};

const getDefaultPermissions = (user: User | null) => {
  if (!user) return [];
  return user.role === 'ADMIN' ? adminPermissions : partnerPermissions;
};

const getDefaultIsAuthenticated = () => {
  // 开发环境可以默认认证，生产环境应该是false
  return isDevelopment;
};

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
      user: getDefaultUser(),
      accessToken: isDevelopment ? 'mock-access-token' : null,
      refreshToken: isDevelopment ? 'mock-refresh-token' : null,
      permissions: getDefaultPermissions(getDefaultUser()),
      isAuthenticated: getDefaultIsAuthenticated(),

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