import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNotifications, isNotifExpired } from '@/contexts/NotificationContext.jsx';
import { Bell, CheckCircle2, AlertTriangle, CreditCard, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { refreshUnread } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      // FIX: use type="Broadcast" OR direct parentId — not the ambiguous parentId=""
      const [res, readsRes] = await Promise.all([
        pb.collection('notifications').getList(1, 200, {
          filter: `type = "Broadcast" || parentId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false,
        }),
        pb.collection('notification_reads').getList(1, 500, {
          filter: `parentId = "${currentUser.id}"`,
          $autoCancel: false,
        }),
      ]);

      const myReadSet = new Set(readsRes.items.map(r => r.notificationId));
      setReadIds(myReadSet);

      // #8: Filter out expired notifications — new parents won't see old ones
      const active = res.items.filter(n => !isNotifExpired(n));
      setNotifications(active);
    } catch (error) {
      console.error('[SR] fetchNotifications error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const isRead = (notifId) => readIds.has(notifId);

  const markAsRead = async (notifId) => {
    if (isRead(notifId)) return;
    try {
      await pb.collection('notification_reads').create({
        parentId: currentUser.id,
        notificationId: notifId,
      }, { $autoCancel: false });
      setReadIds(prev => new Set([...prev, notifId]));
      refreshUnread();
    } catch (error) {
      if (!error.message?.includes('unique')) {
        console.error('[SR] markAsRead error:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !isRead(n.id));
    await Promise.allSettled(unread.map(n => markAsRead(n.id)));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'FeeReminder':         return <CreditCard   className="w-5 h-5 text-yellow-500" />;
      case 'PaymentConfirmation': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'PickupDelay':         return <Clock        className="w-5 h-5 text-orange-500" />;
      case 'Emergency':           return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:                    return <Bell         className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !isRead(n.id)).length;

  return (
    <>
      <Helmet><title>Notifications - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-yellow-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}
                className="text-blue-800 border-blue-200 hover:bg-blue-50 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto mb-3" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">You'll be notified about fees, payments, and updates here</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const read = isRead(notif.id);
                const daysLeft = notif.expiresAt
                  ? Math.ceil((new Date(notif.expiresAt) - new Date()) / 86400000)
                  : null;
                return (
                  <div key={notif.id}
                    className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${
                      read ? 'border-gray-100 opacity-70' : 'border-blue-200 shadow-md'
                    }`}>
                    <div className="flex gap-4 items-start">
                      <div className={`p-3 rounded-full flex-shrink-0 ${read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-bold ${read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notif.title}
                            </h3>
                            {!read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                            {/* Expiry badge — only show if expiring within 3 days */}
                            {daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                                ⏳ Expires in {daysLeft}d
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                            {new Date(notif.created).toLocaleDateString('en-PK', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${read ? 'text-gray-400' : 'text-gray-700'}`}>
                          {notif.message}
                        </p>
                        {!read && (
                          <button onClick={() => markAsRead(notif.id)}
                            className="text-xs text-blue-600 font-medium mt-3 hover:text-blue-800 hover:underline flex items-center gap-1">
                            <Check className="w-3 h-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default NotificationsPage;