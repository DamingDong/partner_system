import { UserRole } from './index';

export const PERMISSIONS = {
  ADMIN_ALL: 'admin:all',
  CARDS_IMPORT: 'cards:import', // 仅管理员可导入会员卡
  CARDS_MANAGE: 'cards:manage', // 管理会员卡
  ORDERS_VIEW: 'orders:view', // 查看订单
  ORDERS_MANAGE: 'orders:manage', // 管理订单
  PARTNERS_VIEW: 'partners:view', // 查看合作伙伴
  PARTNERS_MANAGE: 'partners:manage', // 管理合作伙伴
  SETTLEMENTS_VIEW: 'settlements:view', // 查看分账记录
  SETTLEMENTS_MANAGE: 'settlements:manage', // 管理分账记录
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    PERMISSIONS.ADMIN_ALL,
    PERMISSIONS.CARDS_IMPORT,
    PERMISSIONS.CARDS_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.PARTNERS_VIEW,
    PERMISSIONS.PARTNERS_MANAGE,
    PERMISSIONS.SETTLEMENTS_VIEW,
    PERMISSIONS.SETTLEMENTS_MANAGE,
  ],
  [UserRole.PARTNER]: [
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.PARTNERS_VIEW,
    PERMISSIONS.SETTLEMENTS_VIEW,
  ],
} as const;
