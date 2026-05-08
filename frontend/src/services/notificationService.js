import axios from 'axios';

const api = axios.create({
  baseURL: '/api/notifications',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const notificationService = {
  // GET /api/notifications
  getNotifications: async () => {
    try {
      const res = await api.get('/');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  // GET /api/notifications/unread-count
  getUnreadCount: async () => {
    try {
      const res = await api.get('/unread-count');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch unread count' };
    }
  },

  // PATCH /api/notifications/:id/read
  markAsRead: async (id) => {
    try {
      const res = await api.patch(`/${id}/read`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to mark as read' };
    }
  },

  // PATCH /api/notifications/mark-all-read
  markAllAsRead: async () => {
    try {
      const res = await api.patch('/mark-all-read');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to mark all as read' };
    }
  },

  // DELETE /api/notifications/:id
  delete: async (id) => {
    try {
      const res = await api.delete(`/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete notification' };
    }
  }
};

export default notificationService;
