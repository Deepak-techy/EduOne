// src/features/admin/components/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, totalItems = 0, pageSize = 20 }) => {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-xs text-slate-500">
        Showing <span className="text-slate-300 font-semibold">{start}–{end}</span> of <span className="text-slate-300 font-semibold">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {startPage > 1 && <><button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/10 cursor-pointer">1</button>{startPage > 2 && <span className="text-slate-600 text-xs px-1">…</span>}</>}
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${p === currentPage ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/10'}`}>{p}</button>
        ))}
        {endPage < totalPages && <>{endPage < totalPages - 1 && <span className="text-slate-600 text-xs px-1">…</span>}<button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/10 cursor-pointer">{totalPages}</button></>}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
