import React from 'react';
import {
  Home,
  BookOpen,
  FileText,
  Bookmark,
  Headphones,
  ChevronLeft,
  X,
  ArrowRight,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
  onOpenVoiceReader,
  isCompactPreview = false,
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, active: activeNav === 'home' },
    { id: 'library', label: 'Library', icon: BookOpen, active: activeNav === 'library' },
    { id: 'my-files', label: 'My Files', icon: FileText, active: activeNav === 'my-files' },
    { id: 'saved-books', label: 'Saved Books', icon: Bookmark, active: activeNav === 'saved-books' },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
      {/* Top Workspace Header & Nav List */}
      <div>
        {/* Workspace Label with Collapse Button */}
        <div className="flex items-center justify-between px-2.5 mb-3 text-neutral-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Workspace
          </span>
          <button
            onClick={onClose}
            aria-label="Collapse sidebar"
            className="p-1 rounded-md hover:bg-[#1f2127] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 hidden lg:inline" />
            <X className="w-4 h-4 lg:hidden" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1c1a12] text-[#f6d23e] border border-[#f6d23e]/30 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#16171b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      isActive ? 'text-[#f6d23e]' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-md bg-[#2d240e] text-[#f6d23e] border border-[#f6d23e]/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card: "A little less screen. A little more listening." */}
      <div className="pt-4">
        <div className="bg-[#14151a] border border-[#23252d] rounded-2xl p-4 text-center relative overflow-hidden group shadow-md">
          {/* Subtle warm glow background accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f6d23e]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Book with Headphones Graphic Illustration */}
          <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center relative">
            <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-sm">
              {/* Stacked Pages */}
              <polygon points="15,48 40,58 65,48 40,38" fill="#e5dfd3" />
              <polygon points="15,44 40,54 65,44 40,34" fill="#fef08a" opacity="0.9" />
              {/* Open Book Wings */}
              <path d="M12 40 Q25 45 40 40 Q55 45 68 40 L68 55 Q55 60 40 55 Q25 60 12 55 Z" fill="#262626" />
              {/* Headphones arch */}
              <path d="M22 36 A20 20 0 0 1 58 36" stroke="#f6d23e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Headphone earcups */}
              <rect x="18" y="32" width="8" height="12" rx="4" fill="#181818" stroke="#f6d23e" strokeWidth="2" />
              <rect x="54" y="32" width="8" height="12" rx="4" fill="#181818" stroke="#f6d23e" strokeWidth="2" />
              {/* Sparkle stars */}
              <path d="M64 18 L66 23 L71 25 L66 27 L64 32 L62 27 L57 25 L62 23 Z" fill="#f6d23e" />
              <circle cx="20" cy="18" r="1.8" fill="#f6d23e" />
            </svg>
          </div>

          <p className="text-[13px] font-bold text-white leading-snug">
            A little less screen.
          </p>
          <p className="text-[12px] text-neutral-400 mt-0.5 mb-3">
            A little more listening.
          </p>

          <button
            onClick={onOpenVoiceReader}
            className="w-full flex items-center justify-center gap-2 bg-[#1c1d23] hover:bg-[#252730] text-[#f6d23e] border border-[#f6d23e]/30 hover:border-[#f6d23e] text-xs font-bold py-2 px-3 rounded-xl transition-all"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Voice reader</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          <p className="text-[10px] text-neutral-400 mt-3 font-medium">
            Made for every kind of mind.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Large Screen Fixed Sidebar */}
      <aside
        className={`${
          isCompactPreview ? 'hidden' : 'hidden lg:block'
        } w-[240px] flex-shrink-0 h-[calc(100vh-61px)] sticky top-[61px] border-r border-[#1c1d22] bg-[#0e0f11]`}
      >
        {content}
      </aside>

      {/* Mobile & Tablet Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm ${
            isCompactPreview ? '' : 'lg:hidden'
          } transition-opacity`}
          onClick={onClose}
        >
          {/* Drawer Panel */}
          <div
            className="w-72 max-w-[85vw] h-full bg-[#111216] border-r border-[#22242a] shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
