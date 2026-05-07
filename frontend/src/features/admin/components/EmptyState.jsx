// src/features/admin/components/EmptyState.jsx
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There are no items to display.',
  action,
  actionLabel = 'Refresh',
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-indigo-400/60" />
    </div>
    <h3 className="text-lg font-semibold text-white/80 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 mb-4 text-center max-w-xs">{description}</p>
    {action && (
      <button
        onClick={action}
        className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
