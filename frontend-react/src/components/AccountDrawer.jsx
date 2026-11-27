import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  X,
  User,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  Pencil,
  Receipt,
  Accessibility,
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
  savedCount = 6,
  highlightsCount = 48,
  onUpgradePremium,
  accessibilityState,
  onChangeAccessibility,
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
      savedCount={savedCount}
      highlightsCount={highlightsCount}
      onUpgradePremium={onUpgradePremium}
      accessibilityState={accessibilityState}
      onChangeAccessibility={onChangeAccessibility}
    />
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${
        checked ? 'bg-[#4B3AE8]' : 'bg-[#D6D2E2]'
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform ${
          checked ? 'translate-x-[19px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

function AccountDrawerPanel({
  onClose,
  profile,
  activeItem,
  onSelectItem,
  onSignOut,
  returnFocusRef,
  savedCount,
  highlightsCount,
  onUpgradePremium,
  accessibilityState,
  onChangeAccessibility,
}) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [readAloudOn, setReadAloudOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(
    () => accessibilityState?.readerTheme === 'dark'
  );
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const capturedTriggerRef = useRef(null);

  const isDyslexicOn = accessibilityState?.fontMode === 'dyslexic';
  const isFocusOn = !!accessibilityState?.focusMode;

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

  const readingMenuItems = [
    {
      id: 'highlights',
      label: 'Highlights',
      subtitle: 'Notes and quotes you saved',
      icon: Pencil,
    },
    {
      id: 'saved-books',
      label: 'Saved books',
      icon: Bookmark,
      count: savedCount,
    },
    {
      id: 'library',
      label: 'Purchases and rentals',
      subtitle: '2 rentals expire soon',
      icon: Receipt,
    },
  ];

  const accountMenuItems = [
    { id: 'edit-profile', label: 'Edit profile', icon: User },
    {
      id: 'accessibility',
      label: 'Accessibility settings',
      subtitle: 'Fonts, colours, spacing',
      icon: Accessibility,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help and support', icon: HelpCircle },
  ];

  const renderMenuRow = (item) => {
    const Icon = item.icon;
    const targetId = item.navTarget || item.id;
    const isActive = activeItem === item.id;

    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => onSelectItem(targetId)}
          aria-current={isActive ? 'page' : undefined}
          className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4B3AE8] ${
            isActive ? 'bg-[#F5F3FF]' : 'hover:bg-[#F7F6FB]'
          }`}
        >
          <span className="w-9 h-9 rounded-xl bg-[#EFEBFD] text-[#4B3AE8] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </span>

          <div className="flex-1 min-w-0">
            <span
              className={`block text-[13.5px] font-bold leading-snug ${
                isActive ? 'text-[#4B3AE8]' : 'text-[#141416]'
              }`}
            >
              {item.label}
            </span>
            {item.subtitle && (
              <span className="block text-[11px] text-[#7A7585] truncate mt-0.5">
                {item.subtitle}
              </span>
            )}
          </div>

          {typeof item.count === 'number' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFEBFD] text-[#4B3AE8]">
              {item.count}
            </span>
          )}

          <ChevronRight className="w-4 h-4 text-[#8B8598] flex-shrink-0" aria-hidden="true" />
        </button>
      </li>
    );
  };

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-16 md:bottom-0 z-50 flex justify-end bg-black/40 backdrop-fade-in"
      onClick={closeAndRestoreFocus}
    >
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-drawer-name"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[360px] h-full min-h-0 overflow-hidden bg-white border-l border-[#EAE6F0] flex flex-col drawer-slide-in shadow-2xl"
      >
        {/* Top Bar: Back + Close */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeAndRestoreFocus}
            aria-label="Back"
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-[#4B4754] hover:text-[#141416] hover:bg-[#F5F3F9] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={closeAndRestoreFocus}
            aria-label="Close account menu"
            className="w-9 h-9 flex items-center justify-center text-[#5E5A68] hover:text-[#141416] hover:bg-[#F5F3F9] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 space-y-5">
          {/* Identity Header */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="p-0.5 rounded-full ring-2 ring-[#4B3AE8]">
              <UserAvatar
                name={profile.displayName}
                src={profile.avatarUrl}
                sizeClass="w-14 h-14 flex-shrink-0"
                textClass="text-lg font-extrabold"
                ringClass=""
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                id="account-drawer-name"
                className="text-lg font-extrabold text-[#111115] leading-tight truncate"
              >
                {profile.displayName}
              </p>
              <p className="text-xs text-[#686472] truncate mt-0.5">{profile.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1FA] text-[11px] font-semibold text-[#524E5B]">
                Free plan
              </span>
            </div>
          </div>

          {/* 2-Card Stats Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#F7F6FB] py-2.5 px-3 text-center">
              <div className="text-base font-extrabold text-[#141416] leading-tight">12</div>
              <div className="text-[11px] font-medium text-[#736E7D] mt-0.5">Books read</div>
            </div>
            <div className="rounded-xl bg-[#F7F6FB] py-2.5 px-3 text-center">
              <div className="text-base font-extrabold text-[#141416] leading-tight">
                {highlightsCount}
              </div>
              <div className="text-[11px] font-medium text-[#736E7D] mt-0.5">Highlights</div>
            </div>
          </div>

          {/* PDF Storage Upgrade Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#5240EE] to-[#4232D8] p-4 text-white shadow-md">
            <h3 className="text-sm font-extrabold leading-snug">PDF storage</h3>
            <p className="text-[11.5px] text-white/85 leading-relaxed mt-1">
              Upload more PDFs and sync them on every device with Premium.
            </p>

            {/* Progress Bar */}
            <div className="mt-3.5 h-1.5 w-full rounded-full bg-white/25 overflow-hidden">
              <div className="h-full rounded-full bg-[#F7C948]" style={{ width: '74%' }} />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-white/90 mt-1.5">
              <span>148 MB used</span>
              <span>200 MB total</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgradePremium?.();
              }}
              className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#F5F3FF] text-[#4B3AE8] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Crown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upgrade to Premium</span>
            </button>
          </div>

          {/* Reading Section */}
          <div>
            <p className="px-1 text-[11px] font-semibold text-[#7A7585] mb-1.5">Reading</p>
            <ul className="space-y-0.5">{readingMenuItems.map(renderMenuRow)}</ul>
          </div>

          {/* Reading Comfort Toggles (2x2 Grid) */}
          <div>
            <p className="px-1 text-[11px] font-semibold text-[#7A7585] mb-2">Reading comfort</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#EAE6F0] bg-white px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#141416] leading-tight">
                  Dyslexia-friendly text
                </span>
                <ToggleSwitch
                  checked={isDyslexicOn}
                  label="Toggle dyslexia-friendly text"
                  onChange={() =>
                    onChangeAccessibility?.({
                      fontMode: isDyslexicOn ? 'inter' : 'dyslexic',
                    })
                  }
                />
              </div>

              <div className="rounded-xl border border-[#EAE6F0] bg-white px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#141416] leading-tight">Focus line</span>
                <ToggleSwitch
                  checked={isFocusOn}
                  label="Toggle focus line"
                  onChange={() =>
                    onChangeAccessibility?.({
                      focusMode: !isFocusOn,
                    })
                  }
                />
              </div>

              <div className="rounded-xl border border-[#EAE6F0] bg-white px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#141416] leading-tight">Read aloud</span>
                <ToggleSwitch
                  checked={readAloudOn}
                  label="Toggle read aloud"
                  onChange={() => setReadAloudOn((prev) => !prev)}
                />
              </div>

              <div className="rounded-xl border border-[#EAE6F0] bg-white px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#141416] leading-tight">Dark mode</span>
                <ToggleSwitch
                  checked={darkModeOn}
                  label="Toggle dark mode"
                  onChange={() => {
                    const next = !darkModeOn;
                    setDarkModeOn(next);
                    onChangeAccessibility?.({
                      readerTheme: next ? 'dark' : 'cream',
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <p className="px-1 text-[11px] font-semibold text-[#7A7585] mb-1.5">Account</p>
            <ul className="space-y-0.5">{accountMenuItems.map(renderMenuRow)}</ul>
          </div>

          {/* Sign Out inside Profile Menu */}
          <div className="border-t border-[#EFECE6] pt-3">
            {!confirmSignOut ? (
              <button
                type="button"
                onClick={() => setConfirmSignOut(true)}
                className="w-full py-2 px-3 rounded-xl flex items-center gap-3 text-left text-sm font-bold text-[#D93829] hover:bg-[#FEF2F2] transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-[#FEECEB] text-[#D93829] flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>Sign out</span>
              </button>
            ) : (
              <div
                role="alertdialog"
                aria-labelledby="drawer-signout-label"
                className="py-1.5 px-2 flex items-center justify-between gap-2 rounded-xl bg-[#FEF2F2]"
              >
                <span id="drawer-signout-label" className="text-xs font-semibold text-[#141416]">
                  Sign out of session?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmSignOut(false)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#5E5A68] hover:bg-white"
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
                    className="px-3 py-1.5 rounded-lg bg-[#D93829] text-white text-xs font-bold hover:bg-[#B91C1C]"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
