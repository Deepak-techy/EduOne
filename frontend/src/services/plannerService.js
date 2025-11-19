// src/services/plannerService.js
import axios from 'axios';

const API_URL = '/api/tasks';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Helper: Convert Date to YYYY-MM-DD format
const formatDateForAPI = (date) => {
  if (typeof date === 'string') return date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const plannerService = {
  // ✅ GET /api/tasks/all - Get all tasks
  getAllTasks: async () => {
    try {
      console.log('📡 API: getAllTasks');
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      console.error('❌ getAllTasks error:', error);
      throw error.response?.data || { message: 'Failed to fetch tasks' };
    }
  },

  // ✅ GET /api/tasks/dashboard - Get dashboard data
  getDashboard: async () => {
    try {
      console.log('📡 API: getDashboard');
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ getDashboard error:', error);
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  // ✅ GET /api/tasks/range - Get tasks by date range
  getTasksByRange: async (startDate, endDate) => {
    try {
      const start = formatDateForAPI(startDate);
      const end = formatDateForAPI(endDate);
      
      console.log('📡 API: getTasksByRange ->', start, 'to', end);
      
      const response = await api.get('/range', {
        params: { startDate: start, endDate: end }
      });
      return response.data;
    } catch (error) {
      console.error('❌ getTasksByRange error:', error);
      throw error.response?.data || { message: 'Failed to fetch tasks by range' };
    }
  },

  // ✅ GET /api/tasks/due-date - Get tasks by specific date
  getTasksByDate: async (dueDate) => {
    try {
      const dateStr = formatDateForAPI(dueDate);
      
      console.log('📡 API: getTasksByDate ->', dateStr);
      
      const response = await api.get('/due-date', {
        params: { dueDate: dateStr }
      });
      return response.data;
    } catch (error) {
      console.error('❌ getTasksByDate error:', error);
      throw error.response?.data || { message: 'Failed to fetch tasks by date' };
    }
  },

  // ✅ GET /api/tasks/ai-prioritized - Get AI prioritized tasks
  getAIPrioritized: async () => {
    try {
      console.log('📡 API: getAIPrioritized');
      const response = await api.get('/ai-prioritized');
      return response.data;
    } catch (error) {
      console.error('❌ getAIPrioritized error:', error);
      throw error.response?.data || { message: 'Failed to fetch AI prioritized tasks' };
    }
  },

  // ✅ POST /api/tasks/create - Create new task
  createTask: async (taskData) => {
    try {
      console.log('📡 API: createTask ->', taskData);
      const response = await api.post('/create', taskData);
      return response.data;
    } catch (error) {
      console.error('❌ createTask error:', error);
      throw error.response?.data || { message: 'Failed to create task' };
    }
  },

  // ✅ PATCH /api/tasks/:taskId/update - Update task
  updateTask: async (taskId, updates) => {
    try {
      console.log('📡 API: updateTask ->', taskId, updates);
      const response = await api.patch(`/${taskId}/update`, updates);
      return response.data;
    } catch (error) {
      console.error('❌ updateTask error:', error);
      throw error.response?.data || { message: 'Failed to update task' };
    }
  },

  // ✅ PATCH /api/tasks/:taskId/mark-completed - Mark task complete
markComplete: async (taskId) => {
  try {
    console.log('📡 API: markComplete ->', taskId);
    const response = await api.patch(`/${taskId}/mark-completed`);
    return response.data;
  } catch (error) {
    console.error('❌ markComplete error:', error);
    throw error.response?.data || { message: 'Failed to mark task complete' };
  }
},

// ✅ FIXED: PATCH /api/tasks/:taskId/mark-uncompleted - Mark task uncomplete
markUncomplete: async (taskId) => {
  try {
    console.log('📡 API: markUncomplete ->', taskId);
    const response = await api.patch(`/${taskId}/mark-uncompleted`);  // ✅ CHANGED FROM GET TO PATCH
    return response.data;
  } catch (error) {
    console.error('❌ markUncomplete error:', error);
    throw error.response?.data || { message: 'Failed to mark task uncomplete' };
  }
},


  // ✅ DELETE /api/tasks/:taskId/delete - Delete task
  deleteTask: async (taskId) => {
    try {
      console.log('📡 API: deleteTask ->', taskId);
      const response = await api.delete(`/${taskId}/delete`);
      return response.data;
    } catch (error) {
      console.error('❌ deleteTask error:', error);
      throw error.response?.data || { message: 'Failed to delete task' };
    }
  },
};

export default plannerService;
