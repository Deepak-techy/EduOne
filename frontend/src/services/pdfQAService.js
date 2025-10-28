// src/services/pdfQAService.js
import axios from 'axios';

// Base URL - proxy handles the rest
const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// PDF Q&A Service - All API functions
export const pdfQAService = {
  
  // 1. Get Available Subjects
  getSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data; // { statusCode: 200, data: [...], message: "...", success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subjects' };
    }
  },

  // 2. Query Subject (Ask question about a subject)
  querySubject: async (subjectCode, query) => {
    try {
      const response = await api.post('/subjects/query', {
        subject: subjectCode,
        query: query,
      });
      return response.data; // { statusCode: 200, data: { answer: "...", sources: [...] } }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get answer' };
    }
  },

  // 3. Upload PDF (Temporary)
  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file); // ← Field name is 'pdf'

      const response = await axios.post(`${API_URL}/uploads/temporary`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      
      return response.data; // { statusCode: 200, data: { sessionId: "...", chunkCount: 256 } }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload PDF' };
    }
  },

  // 4. Query Uploaded PDF
  queryUploadedPDF: async (sessionId, query) => {
    try {
      const response = await api.post('/uploads/query', {
        sessionId: sessionId,
        query: query,
      });
      return response.data; // { statusCode: 200, data: "answer as string" }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get answer' };
    }
  },
};

export default pdfQAService;
