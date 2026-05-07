// src/services/adminService.js
// Real API service connecting to backend admin endpoints
import axios from 'axios';

const API_URL = '/api/admin';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ─── Auth ──────────────────────────────────────────────────────────────────────
const auth = {
  login: async (credentials) => {
    try {
      const res = await api.post('/login', credentials);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Admin login failed' };
    }
  },
  getProfile: async () => {
    try {
      const res = await api.get('/profile');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch admin profile' };
    }
  },
  changePassword: async (data) => {
    try {
      const res = await api.put('/change-password', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to change password' };
    }
  },
  getDashboardOverview: async () => {
    try {
      const res = await api.get('/dashboard-overview');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },
};

// ─── User Management ───────────────────────────────────────────────────────────
const users = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/users', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch users' };
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch user' };
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/users/create', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to create user' };
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/users/${id}/update`, data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to update user' };
    }
  },
  suspend: async (id) => {
    try {
      const res = await api.patch(`/users/${id}/suspend`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to suspend user' };
    }
  },
  activate: async (id) => {
    try {
      const res = await api.patch(`/users/${id}/activate`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to activate user' };
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/users/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete user' };
    }
  },
  changeRole: async (id, role) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to change role' };
    }
  },
  getActivity: async (id) => {
    try {
      const res = await api.get(`/users/${id}/activity`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch activity' };
    }
  },
  getLoginHistory: async (id) => {
    try {
      const res = await api.get(`/users/${id}/login-history`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch login history' };
    }
  },
  export: async () => {
    try {
      const res = await api.get('/users/export');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to export users' };
    }
  },
  getOnline: async () => {
    try {
      const res = await api.get('/users/online');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch online users' };
    }
  },
  bulkAction: async (data) => {
    try {
      const res = await api.post('/users/bulk-action', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Bulk action failed' };
    }
  },
};

// ─── Community / Content Moderation ────────────────────────────────────────────
const community = {
  getPosts: async (params = {}) => {
    try {
      const res = await api.get('/posts', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch posts' };
    }
  },
  getFlaggedPosts: async (params = {}) => {
    try {
      const res = await api.get('/posts/flagged', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch flagged posts' };
    }
  },
  getPostById: async (id) => {
    try {
      const res = await api.get(`/posts/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch post' };
    }
  },
  deletePost: async (id) => {
    try {
      const res = await api.delete(`/posts/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete post' };
    }
  },
  getReports: async (params = {}) => {
    try {
      const res = await api.get('/reports', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch reports' };
    }
  },
  getReportById: async (id) => {
    try {
      const res = await api.get(`/reports/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch report' };
    }
  },
  resolveReport: async (id) => {
    try {
      const res = await api.patch(`/reports/${id}/resolve`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to resolve report' };
    }
  },
  rejectReport: async (id) => {
    try {
      const res = await api.patch(`/reports/${id}/reject`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to reject report' };
    }
  },
  deleteComment: async (id) => {
    try {
      const res = await api.delete(`/comments/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete comment' };
    }
  },
  getStats: async () => {
    try {
      const res = await api.get('/community/stats');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch community stats' };
    }
  },
};

// ─── Notes Management ──────────────────────────────────────────────────────────
const notes = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/notes', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch notes' };
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/notes/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch note' };
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/notes/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete note' };
    }
  },
  getUsageStats: async () => {
    try {
      const res = await api.get('/notes/usage-stats');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch notes stats' };
    }
  },
};

// ─── Tasks Management ──────────────────────────────────────────────────────────
const tasks = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/tasks', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch tasks' };
    }
  },
  getStats: async () => {
    try {
      const res = await api.get('/tasks/stats');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch task stats' };
    }
  },
  getAIPerformance: async () => {
    try {
      const res = await api.get('/tasks/ai-performance');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch AI stats' };
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/tasks/delete/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete task' };
    }
  },
};

// ─── Resumes Management ────────────────────────────────────────────────────────
const resumes = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/resumes', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch resumes' };
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/resumes/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch resume' };
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/resumes/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete resume' };
    }
  },
  getStats: async () => {
    try {
      const res = await api.get('/resumes/stats');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch resume stats' };
    }
  },
};

// ─── Analytics ─────────────────────────────────────────────────────────────────
const analytics = {
  getDailyUsers: async (params = {}) => {
    try {
      const res = await api.get('/analytics/daily-users', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch daily users' };
    }
  },
  getMonthlyUsers: async (params = {}) => {
    try {
      const res = await api.get('/analytics/monthly-users', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch monthly users' };
    }
  },
  getFeatureUsage: async () => {
    try {
      const res = await api.get('/analytics/feature-usage');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch feature usage' };
    }
  },
  getUserGrowth: async (params = {}) => {
    try {
      const res = await api.get('/analytics/user-growth', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch user growth' };
    }
  },
  getTopFeatures: async () => {
    try {
      const res = await api.get('/analytics/top-features');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch top features' };
    }
  },
  getTrafficSource: async () => {
    try {
      const res = await api.get('/analytics/traffic-source');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch traffic source' };
    }
  },
  getErrorLogs: async (params = {}) => {
    try {
      const res = await api.get('/analytics/error-logs', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch error logs' };
    }
  },
  getSystemHealth: async () => {
    try {
      const res = await api.get('/analytics/system-health');
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch system health' };
    }
  },
};

// ─── Announcements & Notifications ─────────────────────────────────────────────
const announcements = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/announcements', { params });
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to fetch announcements' };
    }
  },
  create: async (data) => {
    try {
      const res = await api.post('/announcements/create', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to create announcement' };
    }
  },
  update: async (id, data) => {
    try {
      const res = await api.put(`/announcements/${id}/update`, data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to update announcement' };
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/announcements/${id}/delete`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to delete announcement' };
    }
  },
  pin: async (id) => {
    try {
      const res = await api.patch(`/announcement/pin/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to pin announcement' };
    }
  },
};

const notifications = {
  send: async (data) => {
    try {
      const res = await api.post('/notifications/send', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to send notification' };
    }
  },
  broadcastEmail: async (data) => {
    try {
      const res = await api.post('/email/broadcast', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to broadcast email' };
    }
  },
  sendPush: async (data) => {
    try {
      const res = await api.post('/push-notification/send', data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: 'Failed to send push notification' };
    }
  },
};

export const adminService = {
  auth,
  users,
  community,
  notes,
  tasks,
  resumes,
  analytics,
  announcements,
  notifications,
};

export default adminService;
