// src/features/admin/pages/TasksMonitoring.jsx
import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Trash2, AlertCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminStatsCard from '../components/AdminStatsCard';
import { SkeletonTable, SkeletonCard } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 12;

const TasksMonitoring = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [tRes, sRes] = await Promise.allSettled([adminService.tasks.getAll(), adminService.tasks.getStats()]);
      if (tRes.status === 'fulfilled') { const payload = tRes.value.data ?? tRes.value; const l = payload?.tasks ?? payload ?? []; setTasks(Array.isArray(l) ? l : []); }
      if (sRes.status === 'fulfilled') { const s = sRes.value.data ?? sRes.value; setStats(s?.overview ?? s); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || (t.subject || '').toLowerCase().includes(q) || (t.task || '').toLowerCase().includes(q) || (t.userId?.fullName || t.owner?.fullName || '').toLowerCase().includes(q);
    const completed = t.isCompleted || t.status === 'completed';
    const matchStatus = statusFilter === 'all' || (statusFilter === 'completed' && completed) || (statusFilter === 'pending' && !completed);
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    setDeleting(id); setConfirmDel(null);
    try { await adminService.tasks.delete(id); setTasks(p => p.filter(t => (t._id || t.id) !== id)); toast.success('Task deleted'); }
    catch (e) { toast.error(e.message); } finally { setDeleting(null); }
  };

  if (loading) return <div className="space-y-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div><SkeletonTable rows={6} /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3"><AlertCircle className="w-8 h-8 text-red-400" /><p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button></div>
  );

  return (
    <div className="space-y-5">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatsCard title="Total Tasks" value={stats.totalTasks ?? tasks.length} icon={CalendarCheck} color="amber" />
          <AdminStatsCard title="Completed" value={stats.completedTasks ?? 0} icon={CheckCircle2} color="green" />
          <AdminStatsCard title="Completion Rate" value={`${stats.completionRate ?? 0}%`} icon={Clock} color="cyan" />
        </div>
      )}

      <SearchFilterBar searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} placeholder="Search tasks…"
        filters={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All' }, { value: 'completed', label: 'Completed' }, { value: 'pending', label: 'Pending' }] }]}
        activeFilters={{ status: statusFilter }} onFilterChange={(_, v) => { setStatusFilter(v); setPage(1); }} onClearFilters={() => setStatusFilter('all')}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No tasks" description="No tasks to display." action={fetchData} actionLabel="Refresh" />
      ) : (
        <>
          <div className="bg-[#1e2030] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-white/5 bg-white/[0.02]">
                  {['Task', 'Owner', 'Priority', 'Status', 'Due Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {paged.map(task => {
                    const tid = task._id || task.id;
                    const owner = task.userId?.fullName || task.owner?.fullName || '—';
                    const completed = task.isCompleted || task.status === 'completed';
                    const priority = task.priority || 'Medium';
                    const prioColor = priority.toLowerCase() === 'high' ? 'text-red-400 bg-red-500/10' : priority.toLowerCase() === 'low' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10';
                    return (
                      <tr key={tid} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4"><span className="text-sm font-semibold text-white">{task.subject || task.task || 'Untitled'}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-slate-400">{owner}</span></td>
                        <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${prioColor}`}>{priority}</span></td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {completed ? <><CheckCircle2 className="w-3 h-3" />Done</> : <><Clock className="w-3 h-3" />Pending</>}
                          </span>
                        </td>
                        <td className="px-5 py-4"><span className="text-sm text-slate-500 whitespace-nowrap">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</span></td>
                        <td className="px-5 py-4">
                          <button onClick={() => setConfirmDel(tid)} disabled={deleting === tid}
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
        title="Delete this task?" description="This will permanently remove this task." confirmText="Delete" variant="danger" loading={!!deleting} />
    </div>
  );
};

export default TasksMonitoring;
