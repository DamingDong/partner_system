import { useAuthStore } from '../store/authStore';

export class PermissionService {
  /**
   * 检查用户是否具有指定权限
   * @param permission 权限标识
   * @returns 是否具有权限
   */
  static checkPermission(permission: string): boolean {
    const { hasPermission } = useAuthStore.getState();
    return hasPermission(permission);
  }

  /**
   * 强制检查权限，如果没有权限则抛出错误
   * @param permission 权限标识
   */
  static enforcePermission(permission: string): void {
    if (!this.checkPermission(permission)) {
      throw new Error('您没有执行此操作的权限');
    }
  }
}