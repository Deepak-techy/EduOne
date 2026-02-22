// src/features/admin/dashboard/components/DailyActiveUsersChart.jsx
const DailyActiveUsersChart = ({ data = [] }) => {
    if (!data.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center h-64">
                <p className="text-sm text-gray-400 dark:text-slate-500">No data available</p>
            </div>
        );
    }

    const values = data.map((d) => d.count ?? d.value ?? 0);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    const width = 600;
    const height = 200;
    const padX = 40;
    const padY = 20;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const points = values.map((v, i) => {
        const x = padX + (i / (values.length - 1 || 1)) * chartW;
        const y = padY + chartH - ((v - minVal) / range) * chartH;
        return { x, y, v };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${padX + chartW},${padY + chartH} L${padX},${padY + chartH} Z`;

    const gridFracs = [0, 0.25, 0.5, 0.75, 1];

    const labels = data
        .filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1)
        .map((d, idx) => {
            const origIdx = idx === 0 ? 0 : idx === 1 ? Math.floor(data.length / 2) : data.length - 1;
            return { label: d.date ?? d.label ?? `Day ${origIdx + 1}`, idx: origIdx };
        });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Active Users</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Last {data.length} days</p>
            </div>
            <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {gridFracs.map((frac, i) => {
                        const y = padY + chartH * (1 - frac);
                        const val = Math.round(minVal + range * frac);
                        return (
                            <g key={i}>
                                <line x1={padX} y1={y} x2={padX + chartW} y2={y}
                                    stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4"
                                    className="dark:stroke-slate-700" />
                                <text x={padX - 6} y={y + 4} textAnchor="end"
                                    fontSize="9" className="fill-gray-400 dark:fill-slate-500">{val}</text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {labels.map(({ label, idx }) => {
                        const x = padX + (idx / (values.length - 1 || 1)) * chartW;
                        return (
                            <text key={idx} x={x} y={height - 3} textAnchor="middle"
                                fontSize="9" className="fill-gray-400 dark:fill-slate-500">{label}</text>
                        );
                    })}

                    <path d={areaPath} fill="url(#dauGradient)" />
                    <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" />

                    {/* Dots at endpoints */}
                    {[0, Math.floor(points.length / 2), points.length - 1].map((i) => {
                        const p = points[i];
                        return p ? (
                            <circle key={i} cx={p.x} cy={p.y} r="5"
                                fill="white" stroke="#3b82f6" strokeWidth="2.5" />
                        ) : null;
                    })}
                </svg>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 text-center">
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{Math.max(...values).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Peak</p>
                </div>
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                        {Math.round(values.reduce((a, b) => a + b, 0) / values.length).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Average</p>
                </div>
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{values[values.length - 1].toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Latest</p>
                </div>
            </div>
        </div>
    );
};

export default DailyActiveUsersChart;
