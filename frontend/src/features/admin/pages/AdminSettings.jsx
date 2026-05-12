// src/features/admin/pages/AdminSettings.jsx
import { useState } from 'react';
import { Settings, Key, Loader2, User } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const { admin, refreshProfile } = useAdminAuth();
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmNewPassword) { toast.error('All fields required'); return; }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { toast.error('New passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await adminService.auth.changePassword(pwForm);
      toast.success('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) { toast.error(err.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Section */}
      <div className="bg-[#1e2030] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2196F3] to-[#00BCD4] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Admin Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Full Name</p>
            <p className="text-sm font-semibold text-white">{admin?.fullName || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Username</p>
            <p className="text-sm font-semibold text-white">{admin?.userName || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Email</p>
            <p className="text-sm font-semibold text-white">{admin?.email || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Role</p>
            <p className="text-sm font-bold text-blue-400">{admin?.role || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-[#1e2030] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Current Password</label>
            <input type="password" value={pwForm.oldPassword} onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
              placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
            <input type="password" value={pwForm.confirmNewPassword} onChange={e => setPwForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
              placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#00BCD4] text-white text-sm font-bold shadow-sm hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
