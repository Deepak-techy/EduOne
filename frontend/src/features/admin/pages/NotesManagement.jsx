// src/features/admin/pages/NotesManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { StickyNote, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminModal from '../components/AdminModal';
import AdminStatsCard from '../components/AdminStatsCard';
import { SkeletonTable, SkeletonCard } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 12;

const NotesManagement = () => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewNote, setViewNote] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [notesRes, statsRes] = await Promise.allSettled([
        adminService.notes.getAll({ limit: 1000 }), adminService.notes.getUsageStats()
      ]);
      if (notesRes.status === 'fulfilled') { const payload = notesRes.value.data ?? notesRes.value; const l = payload?.notes ?? payload ?? []; setNotes(Array.isArray(l) ? l : []); }
      if (statsRes.status === 'fulfilled') { const s = statsRes.value.data ?? statsRes.value; setStats(s?.overview ?? s); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = notes.filter(n => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (n.title || n.subject || '').toLowerCase().includes(q) || (n.owner?.fullName || n.userId?.fullName || '').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    setDeleting(id); setConfirmDel(null);
    try { await adminService.notes.delete(id); setNotes(p => p.filter(n => (n._id || n.id) !== id)); toast.success('Note deleted'); }
    catch (e) { toast.error(e.message); } finally { setDeleting(null); }
  };

  if (loading) return <div className="space-y-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div><SkeletonTable rows={6} /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-gray-500">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button></div>
  );

  return (
    <div className="space-y-5">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatsCard title="Total Notes" value={stats.totalNotes ?? notes.length} icon={StickyNote} color="purple" />
          <AdminStatsCard title="This Week" value={stats.thisWeek ?? 0} icon={StickyNote} color="cyan" />
          <AdminStatsCard title="Avg per User" value={stats.avgPerUser ?? 0} icon={StickyNote} color="teal" />
        </div>
      )}

      <SearchFilterBar searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} placeholder="Search notes by title or owner…" />

      {filtered.length === 0 ? (
        <EmptyState icon={StickyNote} title="No notes" description="No notes to display." action={fetchData} actionLabel="Refresh" />
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  {['Subject', 'Owner', 'Document', 'Created', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {paged.map(note => {
                    const nid = note._id || note.id;
                    const owner = note.owner?.fullName || note.userId?.fullName || '—';
                    return (
                      <tr key={nid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{note.subject || 'Untitled'}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-500">{owner}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-500">{note.documentMetadata?.fileName || (note.documentUrl ? 'Uploaded' : '—')}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-400 whitespace-nowrap">{note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewNote(note)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-900 cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirmDel(nid)} disabled={deleting === nid}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 cursor-pointer disabled:opacity-50">
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
        title="Delete this note?" description="This will permanently remove this note." confirmText="Delete" variant="danger" loading={!!deleting} />

      <AdminModal open={!!viewNote} onClose={() => setViewNote(null)} title="Note Details" icon={StickyNote}>
        {viewNote && (
          <div className="space-y-3">
            <div><p className="text-xs text-gray-400 mb-1">Subject</p><p className="text-sm text-gray-900 font-semibold">{viewNote.subject || 'Untitled'}</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Owner</p><p className="text-sm text-gray-700">{viewNote.owner?.fullName || viewNote.userId?.fullName || '—'}</p></div>
            {viewNote.documentMetadata?.fileName && <div><p className="text-xs text-gray-400 mb-1">Document</p><p className="text-sm text-gray-700">{viewNote.documentMetadata.fileName}</p></div>}
            {viewNote.content && <div><p className="text-xs text-gray-400 mb-1">Content Preview</p><p className="text-sm text-gray-700 leading-relaxed line-clamp-6">{viewNote.content}</p></div>}
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default NotesManagement;
