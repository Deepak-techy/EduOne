// Handles all API calls to backend

import axios from 'axios';

// Base URL from backend
const API_URL = '/api/users';  // ← FIXED: Just /api/auth - proxy handles rest

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,  // ← FIXED: Changed from API_BASE_URL to API_URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Auth Service - All API functions
export const authService = {
  // Register/Signup
  register: async (userData) => {
    try {
      const response = await api.post('/register', {  // ← FIXED: Removed /users/
        fullName: userData.fullName,
        userName: userData.userName,
        email: userData.email,
        // phone: userData.phone,
        role: userData.role,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);  // ← FIXED: Removed /users/
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Forget Password
  forgetPassword: async (email) => {
    try {
      const response = await api.post('/forget-password', { email });  // ← FIXED: Removed /users/
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Request failed' };
    }
  },

  // Reset Password
  resetPassword: async (token, passwords) => {
    try {
      const response = await api.post(`/reset-password/${token}`, {  // ← FIXED: Removed /users/
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmNewPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Reset failed' };
    }
  },
};

export default authService;
