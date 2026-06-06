import { useState, useEffect } from 'react';
import { Pin, X, ChevronRight } from 'lucide-react';
import { communityService } from '../../../services/communityService';

const AnnouncementBanner = ({ onVisibilityChange }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await communityService.getAllAnnouncements();
        const list = res.data?.data?.announcements || [];
        const pinned = list.filter(a => a.isPinned && a.isActive !== false);

        if (pinned.length > 0) {
          setAnnouncements(pinned);
          setIsVisible(true);
          onVisibilityChange?.(true);
        }
      } catch (err) {
        // Silent fail — banner is non-critical
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDismiss = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsVisible(false);
      onVisibilityChange?.(false);
    }
  };

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div
      className="relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
      style={{
        background: 'linear-gradient(135deg, #d0ecf5 0%, #b8e0f0 30%, #c5e8f7 60%, #daf0fa 100%)',
        borderBottom: '1px solid rgba(33, 150, 243, 0.15)',
        boxShadow: '0 1px 8px rgba(33, 150, 243, 0.08)',
      }}
    >
      {/* Subtle decorative blur orb */}
      <div className="absolute left-[max(-7rem,50%-52rem)] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
        <div className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-[#90caf9] to-[#b3e5fc] opacity-20"
          style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.2% 56.8%, 45.2% 34.8%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(33, 150, 243, 0.15)' }}
          >
            <Pin size={12} className="fill-[#1976D2]" style={{ color: '#1976D2' }} />
          </div>
          <p className="text-sm leading-6 font-semibold truncate max-w-[200px] sm:max-w-none" style={{ color: '#0d47a1' }}>
            {current.title}
          </p>
        </div>
        <p className="text-sm leading-6 line-clamp-1 max-w-md hidden md:flex items-center gap-1" style={{ color: '#37474f' }}>
          <ChevronRight size={14} style={{ color: '#1976D2', flexShrink: 0 }} />
          {current.content}
        </p>
        {announcements.length > 1 && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              color: '#1565c0',
              backgroundColor: 'rgba(33, 150, 243, 0.12)',
            }}
          >
            {currentIndex + 1}/{announcements.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        <button onClick={handleDismiss} type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px] rounded-full transition-colors"
          style={{ color: '#455a64' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
