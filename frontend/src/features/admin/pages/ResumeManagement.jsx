// src/features/admin/pages/ResumeManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { FileCheck, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminStatsCard from '../components/AdminStatsCard';
import { SkeletonTable, SkeletonCard } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 12;

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [rRes, sRes] = await Promise.allSettled([adminService.resumes.getAll({ limit: 1000 }), adminService.resumes.getStats()]);
      if (rRes.status === 'fulfilled') { const payload = rRes.value.data ?? rRes.value; const l = payload?.resumes ?? payload ?? []; setResumes(Array.isArray(l) ? l : []); }
      if (sRes.status === 'fulfilled') { const s = sRes.value.data ?? sRes.value; setStats(s?.overview ?? s); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = resumes.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (r.userId?.fullName || r.fullName || '').toLowerCase().includes(q) || (r.jobRole || '').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    setDeleting(id); setConfirmDel(null);
    try { await adminService.resumes.delete(id); setResumes(p => p.filter(r => (r._id || r.id) !== id)); toast.success('Resume deleted'); }
    catch (e) { toast.error(e.message); } finally { setDeleting(null); }
  };

  if (loading) return <div className="space-y-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div><SkeletonTable rows={6} /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3"><AlertCircle className="w-8 h-8 text-red-400" /><p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button></div>
  );

  return (
    <div className="space-y-5">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatsCard title="Total Resumes" value={stats.totalResumes ?? resumes.length} icon={FileCheck} color="blue" />
          <AdminStatsCard title="This Week" value={stats.thisWeek ?? 0} icon={FileCheck} color="green" />
          <AdminStatsCard title="Avg Score" value={stats.avgOverallScore ?? stats.avgScore ?? '—'} icon={FileCheck} color="purple" />
        </div>
      )}

      <SearchFilterBar searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} placeholder="Search resumes by owner…" />

      {filtered.length === 0 ? (
        <EmptyState icon={FileCheck} title="No resumes" description="No resumes to display." action={fetchData} actionLabel="Refresh" />
      ) : (
        <>
          <div className="bg-[#1e2030] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-white/5 bg-white/[0.02]">
                  {['Owner', 'Job Role', 'Score', 'Created', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {paged.map(resume => {
                    const rid = resume._id || resume.id;
                    const owner = resume.userId?.fullName || resume.fullName || '—';
                    return (
                      <tr key={rid} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4"><span className="text-sm font-semibold text-white">{owner}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-slate-400">{resume.jobRole || '—'}</span></td>
                        <td className="px-5 py-4"><span className="text-sm font-bold text-blue-400">{resume.analysisResult?.overallScore ?? '—'}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-slate-500 whitespace-nowrap">{resume.createdAt ? new Date(resume.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></td>
                        <td className="px-5 py-4">
                          <button onClick={() => setConfirmDel(rid)} disabled={deleting === rid}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 cursor-pointer disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />Delete
                          </button>
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
        title="Delete this resume?" description="This will permanently remove this resume." confirmText="Delete" variant="danger" loading={!!deleting} />
    </div>
  );
};

export default ResumeManagement;
