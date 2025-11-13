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

export const plannerService = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks' };
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  getTasksByRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks by range' };
    }
  },

  getTasksByDate: async (dueDate) => {
    try {
      const response = await api.get(`/due-date?dueDate=${dueDate}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks by date' };
    }
  },

  getAIPrioritized: async () => {
    try {
      const response = await api.get('/ai-prioritized');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch AI prioritized tasks' };
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/create', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task' };
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response = await api.patch(`/${taskId}/update`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task' };
    }
  },

  // ✅ FIXED - Toggle isCompleted status
  markComplete: async (taskId, task) => {
    try {
      const response = await api.patch(`/${taskId}/mark-completed`, {
        isCompleted: !task.isCompleted  // Toggle the status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark task complete' };
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/${taskId}/delete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete task' };
    }
  },
};

export default plannerService;
