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
      <p className="text-xs text-gray-400">
        Showing <span className="text-gray-700 font-semibold">{start}–{end}</span> of <span className="text-gray-700 font-semibold">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {startPage > 1 && <><button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">1</button>{startPage > 2 && <span className="text-gray-300 text-xs px-1">…</span>}</>}
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${p === currentPage ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{p}</button>
        ))}
        {endPage < totalPages && <>{endPage < totalPages - 1 && <span className="text-gray-300 text-xs px-1">…</span>}<button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">{totalPages}</button></>}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
