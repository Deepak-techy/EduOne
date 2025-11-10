// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user from backend on mount (backend uses cookies automatically)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getProfile();
        const userData = response.data;
        
        // Map avatar to avatarUrl for consistency
        const userWithAvatar = {
          ...userData,
          avatarUrl: userData.avatar || userData.avatarUrl || null,
        };
        
        setUser(userWithAvatar);
      } catch (error) {
        // Silently fail if not logged in (expected behavior)
        // Don't show errors in console for 401 on initial load
        if (error?.response?.status !== 401) {
          console.error('Error fetching profile:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout function - calls backend to clear cookies
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.info('Logged out successfully! See you soon! 👋', {
        position: 'top-right',
        autoClose: 3000,
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend fails, clear user state
      setUser(null);
      window.location.href = '/';
    }
  };

  // ✅ Update profile function - refetch from backend after update
  const updateProfile = async (updatedData) => {
    try {
      const response = await authService.updateProfile(updatedData);
      const userData = response.data;
      
      // Map avatar to avatarUrl
      const userWithAvatar = {
        ...userData,
        avatarUrl: userData.avatar || userData.avatarUrl || null,
      };
      
      setUser(userWithAvatar);
      toast.success('Profile updated successfully! ✅', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to update profile', {
        position: 'top-right',
        autoClose: 3000,
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    logout,
    updateProfile,
    setUser, // For manual updates after avatar change
    isAuthenticated: !!user,
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
