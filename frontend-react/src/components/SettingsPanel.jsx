import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Download,
  KeyRound,
  Sliders,
  Trash2,
  AlertCircle,
  X,
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import {
  formatAccessibilitySummary,
  validateDisplayName,
  validateEmail,
} from '../utils/profileHelpers';

const AUDIO_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

const FALLBACK_VOICES = [
  { id: 'system-default', label: 'System default voice' },
  { id: 'calm-neutral', label: 'Calm neutral' },
  { id: 'warm-clear', label: 'Warm & clear' },
];

/**
 * Settings view rendered inside the single ProfileModal dialog.
 * Fixed header and Save footer with an independently scrolling body.
 */
export default function SettingsPanel({
  draft,
  onChangeDraft,
  hasUnsavedChanges,
  savedBanner,
  onSave,
  onBackToProfile,
  onCloseModal,
  onOpenAvatarUpload,
  onOpenAvatarDefaults,
  onRemoveAvatar,
  onOpenReadingPreferences,
  accessibilityState,
  onDownloadData,
  onDeleteAccount,
  hasAvatarPhoto,
  headingRef,
  focusField,
  unsavedBanner,
}) {
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(draft.email);
  const [emailError, setEmailError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  // Account: Change password inline panel
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  // Account: Download & Delete confirmation
  const [downloadStatus, setDownloadStatus] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // SpeechSynthesis voices
  const [voiceOptions, setVoiceOptions] = useState(FALLBACK_VOICES);

  const nameInputRef = useRef(null);
  const photoMenuRef = useRef(null);

  useEffect(() => {
    if (focusField === 'displayName') {
      requestAnimationFrame(() => nameInputRef.current?.focus());
    }
  }, [focusField]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        const mapped = voices.slice(0, 12).map((v) => ({
          id: v.voiceURI || v.name,
          label: `${v.name} (${v.lang})`,
        }));
        setVoiceOptions([{ id: 'system-default', label: 'System default voice' }, ...mapped]);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

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

  const nameError = validateDisplayName(draft.displayName);
  const showNameError = (nameTouched || draft.displayName !== '') && Boolean(nameError);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameTouched(true);
    if (nameError) {
      nameInputRef.current?.focus();
      return;
    }
    onSave();
  };

  const handleApplyEmail = () => {
    const err = validateEmail(emailInput);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');
    onChangeDraft({ email: emailInput.trim() });
    setIsEditingEmail(false);
    setEmailStatus('Email updated in your draft. Save changes to apply.');
  };

  const handlePasswordSubmit = () => {
    setPwError('');
    setPwStatus('');
    if (!currentPw) {
      setPwError('Please enter your current password.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setPasswordOpen(false);
    setPwStatus('Password updated.');
  };

  const handleExportClick = () => {
    onDownloadData?.();
    setDownloadStatus('Your reading data file (JSON) has been downloaded.');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0">
      {/* Fixed Header */}
      <div className="shrink-0 bg-white px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-[#E4E4E7] relative">
        <button
          type="button"
          onClick={onCloseModal}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          <X className="w-5 h-5 pointer-events-none" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pr-12 mb-2">
          <button
            type="button"
            onClick={onBackToProfile}
            aria-label="Back to Profile"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 -ml-3 rounded-full text-sm font-semibold text-[#3B2FD6] hover:bg-[#ECEAFD]/60 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" aria-hidden="true" />
            <span>Back to Profile</span>
          </button>

          {hasUnsavedChanges && (
            <span className="text-xs font-medium text-[#7C4A1E] bg-[#F5EAE0] border border-[#E5D0BC] px-2.5 py-1 rounded-full">
              Unsaved edits
            </span>
          )}
        </div>

        <h2
          id="settings-dialog-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-editorial text-2xl font-bold text-[#141416] tracking-tight focus:outline-none"
        >
          Settings
        </h2>
        <p className="text-sm text-[#524E48] mt-0.5">
          Update your profile, audio defaults, and account.
        </p>
      </div>

      {/* Scrollable Middle Area */}
      <div className="flex-1 min-h-0 overflow-y-auto modal-scroll mr-1.5 sm:mr-2 pl-5 sm:pl-6 pr-3.5 sm:pr-4 pt-5 pb-8 space-y-5">
        {unsavedBanner}

        {/* Section 1: Profile */}
        <section
          aria-labelledby="settings-profile-heading"
          className="bg-white border border-[#E4E4E7] rounded-2xl p-4 space-y-4"
        >
          <h3
            id="settings-profile-heading"
            className="text-sm font-semibold text-[#141416] border-b border-[#F4F4F5] pb-2"
          >
            Profile
          </h3>

          {/* Photo Row */}
          <div className="flex items-center gap-4">
            <UserAvatar
              name={draft.displayName}
              src={draft.avatarUrl}
              sizeClass="w-16 h-16"
              textClass="text-lg"
              ringClass="ring-1 ring-[#D4D4D8]"
            />
            <div className="relative" ref={photoMenuRef}>
              <button
                type="button"
                aria-expanded={photoMenuOpen}
                aria-haspopup="menu"
                onClick={() => setPhotoMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-[#FAFAFA] hover:bg-[#F4F4F5] text-sm font-semibold text-[#141416] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                <Camera className="w-4 h-4 text-[#3B2FD6] pointer-events-none" aria-hidden="true" />
                <span>Change photo</span>
              </button>

              {photoMenuOpen && (
                <div
                  role="menu"
                  aria-label="Profile photo options"
                  className="absolute left-0 mt-2 w-56 rounded-2xl bg-white border border-[#E4E4E7] shadow-lg p-1.5 z-20 space-y-0.5"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setPhotoMenuOpen(false);
                      onOpenAvatarUpload();
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
                      onOpenAvatarDefaults();
                    }}
                    className="w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Choose from default avatars
                  </button>
                  {hasAvatarPhoto && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setPhotoMenuOpen(false);
                        onRemoveAvatar();
                      }}
                      className="w-full text-left min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium text-[#8F291E] hover:bg-[#FDF4F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor="settings-display-name"
              className="block text-sm font-semibold text-[#141416] mb-1.5"
            >
              Display name
            </label>
            <input
              ref={nameInputRef}
              id="settings-display-name"
              type="text"
              required
              maxLength={45}
              value={draft.displayName}
              onChange={(e) => onChangeDraft({ displayName: e.target.value })}
              onBlur={() => setNameTouched(true)}
              aria-invalid={showNameError}
              aria-describedby={showNameError ? 'settings-name-error' : 'settings-name-hint'}
              className={`w-full min-h-[44px] bg-[#FAFAFA] border rounded-xl px-3.5 py-2.5 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6] ${
                showNameError ? 'border-[#B93829]' : 'border-[#D4D4D8] focus:border-[#3B2FD6]'
              }`}
            />
            {showNameError ? (
              <p
                id="settings-name-error"
                role="alert"
                className="mt-1.5 text-xs text-[#8F291E] flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 pointer-events-none" aria-hidden="true" />
                <span>{nameError}</span>
              </p>
            ) : (
              <p id="settings-name-hint" className="mt-1 text-xs text-[#524E48]">
                Shown on your profile and reading notes (2–40 characters).
              </p>
            )}
          </div>

          {/* Email (Read-only with inline Change action) */}
          <div>
            <span className="block text-sm font-semibold text-[#141416] mb-1.5">
              Email address
            </span>
            {!isEditingEmail ? (
              <div className="flex items-center justify-between gap-3 min-h-[44px] bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3.5 py-2">
                <span className="text-sm text-[#141416] truncate">{draft.email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput(draft.email);
                    setEmailError('');
                    setEmailStatus('');
                    setIsEditingEmail(true);
                  }}
                  className="min-h-[44px] px-2 text-sm font-semibold text-[#3B2FD6] hover:underline flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-lg"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-3">
                <label htmlFor="settings-email-input" className="block text-xs font-medium text-[#524E48]">
                  New email address
                </label>
                <input
                  id="settings-email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'settings-email-error' : undefined}
                  className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-xl px-3 py-2 text-sm text-[#141416] focus:outline-none focus:border-[#3B2FD6]"
                />
                {emailError && (
                  <p id="settings-email-error" role="alert" className="text-xs text-[#8F291E]">
                    {emailError}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyEmail}
                    className="min-h-[44px] px-4 py-1.5 rounded-full bg-[#3B2FD6] text-white text-xs font-semibold hover:bg-[#3126B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Update email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmail(false);
                      setEmailInput(draft.email);
                      setEmailError('');
                    }}
                    className="min-h-[44px] px-4 py-1.5 rounded-full border border-[#D4D4D8] bg-white text-xs font-semibold text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {emailStatus && (
              <p role="status" className="mt-1.5 text-xs text-[#524E48]">
                {emailStatus}
              </p>
            )}
          </div>
        </section>

        {/* Section 2: Reading Preferences (Reuses Accessibility panel) */}
        <section
          aria-labelledby="settings-reading-heading"
          className="bg-white border border-[#E4E4E7] rounded-2xl p-4 space-y-3"
        >
          <h3 id="settings-reading-heading" className="text-sm font-semibold text-[#141416]">
            Reading preferences
          </h3>
          <p className="text-xs text-[#524E48]">
            Default font, text size, line spacing, and reader theme are managed in Accessibility.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-3">
            <p className="text-xs font-medium text-[#141416]">
              Current: <span className="text-[#524E48]">{formatAccessibilitySummary(accessibilityState)}</span>
            </p>
            <button
              type="button"
              onClick={onOpenReadingPreferences}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-xs font-semibold text-[#141416] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B2FD6] pointer-events-none" aria-hidden="true" />
              <span>Open accessibility settings</span>
            </button>
          </div>
        </section>

        {/* Section 3: Audio Defaults */}
        <section
          aria-labelledby="settings-audio-heading"
          className="bg-white border border-[#E4E4E7] rounded-2xl p-4 space-y-4"
        >
          <h3 id="settings-audio-heading" className="text-sm font-semibold text-[#141416]">
            Audio
          </h3>

          <div>
            <label
              htmlFor="settings-audio-voice"
              className="block text-sm font-medium text-[#141416] mb-1.5"
            >
              Default voice for Voice Reader
            </label>
            <select
              id="settings-audio-voice"
              value={draft.audioVoiceId}
              onChange={(e) => onChangeDraft({ audioVoiceId: e.target.value })}
              className="w-full min-h-[44px] bg-[#FAFAFA] border border-[#D4D4D8] rounded-xl px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus:border-[#3B2FD6] focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {voiceOptions.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span id="settings-audio-speed-label" className="text-sm font-medium text-[#141416]">
                Default playback speed
              </span>
              <span className="text-sm font-semibold text-[#3B2FD6]" aria-live="polite">
                {draft.audioSpeed}x
              </span>
            </div>
            <div
              role="radiogroup"
              aria-labelledby="settings-audio-speed-label"
              className="grid grid-cols-3 sm:grid-cols-6 gap-1.5"
            >
              {AUDIO_SPEEDS.map((speed) => {
                const isSelected = draft.audioSpeed === speed;
                return (
                  <button
                    key={speed}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onChangeDraft({ audioSpeed: speed })}
                    className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                      isSelected
                        ? 'bg-[#3B2FD6] border-[#3B2FD6] text-white'
                        : 'bg-[#FAFAFA] border-[#E4E4E7] text-[#141416] hover:border-[#A1A1AA]'
                    }`}
                  >
                    {speed}x
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Account */}
        <section
          aria-labelledby="settings-account-heading"
          className="bg-white border border-[#E4E4E7] rounded-2xl p-4 space-y-3"
        >
          <h3 id="settings-account-heading" className="text-sm font-semibold text-[#141416]">
            Account
          </h3>

          {/* Change Password */}
          <div className="border border-[#F4F4F5] rounded-xl p-3 bg-[#FAFAFA]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-[#524E48] pointer-events-none" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-[#141416]">Password</p>
                  <p className="text-xs text-[#524E48]">Update your sign-in password</p>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={passwordOpen}
                onClick={() => {
                  setPasswordOpen((o) => !o);
                  setPwError('');
                  setPwStatus('');
                }}
                className="min-h-[44px] px-3 text-sm font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-lg"
              >
                {passwordOpen ? 'Cancel' : 'Change password'}
              </button>
            </div>

            {passwordOpen && (
              <div className="mt-3 pt-3 border-t border-[#E4E4E7] space-y-2.5">
                <div>
                  <label htmlFor="pw-current" className="block text-xs font-medium text-[#141416] mb-1">
                    Current password
                  </label>
                  <input
                    id="pw-current"
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-xl px-3 py-2 text-sm text-[#141416] focus:outline-none focus:border-[#3B2FD6]"
                  />
                </div>
                <div>
                  <label htmlFor="pw-new" className="block text-xs font-medium text-[#141416] mb-1">
                    New password (8+ characters)
                  </label>
                  <input
                    id="pw-new"
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-xl px-3 py-2 text-sm text-[#141416] focus:outline-none focus:border-[#3B2FD6]"
                  />
                </div>
                <div>
                  <label htmlFor="pw-confirm" className="block text-xs font-medium text-[#141416] mb-1">
                    Confirm new password
                  </label>
                  <input
                    id="pw-confirm"
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-xl px-3 py-2 text-sm text-[#141416] focus:outline-none focus:border-[#3B2FD6]"
                  />
                </div>
                {pwError && (
                  <p role="alert" className="text-xs text-[#8F291E]">
                    {pwError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="min-h-[44px] px-4 py-2 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Update password
                </button>
              </div>
            )}

            {pwStatus && (
              <p role="status" className="mt-2 text-xs font-medium text-[#2F5947]">
                {pwStatus}
              </p>
            )}
          </div>

          {/* Download My Data */}
          <div className="border border-[#F4F4F5] rounded-xl p-3 bg-[#FAFAFA]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-[#524E48] pointer-events-none" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-[#141416]">Your reading data</p>
                  <p className="text-xs text-[#524E48]">Export profile, saved books, and highlights</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportClick}
                className="min-h-[44px] px-3.5 py-2 rounded-full border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-xs font-semibold text-[#141416] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Download my data
              </button>
            </div>
            {downloadStatus && (
              <p role="status" className="mt-2 text-xs font-medium text-[#2F5947]">
                {downloadStatus}
              </p>
            )}
          </div>

          {/* Delete Account */}
          <div className="border border-[#E8D8D4] rounded-xl p-3 bg-[#FCF8F7]">
            {!deleteConfirmOpen ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-[#8F291E] pointer-events-none" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-[#141416]">Delete account</p>
                    <p className="text-xs text-[#524E48]">Permanently remove your account and reading history</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-full border border-[#D8B4AE] bg-white hover:bg-[#FDF4F2] text-xs font-semibold text-[#8F291E] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Delete account
                </button>
              </div>
            ) : (
              <div className="space-y-3" role="alertdialog" aria-labelledby="delete-confirm-title">
                <p id="delete-confirm-title" className="text-sm font-semibold text-[#8F291E]">
                  Delete your NeuroRead account?
                </p>
                <p className="text-xs text-[#524E48]">
                  This permanently clears your profile, saved books, and highlights from this session.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-white text-xs font-semibold text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      onDeleteAccount?.();
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-full bg-[#8F291E] hover:bg-[#752017] text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Yes, delete account
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Fixed Solid Footer */}
      <div className="shrink-0 bg-white border-t border-[#E4E4E7] px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="min-h-[20px] flex items-center" aria-live="polite" role="status">
          {savedBanner ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2F5947]">
              <Check className="w-4 h-4 pointer-events-none" aria-hidden="true" />
              <span>Saved</span>
            </span>
          ) : hasUnsavedChanges ? (
            <span className="text-xs text-[#524E48]">You have unsaved changes</span>
          ) : (
            <span className="text-xs text-[#524E48]">All changes saved</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!hasUnsavedChanges || Boolean(nameError)}
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] disabled:bg-[#D4D4D8] disabled:text-[#524E48] disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
