// src/features/admin/pages/ReportsManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Flag, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-toastify';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import AdminModal from '../components/AdminModal';
import { SkeletonTable } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 12;

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [acting, setActing] = useState(null);
  const [viewReport, setViewReport] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminService.community.getReports({ limit: 1000 });
      const payload = res.data ?? res;
      const list = payload?.reports ?? payload ?? [];
      setReports(Array.isArray(list) ? list : []);
    } catch (err) { setError(err.message ?? 'Failed'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || (r.reason || '').toLowerCase().includes(q) || (r.reporterId?.fullName || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || (r.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleResolve = async (id) => {
    setActing(id);
    try { await adminService.community.resolveReport(id); setReports(p => p.map(r => (r._id || r.id) === id ? { ...r, status: 'Resolved' } : r)); toast.success('Report resolved'); }
    catch (e) { toast.error(e?.message || e?.data?.message || 'Failed to resolve report'); } finally { setActing(null); }
  };

  const handleReject = async (id) => {
    setActing(id);
    try { await adminService.community.rejectReport(id); setReports(p => p.map(r => (r._id || r.id) === id ? { ...r, status: 'Rejected' } : r)); toast.success('Report rejected'); }
    catch (e) { toast.error(e?.message || e?.data?.message || 'Failed to reject report'); } finally { setActing(null); }
  };

  if (loading) return <SkeletonTable rows={6} />;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-gray-500">{error}</p>
      <button onClick={fetchReports} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      <SearchFilterBar searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }} placeholder="Search reports…"
        filters={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'resolved', label: 'Resolved' }, { value: 'rejected', label: 'Rejected' }] }]}
        activeFilters={{ status: statusFilter }} onFilterChange={(_, v) => { setStatusFilter(v); setPage(1); }} onClearFilters={() => setStatusFilter('all')}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={Flag} title="No reports" description="No reports to display." action={fetchReports} actionLabel="Refresh" />
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  {['Reporter', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {paged.map(report => {
                    const rid = report._id || report.id;
                    const reporter = report.reporterId?.fullName || report.reporter || '—';
                    const status = report.status || 'Pending';
                    const isPending = status.toLowerCase() === 'pending';
                    return (
                      <tr key={rid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{reporter}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-700">{report.reason || '—'}</span></td>
                        <td className="px-5 py-4"><StatusBadge status={status} /></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-400 whitespace-nowrap">{report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewReport(report)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-900 cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                            {isPending && (
                              <>
                                <button onClick={() => handleResolve(rid)} disabled={acting === rid}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-500/20 cursor-pointer disabled:opacity-50">
                                  <CheckCircle className="w-3.5 h-3.5" />Resolve
                                </button>
                                <button onClick={() => handleReject(rid)} disabled={acting === rid}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 cursor-pointer disabled:opacity-50">
                                  <XCircle className="w-3.5 h-3.5" />Reject
                                </button>
                              </>
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
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}

      <AdminModal open={!!viewReport} onClose={() => setViewReport(null)} title="Report Details" icon={Flag}>
        {viewReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-400 mb-1">Reporter</p><p className="text-sm text-gray-900 font-semibold">{viewReport.reporterId?.fullName || '—'}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Status</p><StatusBadge status={viewReport.status || 'Pending'} /></div>
              <div><p className="text-xs text-gray-400 mb-1">Reason</p><p className="text-sm text-gray-700">{viewReport.reason || '—'}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Date</p><p className="text-sm text-gray-700">{viewReport.createdAt ? new Date(viewReport.createdAt).toLocaleString() : '—'}</p></div>
            </div>
            {viewReport.description && <div><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-gray-700 leading-relaxed">{viewReport.description}</p></div>}
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default ReportsManagement;
