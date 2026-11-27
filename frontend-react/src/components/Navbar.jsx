import React, { useState } from 'react';
import {
  Search,
  Home,
  BookOpen,
  FileText,
  Bell,
  ChevronDown,
} from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Navbar({
  activeNav,
  setActiveNav,
  onOpenSearch,
  onOpenProfile,
  onOpenLogin,
  isAuthenticated = false,
  profile,
  avatarButtonRef,
}) {
  const [hasUnread, setHasUnread] = useState(true);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Discover', icon: Home },
    { id: 'library', label: 'My Library', icon: BookOpen },
    { id: 'my-files', label: 'My PDFs', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#ECE8F4] shadow-[0_4px_20px_rgba(20,16,44,0.04)]">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 h-[64px] sm:h-[76px] lg:h-[82px] flex items-center justify-between gap-4 sm:gap-6">
        {/* Left: Brand Logo + Divider + Nav Pills */}
        <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveNav?.('home')}
            className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#624DF5] to-[#4B3AE8] flex items-center justify-center text-white shadow-sm group-hover:brightness-105 transition-all select-none">
              <BookOpen className="w-5 h-5 sm:w-[22px] sm:h-[22px] lg:w-6 lg:h-6" />
            </div>
            <span className="font-extrabold text-xl sm:text-[22px] lg:text-2xl tracking-tight select-none">
              <span className="text-[#141416]">Neuro</span>
              <span className="text-[#4B3AE8]">Reader</span>
            </span>
          </button>

          <span className="hidden md:block w-px h-7 bg-[#ECE8F4] mx-1" aria-hidden="true" />

          {/* Tablet & Desktop Nav Pills (md+) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav?.(item.id)}
                  className={`inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-[15px] lg:text-base whitespace-nowrap transition-all focus:outline-none ${
                    isActive
                      ? 'bg-[#EFEBFD] text-[#4B3AE8] font-bold'
                      : 'text-[#1E1D24] hover:bg-[#F6F5FA] font-medium'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] lg:w-5 lg:h-5 ${isActive ? 'text-[#4B3AE8]' : 'text-[#5E5A68]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Pill + Divider + Notification Bell + Profile/Sign In */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end min-w-0">
          {/* Desktop/Tablet Inline Search Pill (md+) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center justify-between gap-3 w-full max-w-[240px] lg:max-w-sm xl:max-w-md min-w-0 overflow-hidden bg-[#F8F7FB] hover:bg-[#F2F0F8] border border-[#E6E2EE] hover:border-[#CFC7DF] rounded-full px-5 py-2.5 lg:py-3 text-left transition-all group"
          >
            <span className="flex items-center gap-2.5 min-w-0 flex-1">
              <Search className="w-[18px] h-[18px] lg:w-5 lg:h-5 text-[#736E7D] group-hover:text-[#4B3AE8] flex-shrink-0 transition-colors" />
              <span className="text-[15px] lg:text-base text-[#7D7888] truncate">
                Search books, authors or topics...
              </span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 flex-shrink-0">
              <kbd className="px-2 py-0.5 text-xs font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
                Ctrl
              </kbd>
              <kbd className="px-2 py-0.5 text-xs font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
                K
              </kbd>
            </span>
          </button>

          {/* Mobile Search Icon Button (< md) */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search books, authors or topics"
            className="flex md:hidden w-11 h-11 rounded-full items-center justify-center text-[#141416] hover:bg-[#F4F2F8] transition-colors"
          >
            <Search className="w-[22px] h-[22px]" />
          </button>

          <span className="hidden md:block w-px h-7 bg-[#ECE8F4]" aria-hidden="true" />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBellOpen((p) => !p);
                setHasUnread(false);
              }}
              aria-label="Notifications"
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-[#1E1D24] hover:bg-[#F4F2F8] transition-colors"
            >
              <Bell className="w-[22px] h-[22px]" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
              )}
            </button>

            {isBellOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E6E2EE] rounded-2xl shadow-xl p-5 z-50 text-left">
                <p className="text-base font-bold text-[#141416] mb-2">Notifications</p>
                <p className="text-sm text-[#686472] leading-relaxed">
                  Welcome to NeuroReader! Your reading preferences and uploaded PDFs are synced.
                </p>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <button
              ref={avatarButtonRef}
              type="button"
              onClick={onOpenProfile}
              aria-label="Open account menu"
              title="Account menu"
              className="hidden md:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-[#F5F3F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
            >
              <UserAvatar
                name={profile?.displayName || 'Alex Morgan'}
                src={profile?.avatarUrl}
                sizeClass="w-10 h-10"
                textClass="text-sm"
                ringClass="ring-2 ring-[#E4DDFB]"
              />
              <ChevronDown className="w-4 h-4 text-[#686472]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-[15px] font-semibold transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
