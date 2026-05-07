// src/features/admin/components/SkeletonLoader.jsx

export const SkeletonCard = () => (
  <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/5" />
      <div className="w-16 h-6 rounded-lg bg-white/5" />
    </div>
    <div className="w-24 h-8 rounded bg-white/5 mb-2" />
    <div className="w-32 h-4 rounded bg-white/5" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-[#1e2030] rounded-2xl border border-white/5 overflow-hidden animate-pulse">
    <div className="h-12 bg-white/[0.03] flex items-center gap-4 px-5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-3 rounded bg-white/5 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 flex items-center gap-4 px-5 border-t border-white/5">
        {[1, 2, 3, 4, 5].map(j => (
          <div key={j} className="h-3 rounded bg-white/5 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-[#1e2030] rounded-2xl p-6 border border-white/5 animate-pulse">
    <div className="w-40 h-5 rounded bg-white/5 mb-2" />
    <div className="w-56 h-3 rounded bg-white/5 mb-6" />
    <div className="h-48 rounded-xl bg-white/[0.03]" />
  </div>
);
