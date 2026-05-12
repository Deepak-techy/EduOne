// src/features/admin/components/AdminStatsCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react';

const GRADIENTS = {
  blue:   'from-blue-500 to-cyan-600',
  cyan:   'from-cyan-500 to-blue-600',
  purple: 'from-purple-500 to-indigo-600',
  green:  'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-red-500',
  pink:   'from-pink-500 to-rose-600',
  teal:   'from-teal-500 to-cyan-600',
  amber:  'from-amber-500 to-orange-600',
};

const AdminStatsCard = ({
  title,
  value,
  icon: Icon,
  growth,
  color = 'blue',
  subtitle,
}) => {
  const isPositive = growth && (typeof growth === 'string' ? growth.startsWith('+') : growth > 0);
  const gradient = GRADIENTS[color] || GRADIENTS.blue;

  return (
    <div className="group relative transform transition-all duration-300 hover:-translate-y-1">
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500`} />

      <div className="relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          {growth && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {typeof growth === 'string' ? growth : `${growth > 0 ? '+' : ''}${growth}%`}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};

export default AdminStatsCard;
