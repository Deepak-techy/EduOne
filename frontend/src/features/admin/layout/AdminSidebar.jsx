// src/features/admin/layout/AdminSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquareWarning, Flag, BarChart3,
  StickyNote, FileCheck, CalendarCheck, Megaphone, Settings,
  ChevronLeft, ChevronRight, ShieldCheck, LogOut
} from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const MENU = [
  { section: 'Overview' },
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Management' },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/community', label: 'Community', icon: MessageSquareWarning },
  { path: '/admin/reports', label: 'Reports', icon: Flag },
  { section: 'Content' },
  { path: '/admin/notes', label: 'Notes', icon: StickyNote },
  { path: '/admin/resumes', label: 'Resumes', icon: FileCheck },
  { path: '/admin/tasks', label: 'Tasks', icon: CalendarCheck },
  { section: 'Insights' },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'Communications' },
  { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { section: 'System' },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: open ? 260 : 72, background: 'linear-gradient(180deg, #13141f 0%, #171829 100%)' }}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {open && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-sm font-bold text-white tracking-wide">EduOne</h1>
            <p className="text-[10px] text-indigo-400 font-semibold">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2" style={{ scrollbarWidth: 'none' }}>
        {MENU.map((item, idx) => {
          if (item.section) {
            return open ? (
              <div key={idx} className="px-3 pt-4 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {item.section}
              </div>
            ) : (
              <div key={idx} className="mx-3 my-2 border-t border-white/5" />
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${!open ? 'justify-center' : ''}`}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-indigo-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile + Logout */}
      <div className="flex-shrink-0 border-t border-white/5 p-3">
        {open ? (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(admin?.fullName || admin?.userName || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{admin?.fullName || admin?.userName || 'Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{admin?.email || ''}</p>
            </div>
            <button onClick={logout} title="Logout" className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={logout} title="Logout" className="w-full flex justify-center p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
