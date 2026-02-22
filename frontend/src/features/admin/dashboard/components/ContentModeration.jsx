// src/features/admin/dashboard/components/ContentModeration.jsx
import { useState, useEffect, useCallback } from 'react';
import { Flag, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { adminService } from '../../../../services/adminService';
import { toast } from 'react-toastify';

const ContentModeration = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getPosts();
            setPosts(res.data ?? res ?? []);
        } catch (err) {
            setError(err.message ?? 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleFlag = async (post) => {
        const pid = post._id ?? post.id;
        setActionLoading({ id: pid, type: 'flag' });
        try {
            await adminService.flagPost(pid, !post.flagged);
            setPosts((prev) => prev.map((p) =>
                (p._id ?? p.id) === pid ? { ...p, flagged: !p.flagged } : p
            ));
            toast.success(post.flagged ? 'Post unflagged' : 'Post flagged');
        } catch (err) {
            toast.error(err.message ?? 'Failed to flag post');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (pid) => {
        setConfirmDelete(null);
        setActionLoading({ id: pid, type: 'delete' });
        try {
            await adminService.deletePost(pid);
            setPosts((prev) => prev.filter((p) => (p._id ?? p.id) !== pid));
            toast.success('Post deleted');
        } catch (err) {
            toast.error(err.message ?? 'Failed to delete post');
        } finally {
            setActionLoading(null);
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
            <button onClick={fetchPosts}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content Moderation</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">{posts.length} posts under review</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-700/30">
                                {['Author', 'Role', 'Content Preview', 'Date', 'Flags', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-sm text-gray-400 dark:text-slate-500">
                                        No posts to moderate.
                                    </td>
                                </tr>
                            ) : posts.map((post) => {
                                const pid = post._id ?? post.id;
                                const authorName = post.author?.fullName ?? post.author?.name ?? post.authorName ?? '—';
                                const authorRole = post.author?.role ?? post.authorRole ?? '—';
                                const preview = post.content ?? post.body ?? post.text ?? '';
                                const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                                const flagCount = post.flagCount ?? (post.flagged ? 1 : 0);
                                const isActing = actionLoading?.id === pid;

                                return (
                                    <tr key={pid} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/30 transition-colors">
                                        {/* Author */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {authorName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{authorName}</span>
                                            </div>
                                        </td>
                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-600 dark:text-slate-400 capitalize">{authorRole}</span>
                                        </td>
                                        {/* Content Preview */}
                                        <td className="px-5 py-4 max-w-xs">
                                            <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-normal break-words">{preview || '(no text)'}</p>
                                        </td>
                                        {/* Date */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">{date}</span>
                                        </td>
                                        {/* Flags */}
                                        <td className="px-5 py-4">
                                            {flagCount > 0 ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                    <Flag className="w-3 h-3" /> {flagCount}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 dark:text-slate-500">—</span>
                                            )}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Flag / Unflag */}
                                                <button
                                                    onClick={() => handleFlag(post)}
                                                    disabled={isActing}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${post.flagged
                                                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-gray-200'
                                                        }`}>
                                                    <Flag className="w-3.5 h-3.5" />
                                                    {post.flagged ? 'Unflag' : 'Flag'}
                                                </button>
                                                {/* Delete */}
                                                {confirmDelete === pid ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleDelete(pid)}
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
                                                        onClick={() => setConfirmDelete(pid)}
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

export default ContentModeration;
