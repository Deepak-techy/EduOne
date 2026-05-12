// src/features/admin/components/RoleBadge.jsx

const ROLE_STYLES = {
  admin:   'bg-purple-50 text-purple-600 border-purple-200',
  teacher: 'bg-blue-50 text-blue-600 border-blue-200',
  student: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  moderator: 'bg-amber-50 text-amber-600 border-amber-200',
  default: 'bg-gray-50 text-gray-500 border-gray-200',
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
