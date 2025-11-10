// src/services/authService.js
import axios from 'axios';

const API_URL = '/api/users'; // ✅ Full backend URL proxy

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ CRITICAL: Send cookies to backend
});

// ✅ NO Authorization header interceptor needed!
// Backend reads tokens from cookies automatically

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        fullName: userData.fullName,
        userName: userData.userName,
        email: userData.email,
        role: userData.role,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },


  login: async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    // ✅ Backend sets cookies automatically - don't store anything!
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
},

logout: async () => {
  try {
    const response = await api.post('/logout');
    // ✅ Backend clears cookies - no localStorage needed!
    return response.data;
  } catch (error) {
    // ✅ Don't store anything on error either
    throw error.response?.data || { message: 'Logout failed' };
  }
},


  forgetPassword: async (email) => {
    try {
      const response = await api.post('/forget-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Request failed' };
    }
  },

  resetPassword: async (token, passwords) => {
    try {
      const response = await api.post(`/reset-password/${token}`, {
        newPassword: passwords.newPassword,
        confirmNewPassword: passwords.confirmNewPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Reset failed' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/view-profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/update-profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  updateAvatar: async (formData) => {
    try {
      const response = await api.patch('/update-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update avatar' };
    }
  },
};

export default authService;
