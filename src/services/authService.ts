import { apiClient } from '@/lib/api';
import { LoginRequest, AuthResponse, User } from '@/types';

export class AuthService {
  // 用户登录
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '登录失败');
  }

  // 用户登出
  static async logout(): Promise<void> {
    const response = await apiClient.post<void>('/auth/logout');
    if (!response.success) {
      throw new Error(response.message || '登出失败');
    }
  }

  // 刷新token
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Token刷新失败');
  }

  // 重置密码
  static async resetPassword(email: string): Promise<void> {
    const response = await apiClient.post<void>('/auth/reset-password', {
      email,
    });
    if (!response.success) {
      throw new Error(response.message || '密码重置失败');
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取用户信息失败');
  }

  // 更新用户信息
  static async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', updates);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '更新用户信息失败');
  }
}