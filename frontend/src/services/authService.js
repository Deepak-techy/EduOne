// //src/services/authService.js (Handles all API calls to backend)

// import axios from 'axios';

// // Base URL from backend
// const API_URL = '/api/users';  // ← FIXED: Just /api/auth - proxy handles rest

// // Create axios instance with base config
// const api = axios.create({
//   baseURL: API_URL,  // ← FIXED: Changed from API_BASE_URL to API_URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Send cookies with requests
// });

// // Auth Service - All API functions
// export const authService = {
//   // Register/Signup
//   register: async (userData) => {
//     try {
//       const response = await api.post('/register', {  // ← FIXED: Removed /users/
//         fullName: userData.fullName,
//         userName: userData.userName,
//         email: userData.email,
//         role: userData.role,
//         password: userData.password,
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Registration failed' };
//     }
//   },

//   // Login
//   login: async (credentials) => {
//     try {
//       const response = await api.post('/login', credentials);  // ← FIXED: Removed /users/
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Login failed' };
//     }
//   },

//   // ✅ ADD THIS NEW LOGOUT FUNCTION
//   logout: async () => {
//     try {
//       const response = await api.post('/logout');  // ← Endpoint call
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Logout failed' };
//     }
//   },

//   // Forget Password
//   forgetPassword: async (email) => {
//     try {
//       const response = await api.post('/forget-password', { email });  // ← FIXED: Removed /users/
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Request failed' };
//     }
//   },

//   // Reset Password
//   resetPassword: async (token, passwords) => {
//     try {
//       const response = await api.post(`/reset-password/${token}`, {  // ← FIXED: Removed /users/
//         newPassword: passwords.newPassword,
//         confirmNewPassword: passwords.confirmNewPassword,
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Reset failed' };
//     }
//   },

  
//   // ✅ View Profile
//   getProfile: async () => {
//     try {
//       const response = await api.get('/view-profile');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch profile' };
//     }
//   },

//   // ✅ Update Profile (fullName, userName, email)
//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.patch('/update-profile', profileData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update profile' };
//     }
//   },

//   // ✅ Update Avatar (FormData)
//   updateAvatar: async (formData) => {
//     try {
//       const response = await api.patch('/update-avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update avatar' };
//     }
//   },
// };

// export default authService;


















import axios from 'axios';

const API_URL = '/api/users';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies both ways
});

// ✅ ADD TOKEN TO EVERY REQUEST (like Postman does)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
      
      // ✅ SAVE TOKEN - This is what you're missing!
      if (response.data?.data?.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
      } else if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      
      // ✅ CLEAR EVERYTHING
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      
      return response.data;
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
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
