import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useThemeStore } from '../../store/themeStore.js';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);

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
          
         {/* Logo - Bigger with Radius */}
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


          {/* Center Links - Exact spacing */}
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

          {/* Right Side - Exact spacing */}
          <div className="hidden md:flex items-center" style={{ gap: '16px' }}>
            <ThemeToggle />
            <button className="text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#2196F3] transition-colors px-3">
              Log In
            </button>
            <button className="px-7 py-2.5 rounded-lg text-[15px] font-semibold text-white bg-[#2196F3] hover:bg-[#1976D2] transition-all shadow-md hover:shadow-lg">
              Sign Up
            </button>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
