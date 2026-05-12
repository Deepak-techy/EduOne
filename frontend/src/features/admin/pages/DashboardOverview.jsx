// src/features/admin/pages/DashboardOverview.jsx
import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, GraduationCap, BookOpen, MessageSquare, FileText, CalendarCheck, CheckCircle2, Flag, AlertCircle, RefreshCw, TrendingUp, Activity, Zap, Shield } from 'lucide-react';
import { SkeletonCard } from '../components/SkeletonLoader';
import { adminService } from '../../../services/adminService';

// Animated counter component
const AnimatedValue = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const numericVal = typeof value === 'string' ? parseInt(value) || 0 : (typeof value === 'number' ? value : 0);
  const isPercentage = typeof value === 'string' && value.includes('%');

  useEffect(() => {
    if (numericVal === 0) { setDisplay(0); return; }
    let start = 0;
    const increment = numericVal / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericVal) { setDisplay(numericVal); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [numericVal, duration]);

  return <>{display.toLocaleString()}{isPercentage ? '%' : ''}</>;
};

// Large hero stat card
const HeroCard = ({ title, value, icon: Icon, gradient, subtitle, delay = 0 }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 border border-white/10 group hover:border-white/20 transition-all duration-500 hover:-translate-y-1 cursor-default"
    style={{ background: gradient, animationDelay: `${delay}ms` }}
  >
    {/* Animated background circles */}
    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-700" />
    <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700 delay-100" />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-sm">
          <Activity className="w-3 h-3" />
          Live
        </div>
      </div>
      <h3 className="text-4xl font-black text-white mb-1 tracking-tight">
        <AnimatedValue value={value} />
      </h3>
      <p className="text-sm font-medium text-white/80">{title}</p>
      {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// Standard stat card with ring progress
const StatCard = ({ title, value, icon: Icon, color, subtitle, maxVal, delay = 0 }) => {
  const colors = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: '#3b82f6', glow: 'group-hover:shadow-blue-500/10' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: '#10b981', glow: 'group-hover:shadow-emerald-500/10' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', ring: '#f97316', glow: 'group-hover:shadow-orange-500/10' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', ring: '#06b6d4', glow: 'group-hover:shadow-cyan-500/10' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: '#8b5cf6', glow: 'group-hover:shadow-purple-500/10' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', ring: '#14b8a6', glow: 'group-hover:shadow-teal-500/10' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: '#f59e0b', glow: 'group-hover:shadow-amber-500/10' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', ring: '#ec4899', glow: 'group-hover:shadow-pink-500/10' },
  };
  const c = colors[color] || colors.blue;
  const numericVal = typeof value === 'string' ? parseInt(value) || 0 : (typeof value === 'number' ? value : 0);
  const pct = maxVal ? Math.min((numericVal / maxVal) * 100, 100) : null;
  const circumference = 2 * Math.PI * 18;

  return (
    <div className={`group relative bg-[#1e2030] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow} cursor-default`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-5 h-5 ${c.text}`} strokeWidth={2.5} />
        </div>
        {pct !== null && (
          <svg width="44" height="44" className="transform -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18" fill="none" stroke={c.ring} strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="9" fontWeight="bold" className="rotate-90 origin-center">
              {Math.round(pct)}%
            </text>
          </svg>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-0.5 tracking-tight">
        <AnimatedValue value={value} />
      </h3>
      <p className="text-xs text-slate-400 font-medium">{title}</p>
      {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}

      {/* Hover shine effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)' }}
      />
    </div>
  );
};

// Section header component
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
  </div>
);

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminService.auth.getDashboardOverview();
      setData(res.data ?? res);
      setLastUpdated(new Date());
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Overview</h2>
          <p className="text-sm text-slate-400">
            Real-time platform statistics
            {lastUpdated && <span className="ml-2 text-slate-500">· Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={fetch} className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-300 cursor-pointer group" title="Refresh">
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Hero Cards - Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <HeroCard
          title="Total Users"
          value={u.total ?? 0}
          icon={Users}
          gradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)"
          subtitle="All registered accounts"
          delay={0}
        />
        <HeroCard
          title="Active Users"
          value={u.active ?? 0}
          icon={Zap}
          gradient="linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #0ea5e9 100%)"
          subtitle="Currently active accounts"
          delay={100}
        />
        <HeroCard
          title="Pending Reports"
          value={m.pendingReports ?? 0}
          icon={Shield}
          gradient={m.pendingReports > 0
            ? "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)"
            : "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
          }
          subtitle={m.pendingReports > 0 ? "Needs attention" : "All clear"}
          delay={200}
        />
      </div>

      {/* User Breakdown Section */}
      <div>
        <SectionHeader icon={Users} title="User Breakdown" color="bg-blue-600" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Students" value={u.students ?? 0} icon={GraduationCap} color="cyan" maxVal={u.total || 1} />
          <StatCard title="Teachers" value={u.teachers ?? 0} icon={BookOpen} color="purple" maxVal={u.total || 1} />
          <StatCard title="Suspended" value={u.suspended ?? 0} icon={UserX} color="orange" maxVal={u.total || 1} />
          <StatCard title="New (7 days)" value={u.recentRegistrations ?? 0} icon={TrendingUp} color="teal" subtitle="Recent registrations" />
        </div>
      </div>

      {/* Community Section */}
      <div>
        <SectionHeader icon={MessageSquare} title="Community" color="bg-cyan-600" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Posts" value={c.totalPosts ?? 0} icon={MessageSquare} color="blue" />
          <StatCard title="Comments" value={c.totalComments ?? 0} icon={MessageSquare} color="cyan" />
        </div>
      </div>

      {/* Features Section */}
      <div>
        <SectionHeader icon={Zap} title="Features" color="bg-purple-600" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Notes" value={f.totalNotes ?? 0} icon={FileText} color="purple" />
          <StatCard title="Total Tasks" value={f.totalTasks ?? 0} icon={CalendarCheck} color="amber" />
          <StatCard
            title="Task Completion"
            value={`${f.taskCompletionRate ?? 0}%`}
            icon={CheckCircle2}
            color="green"
            maxVal={100}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
