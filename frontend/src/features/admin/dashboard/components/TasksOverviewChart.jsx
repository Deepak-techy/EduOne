// src/features/admin/dashboard/components/TasksOverviewChart.jsx
const TasksOverviewChart = ({ completed = 0, pending = 0 }) => {
    const total = completed + pending || 1;
    const completedPct = Math.round((completed / total) * 100);
    const pendingPct = 100 - completedPct;

    // SVG donut
    const cx = 80;
    const cy = 80;
    const r = 60;
    const stroke = 14;
    const circ = 2 * Math.PI * r;
    const completedDash = (completedPct / 100) * circ;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 h-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tasks Overview</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Completed vs Pending (7 days)</p>
            </div>

            <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="flex-shrink-0">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        {/* Background ring */}
                        <circle cx={cx} cy={cy} r={r} fill="none"
                            stroke="#e5e7eb" strokeWidth={stroke}
                            className="dark:stroke-slate-700" />
                        {/* Completed arc */}
                        <circle cx={cx} cy={cy} r={r} fill="none"
                            stroke="#3b82f6" strokeWidth={stroke}
                            strokeDasharray={`${completedDash} ${circ}`}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${cx} ${cy})`}
                            style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                        {/* Pending arc */}
                        <circle cx={cx} cy={cy} r={r} fill="none"
                            stroke="#06b6d4" strokeWidth={stroke}
                            strokeDasharray={`${(pendingPct / 100) * circ} ${circ}`}
                            strokeLinecap="round"
                            transform={`rotate(${-90 + (completedPct / 100) * 360} ${cx} ${cy})`}
                            style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                        {/* Center text */}
                        <text x={cx} y={cy - 6} textAnchor="middle"
                            fontSize="22" fontWeight="700" className="fill-gray-900 dark:fill-white"
                            style={{ fill: 'currentColor' }}>
                            {completedPct}%
                        </text>
                        <text x={cx} y={cy + 14} textAnchor="middle"
                            fontSize="10" className="fill-gray-500 dark:fill-slate-400"
                            style={{ fill: '#6b7280' }}>
                            done
                        </text>
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{completed.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Completed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{pending.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Pending</p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Total</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksOverviewChart;
