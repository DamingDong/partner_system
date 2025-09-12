import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  permission?: string;
}

export function PrivateRoute({ children, permission }: PrivateRouteProps) {
  const { isAuthenticated, hasPermission } = useAuthStore();
  const location = useLocation();

  // 未登录，跳转到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 需要特定权限但用户没有权限
  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">权限不足</h2>
          <p className="text-gray-600">您没有访问此页面的权限</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}