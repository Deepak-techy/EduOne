// src/services/resumeService.js
import axios from 'axios';

const API_URL = '/api/resumes';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const resumeService = {
  // 1. Upload and analyze a new resume using AI
  analyzeResume: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Analyze resume error:', error);
      throw error.response?.data || { message: 'Failed to analyze resume' };
    }
  },

  // 2. Get all analyzed resumes for the logged-in user
  getAllResumes: async () => {
    try {
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      console.error('Get all resumes error:', error);
      throw error.response?.data || { message: 'Failed to fetch resumes' };
    }
  },

  // 3. Retrieve a specific resume and its AI analysis
  getResumeById: async (resumeId) => {
    try {
      const response = await api.get(`/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Get resume by ID error:', error);
      throw error.response?.data || { message: 'Failed to fetch resume' };
    }
  },

  // 4. Delete a specific resume
  deleteResume: async (resumeId) => {
    try {
      const response = await api.delete(`/${resumeId}/delete`);
      return response.data;
    } catch (error) {
      console.error('Delete resume error:', error);
      throw error.response?.data || { message: 'Failed to delete resume' };
    }
  },
};

export default resumeService;
