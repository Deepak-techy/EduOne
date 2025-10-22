import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useThemeStore } from '../../store/themeStore.js';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  // State for user and avatar dropdown
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' },
    { name: 'About', id: 'about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1b1e]/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="flex justify-between items-center" style={{ height: '80px' }}>
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

          {/* Center Links */}
          <div className="hidden md:flex items-center" style={{ gap: '48px' }}>
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

          {/* Right Side */}
          <div className="hidden md:flex items-center" style={{ gap: '16px' }}>
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {user.userName || user.fullName || user.email}
                  </span>

                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border cursor-pointer object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg border cursor-pointer">
                      {(user.userName || user.fullName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#2d3748] rounded-xl shadow-xl z-50">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748]"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        setUser(null);
                        setDropdownOpen(false);
                        navigate('/');
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-3 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#2d3748]"
                    >
                      Logout
                    </button>
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
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 rounded text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.name}
              </button>
            ))}
            {user ? (
              <div className="pt-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d3748]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    setUser(null);
                    setMobileMenuOpen(false);
                    navigate('/');
                    window.location.reload();
                  }}
                  className="block w-full text-left px-4 py-3 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#2d3748]"
                >
                  Logout
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
  );
};

export default Navbar;
