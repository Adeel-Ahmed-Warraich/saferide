
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Bell, CheckCircle2, AlertTriangle, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [currentUser.id]);

  const fetchNotifications = async () => {
    try {
      // Fetch personal and broadcast notifications
      const res = await pb.collection('notifications').getList(1, 50, {
        filter: `parentId="${currentUser.id}" || parentId=""`,
        sort: '-created',
        $autoCancel: false
      });
      setNotifications(res.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { isRead: true }, { $autoCancel: false });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'FeeReminder': return <CreditCard className="w-6 h-6 text-yellow-500" />;
      case 'PaymentConfirmation': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'PickupDelay': return <Clock className="w-6 h-6 text-orange-500" />;
      case 'Emergency': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <Bell className="w-6 h-6 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full ml-2">{unreadCount} new</span>
              )}
            </h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-blue-800 border-blue-200 hover:bg-blue-50">
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${notif.isRead ? 'border-gray-100 opacity-75' : 'border-blue-200 shadow-md'}`}>
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {new Date(notif.created).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm ${notif.isRead ? 'text-gray-500' : 'text-gray-700'}`}>{notif.message}</p>
                      
                      {!notif.isRead && (
                        <button onClick={() => markAsRead(notif.id)} className="text-xs text-blue-600 font-medium mt-3 hover:underline">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
