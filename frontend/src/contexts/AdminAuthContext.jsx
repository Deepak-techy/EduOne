// src/contexts/AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to validate existing admin session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await adminService.auth.getProfile();
        const user = res.data ?? res;
        if (user && user.role === 'Admin') {
          setAdmin(user);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await adminService.auth.login(credentials);
    const user = res.data?.user ?? res.user ?? res.data ?? res;
    if (user) {
      setAdmin(user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call the user logout endpoint to clear cookies
      const { authService } = await import('../services/authService');
      await authService.logout();
    } catch {
      // Ignore — just clear local state
    }
    setAdmin(null);
    toast.info('Admin logged out successfully 👋');
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await adminService.auth.getProfile();
      const user = res.data ?? res;
      setAdmin(user);
    } catch {
      // silent
    }
  }, []);

  const value = {
    admin,
    loading,
    login,
    logout,
    refreshProfile,
    isAdminAuthenticated: !!admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
