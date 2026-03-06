import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNotifications } from '@/contexts/NotificationContext.jsx';
import { Bell, CheckCircle2, AlertTriangle, CreditCard, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { refreshUnread } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set()); // notificationIds this parent has read
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      // 1. Fetch all notifications for this parent (personal + broadcast)
      const res = await pb.collection('notifications').getList(1, 100, {
        filter: `parentId="${currentUser.id}" || parentId=""`,
        sort: '-created',
        $autoCancel: false,
      });

      // 2. Fetch which ones THIS parent has already read
      const readsRes = await pb.collection('notification_reads').getList(1, 200, {
        filter: `parentId="${currentUser.id}"`,
        $autoCancel: false,
      });

      const myReadSet = new Set(readsRes.items.map(r => r.notificationId));
      setReadIds(myReadSet);
      setNotifications(res.items);
    } catch (error) {
      console.error('fetchNotifications error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const isRead = (notifId) => readIds.has(notifId);

  const markAsRead = async (notifId) => {
    if (isRead(notifId)) return;
    try {
      // Create a read record for this parent+notification
      await pb.collection('notification_reads').create({
        parentId: currentUser.id,
        notificationId: notifId,
      }, { $autoCancel: false });
      setReadIds(prev => new Set([...prev, notifId]));
      refreshUnread(); // instantly update header badge
    } catch (error) {
      // Ignore duplicate error (already read)
      if (!error.message?.includes('unique')) {
        console.error('markAsRead error:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !isRead(n.id));
    await Promise.allSettled(unread.map(n => markAsRead(n.id)));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'FeeReminder':        return <CreditCard  className="w-6 h-6 text-yellow-500" />;
      case 'PaymentConfirmation':return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'PickupDelay':        return <Clock        className="w-6 h-6 text-orange-500" />;
      case 'Emergency':          return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default:                   return <Bell         className="w-6 h-6 text-blue-500" />;
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
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full ml-2">
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
                            {!read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
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