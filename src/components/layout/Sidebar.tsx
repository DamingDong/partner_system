import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  CreditCard,
  PieChart,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Monitor,
} from 'lucide-react';

import {
  Sidebar as SidebarShadcn,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: string;
  subItems?: Array<{
    name: string;
    href: string;
  }>;
}

const navigation: NavigationItem[] = [
  {
    name: '仪表板',
    href: '/',
    icon: Home,
    permission: 'dashboard:read',
  },
  {
    name: '会员卡管理',
    href: '/cards',
    icon: CreditCard,
    permission: 'cards:read',
  },
  {
    name: '设备管理',
    href: '/devices',
    icon: Monitor,
    permission: 'devices:read',
  },
  {
    name: '订单管理',
    href: '/orders',
    icon: FileText,
    permission: 'orders:read',
  },
  {
    name: '分账管理',
    href: '/revenue-sharing',
    icon: PieChart,
    permission: 'sharing:read',
  },
  {
    name: '对账管理',
    href: '/reconciliation',
    icon: FileText,
    permission: 'reconciliation:read',
  },
  {
    name: '合作伙伴',
    href: '/partners',
    icon: Users,
    permission: 'partners:read',
  },
  {
    name: '数据报表',
    href: '/reports',
    icon: BarChart3,
    permission: 'reports:read',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const filteredNavigation = navigation.filter(item => hasPermission(item.permission));

  return (
    <SidebarShadcn className={className}>
      <SidebarHeader>
        <div className="flex h-16 items-center px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MGX</span>
            </div>
            <span className="font-semibold text-lg">合作伙伴系统</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>导航菜单</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive = location.pathname === item.href || 
                  (hasSubItems && item.subItems.some(subItem => location.pathname === subItem.href));
                
                if (hasSubItems) {
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 h-5 w-5',
                            isActive ? 'text-blue-700' : 'text-gray-400'
                          )}
                        />
                        {item.name}
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.href;
                          return (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                                className={cn(
                                  'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                                  isSubActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                              >
                                <Link to={subItem.href}>
                                  {subItem.name}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  );
                } else {
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <Link to={item.href}>
                          <item.icon
                            className={cn(
                              'mr-3 h-5 w-5',
                              isActive ? 'text-blue-700' : 'text-gray-400'
                            )}
                          />
                          {item.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Link to="/settings">
                    <Settings className="mr-3 h-5 w-5 text-gray-400" />
                    设置
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {user && (
                <>
                  <SidebarMenuItem>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      退出登录
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </SidebarShadcn>
  );
}