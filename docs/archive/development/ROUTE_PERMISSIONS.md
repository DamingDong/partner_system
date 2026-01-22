# 路由权限控制文档

## 概述

本文档描述了系统中路由级别的权限控制实现，确保用户只能访问其具有相应权限的页面。

## 实现细节

### 1. ProtectedRoute 组件

创建了 [ProtectedRoute.tsx](file:///d:/Users/terry/qoderData/partner_system/src/components/ProtectedRoute.tsx) 组件，用于包装需要权限检查的路由。

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}
```

该组件会检查用户是否已认证以及是否具有访问特定路由所需的权限。

### 2. 权限配置

权限配置在 [src/types/permissions.ts](file:///d:/Users/terry/qoderData/partner_system/src/types/permissions.ts) 文件中定义：

```typescript
export const PERMISSIONS = {
  ADMIN_ALL: 'admin:all',
  CARDS_IMPORT: 'cards:import', // 仅管理员可导入会员卡
  // ... 其他权限
};
```

### 3. 路由保护

在 [App.tsx](file:///d:/Users/terry/qoderData/partner_system/src/App.tsx) 中，我们为需要特殊权限的路由添加了保护：

```typescript
<Route path="cards" element={
  <ProtectedRoute requiredPermission={PERMISSIONS.CARDS_IMPORT}>
    <Cards />
  </ProtectedRoute>
} />
```

### 4. 权限检查逻辑

权限检查使用 authStore 中的 `hasPermission` 方法：

```typescript
const { isAuthenticated, hasPermission } = useAuthStore();

// 检查用户是否具有特定权限
if (requiredPermission && !hasPermission(requiredPermission)) {
  // 重定向到首页或其他适当页面
}
```

## 受保护的路由

以下路由已添加权限保护：

1. `/cards` - 需要 `cards:import` 权限，仅管理员可访问

## 未来改进

1. 为更多路由添加适当的权限保护
2. 实现更细粒度的权限控制（例如基于角色的访问控制）
3. 添加权限拒绝时的用户友好提示页面