import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Edit,
  HelpCircle, 
  Bell
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useThemeStore } from '../../store/themeStore.js';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  // State for user and avatar dropdown
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const dropdownRef = useRef(null);

  // Detect login user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, []);

  // Close dropdown when click outside
  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    setShowLogoutMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowLogoutMessage(false);
      navigate('/');
      window.location.reload();
    }, 2000);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' },
    { name: 'About', id: 'about' },
  ];

  return (
    <>
      {/* Logout Success Message */}
      {showLogoutMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] 
          bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl 
          animate-fade-in flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold text-base">Successfully logged out!</p>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1b1e]/95 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex justify-between items-center h-[80px]">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('home')} 
              className="flex-shrink-0 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img 
                src={theme === 'dark' 
                  ? '/src/assets/icons/darkmoodlogo.png' 
                  : '/src/assets/icons/lightmoodlogo.png'
                }
                alt="EDUONE" 
                className="h-12 w-auto rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </button>

            {/* Center Links (only show if NOT logged in) */}
            {!user && (
              <div className="hidden md:flex items-center gap-12">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#2196F3] dark:hover:text-[#3b82f6] transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            )}

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 select-none">
                      {user.userName || user.fullName || user.email}
                    </span>
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-11 h-11 rounded-full border cursor-pointer object-cover bg-gray-100 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-[22px] border cursor-pointer transition-all duration-200">
                        {(user.userName || user.fullName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2d3748]">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.userName || user.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/profile');
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition-all cursor-pointer"
                        >
                          <User className="w-5 h-5" />
                          <span>View Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/profile/edit');
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition-all cursor-pointer"
                        >
                          <Edit className="w-5 h-5" />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/notifications');
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition-all cursor-pointer"
                        >
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/help');
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition-all cursor-pointer"
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span>Help & Support</span>
                        </button>
                      </div>

                      {/* Logout - Separated */}
                      <div className="border-t border-gray-200 dark:border-[#2d3748] pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#2d3748] transition-all cursor-pointer"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/auth/login')}
                    className="text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#2196F3] transition-colors px-3"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => navigate('/auth/signup')}
                    className="px-7 py-2.5 rounded-lg text-[15px] font-semibold text-white bg-[#2196F3] hover:bg-[#1976D2] transition-all shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-800 dark:text-gray-200">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1a1b1e] border-t border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4 space-y-2">
              {!user && navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-4 py-3 rounded text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.name}
                </button>
              ))}
              {user ? (
                <div className="pt-2 space-y-1">
                  {/* Profile Header Mobile */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.userName || user.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-xl transition-all cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/profile/edit');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-xl transition-all cursor-pointer"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-xl transition-all cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/help');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-xl transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#2d3748] rounded-xl transition-all cursor-pointer border-t border-gray-200 dark:border-gray-700 mt-2 pt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/auth/login');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-3 rounded text-white bg-[#2196F3] hover:bg-[#1976D2]"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
