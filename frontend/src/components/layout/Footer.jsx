import { Twitter, Mail, Instagram, Github, Linkedin, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ FIX: Track sidebar state

  // ✅ FIX: Listen for sidebar width changes
  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector('[style*="width"]');
      if (sidebar) {
        const width = parseInt(sidebar.style.width);
        setSidebarOpen(width > 70);
      }
    };

    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Mail, url: 'mailto:contact@eduone.com', label: 'Email' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Github, url: '#', label: 'GitHub' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ];

  return (
    <footer 
      className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 transition-all duration-300"
      style={{
        padding: '32px 0',
        // ✅ FIX: Shift footer content based on sidebar state
        marginLeft: sidebarOpen ? '250px' : '70px',
        width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
        transition: 'margin-left 0.35s cubic-bezier(.72,-0.2,.25,1), width 0.35s cubic-bezier(.72,-0.2,.25,1)'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="flex flex-col md:flex-row justify-between items-center" style={{ gap: '24px' }}>
          
          {/* Left - Brand - Exact size */}
          <div className="flex items-center">
            <span className="font-bold text-gray-900" style={{ fontSize: '24px' }}>@EDUONE</span>
          </div>

          {/* Center - Phone - Exact spacing */}
          <div className="flex items-center text-gray-900" style={{ gap: '12px' }}>
            <Phone style={{ width: '20px', height: '20px' }} />
            <span className="font-medium" style={{ fontSize: '17px' }}>8019-2892-09</span>
          </div>

          {/* Right - Social Icons - Exact spacing */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  className="rounded-full bg-white/20 hover:bg-white/40 transition-all hover:scale-110 text-gray-900 flex items-center justify-center"
                  style={{ width: '40px', height: '40px' }}
                  aria-label={social.label}
                >
                  <Icon style={{ width: '20px', height: '20px' }} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
