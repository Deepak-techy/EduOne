// src/features/admin/pages/CommunityModeration.jsx
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Flag, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminModal from '../components/AdminModal';
import { SkeletonTable } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 12;

const CommunityModeration = () => {
  const [tab, setTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewPost, setViewPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = tab === 'flagged'
        ? await adminService.community.getFlaggedPosts({ limit: 1000 })
        : await adminService.community.getPosts({ limit: 1000 });
      const payload = res.data ?? res;
      const list = payload?.posts ?? payload ?? [];
      setPosts(Array.isArray(list) ? list : []);
    } catch (err) { setError(err.message ?? 'Failed'); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { fetchPosts(); setPage(1); }, [fetchPosts]);

  const filtered = posts.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.content || p.text || '').toLowerCase().includes(q) ||
      (p.author?.fullName || '').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    setDeleting(id); setConfirmDel(null);
    try {
      await adminService.community.deletePost(id);
      setPosts(p => p.filter(x => (x._id || x.id) !== id));
      toast.success('Post deleted');
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  const tabs = [
    { id: 'all', label: 'All Posts', icon: MessageSquare },
    { id: 'flagged', label: 'Flagged', icon: Flag },
  ];

  if (loading) return <SkeletonTable rows={6} />;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-gray-500">{error}</p>
      <button onClick={fetchPosts} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                tab === t.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-900'
              }`}>
              <Icon className="w-4 h-4" />{t.label}
            </button>
          );
        })}
      </div>

      <SearchFilterBar searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} placeholder="Search posts…" />

      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No posts found" description="No community posts to display." action={fetchPosts} actionLabel="Refresh" />
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Author', 'Content', 'Date', 'Flags', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paged.map(post => {
                    const pid = post._id || post.id;
                    const author = post.author?.fullName || post.authorName || '—';
                    const content = post.content || post.text || post.body || '';
                    const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                    const flags = post.reportCount ?? post.flagCount ?? 0;

                    return (
                      <tr key={pid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0">
                              {author[0]?.toUpperCase()}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900">{author}</span>
                              <p className="text-[11px] text-gray-400 capitalize">{post.author?.role || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm text-gray-700 truncate">{content || '(empty)'}</p>
                        </td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-400 whitespace-nowrap">{date}</span></td>
                        <td className="px-5 py-4">
                          {flags > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-500 border border-red-200">
                              <Flag className="w-3 h-3" />Flagged ({flags})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Not Flagged
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewPost(post)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDel(pid)} disabled={deleting === pid}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50">
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
        </>
      )}

      <ConfirmDialog open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={() => handleDelete(confirmDel)}
        title="Delete this post?" description="This will permanently remove this community post." confirmText="Delete" variant="danger" loading={!!deleting} />

      <AdminModal open={!!viewPost} onClose={() => setViewPost(null)} title="Post Details" icon={MessageSquare}>
        {viewPost && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-gray-900 text-sm font-bold">
                {(viewPost.author?.fullName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{viewPost.author?.fullName || '—'}</p>
                <p className="text-xs text-gray-400">{viewPost.author?.role || ''} • {viewPost.createdAt ? new Date(viewPost.createdAt).toLocaleString() : ''}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewPost.content || viewPost.text || viewPost.body || '(empty)'}</p>
            {(viewPost.flagCount > 0 || viewPost.flagged) && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <Flag className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-semibold">{viewPost.flagCount || 1} flag(s)</span>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default CommunityModeration;
