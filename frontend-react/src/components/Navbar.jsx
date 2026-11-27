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
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-14 sm:h-16 lg:h-[68px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo + Divider + Nav Pills */}
        <div className="flex items-center gap-2.5 lg:gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveNav?.('home')}
            className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#624DF5] to-[#4B3AE8] flex items-center justify-center text-white shadow-sm group-hover:brightness-105 transition-all select-none">
              <BookOpen className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
            </div>
            <span className="font-extrabold text-lg sm:text-[19px] lg:text-[20px] tracking-tight select-none">
              <span className="text-[#141416]">Neuro</span>
              <span className="text-[#4B3AE8]">Reader</span>
            </span>
          </button>

          <span className="hidden md:block w-px h-5 lg:h-6 bg-[#ECE8F4] mx-0.5" aria-hidden="true" />

          {/* Tablet & Desktop Nav Pills (md+) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav?.(item.id)}
                  className={`inline-flex items-center gap-1.5 lg:gap-2 px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-[13.5px] lg:text-sm whitespace-nowrap transition-all focus:outline-none ${
                    isActive
                      ? 'bg-[#EFEBFD] text-[#4B3AE8] font-bold'
                      : 'text-[#1E1D24] hover:bg-[#F6F5FA] font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4B3AE8]' : 'text-[#5E5A68]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Pill + Divider + Notification Bell + Profile/Sign In */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-end min-w-0">
          {/* Desktop/Tablet Inline Search Pill (md+) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center justify-between gap-2.5 w-full max-w-[220px] lg:max-w-[290px] xl:max-w-[360px] min-w-0 overflow-hidden bg-[#F8F7FB] hover:bg-[#F2F0F8] border border-[#E6E2EE] hover:border-[#CFC7DF] rounded-full px-4 py-1.5 lg:py-2 text-left transition-all group"
          >
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <Search className="w-4 h-4 text-[#736E7D] group-hover:text-[#4B3AE8] flex-shrink-0 transition-colors" />
              <span className="text-[13.5px] lg:text-sm text-[#7D7888] truncate">
                Search books, authors or topics...
              </span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 flex-shrink-0">
              <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
                Ctrl
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
                K
              </kbd>
            </span>
          </button>

          {/* Mobile Search Icon Button (< md) */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search books, authors or topics"
            className="flex md:hidden w-9 h-9 rounded-full items-center justify-center text-[#141416] hover:bg-[#F4F2F8] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <span className="hidden md:block w-px h-5 lg:h-6 bg-[#ECE8F4]" aria-hidden="true" />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBellOpen((p) => !p);
                setHasUnread(false);
              }}
              aria-label="Notifications"
              className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-[#1E1D24] hover:bg-[#F4F2F8] transition-colors"
            >
              <Bell className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
              )}
            </button>

            {isBellOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E6E2EE] rounded-2xl shadow-xl p-4 z-50 text-left">
                <p className="text-sm font-bold text-[#141416] mb-1.5">Notifications</p>
                <p className="text-xs sm:text-sm text-[#686472] leading-relaxed">
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
              className="hidden md:flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 rounded-full hover:bg-[#F5F3F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
            >
              <UserAvatar
                name={profile?.displayName || 'Alex Morgan'}
                src={profile?.avatarUrl}
                sizeClass="w-8 h-8 lg:w-9 lg:h-9"
                textClass="text-xs lg:text-sm"
                ringClass="ring-2 ring-[#E4DDFB]"
              />
              <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#686472]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center px-4 lg:px-5 py-1.5 lg:py-2 rounded-full bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-sm font-semibold transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
