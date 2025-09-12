import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ApiResponse } from '@/types';
import { mockApiClient } from './mock-api';

// Use mock API in development
const USE_MOCK_API = import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加认证token
    this.client.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理token过期
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config as { _retry?: boolean; headers: { Authorization: string } };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { refreshToken } = useAuthStore.getState();
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { accessToken: newAccessToken } = response.data;
              const currentState = useAuthStore.getState();
              if (currentState.user) {
                useAuthStore.getState().login({
                  user: currentState.user,
                  accessToken: newAccessToken,
                  refreshToken: currentState.refreshToken || '',
                  permissions: currentState.permissions || [],
                });
              }

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: unknown,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      try {
        let response: { success: boolean; data: T };
        switch (method) {
          case 'GET':
            response = await mockApiClient.get<T>(url, params);
            break;
          case 'POST':
            response = await mockApiClient.post<T>(url, data);
            break;
          case 'PUT':
            response = await mockApiClient.put<T>(url, data);
            break;
          case 'DELETE':
            response = await mockApiClient.delete<T>(url);
            break;
        }
        return response;
      } catch (error: unknown) {
        throw {
          success: false,
          message: error instanceof Error ? error.message : '请求失败',
          code: 'MOCK_ERROR',
        };
      }
    }

    // Use real API
    try {
      const response = await this.client.request({
        method,
        url,
        data,
        params,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
      throw {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || '请求失败',
        code: axiosError.response?.status?.toString() || 'NETWORK_ERROR',
      };
    }
  }

  // GET请求
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, params);
  }

  // POST请求
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  // PUT请求
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  // DELETE请求
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  // 文件下载
  async downloadFile(url: string, filename: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiClient.downloadFile(url, filename);
    }

    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw new Error('文件下载失败');
    }
  }
}

export const apiClient = new ApiClient();