import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import UserAvatar from './UserAvatar';
import AccountPageLayout from './AccountPageLayout';
import {
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
  LINE_SPACING_OPTIONS,
  READER_THEME_OPTIONS,
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
 * Single centered Settings page with vertically stacked sections, 32px spacing,
 * 1px hairline dividers, full-width controls, and clear Save action.
 */
export default function SettingsPage({
  profile,
  onSaveProfile,
  accessibilityState,
  onChangeAccessibility,
  audioDefaults,
  onSaveAudioDefaults,
  onOpenEditProfile,
  onDownloadData,
  onDeleteAccount,
  onBack,
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [emailError, setEmailError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  const [audioVoiceId, setAudioVoiceId] = useState(audioDefaults.voiceId || 'system-default');
  const [audioSpeed, setAudioSpeed] = useState(audioDefaults.playbackSpeed || 1.0);
  const [voiceOptions, setVoiceOptions] = useState(FALLBACK_VOICES);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  const [downloadStatus, setDownloadStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        setVoiceOptions([
          { id: 'system-default', label: 'System default voice' },
          ...voices.slice(0, 12).map((v) => ({
            id: v.voiceURI || v.name,
            label: `${v.name} (${v.lang})`,
          })),
        ]);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  const nameError = validateDisplayName(displayName);
  const showNameError = nameTouched && Boolean(nameError);
  const hasUnsavedChanges =
    displayName !== profile.displayName ||
    email !== profile.email ||
    audioVoiceId !== (audioDefaults.voiceId || 'system-default') ||
    Number(audioSpeed) !== Number(audioDefaults.playbackSpeed || 1.0);

  const handleSave = (e) => {
    e.preventDefault();
    setNameTouched(true);
    if (nameError) return;
    onSaveProfile({ displayName: displayName.trim(), email: email.trim() });
    onSaveAudioDefaults({ voiceId: audioVoiceId, playbackSpeed: Number(audioSpeed) });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleApplyEmail = () => {
    const err = validateEmail(emailInput);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');
    setEmail(emailInput.trim());
    setEditingEmail(false);
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

  return (
    <AccountPageLayout
      activePage="settings"
      onBack={onBack}
      title="Settings"
      subtitle="Manage your profile, reading defaults, Voice Reader, and account."
    >
      <form onSubmit={handleSave} noValidate className="space-y-8">
        {/* Section 1: Profile */}
        <section
          aria-labelledby="settings-sec-profile"
          className="border-t border-[#E4E4E7] pt-8 space-y-5"
        >
          <div>
            <h2 id="settings-sec-profile" className="text-base font-semibold text-[#141416]">
              Profile
            </h2>
            <p className="text-xs text-[#524E48] mt-0.5">
              Your photo, display name, and sign-in email.
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-[#141416]">Photo</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <UserAvatar
                name={displayName}
                src={profile.avatarUrl}
                sizeClass="w-12 h-12"
                textClass="text-sm"
                ringClass="ring-1 ring-[#E4E4E7]"
              />
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-sm font-medium text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Change photo
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-page-name" className="block text-sm font-medium text-[#141416]">
              Display name
            </label>
            <input
              id="settings-page-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              aria-invalid={showNameError}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            />
            {showNameError && (
              <p role="alert" className="text-xs text-[#8F291E] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-[#141416]">Email</span>
            {!editingEmail ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm text-[#524E48] break-all">{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput(email);
                    setEmailError('');
                    setEditingEmail(true);
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-sm font-medium text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Change email
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="email"
                  aria-label="New email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
                />
                {emailError && (
                  <p role="alert" className="text-xs text-[#8F291E]">
                    {emailError}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyEmail}
                    className="w-full sm:w-auto min-h-[44px] px-4 border border-[#141416] text-sm font-medium text-[#141416] hover:bg-[#F4F4F5] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEmail(false)}
                    className="w-full sm:w-auto min-h-[44px] px-3 border border-[#D4D4D8] text-sm text-[#524E48] hover:text-[#141416] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Reading */}
        <section
          aria-labelledby="settings-sec-reading"
          className="border-t border-[#E4E4E7] pt-8 space-y-5"
        >
          <div>
            <h2 id="settings-sec-reading" className="text-base font-semibold text-[#141416]">
              Reading
            </h2>
            <p className="text-xs text-[#524E48] mt-0.5">
              Typography, spacing, and reader theme applied when opening books.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-reading-font" className="block text-sm font-medium text-[#141416]">
              Default font
            </label>
            <select
              id="settings-reading-font"
              value={accessibilityState.fontMode}
              onChange={(e) => onChangeAccessibility({ fontMode: e.target.value })}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-reading-size" className="block text-sm font-medium text-[#141416]">
              Text size
            </label>
            <select
              id="settings-reading-size"
              value={accessibilityState.textSize}
              onChange={(e) => onChangeAccessibility({ textSize: Number(e.target.value) })}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {TEXT_SIZE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({s.scale})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-reading-spacing" className="block text-sm font-medium text-[#141416]">
              Line spacing
            </label>
            <select
              id="settings-reading-spacing"
              value={accessibilityState.lineSpacing}
              onChange={(e) => onChangeAccessibility({ lineSpacing: e.target.value })}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {LINE_SPACING_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label} ({l.value})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-reading-theme" className="block text-sm font-medium text-[#141416]">
              Reader theme
            </label>
            <select
              id="settings-reading-theme"
              value={accessibilityState.readerTheme}
              onChange={(e) => onChangeAccessibility({ readerTheme: e.target.value })}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {READER_THEME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <label
              htmlFor="settings-reading-focus"
              className="min-h-[44px] inline-flex items-center gap-3 cursor-pointer"
            >
              <input
                id="settings-reading-focus"
                type="checkbox"
                checked={accessibilityState.focusMode}
                onChange={(e) => onChangeAccessibility({ focusMode: e.target.checked })}
                className="w-4 h-4 accent-[#3B2FD6] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              />
              <span className="text-sm text-[#141416]">
                Focus mode — dim surrounding sections while reading
              </span>
            </label>
          </div>
        </section>

        {/* Section 3: Audio */}
        <section
          aria-labelledby="settings-sec-audio"
          className="border-t border-[#E4E4E7] pt-8 space-y-5"
        >
          <div>
            <h2 id="settings-sec-audio" className="text-base font-semibold text-[#141416]">
              Audio
            </h2>
            <p className="text-xs text-[#524E48] mt-0.5">
              Default voice and playback speed for Voice Reader.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-audio-voice" className="block text-sm font-medium text-[#141416]">
              Default voice
            </label>
            <select
              id="settings-audio-voice"
              value={audioVoiceId}
              onChange={(e) => setAudioVoiceId(e.target.value)}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {voiceOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-audio-speed" className="block text-sm font-medium text-[#141416]">
              Playback speed
            </label>
            <select
              id="settings-audio-speed"
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(Number(e.target.value))}
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            >
              {AUDIO_SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Section 4: Account */}
        <section
          aria-labelledby="settings-sec-account"
          className="border-t border-[#E4E4E7] pt-8 space-y-5"
        >
          <div>
            <h2 id="settings-sec-account" className="text-base font-semibold text-[#141416]">
              Account
            </h2>
            <p className="text-xs text-[#524E48] mt-0.5">
              Security, data export, and account removal.
            </p>
          </div>

          <div className="divide-y divide-[#E4E4E7] border-t border-b border-[#E4E4E7]">
            <div className="py-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#141416]">Password</p>
                  <p className="text-xs text-[#524E48]">Update your sign-in password</p>
                </div>
                <button
                  type="button"
                  aria-expanded={passwordOpen}
                  onClick={() => {
                    setPasswordOpen((o) => !o);
                    setPwError('');
                    setPwStatus('');
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-sm font-medium text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  {passwordOpen ? 'Cancel' : 'Change password'}
                </button>
              </div>

              {passwordOpen && (
                <div className="space-y-2.5 pt-2">
                  <input
                    type="password"
                    aria-label="Current password"
                    placeholder="Current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416]"
                  />
                  <input
                    type="password"
                    aria-label="New password"
                    placeholder="New password (8+ characters)"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416]"
                  />
                  <input
                    type="password"
                    aria-label="Confirm new password"
                    placeholder="Confirm new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416]"
                  />
                  {pwError && (
                    <p role="alert" className="text-xs text-[#8F291E]">
                      {pwError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    className="w-full sm:w-auto min-h-[44px] px-4 border border-[#141416] text-sm font-medium text-[#141416] hover:bg-[#F4F4F5] rounded-md"
                  >
                    Update password
                  </button>
                </div>
              )}

              {pwStatus && (
                <p role="status" className="text-xs text-[#2F5947]">
                  {pwStatus}
                </p>
              )}
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-[#141416]">Your reading data</p>
                <p className="text-xs text-[#524E48]">
                  {downloadStatus || 'Download a JSON copy of your profile, saved books, and highlights'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onDownloadData?.();
                  setDownloadStatus('Downloaded JSON');
                }}
                className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] text-sm font-medium text-[#141416] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Download
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#141416]">Delete account</p>
                  <p className="text-xs text-[#524E48]">
                    Clear your profile, saved books, and highlights from this session
                  </p>
                </div>
                {!deleteConfirm && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D8B4AE] text-sm font-medium text-[#8F291E] hover:bg-[#FDF4F2] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Delete account
                  </button>
                )}
              </div>

              {deleteConfirm && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                  <span className="text-xs text-[#524E48]">Clear all session data?</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirm(false);
                        onDeleteAccount?.();
                      }}
                      className="w-full sm:w-auto min-h-[44px] px-4 rounded-md bg-[#8F291E] hover:bg-[#752017] text-white text-xs font-semibold"
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="w-full sm:w-auto min-h-[44px] px-4 rounded-md border border-[#D4D4D8] text-xs font-medium text-[#524E48] hover:text-[#141416]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Save Row */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <div role="status" aria-live="polite" className="text-sm">
            {savedBanner ? (
              <span className="inline-flex items-center gap-1.5 text-[#2F5947]">
                <Check className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                <span>Saved</span>
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-[#524E48]">Unsaved changes</span>
            ) : (
              <span className="text-[#524E48]">All changes saved</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!hasUnsavedChanges || Boolean(nameError)}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-md bg-[#3B2FD6] hover:bg-[#3126B8] text-white text-sm font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            Save changes
          </button>
        </div>
      </form>
    </AccountPageLayout>
  );
}
