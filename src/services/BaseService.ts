import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '../store/authStore'

export abstract class BaseService {
  protected static apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
  })

  protected static transformResponse<T>(response: any): T {
    if (response.data?.success === false) {
      throw new Error(response.data.message || '请求失败')
    }
    return response.data?.data || response.data
  }

  protected static handleError(error: any): never {
    console.error('API Error:', error)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    throw error instanceof Error ? error : new Error('请求失败')
  }

  protected static checkPermission(permission: string): void {
    const { hasPermission } = useAuthStore.getState()
    if (!hasPermission(permission)) {
      throw new Error(`缺少权限: ${permission}`)
    }
  }
}