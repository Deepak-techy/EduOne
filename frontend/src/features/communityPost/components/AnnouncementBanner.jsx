import { useState, useEffect } from 'react';
import { Pin, X, Megaphone, ArrowRight } from 'lucide-react';
import { communityService } from '../../../services/communityService';

const AnnouncementBanner = () => {
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
          const dismissed = JSON.parse(sessionStorage.getItem('dismissedAnnouncements') || '[]');
          const visible = pinned.filter(a => !dismissed.includes(a._id));
          if (visible.length > 0) {
            setAnnouncements(visible);
            setIsVisible(true);
          }
        }
      } catch (err) {
        // Silent fail — banner is non-critical
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDismiss = () => {
    if (announcements[currentIndex]) {
      const dismissed = JSON.parse(sessionStorage.getItem('dismissedAnnouncements') || '[]');
      dismissed.push(announcements[currentIndex]._id);
      sessionStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissed));
    }

    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      {/* Decorative blur */}
      <div className="absolute left-[max(-7rem,50%-52rem)] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
        <div className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.2% 56.8%, 45.2% 34.8%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Pin size={12} className="text-white fill-white" />
          </div>
          <p className="text-sm leading-6 font-semibold truncate max-w-[200px] sm:max-w-none">
            {current.title}
          </p>
        </div>
        <p className="text-sm leading-6 text-indigo-100 line-clamp-1 max-w-md hidden md:block">
          {current.content}
        </p>
        {announcements.length > 1 && (
          <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
            {currentIndex + 1}/{announcements.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        <button onClick={handleDismiss} type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px] hover:bg-white/10 rounded-full transition-colors">
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
