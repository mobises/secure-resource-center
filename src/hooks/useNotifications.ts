
import { useState, useEffect } from 'react';
import { AdminNotification } from '@/types';

const NOTIFICATIONS_KEY = 'admin_notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  const saveNotifications = (notifs: AdminNotification[]) => {
    setNotifications(notifs);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  };

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    saveNotifications([...notifications, newNotification]);
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifications(updatedNotifications);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };
};
