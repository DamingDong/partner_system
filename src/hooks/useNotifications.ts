import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = async () => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: '新合作伙伴注册',
          message: '张三已成为您的新合作伙伴',
          type: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false,
          actionUrl: '/partners'
        },
        {
          id: '2',
          title: '会员卡到期提醒',
          message: 'VIP会员卡将在3天后到期',
          type: 'warning',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
          actionUrl: '/cards'
        },
        {
          id: '3',
          title: '分润到账',
          message: '本月分润 ¥1,250 已到账',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true,
          actionUrl: '/revenue-sharing'
        },
        {
          id: '4',
          title: '系统维护通知',
          message: '系统将于今晚23:00-24:00进行维护',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          read: true
        }
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    getNotificationIcon,
    formatTimestamp,
    refresh: loadNotifications
  };
};