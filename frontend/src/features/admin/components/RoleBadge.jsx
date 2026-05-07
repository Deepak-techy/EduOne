// src/features/admin/components/RoleBadge.jsx

const ROLE_STYLES = {
  admin:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  teacher: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  student: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  moderator: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const ROLE_ICONS = {
  admin:   '🛡️',
  teacher: '📚',
  student: '🎓',
  moderator: '⚡',
};

const RoleBadge = ({ role = '', className = '' }) => {
  const key = role.toLowerCase();
  const style = ROLE_STYLES[key] || ROLE_STYLES.default;
  const icon = ROLE_ICONS[key] || '';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${style} ${className}`}>
      {icon && <span className="text-[10px]">{icon}</span>}
      {role}
    </span>
  );
};

export default RoleBadge;
