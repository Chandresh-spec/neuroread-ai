import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  X,
  User,
  Highlighter,
  Bookmark,
  Sliders,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import UserAvatar from './UserAvatar';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AccountDrawer({
  isOpen,
  onClose,
  profile,
  activeItem,
  onSelectItem,
  onSignOut,
  returnFocusRef,
}) {
  if (!isOpen) return null;
  return (
    <AccountDrawerPanel
      onClose={onClose}
      profile={profile}
      activeItem={activeItem}
      onSelectItem={onSelectItem}
      onSignOut={onSignOut}
      returnFocusRef={returnFocusRef}
    />
  );
}

function AccountDrawerPanel({
  onClose,
  profile,
  activeItem,
  onSelectItem,
  onSignOut,
  returnFocusRef,
}) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const capturedTriggerRef = useRef(null);

  const closeAndRestoreFocus = useCallback(() => {
    const target = returnFocusRef?.current || capturedTriggerRef.current;
    onClose();
    requestAnimationFrame(() => {
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    });
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    capturedTriggerRef.current = document.activeElement;
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (confirmSignOut) {
          setConfirmSignOut(false);
          return;
        }
        closeAndRestoreFocus();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAndRestoreFocus, confirmSignOut]);

  const menuItems = [
    { id: 'edit-profile', label: 'Edit profile', icon: User },
    { id: 'highlights', label: 'Highlights', icon: Highlighter },
    { id: 'saved-books', label: 'Saved books', icon: Bookmark },
    { id: 'accessibility', label: 'Accessibility', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleNavigate = (itemId) => {
    onSelectItem(itemId);
  };

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-16 md:bottom-0 z-40 flex justify-end bg-black/35 backdrop-fade-in"
      onClick={closeAndRestoreFocus}
    >
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-drawer-name"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[320px] h-full bg-white border-l border-[#E4E4E7] flex flex-col drawer-slide-in"
      >
        {/* Top bar (Back + Close) & Identity header */}
        <div className="px-4 pt-2 pb-4 border-b border-[#E4E4E7] space-y-2">
          <div className="flex items-center justify-between -mx-2">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeAndRestoreFocus}
              aria-label="Back"
              className="inline-flex items-center gap-2 min-w-[44px] min-h-[44px] px-2 text-sm text-[#141416] hover:text-[#3B2FD6] hover:bg-[#F4F4F5] rounded-md transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B2FD6]"
            >
              <ArrowLeft className="w-4 h-4 pointer-events-none" strokeWidth={1.75} aria-hidden="true" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={closeAndRestoreFocus}
              aria-label="Close account menu"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] rounded-md transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B2FD6]"
            >
              <X className="w-4 h-4 pointer-events-none" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar
              name={profile.displayName}
              src={profile.avatarUrl}
              sizeClass="w-11 h-11 flex-shrink-0"
              textClass="text-sm"
              ringClass="ring-1 ring-[#E4E4E7]"
            />
            <div className="min-w-0 flex-1">
              <p
                id="account-drawer-name"
                className="font-editorial text-lg font-bold text-[#141416] leading-snug truncate"
              >
                {profile.displayName}
              </p>
              <p className="text-xs text-[#524E48] truncate mt-0.5">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Plain list of account actions */}
        <nav aria-label="Account menu" className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-[#E4E4E7] border-b border-[#E4E4E7]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full h-12 min-h-[48px] px-4 flex items-center gap-2 text-left text-sm transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B2FD6] ${
                      isActive
                        ? 'text-[#3B2FD6] font-medium bg-[#FAFAFC]'
                        : 'text-[#141416] font-normal hover:bg-[#F4F4F5]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 pointer-events-none ${
                        isActive ? 'text-[#3B2FD6]' : 'text-[#524E48]'
                      }`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider & Quiet Sign Out Row at Bottom */}
        <div className="border-t border-[#E4E4E7]">
          {!confirmSignOut ? (
            <button
              type="button"
              onClick={() => setConfirmSignOut(true)}
              className="w-full h-12 min-h-[48px] px-4 flex items-center gap-2 text-left text-sm font-normal text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B2FD6]"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 pointer-events-none" strokeWidth={1.75} aria-hidden="true" />
              <span>Sign out</span>
            </button>
          ) : (
            <div
              role="alertdialog"
              aria-labelledby="drawer-signout-label"
              className="px-4 py-2 flex items-center justify-between gap-2 min-h-[48px]"
            >
              <span id="drawer-signout-label" className="text-sm text-[#141416]">
                Sign out?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmSignOut(false)}
                  className="min-h-[44px] px-2 text-sm text-[#524E48] hover:text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmSignOut(false);
                    closeAndRestoreFocus();
                    onSignOut?.();
                  }}
                  className="min-h-[44px] px-2 text-sm font-medium text-[#141416] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
