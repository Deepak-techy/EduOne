// src/features/admin/dashboard/components/FeatureUsage.jsx
import { FileText, BookOpen, Briefcase, Mic, Calendar, Users, BarChart2 } from 'lucide-react';

const iconByName = {
    'PDF Q&A': FileText,
    'Notes Organizer': BookOpen,
    'Resume Analyzer': Briefcase,
    'Interview AI': Mic,
    'Academic Planner': Calendar,
    'Community': Users,
    default: BarChart2,
};

const palettes = [
    { color: 'from-blue-400 to-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    { color: 'from-cyan-400 to-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
    { color: 'from-teal-400 to-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
    { color: 'from-purple-400 to-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    { color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    { color: 'from-green-400 to-green-500', bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
];

const FeatureUsage = ({ features = [] }) => {
    if (!features.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center h-64">
                <p className="text-sm text-gray-400 dark:text-slate-500">No usage data available</p>
            </div>
        );
    }

    const maxUsage = Math.max(...features.map((f) => f.usage ?? f.count ?? 0), 1);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Top Feature Usage</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Active usage across features</p>

            <div className="space-y-5">
                {features.map((feature, idx) => {
                    const palette = palettes[idx % palettes.length];
                    const name = feature.name ?? feature.feature ?? `Feature ${idx + 1}`;
                    const Icon = iconByName[name] ?? iconByName.default;
                    const rawVal = feature.usage ?? feature.count ?? 0;
                    const pct = Math.round((rawVal / maxUsage) * 100);

                    return (
                        <div key={name}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className={`${palette.bg} p-1.5 rounded-lg`}>
                                        <Icon className={`w-4 h-4 ${palette.text}`} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{name}</span>
                                </div>
                                <span className={`text-sm font-bold ${palette.text}`}>
                                    {typeof rawVal === 'number' && rawVal > 100
                                        ? rawVal.toLocaleString()
                                        : `${rawVal}%`}
                                </span>
                            </div>
                            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${palette.color} rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeatureUsage;
