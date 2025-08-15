
import { useState, useEffect } from 'react';
import { AdminNotification } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const NOTIFICATIONS_KEY = 'admin_notifications';

export const useNotifications = () => {
  const { user } = useAuth();
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

  // Auto-add notifications for new room reservations
  const addRoomReservationNotification = (reservationId: string, roomName: string, userName: string) => {
    // Solo agregar notificación si es generada por otro usuario
    if (user?.name === userName) return;
    
    addNotification({
      type: 'room_reservation',
      title: 'Nueva reserva de sala',
      message: `${userName} ha reservado la sala "${roomName}"`,
      relatedId: reservationId
    });
  };

  // Auto-add notifications for new vehicle reservations
  const addVehicleReservationNotification = (reservationId: string, vehicleName: string, userName: string) => {
    // Solo agregar notificación si es generada por otro usuario
    if (user?.name === userName) return;
    
    addNotification({
      type: 'vehicle_reservation',
      title: 'Nueva reserva de vehículo',
      message: `${userName} ha reservado el vehículo "${vehicleName}"`,
      relatedId: reservationId
    });
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  const markAsReadByRelatedId = (relatedId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.relatedId === relatedId ? { ...n, isRead: true } : n
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
    addRoomReservationNotification,
    addVehicleReservationNotification,
    markAsRead,
    markAsReadByRelatedId,
    markAllAsRead,
    getUnreadCount
  };
};
