import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('eduone_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('eduone_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.fullName}! 🎉`, {
      position: 'top-right',
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Signup function
  const signup = (userData) => {
    setUser(userData);
    localStorage.setItem('eduone_user', JSON.stringify(userData));
    toast.success('Successfully registered! Welcome to EduOne! 🎊', {
      position: 'top-right',
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduone_user');
    toast.info('Logged out successfully! See you soon! 👋', {
      position: 'top-right',
      autoClose: 3000,
    });
    navigate('/');
  };

  // Update profile function
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('eduone_user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully! ✅', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
