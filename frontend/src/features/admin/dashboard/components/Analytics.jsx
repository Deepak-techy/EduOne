// src/features/admin/dashboard/components/Analytics.jsx
import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Loader2, BarChart2 } from 'lucide-react';
import { adminService } from '../../../../services/adminService';

const WeeklyActivityChart = ({ data = [] }) => {
    if (!data.length) return null;
    const values = data.map((d) => d.count ?? d.value ?? 0);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;
    const width = 600; const height = 160; const padX = 40; const padY = 20;
    const chartW = width - padX * 2; const chartH = height - padY * 2;

    const points = values.map((v, i) => ({
        x: padX + (i / (values.length - 1 || 1)) * chartW,
        y: padY + chartH - ((v - minVal) / range) * chartH,
    }));
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${padX + chartW},${padY + chartH} L${padX},${padY + chartH} Z`;

    return (
        <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="waGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {[0, 0.5, 1].map((frac, i) => {
                    const y = padY + chartH * (1 - frac);
                    return <line key={i} x1={padX} y1={y} x2={padX + chartW} y2={y}
                        stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-slate-700" />;
                })}
                {data.map((d, i) => {
                    const x = padX + (i / (values.length - 1 || 1)) * chartW;
                    return <text key={i} x={x} y={height - 3} textAnchor="middle"
                        fontSize="9" className="fill-gray-400 dark:fill-slate-500">
                        {d.label ?? d.date ?? `W${i + 1}`}
                    </text>;
                })}
                <path d={areaPath} fill="url(#waGrad)" />
                <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4"
                        fill="white" stroke="#06b6d4" strokeWidth="2" />
                ))}
            </svg>
        </div>
    );
};

const FeatureBarChart = ({ features = [] }) => {
    if (!features.length) return null;
    const maxVal = Math.max(...features.map((f) => f.usage ?? f.count ?? 0), 1);
    const colors = ['bg-blue-500', 'bg-cyan-400', 'bg-teal-400', 'bg-purple-400', 'bg-orange-400', 'bg-green-400'];

    return (
        <div className="space-y-3">
            {features.map((f, i) => {
                const val = f.usage ?? f.count ?? 0;
                const pct = (val / maxVal) * 100;
                return (
                    <div key={f.name ?? i}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{f.name ?? f.feature ?? `Feature ${i + 1}`}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{val.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getAnalytics();
            setData(res.data ?? res);
        } catch (err) {
            setError(err.message ?? 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500 dark:text-slate-400">{error}</p>
            <button onClick={fetchData}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer">
                Retry
            </button>
        </div>
    );

    const featureUsage = data?.featureUsage ?? data?.features ?? [];
    const weeklyActivity = data?.weeklyActivity ?? data?.weekly ?? [];

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Platform usage insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Feature Usage chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feature Usage</h3>
                    </div>
                    {featureUsage.length ? (
                        <FeatureBarChart features={featureUsage} />
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-slate-500 py-8 text-center">No feature data</p>
                    )}
                </div>

                {/* Weekly Activity chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Weekly Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Active sessions per week</p>
                    {weeklyActivity.length ? (
                        <WeeklyActivityChart data={weeklyActivity} />
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-slate-500 py-8 text-center">No activity data</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
