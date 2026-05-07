// src/features/admin/components/StatusBadge.jsx

const STATUS_STYLES = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  deleted:   'bg-gray-500/10 text-gray-400 border-gray-500/20',
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  resolved:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
  success:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed:    'bg-red-500/10 text-red-400 border-red-500/20',
  default:   'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const StatusBadge = ({ status = '', className = '' }) => {
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${key === 'active' || key === 'resolved' || key === 'success' ? 'bg-emerald-400' : key === 'suspended' || key === 'rejected' || key === 'failed' || key === 'deleted' ? 'bg-red-400' : key === 'pending' ? 'bg-amber-400' : 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
