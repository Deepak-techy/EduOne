import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Bell, Trash2, CheckCheck, Loader2, Megaphone, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [acting, setActing] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await notificationService.getNotifications();
      const list = res.data ?? res ?? [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    setActing(id);
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id || n.id) === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); } finally { setActing(null); }
  };

  const handleMarkAllRead = async () => {
    setActing('all');
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); } finally { setActing(null); }
  };

  const handleDelete = async (id) => {
    setActing(id);
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
    } catch (err) { console.error(err); } finally { setActing(null); }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1b1e]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notifications.length} total</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} disabled={acting === 'all'}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-2 rounded-xl transition-colors disabled:opacity-50">
              {acting === 'all' ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'read', label: 'Read' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button onClick={fetchNotifications}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Bell className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {filter === 'unread' ? "You're all caught up!" : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const nid = n._id || n.id;
              return (
                <div key={nid}
                  className={`group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                    n.isRead
                      ? 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'
                      : 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-200/50 dark:border-blue-500/20'
                  }`}>
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    n.isRead
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400'
                  }`}>
                    {n.type === 'System' ? <Megaphone size={18} /> : <Bell size={18} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-semibold leading-tight ${
                        n.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                      }`}>{n.title}</h4>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.isRead && (
                        <button onClick={() => handleMarkAsRead(nid)} disabled={acting === nid}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50">
                          Mark as read
                        </button>
                      )}
                      <button onClick={() => handleDelete(nid)} disabled={acting === nid}
                        className="text-[11px] font-semibold text-red-500 hover:underline disabled:opacity-50 flex items-center gap-0.5">
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
