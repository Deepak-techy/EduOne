// // src/components/common/LogoutButton.jsx

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const LogoutButton = ({ onLogoutSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 1. Call backend logout endpoint - deletes JWT tokens/cookies
      await authService.logout();

      // 2. Clear localStorage
      localStorage.removeItem('user');

      // 3. Show success message
      toast.success('Successfully logged out!');

      // 4. Callback if provided (closes navbar dropdown, mobile menu)
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }

      // 5. Redirect to home after delay
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Hard reload clears all state
      }, 1500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error?.message || 'Logout failed');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#2d3748] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-5 h-5" />
      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
};

export default LogoutButton;
