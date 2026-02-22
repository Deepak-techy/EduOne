// src/features/admin/dashboard/components/UserManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, ShieldCheck, UserX, UserCheck, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { adminService } from '../../../../services/adminService';
import { toast } from 'react-toastify';

const ROLES = ['student', 'admin', 'moderator'];

const statusStyle = {
    active: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    suspended: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [roleDropdown, setRoleDropdown] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getUsers();
            setUsers(res.data ?? res ?? []);
        } catch (err) {
            setError(err.message ?? 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleChange = async (userId, role) => {
        setRoleDropdown(null);
        setActionLoading({ id: userId, type: 'role' });
        try {
            await adminService.updateUserRole(userId, role);
            setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role } : u));
            toast.success('Role updated');
        } catch (err) {
            toast.error(err.message ?? 'Failed to update role');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
        setActionLoading({ id: user._id, type: 'status' });
        try {
            await adminService.updateUserStatus(user._id, newStatus);
            setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, status: newStatus } : u));
            toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'unsuspended'}`);
        } catch (err) {
            toast.error(err.message ?? 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        setConfirmDelete(null);
        setActionLoading({ id: userId, type: 'delete' });
        try {
            await adminService.deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            toast.success('User deleted');
        } catch (err) {
            toast.error(err.message ?? 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            (u.fullName ?? u.name ?? '').toLowerCase().includes(q) ||
            (u.email ?? '').toLowerCase().includes(q) ||
            (u.role ?? '').toLowerCase().includes(q)
        );
    });

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500 dark:text-slate-400">{error}</p>
            <button onClick={fetchUsers}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{filtered.length} users found</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or role…"
                        className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72 transition"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-700/30">
                                {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-sm text-gray-400 dark:text-slate-500">No users match your search.</td>
                                </tr>
                            ) : filtered.map((user) => {
                                const uid = user._id ?? user.id;
                                const name = user.fullName ?? user.name ?? '—';
                                const status = (user.status ?? 'active').toLowerCase();
                                const role = (user.role ?? 'student').toLowerCase();
                                const isActing = actionLoading?.id === uid;

                                return (
                                    <tr key={uid} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/30 transition-colors">
                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{name}</span>
                                            </div>
                                        </td>
                                        {/* Email */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-600 dark:text-slate-400">{user.email ?? '—'}</span>
                                        </td>
                                        {/* Role dropdown */}
                                        <td className="px-5 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setRoleDropdown(roleDropdown === uid ? null : uid)}
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer capitalize"
                                                    disabled={isActing}
                                                >
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    {role}
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                                {roleDropdown === uid && (
                                                    <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden min-w-[120px]">
                                                        {ROLES.map((r) => (
                                                            <button key={r}
                                                                onClick={() => handleRoleChange(uid, r)}
                                                                className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors cursor-pointer ${r === role ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>
                                                                {r}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${statusStyle[status] ?? statusStyle.inactive}`}>
                                                {status}
                                            </span>
                                        </td>
                                        {/* Last Login */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Suspend / Unsuspend */}
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    disabled={isActing}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${status === 'suspended'
                                                        ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100'
                                                        : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-100'
                                                        }`}
                                                >
                                                    {isActing && actionLoading.type === 'status'
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : status === 'suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                                    {status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                                                </button>
                                                {/* Delete */}
                                                {confirmDelete === uid ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleDelete(uid)}
                                                            className="px-2 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer">
                                                            Confirm
                                                        </button>
                                                        <button onClick={() => setConfirmDelete(null)}
                                                            className="px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDelete(uid)}
                                                        disabled={isActing}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer disabled:opacity-50">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
