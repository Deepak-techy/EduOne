import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, growth, iconColor = 'blue' }) => {
    const isPositive = growth && growth.startsWith('+');

    const colorMap = {
        blue: 'from-blue-400 to-blue-500',
        cyan: 'from-cyan-400 to-cyan-500',
        teal: 'from-teal-400 to-teal-500',
        green: 'from-green-400 to-green-500',
        orange: 'from-orange-400 to-orange-500',
        purple: 'from-purple-400 to-purple-500',
    };

    const bgColorMap = {
        blue: 'bg-blue-50 dark:bg-blue-900/30',
        cyan: 'bg-cyan-50 dark:bg-cyan-900/30',
        teal: 'bg-teal-50 dark:bg-teal-900/30',
        green: 'bg-green-50 dark:bg-green-900/30',
        orange: 'bg-orange-50 dark:bg-orange-900/30',
        purple: 'bg-purple-50 dark:bg-purple-900/30',
    };

    const textColorMap = {
        blue: 'text-blue-600 dark:text-blue-400',
        cyan: 'text-cyan-600 dark:text-cyan-400',
        teal: 'text-teal-600 dark:text-teal-400',
        green: 'text-green-600 dark:text-green-400',
        orange: 'text-orange-600 dark:text-orange-400',
        purple: 'text-purple-600 dark:text-purple-400',
    };

    return (
        <div className="group relative transform transition-all duration-300 hover:-translate-y-1 animate-fade-in">
            {/* Glow on hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorMap[iconColor]} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`} />

            {/* Card */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div className={`${bgColorMap[iconColor]} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`w-6 h-6 ${textColorMap[iconColor]}`} strokeWidth={2.5} />
                    </div>

                    {growth && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {growth}
                        </div>
                    )}
                </div>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{title}</p>
            </div>
        </div>
    );
};

export default StatsCard;
