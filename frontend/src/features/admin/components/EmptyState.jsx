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
    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-sm text-gray-400 mb-4 text-center max-w-xs">{description}</p>
    {action && (
      <button
        onClick={action}
        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
