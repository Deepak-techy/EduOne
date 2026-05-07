// src/features/admin/pages/DashboardOverview.jsx
import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, GraduationCap, BookOpen, MessageSquare, FileText, CalendarCheck, CheckCircle2, Flag, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { adminService } from '../../../services/adminService';

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminService.auth.getDashboardOverview();
      setData(res.data ?? res);
    } catch (err) {
      setError(err.message ?? 'Failed to load dashboard');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetch} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />Retry
      </button>
    </div>
  );

  const u = data?.users || {};
  const c = data?.community || {};
  const f = data?.features || {};
  const m = data?.moderation || {};

  const stats = [
    { title: 'Total Users', value: u.total ?? 0, icon: Users, color: 'blue' },
    { title: 'Active Users', value: u.active ?? 0, icon: UserCheck, color: 'green' },
    { title: 'Suspended', value: u.suspended ?? 0, icon: UserX, color: 'orange' },
    { title: 'Students', value: u.students ?? 0, icon: GraduationCap, color: 'cyan' },
    { title: 'Teachers', value: u.teachers ?? 0, icon: BookOpen, color: 'purple' },
    { title: 'New (7 days)', value: u.recentRegistrations ?? 0, icon: UserCheck, color: 'teal', subtitle: 'Recent registrations' },
    { title: 'Total Posts', value: c.totalPosts ?? 0, icon: MessageSquare, color: 'blue' },
    { title: 'Comments', value: c.totalComments ?? 0, icon: MessageSquare, color: 'cyan' },
    { title: 'Total Notes', value: f.totalNotes ?? 0, icon: FileText, color: 'purple' },
    { title: 'Total Tasks', value: f.totalTasks ?? 0, icon: CalendarCheck, color: 'amber' },
    { title: 'Completion Rate', value: `${f.taskCompletionRate ?? 0}%`, icon: CheckCircle2, color: 'green' },
    { title: 'Pending Reports', value: m.pendingReports ?? 0, icon: Flag, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Overview</h2>
          <p className="text-sm text-slate-400">Real-time platform statistics</p>
        </div>
        <button onClick={fetch} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(s => <AdminStatsCard key={s.title} {...s} />)}
      </div>
    </div>
  );
};

export default DashboardOverview;
