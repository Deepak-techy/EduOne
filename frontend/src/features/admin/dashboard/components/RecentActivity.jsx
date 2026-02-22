// src/features/admin/dashboard/components/RecentActivity.jsx
import { FileText, BookOpen, Megaphone, UserPlus, Upload, Activity } from 'lucide-react';

const iconMap = {
    upload: Upload,
    note: BookOpen,
    announcement: Megaphone,
    resume: FileText,
    register: UserPlus,
    default: Activity,
};

const colorMap = {
    upload: 'from-blue-400 to-blue-500',
    note: 'from-cyan-400 to-cyan-500',
    announcement: 'from-teal-400 to-teal-500',
    resume: 'from-purple-400 to-purple-500',
    register: 'from-green-400 to-green-500',
    default: 'from-gray-400 to-gray-500',
};

const RecentActivity = ({ activities = [] }) => {
    if (!activities.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col items-center justify-center gap-2">
                <Activity className="w-8 h-8 text-gray-300 dark:text-slate-600" />
                <p className="text-sm text-gray-400 dark:text-slate-500">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Recent Activity</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">Latest platform actions</p>

            <div className="space-y-3">
                {activities.map((activity, idx) => {
                    const type = activity.type ?? 'default';
                    const Icon = iconMap[type] ?? iconMap.default;
                    const color = colorMap[type] ?? colorMap.default;
                    return (
                        <div
                            key={activity._id ?? activity.id ?? idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-slate-700/40 hover:bg-blue-50/60 dark:hover:bg-slate-700/70 transition-colors duration-200"
                        >
                            <div className={`flex-shrink-0 w-9 h-9 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-sm`}>
                                <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                                    {activity.user ?? activity.actor ?? 'System'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                                    {activity.action ?? activity.description ?? ''}
                                </p>
                            </div>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
                                {activity.time ?? activity.timeAgo ?? ''}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivity;
