import React from 'react';
import { Home, BookOpen, Bookmark, FileText, User } from 'lucide-react';
import UserAvatar from './UserAvatar';

const PROFILE_PAGES = new Set([
  'edit-profile',
  'highlights',
  'accessibility',
  'settings',
  'help',
]);

export default function MobileBottomNav({
  activeNav,
  setActiveNav,
  onOpenProfile,
  isAccountMenuOpen = false,
  profile,
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'my-files', label: 'Files', icon: FileText },
    { id: 'saved-books', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User, isAction: true, isProfile: true },
  ];

  const isProfileActive = isAccountMenuOpen || PROFILE_PAGES.has(activeNav);

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-xl border-t border-[#E5DFD3] px-2 items-center justify-around shadow-[0_-8px_25px_rgba(20,20,22,0.06)] w-full"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.isProfile
          ? isProfileActive
          : !isAccountMenuOpen && activeNav === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            aria-expanded={tab.isProfile ? isAccountMenuOpen : undefined}
            onClick={() => {
              if (tab.isAction) {
                onOpenProfile();
              } else {
                setActiveNav(tab.id);
              }
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all motion-reduce:transition-none relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
              isActive ? 'text-[#3A2AD9]' : 'text-[#5E5A54] hover:text-[#141416]'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {tab.isProfile ? (
                <UserAvatar
                  name={profile?.displayName || 'Alex Morgan'}
                  src={profile?.avatarUrl}
                  sizeClass="w-5 h-5"
                  textClass="text-[9px]"
                  ringClass={isActive ? 'ring-2 ring-[#3B2FD6]' : 'ring-1.5 ring-[#FAD8C4]'}
                />
              ) : (
                <Icon className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#3A2AD9] mt-0.5" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
