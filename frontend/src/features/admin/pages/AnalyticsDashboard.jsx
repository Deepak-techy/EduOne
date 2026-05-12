// src/features/admin/pages/AnalyticsDashboard.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart3, AlertCircle, RefreshCw, Activity, Server, Clock, Database, Cpu, HardDrive, Globe } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { SkeletonChart } from '../components/SkeletonLoader';

// ─── Enhanced Interactive Line Chart ─────────────────────────────────────────
const LineChart = ({ data = [], color = '#6366f1', label = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data.length) return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <Activity className="w-8 h-8 text-slate-600" />
      <p className="text-sm text-slate-500">No activity data available</p>
    </div>
  );

  const vals = data.map(d => d.count ?? d.activeUsers ?? d.value ?? 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const total = vals.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / vals.length);

  const W = 560, H = 200, PX = 40, PY = 25, PB = 35;
  const cW = W - PX * 2, cH = H - PY - PB;

  const pts = vals.map((v, i) => ({
    x: PX + (i / (vals.length - 1 || 1)) * cW,
    y: PY + cH - ((v - min) / range) * cH,
    val: v,
  }));

  // Smooth curve path using cubic bezier
  const getPath = () => {
    if (pts.length < 2) return `M${pts[0].x},${pts[0].y}`;
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
      const cp2x = pts[i].x + 2 * (pts[i + 1].x - pts[i].x) / 3;
      d += ` C${cp1x},${pts[i].y} ${cp2x},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return d;
  };

  const linePath = getPath();
  const areaPath = `${linePath} L${PX + cW},${PY + cH} L${PX},${PY + cH} Z`;

  // Y-axis labels (5 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    val: Math.round(min + f * range),
    y: PY + cH * (1 - f),
  }));

  // X-axis labels - show up to 7 evenly spaced dates
  const maxLabels = Math.min(7, data.length);
  const xLabels = [];
  for (let i = 0; i < maxLabels; i++) {
    const idx = Math.round(i * (data.length - 1) / (maxLabels - 1 || 1));
    const d = data[idx];
    const dateStr = d.label ?? d.date ?? d.month ?? '';
    // Format date: "2025-05-10" -> "May 10"
    let formatted = dateStr;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const dt = new Date(dateStr + 'T00:00:00');
      formatted = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (dateStr.match(/^\d{4}-\d{2}$/)) {
      const dt = new Date(dateStr + '-01T00:00:00');
      formatted = dt.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    xLabels.push({ idx, x: PX + (idx / (vals.length - 1 || 1)) * cW, label: formatted });
  }

  const handleMouseMove = (e) => {
    if (!svgRef.current || !pts.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    let closestIdx = 0;
    let closestDist = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });
    setHoveredIdx(closestDist < 30 ? closestIdx : null);
  };

  return (
    <div>
      {/* Stats summary bar */}
      <div className="flex items-center gap-4 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-slate-400">Avg: <span className="text-white font-semibold">{avg}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Peak: <span className="text-white font-semibold">{max}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Total: <span className="text-white font-semibold">{total.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="w-full overflow-hidden relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={`area-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="70%" stopColor={color} stopOpacity="0.05" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PX} y1={t.y} x2={PX + cW} y2={t.y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,6" />
              <text x={PX - 8} y={t.y + 3} textAnchor="end" fontSize="9" fill="#475569" fontFamily="system-ui">{t.val}</text>
            </g>
          ))}

          {/* X-axis labels */}
          {xLabels.map((l, i) => (
            <g key={i}>
              <line x1={l.x} y1={PY + cH} x2={l.x} y2={PY + cH + 6} stroke="#334155" strokeWidth="1" />
              <text x={l.x} y={H - 8} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui">{l.label}</text>
            </g>
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#area-${label})`}
            className="transition-opacity duration-700"
            style={{ opacity: animated ? 1 : 0 }}
          />

          {/* Main line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
            style={{
              strokeDasharray: animated ? 'none' : '2000',
              strokeDashoffset: animated ? 0 : 2000,
            }}
          />

          {/* Glow line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.15"
            filter={`url(#glow-${label})`}
          />

          {/* Data point dots */}
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 6 : (data.length <= 14 ? 3 : 0)}
              fill={hoveredIdx === i ? '#1e2030' : color}
              stroke={color}
              strokeWidth={hoveredIdx === i ? 3 : 1.5}
              className="transition-all duration-200"
              style={{ opacity: animated ? 1 : 0 }}
            />
          ))}

          {/* Hover crosshair + tooltip */}
          {hoveredIdx !== null && pts[hoveredIdx] && (
            <g>
              <line x1={pts[hoveredIdx].x} y1={PY} x2={pts[hoveredIdx].x} y2={PY + cH} stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
              <rect
                x={Math.min(pts[hoveredIdx].x - 40, W - PX - 40)}
                y={pts[hoveredIdx].y - 36}
                width="80"
                height="28"
                rx="8"
                fill="#0f172a"
                stroke={color}
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x={Math.min(pts[hoveredIdx].x, W - PX)}
                y={pts[hoveredIdx].y - 18}
                textAnchor="middle"
                fontSize="11"
                fill="white"
                fontWeight="bold"
                fontFamily="system-ui"
              >
                {pts[hoveredIdx].val} users
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

// ─── Horizontal Bar Chart ────────────────────────────────────────────────────
const BarChartH = ({ data = [], colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  if (!data.length) return <p className="text-sm text-slate-500 py-8 text-center">No data</p>;
  const max = Math.max(...data.map(d => d.usage ?? d.count ?? d.value ?? 0), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const val = d.usage ?? d.count ?? d.value ?? 0;
        const pct = (val / max) * 100;
        return (
          <div key={d.name || d.feature || i} className="group">
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{d.name ?? d.feature ?? `Item ${i + 1}`}</span>
              <span className="text-sm font-bold text-white">{val.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  backgroundColor: colors[i % colors.length],
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Format timestamp to readable format ─────────────────────────────────────
const formatTimestamp = (ts) => {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

// ─── System Health Status Indicator ──────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isHealthy = status === 'Healthy' || status === 'Connected';
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
      isHealthy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
      {status}
    </div>
  );
};

// ─── System Health Card ──────────────────────────────────────────────────────
const HealthMetric = ({ icon: Icon, label, value, color = 'text-slate-300' }) => (
  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 group">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
    <p className="text-sm font-bold text-white group-hover:text-white/90 transition-colors">{value || '—'}</p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
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
      <button onClick={fetchAll} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-semibold cursor-pointer flex items-center gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
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
        <button onClick={fetchAll} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer group"><RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Active Users - Enhanced */}
        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Daily Active Users</h3>
                <p className="text-xs text-slate-500">Last 30 days activity</p>
              </div>
            </div>
            {dailyList.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{dailyList[dailyList.length - 1]?.activeUsers ?? dailyList[dailyList.length - 1]?.count ?? 0}</p>
                <p className="text-xs text-slate-500">Today</p>
              </div>
            )}
          </div>
          <LineChart data={dailyList} color="#6366f1" label="dau" />
        </div>

        {/* Feature Usage */}
        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Feature Usage</h3>
              <p className="text-xs text-slate-500">Content created per feature</p>
            </div>
          </div>
          <BarChartH data={featureList} />
        </div>

        {/* Top Features */}
        <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Top Features</h3>
              <p className="text-xs text-slate-500">Most popular by usage</p>
            </div>
          </div>
          <BarChartH data={topList} colors={['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444']} />
        </div>

        {/* System Health - Enhanced */}
        {health && (
          <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Server className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">System Health</h3>
                  <p className="text-xs text-slate-500">Infrastructure monitoring</p>
                </div>
              </div>
              <StatusBadge status={health.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Timestamp - formatted */}
              <HealthMetric icon={Clock} label="Last Checked" value={formatTimestamp(health.timestamp)} color="text-blue-400" />

              {/* Database */}
              {health.database && (
                <>
                  <HealthMetric icon={Database} label="Database Status" value={health.database.status} color="text-emerald-400" />
                  <HealthMetric icon={Database} label="Database Name" value={health.database.name} color="text-cyan-400" />
                  <HealthMetric icon={Globe} label="Database Host" value={health.database.host} color="text-slate-400" />
                </>
              )}

              {/* Server */}
              {health.server && (
                <>
                  <HealthMetric icon={Clock} label="Uptime" value={health.server.uptimeFormatted || `${health.server.uptime}s`} color="text-green-400" />
                  <HealthMetric icon={HardDrive} label="Memory (Heap)" value={health.server.memory?.heapUsed || '—'} color="text-amber-400" />
                  <HealthMetric icon={HardDrive} label="Heap Total" value={health.server.memory?.heapTotal || '—'} color="text-orange-400" />
                  <HealthMetric icon={Cpu} label="Node Version" value={health.server.nodeVersion || '—'} color="text-purple-400" />
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
