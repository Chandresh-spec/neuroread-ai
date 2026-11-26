import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Bookmark,
  LogOut,
  ChevronRight,
  Highlighter,
  Accessibility,
  Settings,
  Camera,
  Edit3,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import AvatarCropper from './AvatarCropper';
import SettingsPanel from './SettingsPanel';
import AccessibilityPanel from './AccessibilityPanel';
import { formatAccessibilitySummary, validateDisplayName } from '../utils/profileHelpers';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProfileModal(props) {
  if (!props.isOpen) return null;
  return <ProfileModalDialog {...props} />;
}

function ProfileModalDialog({
  onClose,
  profile,
  onSaveProfile,
  onUploadAvatar,
  onRemoveAvatar,
  audioDefaults,
  onSaveAudioDefaults,
  accessibilityState,
  onChangeAccessibility,
  savedCount = 0,
  highlightsCount = 0,
  onOpenHighlights,
  onDownloadData,
  onSignOut,
  onDeleteAccount,
}) {
  // Single modal internal views: 'profile' | 'settings' | 'avatar-upload' | 'avatar-defaults' | 'accessibility'
  const [viewMode, setViewMode] = useState('profile');
  const [accessibilityReturnView, setAccessibilityReturnView] = useState('profile');
  const [avatarReturnView, setAvatarReturnView] = useState('profile');
  const [settingsFocusField, setSettingsFocusField] = useState(null);

  // Draft state for Settings (persists across Back to profile until saved or discarded)
  const [draft, setDraft] = useState({
    displayName: profile.displayName,
    email: profile.email,
    avatarUrl: profile.avatarUrl || '',
    audioVoiceId: audioDefaults.voiceId || 'system-default',
    audioSpeed: audioDefaults.playbackSpeed || 1.0,
  });

  // UI states inside Profile view
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [unsavedPromptOpen, setUnsavedPromptOpen] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const photoMenuRef = useRef(null);
  const previousFocusRef = useRef(null);
  const skipPopRef = useRef(false);

  const hasUnsavedChanges = useMemo(() => {
    return (
      draft.displayName !== profile.displayName ||
      draft.email !== profile.email ||
      draft.audioVoiceId !== (audioDefaults.voiceId || 'system-default') ||
      Number(draft.audioSpeed) !== Number(audioDefaults.playbackSpeed || 1.0)
    );
  }, [draft, profile, audioDefaults]);

  const navigateToSubView = (nextView, options = {}) => {
    if (options.accessibilityReturn) {
      setAccessibilityReturnView(options.accessibilityReturn);
    }
    if (options.avatarReturn) {
      setAvatarReturnView(options.avatarReturn);
    }
    setSettingsFocusField(options.focusField || null);
    window.history.pushState({ neuroreadModalView: nextView }, '');
    setViewMode(nextView);
  };

  const navigateBackFromSubView = (targetView) => {
    setSettingsFocusField(null);
    setViewMode(targetView);
    if (window.history.state?.neuroreadModalView) {
      skipPopRef.current = true;
      window.history.back();
    }
  };

  // Support browser back button across internal Profile -> Settings / Accessibility / Avatar views
  useEffect(() => {
    const handlePopState = () => {
      if (skipPopRef.current) {
        skipPopRef.current = false;
        return;
      }
      if (viewMode === 'accessibility') {
        setViewMode(accessibilityReturnView);
      } else if (viewMode === 'avatar-upload' || viewMode === 'avatar-defaults') {
        setViewMode(avatarReturnView);
      } else if (viewMode === 'settings') {
        setSettingsFocusField(null);
        setViewMode('profile');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewMode, accessibilityReturnView, avatarReturnView]);

  const attemptClose = () => {
    if (photoMenuOpen) {
      setPhotoMenuOpen(false);
      return;
    }
    if (hasUnsavedChanges) {
      setUnsavedPromptOpen(true);
      return;
    }
    onClose();
  };

  const forceDiscardAndClose = () => {
    setUnsavedPromptOpen(false);
    setViewMode('profile');
    onClose();
  };

  // Focus management, focus trap, and Escape handling
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    requestAnimationFrame(() => {
      headingRef.current?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (unsavedPromptOpen) {
          setUnsavedPromptOpen(false);
          return;
        }
        attemptClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
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
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges, photoMenuOpen, unsavedPromptOpen]);

  // Focus view heading on internal view change (unless focusing displayName directly)
  useEffect(() => {
    if (viewMode === 'settings' && settingsFocusField === 'displayName') return;
    requestAnimationFrame(() => {
      headingRef.current?.focus();
    });
  }, [viewMode, settingsFocusField]);

  // Close photo menu on outside click
  useEffect(() => {
    if (!photoMenuOpen) return;
    const handleOutside = (e) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) {
        setPhotoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [photoMenuOpen]);

  const handleSaveSettings = () => {
    if (validateDisplayName(draft.displayName)) return;
    onSaveProfile({
      displayName: draft.displayName.trim(),
      email: draft.email.trim(),
      avatarUrl: draft.avatarUrl,
    });
    onSaveAudioDefaults({
      voiceId: draft.audioVoiceId,
      playbackSpeed: draft.audioSpeed,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2600);
  };

  const handleAvatarSave = async (newUrl) => {
    await onUploadAvatar?.(newUrl);
    setDraft((prev) => ({ ...prev, avatarUrl: newUrl }));
    navigateBackFromSubView(avatarReturnView);
  };

  const handleAvatarRemove = () => {
    onRemoveAvatar?.();
    setDraft((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const accessibilitySummary = formatAccessibilitySummary(accessibilityState);
  const dialogLabelId =
    viewMode === 'profile'
      ? 'profile-dialog-title'
      : viewMode === 'settings'
      ? 'settings-dialog-title'
      : viewMode === 'accessibility'
      ? 'accessibility-dialog-title'
      : 'avatar-dialog-title';

  const unsavedBanner = unsavedPromptOpen ? (
    <div
      role="alertdialog"
      aria-labelledby="unsaved-warning-title"
      className="rounded-2xl border border-[#DFC4AA] bg-[#FAF3EB] p-4 space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#7C4A1E] mt-0.5 flex-shrink-0 pointer-events-none" aria-hidden="true" />
        <div>
          <p id="unsaved-warning-title" className="text-sm font-semibold text-[#141416]">
            You have unsaved changes
          </p>
          <p className="text-xs text-[#524E48] mt-0.5">
            Save your edits before closing, or discard them.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setUnsavedPromptOpen(false)}
          className="min-h-[44px] px-4 py-2 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={forceDiscardAndClose}
          className="min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-xs font-semibold text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          Discard changes
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => {
        if (hasUnsavedChanges) {
          setUnsavedPromptOpen(true);
        } else {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogLabelId}
        className="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white border-t sm:border border-[#E4E4E7] rounded-none sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* VIEW 1 & 2: Avatar Upload / Default Avatars */}
        {(viewMode === 'avatar-upload' || viewMode === 'avatar-defaults') && (
          <AvatarCropper
            mode={viewMode === 'avatar-defaults' ? 'defaults' : 'upload'}
            currentAvatarUrl={profile.avatarUrl}
            onSaveAvatar={handleAvatarSave}
            onCancel={() => navigateBackFromSubView(avatarReturnView)}
            onCloseModal={attemptClose}
            headingRef={headingRef}
            backLabel={avatarReturnView === 'settings' ? 'Back to Settings' : 'Back to Profile'}
          />
        )}

        {/* VIEW 3: Accessibility & Reading Preferences (Fixed Header + Scrollable Body + Fixed Done Footer) */}
        {viewMode === 'accessibility' && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Fixed Header */}
            <div className="shrink-0 bg-white px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-[#E4E4E7] relative">
              <button
                type="button"
                onClick={attemptClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                <X className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              </button>

              <div className="pr-12 mb-2">
                <button
                  type="button"
                  onClick={() => navigateBackFromSubView(accessibilityReturnView)}
                  aria-label={
                    accessibilityReturnView === 'settings'
                      ? 'Back to Settings'
                      : 'Back to Profile'
                  }
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 -ml-3 rounded-full text-sm font-semibold text-[#3B2FD6] hover:bg-[#ECEAFD]/60 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <ArrowLeft className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                  <span>
                    {accessibilityReturnView === 'settings'
                      ? 'Back to Settings'
                      : 'Back to Profile'}
                  </span>
                </button>
              </div>

              <h2
                id="accessibility-dialog-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-editorial text-2xl font-bold text-[#141416] tracking-tight focus:outline-none"
              >
                Accessibility &amp; reading preferences
              </h2>
              <p className="text-sm text-[#524E48] mt-0.5">
                Changes apply immediately across NeuroRead.
              </p>
            </div>

            {/* Scrollable Middle Area */}
            <div className="flex-1 min-h-0 overflow-y-auto modal-scroll mr-1.5 sm:mr-2 pl-5 sm:pl-6 pr-3.5 sm:pr-4 pt-5 pb-8">
              <AccessibilityPanel
                fontMode={accessibilityState.fontMode}
                setFontMode={(v) => onChangeAccessibility({ fontMode: v })}
                textSize={accessibilityState.textSize}
                setTextSize={(v) => onChangeAccessibility({ textSize: v })}
                lineSpacing={accessibilityState.lineSpacing}
                setLineSpacing={(v) => onChangeAccessibility({ lineSpacing: v })}
                readerTheme={accessibilityState.readerTheme}
                setReaderTheme={(v) => onChangeAccessibility({ readerTheme: v })}
                focusMode={accessibilityState.focusMode}
                setFocusMode={(v) => onChangeAccessibility({ focusMode: v })}
              />
            </div>

            {/* Fixed Solid Done Footer */}
            <div className="shrink-0 bg-white border-t border-[#E4E4E7] px-5 sm:px-6 py-3.5">
              <button
                type="button"
                onClick={() => navigateBackFromSubView(accessibilityReturnView)}
                className="w-full min-h-[44px] bg-[#3B2FD6] hover:bg-[#3126B8] text-white font-semibold text-sm py-2.5 rounded-full transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: Settings */}
        {viewMode === 'settings' && (
          <SettingsPanel
            draft={draft}
            onChangeDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
            hasUnsavedChanges={hasUnsavedChanges}
            savedBanner={savedBanner}
            onSave={handleSaveSettings}
            onBackToProfile={() => navigateBackFromSubView('profile')}
            onCloseModal={attemptClose}
            onOpenAvatarUpload={() =>
              navigateToSubView('avatar-upload', { avatarReturn: 'settings' })
            }
            onOpenAvatarDefaults={() =>
              navigateToSubView('avatar-defaults', { avatarReturn: 'settings' })
            }
            onRemoveAvatar={handleAvatarRemove}
            onOpenReadingPreferences={() =>
              navigateToSubView('accessibility', { accessibilityReturn: 'settings' })
            }
            accessibilityState={accessibilityState}
            onDownloadData={onDownloadData}
            onDeleteAccount={() => {
              onDeleteAccount?.();
              onClose();
            }}
            hasAvatarPhoto={Boolean(draft.avatarUrl)}
            headingRef={headingRef}
            focusField={settingsFocusField}
            unsavedBanner={unsavedBanner}
          />
        )}

        {/* VIEW 5: Main Profile */}
        {viewMode === 'profile' && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Fixed Top Bar */}
            <div className="shrink-0 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#E4E4E7] relative">
              <button
                type="button"
                onClick={attemptClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                <X className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              </button>

              {/* Header Identity Card */}
              <div className="flex items-start gap-4 pr-12">
                <div className="relative flex-shrink-0" ref={photoMenuRef}>
                  <UserAvatar
                    name={profile.displayName}
                    src={profile.avatarUrl}
                    sizeClass="w-[72px] h-[72px]"
                    textClass="text-xl"
                    ringClass="ring-2 ring-[#3B2FD6]"
                  />

                  {/* Corner Change Photo Button (44x44 touch target) */}
                  <button
                    type="button"
                    aria-label="Change profile photo"
                    aria-expanded={photoMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setPhotoMenuOpen((o) => !o)}
                    className="absolute -bottom-2 -right-2 w-11 h-11 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] text-white border-2 border-white flex items-center justify-center shadow-xs pointer-events-none">
                      <Camera className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                    </span>
                  </button>

                  {photoMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Profile photo options"
                      className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white border border-[#E4E4E7] shadow-lg p-1.5 z-20 space-y-0.5"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setPhotoMenuOpen(false);
                          navigateToSubView('avatar-upload', { avatarReturn: 'profile' });
                        }}
                        className="w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                      >
                        Upload photo
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setPhotoMenuOpen(false);
                          navigateToSubView('avatar-defaults', { avatarReturn: 'profile' });
                        }}
                        className="w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                      >
                        Choose from default avatars
                      </button>
                      {Boolean(profile.avatarUrl) && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setPhotoMenuOpen(false);
                            handleAvatarRemove();
                          }}
                          className="w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium text-[#8F291E] hover:bg-[#FDF4F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    id="profile-dialog-title"
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-editorial text-2xl font-bold text-[#141416] tracking-tight leading-tight focus:outline-none truncate"
                  >
                    {profile.displayName}
                  </h2>
                  <p className="text-sm text-[#524E48] mt-0.5 truncate">{profile.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ECEAFD] text-[#3B2FD6]">
                      {profile.membershipBadge || 'Inclusive Library Member'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigateToSubView('settings', { focusField: 'displayName' })
                      }
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-full border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-xs font-semibold text-[#141416] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#3B2FD6] pointer-events-none" aria-hidden="true" />
                      <span>Edit profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Middle Area */}
            <div className="flex-1 min-h-0 overflow-y-auto modal-scroll mr-1.5 sm:mr-2 pl-5 sm:pl-6 pr-3.5 sm:pr-4 pt-5 pb-6 space-y-5">
              {unsavedBanner}

              {/* Unsaved Settings Reminder */}
              {hasUnsavedChanges && (
                <div className="rounded-2xl border border-[#DFC4AA] bg-[#FAF3EB] px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#524E48]">
                    You have unsaved edits in Settings.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateToSubView('settings')}
                    className="min-h-[44px] px-2 text-xs font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-lg"
                  >
                    Resume editing
                  </button>
                </div>
              )}

              {/* Reading Stats Grid (real data only) */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-3">
                  <BookOpen className="w-4 h-4 text-[#3B2FD6] mx-auto mb-1 pointer-events-none" aria-hidden="true" />
                  <p className="text-base font-bold text-[#141416]">12</p>
                  <p className="text-xs text-[#524E48]">Books read</p>
                </div>
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-3">
                  <Clock className="w-4 h-4 text-[#193B32] mx-auto mb-1 pointer-events-none" aria-hidden="true" />
                  <p className="text-base font-bold text-[#141416]">48h</p>
                  <p className="text-xs text-[#524E48]">Listening</p>
                </div>
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-3">
                  <Bookmark className="w-4 h-4 text-[#3B2FD6] mx-auto mb-1 pointer-events-none" aria-hidden="true" />
                  <p className="text-base font-bold text-[#141416]">{savedCount}</p>
                  <p className="text-xs text-[#524E48]">Saved</p>
                </div>
              </div>

              {/* Navigation Rows */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      setUnsavedPromptOpen(true);
                      return;
                    }
                    onOpenHighlights?.();
                  }}
                  className="w-full min-h-[52px] flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#141416] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <div className="flex items-center gap-3">
                    <Highlighter className="w-4 h-4 text-[#3B2FD6] flex-shrink-0 pointer-events-none" aria-hidden="true" />
                    <span className="text-sm font-semibold">Highlights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ECEAFD] text-[#3B2FD6] text-xs font-semibold">
                      {highlightsCount} saved
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#524E48] pointer-events-none" aria-hidden="true" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateToSubView('accessibility', { accessibilityReturn: 'profile' })
                  }
                  className="w-full min-h-[56px] flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#141416] text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Accessibility className="w-4 h-4 text-[#3B2FD6] mt-0.5 flex-shrink-0 pointer-events-none" aria-hidden="true" />
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold">Accessibility</span>
                      <span className="block text-xs text-[#524E48] truncate">
                        {accessibilitySummary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#524E48] flex-shrink-0 pointer-events-none" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateToSubView('settings')}
                  className="w-full min-h-[52px] flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#141416] text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Settings className="w-4 h-4 text-[#524E48] flex-shrink-0 pointer-events-none" aria-hidden="true" />
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold">Settings</span>
                      <span className="block text-xs text-[#524E48]">
                        Profile, audio, account
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasUnsavedChanges && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F5EAE0] text-[#7C4A1E] text-xs font-medium">
                        Unsaved
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#524E48] pointer-events-none" aria-hidden="true" />
                  </div>
                </button>
              </div>
            </div>

            {/* Quiet Fixed Footer for Sign Out */}
            <div className="shrink-0 bg-white border-t border-[#E4E4E7] px-5 sm:px-6 py-3.5">
              {!signOutConfirmOpen ? (
                <button
                  type="button"
                  onClick={() => setSignOutConfirmOpen(true)}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#D4D4D8] bg-transparent hover:bg-[#F4F4F5] text-[#524E48] hover:text-[#141416] text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <LogOut className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              ) : (
                <div
                  role="alertdialog"
                  aria-labelledby="signout-confirm-heading"
                  className="rounded-2xl border border-[#E4E4E7] bg-white p-3.5 space-y-2.5"
                >
                  <p id="signout-confirm-heading" className="text-sm font-semibold text-[#141416]">
                    Sign out of NeuroRead?
                  </p>
                  <p className="text-xs text-[#524E48]">
                    Your reading preferences stay saved on this device.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSignOutConfirmOpen(false)}
                      className="flex-1 min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-xs font-semibold text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSignOutConfirmOpen(false);
                        onClose();
                        onSignOut?.();
                      }}
                      className="flex-1 min-h-[44px] px-4 py-2 rounded-full border border-[#141416] bg-[#141416] hover:bg-[#2A2A2E] text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
