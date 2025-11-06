// src/pages/profile/Notifications.jsx

import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  
  // ⏳ TODO: Replace with actual API endpoint when backend has notification service
  // GET /api/notifications - fetch user notifications
  // PATCH /api/notifications/:id/read - mark as read
  // DELETE /api/notifications/:id - delete notification
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to EDUONE!',
      message: 'Your account has been successfully created. Start exploring our features.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: 3,
      title: 'New Course Available',
      message: 'Check out the new AI-powered learning course.',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // TODO: Call API - PATCH /api/notifications/:id/read
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    // TODO: Call API - DELETE /api/notifications/:id
  };

  const handleClearAll = () => {
    setNotifications([]);
    // TODO: Call API - DELETE /api/notifications/clear-all
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTypeIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1a1b1e] dark:to-[#23272f] pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#23272f] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications yet</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getTypeStyles(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-400' : ''
                } transition`}
              >
                <div className="flex items-start gap-4">
                  <Bell className={`w-5 h-5 flex-shrink-0 mt-1 ${getTypeIconColor(notification.type)}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {notification.createdAt.toLocaleDateString()} {notification.createdAt.toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
