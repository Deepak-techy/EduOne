import { Megaphone, Pin, Clock, Users, Loader2 } from 'lucide-react';

const AnnouncementFeed = ({ announcements, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading announcements...</p>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No announcements yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Check back later for official updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => {
        const date = a.createdAt
          ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';

        return (
          <div
            key={a._id}
            className={`group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:shadow-xl p-6 ${
              a.isPinned
                ? 'border-indigo-300 dark:border-indigo-500/40 ring-1 ring-indigo-200/50 dark:ring-indigo-500/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {/* Pinned badge */}
            {a.isPinned && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Pin size={12} className="fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pinned</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
                a.isPinned
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{a.content}</p>

                <div className="flex items-center flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {date}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    a.targetAudience === 'Students' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    a.targetAudience === 'Teachers' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    <Users className="w-3 h-3 inline mr-1" />
                    {a.targetAudience || 'All'}
                  </span>
                  {a.createdBy && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      by {a.createdBy.fullName || a.createdBy.userName || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementFeed;
