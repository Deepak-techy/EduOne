// src/features/admin/layout/AdminTopbar.jsx
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const PATH_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/community': 'Community Moderation',
  '/admin/reports': 'Reports & Complaints',
  '/admin/analytics': 'Analytics',
  '/admin/notes': 'Notes Management',
  '/admin/resumes': 'Resume Management',
  '/admin/tasks': 'Tasks Monitoring',
  '/admin/announcements': 'Announcements',
  '/admin/settings': 'Settings',
};

const AdminTopbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { admin } = useAdminAuth();

  const title = PATH_TITLES[location.pathname] || 'Admin Panel';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-4 py-2 w-56 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Admin avatar */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2196F3] to-[#00BCD4] flex items-center justify-center text-white text-xs font-bold">
            {(admin?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-white leading-tight">{admin?.fullName || 'Admin'}</p>
            <p className="text-[11px] text-slate-500">{admin?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
