import React from 'react';
import { Headphones } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Navbar({
  activeNav,
  setActiveNav,
  onOpenProfile,
  onOpenLogin,
  onOpenVoiceReader,
  isAuthenticated = false,
  profile,
  avatarButtonRef,
}) {
  const navItems = [
    { id: 'home', label: 'Discover' },
    { id: 'library', label: 'My library' },
    { id: 'my-files', label: 'My PDFs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#ECE8F4] transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <button
          onClick={() => setActiveNav?.('home')}
          className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#4B3AE8] flex items-center justify-center font-black text-white text-sm sm:text-base shadow-sm group-hover:bg-[#3E2ED6] transition-colors select-none">
            NR
          </div>
          <span className="font-extrabold text-base sm:text-[18px] tracking-tight text-[#141416] group-hover:text-[#4B3AE8] transition-colors">
            NeuroReader
          </span>
        </button>

        {/* Center/Right: Horizontal Menu Links + Voice Reader + Sign In / Profile Avatar */}
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
                      : 'text-[#686472] hover:text-[#141416] font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4B3AE8] rounded-t-full" />
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF9FC] border border-[#E4E0EB] hover:border-[#4B3AE8]/40 text-xs font-semibold text-[#141416] transition-all shadow-2xs"
              title="Open Voice Reader"
            >
              <Headphones className="w-3.5 h-3.5 text-[#4B3AE8]" />
              <span>Voice reader</span>
            </button>

            {isAuthenticated ? (
              /* Circular User Profile Avatar (Hidden on mobile < md, shown on tablet/desktop) */
              <button
                ref={avatarButtonRef}
                type="button"
                onClick={onOpenProfile}
                aria-label="Open account menu"
                title="Account menu"
                className="hidden md:flex relative group min-w-[44px] min-h-[44px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
              >
                <UserAvatar
                  name={profile?.displayName || 'Alex Morgan'}
                  src={profile?.avatarUrl}
                  sizeClass="w-9 h-9"
                  textClass="text-xs"
                  ringClass="ring-2 ring-[#E4DDFB] group-hover:ring-[#4B3AE8] transition-all motion-reduce:transition-none"
                />
                <span className="sr-only">Profile</span>
              </button>
            ) : (
              /* Sign In CTA Button */
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center px-4 py-1.5 sm:py-2 rounded-full bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-semibold transition-all shadow-xs active:scale-95"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Sub-Tabs (< md) matching clean editorial mobile pattern */}
      <div className="flex md:hidden items-center justify-around border-t border-[#F2EFF6] px-4 h-10 bg-white">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav?.(item.id)}
              className={`h-full relative px-3 text-xs transition-colors ${
                isActive ? 'text-[#4B3AE8] font-bold' : 'text-[#686472] font-medium'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#4B3AE8] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
