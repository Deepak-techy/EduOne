// src/features/admin/dashboard/components/Announcements.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Megaphone, AlertCircle, Loader2, X } from 'lucide-react';
import { adminService } from '../../../../services/adminService';
import { toast } from 'react-toastify';

const AnnouncementModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({ title: '', body: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.body.trim()) {
            toast.error('Title and message are required');
            return;
        }
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } catch {
            /* error already toasted */
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                            <Megaphone className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Announcement</h3>
                    </div>
                    <button onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Announcement title…"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Message</label>
                        <textarea
                            rows={4}
                            value={form.body}
                            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                            placeholder="Write your announcement here…"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold shadow-sm hover:from-blue-600 hover:to-cyan-600 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Post Announcement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getAnnouncements();
            setAnnouncements(res.data ?? res ?? []);
        } catch (err) {
            setError(err.message ?? 'Failed to load announcements');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

    const handleCreate = async (formData) => {
        try {
            const res = await adminService.createAnnouncement(formData);
            const newItem = res.data ?? res;
            setAnnouncements((prev) => [newItem, ...prev]);
            toast.success('Announcement posted!');
        } catch (err) {
            toast.error(err.message ?? 'Failed to post announcement');
            throw err;
        }
    };

    const handleDelete = async (aid) => {
        setConfirmDelete(null);
        setDeleting(aid);
        try {
            await adminService.deleteAnnouncement(aid);
            setAnnouncements((prev) => prev.filter((a) => (a._id ?? a.id) !== aid));
            toast.success('Announcement deleted');
        } catch (err) {
            toast.error(err.message ?? 'Failed to delete');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500 dark:text-slate-400">{error}</p>
            <button onClick={fetchAnnouncements}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer">
                Retry
            </button>
        </div>
    );

    return (
        <>
            {showModal && (
                <AnnouncementModal onClose={() => setShowModal(false)} onSave={handleCreate} />
            )}

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{announcements.length} posted</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold shadow-sm hover:from-blue-600 hover:to-cyan-600 transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                        New Announcement
                    </button>
                </div>

                {/* List */}
                {announcements.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3">
                        <Megaphone className="w-10 h-10 text-gray-300 dark:text-slate-600" />
                        <p className="text-sm text-gray-400 dark:text-slate-500">No announcements yet. Create one!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {announcements.map((a) => {
                            const aid = a._id ?? a.id;
                            const date = a.createdAt
                                ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '—';

                            return (
                                <div key={aid}
                                    className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm mt-0.5">
                                                <Megaphone className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{a.title ?? 'Untitled'}</p>
                                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">{a.body ?? a.message ?? a.content ?? ''}</p>
                                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {confirmDelete === aid ? (
                                                <>
                                                    <button onClick={() => handleDelete(aid)}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer">
                                                        Confirm
                                                    </button>
                                                    <button onClick={() => setConfirmDelete(null)}
                                                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer">
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmDelete(aid)}
                                                    disabled={deleting === aid}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer disabled:opacity-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Announcements;
