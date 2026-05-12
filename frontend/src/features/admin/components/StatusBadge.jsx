// src/features/admin/components/StatusBadge.jsx

const STATUS_STYLES = {
  active:    'bg-emerald-50 text-emerald-600 border-emerald-200',
  suspended: 'bg-red-50 text-red-600 border-red-200',
  deleted:   'bg-gray-50 text-gray-500 border-gray-200',
  pending:   'bg-amber-50 text-amber-600 border-amber-200',
  resolved:  'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected:  'bg-red-50 text-red-600 border-red-200',
  success:   'bg-emerald-50 text-emerald-600 border-emerald-200',
  failed:    'bg-red-50 text-red-600 border-red-200',
  default:   'bg-gray-50 text-gray-500 border-gray-200',
};

const StatusBadge = ({ status = '', className = '' }) => {
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${key === 'active' || key === 'resolved' || key === 'success' ? 'bg-emerald-500' : key === 'suspended' || key === 'rejected' || key === 'failed' || key === 'deleted' ? 'bg-red-500' : key === 'pending' ? 'bg-amber-500' : 'bg-gray-400'}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
