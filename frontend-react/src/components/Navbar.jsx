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
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 h-14 sm:h-[60px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo + Divider + Nav Pills */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveNav?.('home')}
            className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0 pl-1"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#624DF5] to-[#4B3AE8] flex items-center justify-center text-white shadow-sm group-hover:brightness-105 transition-all select-none">
              <BookOpen className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="font-extrabold text-base sm:text-[18px] tracking-tight select-none">
              <span className="text-[#141416]">Neuro</span>
              <span className="text-[#4B3AE8]">Reader</span>
            </span>
          </button>

          <span className="hidden md:block w-px h-5 bg-[#ECE8F4] mx-0.5" aria-hidden="true" />

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
                  className={`inline-flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] whitespace-nowrap transition-all focus:outline-none ${
                    isActive
                      ? 'bg-[#EFEBFD] text-[#4B3AE8] font-bold'
                      : 'text-[#1E1D24] hover:bg-[#F6F5FA] font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4B3AE8]' : 'text-[#5E5A68]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Pill + Divider + Notification Bell + Profile/Sign In */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
          {/* Desktop/Tablet Inline Search Pill (md+) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center justify-between gap-2 w-full max-w-[200px] lg:max-w-xs xl:max-w-sm min-w-0 overflow-hidden bg-[#F8F7FB] hover:bg-[#F2F0F8] border border-[#E6E2EE] hover:border-[#CFC7DF] rounded-full px-3.5 py-1.5 text-left transition-all group"
          >
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <Search className="w-3.5 h-3.5 text-[#736E7D] group-hover:text-[#4B3AE8] flex-shrink-0 transition-colors" />
              <span className="text-xs text-[#7D7888] truncate">
                Search books, authors or topics...
              </span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 flex-shrink-0">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
                Ctrl
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#7D7888] bg-white border border-[#E5E2EC] rounded">
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
            <Search className="w-4.5 h-4.5" />
          </button>

          <span className="hidden md:block w-px h-5 bg-[#ECE8F4]" aria-hidden="true" />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBellOpen((p) => !p);
                setHasUnread(false);
              }}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#1E1D24] hover:bg-[#F4F2F8] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
              )}
            </button>

            {isBellOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E6E2EE] rounded-2xl shadow-xl p-3.5 z-50 text-left">
                <p className="text-xs font-bold text-[#141416] mb-1">Notifications</p>
                <p className="text-xs text-[#686472] leading-relaxed">
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
              className="hidden md:flex items-center gap-1.5 pl-0.5 pr-1.5 py-0.5 rounded-full hover:bg-[#F5F3F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
            >
              <UserAvatar
                name={profile?.displayName || 'Alex Morgan'}
                src={profile?.avatarUrl}
                sizeClass="w-8 h-8"
                textClass="text-xs"
                ringClass="ring-2 ring-[#E4DDFB]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#686472]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-semibold transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
