// src/features/admin/pages/AnalyticsDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { BarChart3, AlertCircle, RefreshCw, Activity, Server } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { SkeletonChart } from '../components/SkeletonLoader';

const LineChart = ({ data = [], color = '#6366f1', label = '' }) => {
  if (!data.length) return <p className="text-sm text-slate-500 py-8 text-center">No data</p>;
  const vals = data.map(d => d.count ?? d.value ?? 0);
  const max = Math.max(...vals, 1); const min = Math.min(...vals);
  const range = max - min || 1;
  const W = 500, H = 140, PX = 30, PY = 15;
  const cW = W - PX * 2, cH = H - PY * 2;
  const pts = vals.map((v, i) => ({ x: PX + (i / (vals.length - 1 || 1)) * cW, y: PY + cH - ((v - min) / range) * cH }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${PX + cW},${PY + cH} L${PX},${PY + cH} Z`;
  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs><linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0.01" /></linearGradient></defs>
        {[0, 0.5, 1].map((f, i) => { const y = PY + cH * (1 - f); return <line key={i} x1={PX} y1={y} x2={PX + cW} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />; })}
        {data.filter((_, i) => i === 0 || i === data.length - 1).map((d, idx) => {
          const oi = idx === 0 ? 0 : data.length - 1;
          return <text key={oi} x={PX + (oi / (vals.length - 1 || 1)) * cW} y={H - 2} textAnchor="middle" fontSize="8" fill="#64748b">{d.label ?? d.date ?? d.month ?? ''}</text>;
        })}
        <path d={area} fill={`url(#g-${label})`} /><path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {[0, pts.length - 1].map(i => pts[i] ? <circle key={i} cx={pts[i].x} cy={pts[i].y} r="4" fill="#1e2030" stroke={color} strokeWidth="2" /> : null)}
      </svg>
    </div>
  );
};

const BarChartH = ({ data = [], colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }) => {
  if (!data.length) return <p className="text-sm text-slate-500 py-8 text-center">No data</p>;
  const max = Math.max(...data.map(d => d.usage ?? d.count ?? d.value ?? 0), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const val = d.usage ?? d.count ?? d.value ?? 0;
        const pct = (val / max) * 100;
        return (
          <div key={d.name || i}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-300">{d.name ?? d.feature ?? `Item ${i + 1}`}</span>
              <span className="text-sm font-bold text-white">{val.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [daily, featureUsage, topFeatures, systemHealth] = await Promise.allSettled([
        adminService.analytics.getDailyUsers(),
        adminService.analytics.getFeatureUsage(),
        adminService.analytics.getTopFeatures(),
        adminService.analytics.getSystemHealth(),
      ]);
      setData({
        daily: daily.status === 'fulfilled' ? (daily.value.data ?? daily.value) : [],
        featureUsage: featureUsage.status === 'fulfilled' ? (featureUsage.value.data ?? featureUsage.value) : [],
        topFeatures: topFeatures.status === 'fulfilled' ? (topFeatures.value.data?.features ?? topFeatures.value.data ?? topFeatures.value) : [],
        systemHealth: systemHealth.status === 'fulfilled' ? (systemHealth.value.data ?? systemHealth.value) : null,
      });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1, 2, 3, 4].map(i => <SkeletonChart key={i} />)}</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle className="w-8 h-8 text-red-400" /><p className="text-sm text-slate-400">{error}</p>
      <button onClick={fetchAll} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
    </div>
  );

  const dailyList = Array.isArray(data.daily) ? data.daily : [];
  const featureList = Array.isArray(data.featureUsage) ? data.featureUsage : [];
  const topList = Array.isArray(data.topFeatures) ? data.topFeatures : [];
  const health = data.systemHealth;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Analytics</h2><p className="text-sm text-slate-400">Platform usage insights</p></div>
        <button onClick={fetchAll} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><RefreshCw className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-indigo-400" /><h3 className="text-lg font-bold text-white">Daily Active Users</h3></div>
          <LineChart data={dailyList} color="#6366f1" label="dau" />
        </div>

        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-cyan-400" /><h3 className="text-lg font-bold text-white">Feature Usage</h3></div>
          <BarChartH data={featureList} />
        </div>

        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-emerald-400" /><h3 className="text-lg font-bold text-white">Top Features</h3></div>
          <BarChartH data={topList} colors={['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444']} />
        </div>

        {health && (
          <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4"><Server className="w-5 h-5 text-amber-400" /><h3 className="text-lg font-bold text-white">System Health</h3></div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(health).filter(([, v]) => typeof v !== 'object' || v === null).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-xs text-slate-500 capitalize mb-1">{k.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-bold text-white">{typeof v === 'number' ? v.toLocaleString() : String(v ?? '—')}</p>
                </div>
              ))}
              {health.database && (
                <>
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <p className="text-xs text-slate-500 mb-1">Database Status</p>
                    <p className={`text-sm font-bold ${health.database.status === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>{health.database.status}</p>
                  </div>
                </>
              )}
              {health.server && (
                <>
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <p className="text-xs text-slate-500 mb-1">Uptime</p>
                    <p className="text-sm font-bold text-white">{health.server.uptimeFormatted || `${health.server.uptime}s`}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <p className="text-xs text-slate-500 mb-1">Memory (Heap)</p>
                    <p className="text-sm font-bold text-white">{health.server.memory?.heapUsed || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <p className="text-xs text-slate-500 mb-1">Node Version</p>
                    <p className="text-sm font-bold text-white">{health.server.nodeVersion || '—'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
