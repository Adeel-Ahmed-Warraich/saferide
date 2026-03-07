import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const isNotifExpired = (n) => {
  if (!n.expiresAt) return false;
  return new Date(n.expiresAt) < new Date();
};

export const NotificationProvider = ({ children }) => {
  const { isParent, currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!isParent || !currentUser?.id) { setUnreadCount(0); return; }
    try {
      // FIX: parentId="" caused PocketBase to issue a redirect which fails CORS preflight.
      // Split into two separate queries and merge client-side instead.
      const [broadcastRes, directRes, readsRes] = await Promise.all([
        pb.collection('notifications').getList(1, 200, {
          filter: `type = "Broadcast"`,
          fields: 'id,expiresAt',
          $autoCancel: false,
        }).catch(() => ({ items: [] })),
        pb.collection('notifications').getList(1, 200, {
          filter: `parentId = "${currentUser.id}"`,
          fields: 'id,expiresAt',
          $autoCancel: false,
        }).catch(() => ({ items: [] })),
        pb.collection('notification_reads').getList(1, 500, {
          filter: `parentId = "${currentUser.id}"`,
          fields: 'notificationId',
          $autoCancel: false,
        }).catch(() => ({ items: [] })),
      ]);

      const seen = new Set();
      const all = [...broadcastRes.items, ...directRes.items].filter(n => {
        if (seen.has(n.id)) return false;
        seen.add(n.id);
        return true;
      });

      const readSet = new Set(readsRes.items.map(r => r.notificationId));
      setUnreadCount(all.filter(n => !readSet.has(n.id) && !isNotifExpired(n)).length);
    } catch (err) {
      console.error('[SR] NotificationContext:', err);
    }
  }, [isParent, currentUser?.id]);

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