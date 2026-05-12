// src/features/admin/components/SearchFilterBar.jsx
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const SearchFilterBar = ({
  searchValue = '',
  onSearchChange,
  placeholder = 'Search…',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  children,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActive = Object.values(activeFilters).some(v => v && v !== 'all');

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition"
          />
        </div>
        {filters.length > 0 && (
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
              hasActive ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />Filters
            {hasActive && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </button>
        )}
        {children}
      </div>
      {filtersOpen && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
          {filters.map(f => (
            <div key={f.key} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">{f.label}:</span>
              <div className="flex gap-1">
                {f.options.map(opt => (
                  <button key={opt.value} onClick={() => onFilterChange?.(f.key, opt.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeFilters[f.key] === opt.value ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                    }`}>{opt.label}</button>
                ))}
              </div>
            </div>
          ))}
          {hasActive && (
            <button onClick={onClearFilters} className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 cursor-pointer">
              <X className="w-3 h-3" />Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
