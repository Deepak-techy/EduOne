// src/features/admin/components/ConfirmDialog.jsx
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) => {
  if (!open) return null;

  const variants = {
    danger: {
      icon: 'bg-red-500/10 text-red-400',
      btn: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'bg-amber-500/10 text-amber-400',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    info: {
      icon: 'bg-blue-500/10 text-blue-400',
      btn: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  };

  const v = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1e2030] rounded-2xl shadow-2xl border border-white/10 p-6 animate-[modalIn_0.2s_ease-out]">
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl ${v.icon} flex items-center justify-center mb-4`}>
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400 mb-6">{description}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold ${v.btn} transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
