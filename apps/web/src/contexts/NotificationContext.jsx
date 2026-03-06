import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const { isParent, currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!isParent || !currentUser?.id) { setUnreadCount(0); return; }
    try {
      const [allRes, readsRes] = await Promise.all([
        pb.collection('notifications').getList(1, 200, {
          filter: `parentId="${currentUser.id}" || parentId=""`,
          fields: 'id',
          $autoCancel: false,
        }),
        pb.collection('notification_reads').getList(1, 200, {
          filter: `parentId="${currentUser.id}"`,
          fields: 'notificationId',
          $autoCancel: false,
        }),
      ]);
      const readSet = new Set(readsRes.items.map(r => r.notificationId));
      setUnreadCount(allRes.items.filter(n => !readSet.has(n.id)).length);
    } catch (_) {}
  }, [isParent, currentUser?.id]);

  // Fetch on mount + every 60s
  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 60000);
    return () => clearInterval(interval);
  }, [refreshUnread]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};