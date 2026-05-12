// src/features/admin/pages/UserManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, AlertCircle, RefreshCw, UserPlus, Download, Trash2, UserCheck, UserX, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusBadge from '../components/StatusBadge';
import RoleBadge from '../components/RoleBadge';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminModal from '../components/AdminModal';
import { SkeletonTable } from '../components/SkeletonLoader';

const PAGE_SIZE = 15;
const ROLES = ['Student', 'Teacher', 'Admin'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: 'all', status: 'all' });
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: '', userName: '', email: '', password: '', role: 'Student' });
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminService.users.getAll({ limit: 1000 });
      const payload = res.data ?? res;
      const list = payload?.users ?? payload ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) { setError(err.message ?? 'Failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.fullName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.userName || '').toLowerCase().includes(q);
    const matchRole = filters.role === 'all' || (u.role || '').toLowerCase() === filters.role.toLowerCase();
    const matchStatus = filters.status === 'all' || (u.accountStatus || u.status || '').toLowerCase() === filters.status.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSuspend = async (id) => {
    setActionLoading(id);
    try { await adminService.users.suspend(id); setUsers(p => p.map(u => u._id === id ? { ...u, accountStatus: 'Suspended' } : u)); toast.success('User suspended'); }
    catch (e) { toast.error(e.message); } finally { setActionLoading(null); setConfirmAction(null); }
  };

  const handleActivate = async (id) => {
    setActionLoading(id);
    try { await adminService.users.activate(id); setUsers(p => p.map(u => u._id === id ? { ...u, accountStatus: 'Active' } : u)); toast.success('User activated'); }
    catch (e) { toast.error(e.message); } finally { setActionLoading(null); setConfirmAction(null); }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try { await adminService.users.delete(id); setUsers(p => p.filter(u => u._id !== id)); toast.success('User deleted'); }
    catch (e) { toast.error(e.message); } finally { setActionLoading(null); setConfirmAction(null); }
  };

  const handleRoleChange = async (id, role) => {
    setRoleDropdown(null); setActionLoading(id);
    try { await adminService.users.changeRole(id, role); setUsers(p => p.map(u => u._id === id ? { ...u, role } : u)); toast.success('Role updated'); }
    catch (e) { toast.error(e.message); } finally { setActionLoading(null); }
  };

  const handleExport = async () => {
    try { const res = await adminService.users.export(); toast.success('Export started'); }
    catch (e) { toast.error(e.message); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { fullName, userName, email, password, role } = createForm;
    if (!fullName.trim() || !userName.trim() || !email.trim() || !password.trim()) {
      toast.error('All fields are required'); return;
    }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setCreating(true);
    try {
      const res = await adminService.users.create({ fullName, userName, email, password, role });
      const newUser = res.data ?? res;
      setUsers(prev => [newUser, ...prev]);
      toast.success(`${role} account created successfully!`);
      setShowCreateModal(false);
      setCreateForm({ fullName: '', userName: '', email: '', password: '', role: 'Student' });
      setShowPassword(false);
    } catch (err) { toast.error(err.message || 'Failed to create user'); }
    finally { setCreating(false); }
  };

  if (loading) return <SkeletonTable rows={8} />;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchUsers} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      <SearchFilterBar
        searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        placeholder="Search by name, email, username…"
        filters={[
          { key: 'role', label: 'Role', options: [{ value: 'all', label: 'All' }, { value: 'student', label: 'Student' }, { value: 'teacher', label: 'Teacher' }, { value: 'admin', label: 'Admin' }] },
          { key: 'status', label: 'Status', options: [{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }] },
        ]}
        activeFilters={filters}
        onFilterChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); }}
        onClearFilters={() => { setFilters({ role: 'all', status: 'all' }); setPage(1); }}
      >
        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Download className="w-4 h-4" />Export
        </button>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#00BCD4] text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer">
          <UserPlus className="w-4 h-4" />Create User
        </button>
      </SearchFilterBar>

      <div className="text-xs text-slate-500">{filtered.length} users found</div>

      {/* Table */}
      <div className="bg-[#1e2030] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-500">No users match your search.</td></tr>
              ) : paged.map(user => {
                const uid = user._id || user.id;
                const name = user.fullName || user.userName || '—';
                const status = (user.accountStatus || user.status || 'Active');
                const role = user.role || 'Student';
                const isActing = actionLoading === uid;

                return (
                  <tr key={uid} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2196F3] to-[#00BCD4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-white whitespace-nowrap">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="text-sm text-slate-400">{user.email || '—'}</span></td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button onClick={() => setRoleDropdown(roleDropdown === uid ? null : uid)} disabled={isActing}
                          className="cursor-pointer flex items-center gap-1">
                          <RoleBadge role={role} />
                          <ChevronDown className="w-3 h-3 text-slate-500" />
                        </button>
                        {roleDropdown === uid && (
                          <div className="absolute top-full mt-1 left-0 z-20 bg-[#252740] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[120px]">
                            {ROLES.map(r => (
                              <button key={r} onClick={() => handleRoleChange(uid, r)}
                                className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-white/5 transition-colors cursor-pointer ${r === role ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>{r}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={status} /></td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {status.toLowerCase() === 'suspended' ? (
                          <button onClick={() => setConfirmAction({ type: 'activate', id: uid, name })} disabled={isActing}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50">
                            <UserCheck className="w-3.5 h-3.5" />Activate
                          </button>
                        ) : (
                          <button onClick={() => setConfirmAction({ type: 'suspend', id: uid, name })} disabled={isActing}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer disabled:opacity-50">
                            <UserX className="w-3.5 h-3.5" />Suspend
                          </button>
                        )}
                        <button onClick={() => setConfirmAction({ type: 'delete', id: uid, name })} disabled={isActing}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50">
                          <Trash2 className="w-3.5 h-3.5" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.type === 'delete') handleDelete(confirmAction.id);
          else if (confirmAction?.type === 'suspend') handleSuspend(confirmAction.id);
          else if (confirmAction?.type === 'activate') handleActivate(confirmAction.id);
        }}
        title={confirmAction?.type === 'delete' ? `Delete ${confirmAction?.name}?` : confirmAction?.type === 'suspend' ? `Suspend ${confirmAction?.name}?` : `Activate ${confirmAction?.name}?`}
        description={confirmAction?.type === 'delete' ? 'This will permanently remove this user.' : confirmAction?.type === 'suspend' ? 'This user will lose access.' : 'This user will regain access.'}
        confirmText={confirmAction?.type || 'Confirm'}
        variant={confirmAction?.type === 'delete' ? 'danger' : confirmAction?.type === 'suspend' ? 'warning' : 'info'}
        loading={!!actionLoading}
      />

      {/* Create User Modal */}
      <AdminModal open={showCreateModal} onClose={() => { setShowCreateModal(false); setShowPassword(false); }} title="Create New User" icon={UserPlus}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input type="text" value={createForm.fullName} onChange={e => setCreateForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username</label>
            <input type="text" value={createForm.userName} onChange={e => setCreateForm(f => ({ ...f, userName: e.target.value }))}
              placeholder="johndoe"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
            <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button type="button" key={r} onClick={() => setCreateForm(f => ({ ...f, role: r }))}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-center transition-all cursor-pointer border ${
                    createForm.role === r
                      ? r === 'Admin'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-blue-500/40 text-blue-400 ring-1 ring-blue-500/30'
                        : r === 'Teacher'
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 ring-1 ring-cyan-500/30'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}>{r}</button>
              ))}
            </div>
            {createForm.role === 'Admin' && (
              <p className="mt-2 text-xs text-amber-400/80 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                This user will have full admin privileges
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button type="button" onClick={() => { setShowCreateModal(false); setShowPassword(false); }}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer transition-colors">Cancel</button>
            <button type="submit" disabled={creating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#00BCD4] text-white text-sm font-bold shadow-sm hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              <UserPlus className="w-4 h-4" />{creating ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default UserManagement;
