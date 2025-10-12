import { Twitter, Mail, Instagram, Github, Linkedin, Phone } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Mail, url: 'mailto:contact@eduone.com', label: 'Email' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Github, url: '#', label: 'GitHub' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400" style={{ padding: '32px 0' }}>
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
