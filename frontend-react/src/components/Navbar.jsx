import React from 'react';
import { Search, Headphones } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Navbar({
  activeNav,
  setActiveNav,
  onOpenSearch,
  onOpenProfile,
  onOpenVoiceReader,
  profile,
}) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'my-files', label: 'My Files' },
    { id: 'saved-books', label: 'Saved Books' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5DFD3] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <button
          onClick={() => setActiveNav?.('home')}
          className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#3A2AD9] flex items-center justify-center font-black text-white text-sm sm:text-base shadow-sm group-hover:bg-[#3021C2] transition-colors select-none">
            NR
          </div>
          <span className="font-extrabold text-base sm:text-[18px] tracking-tight text-[#141416] group-hover:text-[#3A2AD9] transition-colors">
            NeuroRead
          </span>
        </button>

        {/* Right: Horizontal Menu Links + Voice Reader + Search + Profile Avatar */}
        <div className="flex items-center gap-4 sm:gap-6 h-full flex-shrink-0">
          {/* Horizontal Navigation Links (Tablet & Desktop: md+) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 h-full">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav?.(item.id)}
                  className={`h-full inline-flex items-center relative text-sm transition-colors focus:outline-none ${
                    isActive
                      ? 'text-[#141416] font-bold'
                      : 'text-[#6B665F] hover:text-[#141416] font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#3A2AD9] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Voice Reader Quick Trigger Pill */}
            <button
              onClick={onOpenVoiceReader}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E2DCD0] hover:border-[#3A2AD9]/40 text-xs font-semibold text-[#141416] transition-all shadow-2xs"
              title="Open Voice Reader"
            >
              <Headphones className="w-3.5 h-3.5 text-[#3A2AD9]" />
              <span>Voice Reader</span>
            </button>

            {/* Circular Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search books"
              title="Search (Ctrl+K)"
              className="w-9 h-9 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E2DCD0] flex items-center justify-center text-[#141416] hover:border-[#3A2AD9]/40 transition-colors shadow-2xs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Circular User Profile Avatar */}
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label="Open profile, highlights, and settings"
              title="Profile & settings"
              className="relative group min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <UserAvatar
                name={profile?.displayName || 'Alex Morgan'}
                src={profile?.avatarUrl}
                sizeClass="w-9 h-9"
                textClass="text-xs"
                ringClass="ring-2 ring-[#FAD8C4] group-hover:ring-[#3B2FD6] transition-all motion-reduce:transition-none"
              />
              <span className="sr-only">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
