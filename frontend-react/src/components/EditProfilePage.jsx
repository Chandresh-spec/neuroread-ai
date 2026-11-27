import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Camera,
  User,
  ImagePlus,
  Trash2,
  ArrowLeft,
  Shield,
  HardDrive,
  FileText,
  ChevronRight,
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import {
  DEFAULT_AVATARS,
  validateAvatarFile,
  validateDisplayName,
} from '../utils/profileHelpers';

export default function EditProfilePage({
  profile,
  onSaveProfile,
  onUploadAvatar,
  onRemoveAvatar,
  onBack,
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [nameTouched, setNameTouched] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  const [photoPanel, setPhotoPanel] = useState('none');
  const [imageSrc, setImageSrc] = useState(null);
  const [imageNatural, setImageNatural] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState(profile.avatarUrl || '');

  const fileInputRef = useRef(null);
  const imgElementRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, origX: 0, origY: 0 });

  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const nameError = validateDisplayName(displayName);
  const showNameError = nameTouched && Boolean(nameError);
  const isNameDirty = displayName.trim() !== profile.displayName;

  const handleSaveName = (e) => {
    e.preventDefault();
    setNameTouched(true);
    if (nameError) return;
    onSaveProfile({ displayName: displayName.trim() });
    setSavedStatus('Changes saved');
    setTimeout(() => setSavedStatus(''), 2500);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateAvatarFile(file);
    if (err) { setPhotoError(err); e.target.value = ''; return; }
    setPhotoError('');
    if (imageSrc && imageSrc.startsWith('blob:')) URL.revokeObjectURL(imageSrc);
    setImageSrc(URL.createObjectURL(file));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setPhotoPanel('upload');
  };

  const handlePointerDown = (e) => {
    if (!imageSrc) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, origX: offset.x, origY: offset.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const limit = 90 * zoom;
    setOffset({
      x: Math.max(-limit, Math.min(limit, dragStartRef.current.origX + dx)),
      y: Math.max(-limit, Math.min(limit, dragStartRef.current.origY + dy)),
    });
  };

  const renderCroppedDataUrl = () => {
    const imgEl = imgElementRef.current;
    if (!imgEl || !imageNatural.width || !imageNatural.height) return null;
    const outputSize = 320;
    const previewSize = 192;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const baseScale = Math.max(previewSize / imageNatural.width, previewSize / imageNatural.height);
    const totalScale = baseScale * zoom;
    const drawnW = imageNatural.width * totalScale;
    const drawnH = imageNatural.height * totalScale;
    const ratio = outputSize / previewSize;
    const drawX = (previewSize - drawnW) / 2 + offset.x;
    const drawY = (previewSize - drawnH) / 2 + offset.y;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.drawImage(imgEl, drawX * ratio, drawY * ratio, drawnW * ratio, drawnH * ratio);
    return canvas.toDataURL('image/png', 0.92);
  };

  const handleConfirmUpload = async () => {
    const cropped = renderCroppedDataUrl();
    if (!cropped) { setPhotoError('Could not prepare that image. Please try another file.'); return; }
    setIsUploading(true);
    try {
      await onUploadAvatar(cropped);
      setPhotoPanel('none');
      setImageSrc(null);
      setSavedStatus('Photo updated');
      setTimeout(() => setSavedStatus(''), 2500);
    } finally { setIsUploading(false); }
  };

  const handleConfirmDefault = async () => {
    if (!selectedDefault) return;
    setIsUploading(true);
    try {
      await onUploadAvatar(selectedDefault);
      setPhotoPanel('none');
      setSavedStatus('Photo updated');
      setTimeout(() => setSavedStatus(''), 2500);
    } finally { setIsUploading(false); }
  };

  const sideNavItems = [
    { id: 'profile', label: 'Profile', icon: User, desc: 'Photo & display name' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Email & account' },
    { id: 'storage', label: 'Storage', icon: HardDrive, desc: 'Usage & files' },
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

      {/* ── MOBILE TOP BAR (hidden on lg+) ───────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-[#E8E8EF]">
        {/* Back + identity row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-[#6B6B7B] hover:text-[#141416] hover:bg-[#F5F5F8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="relative group flex-shrink-0">
            <UserAvatar
              name={displayName}
              src={profile.avatarUrl}
              sizeClass="w-9 h-9"
              textClass="text-sm"
              ringClass="ring-2 ring-[#E8E8EF]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Change photo"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#141416] truncate">{displayName || 'Reader'}</p>
            <p className="text-[11px] text-[#9994A8] truncate">{profile.email}</p>
          </div>
        </div>
        {/* Section tab pills */}
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {sideNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${
                activeSection === id
                  ? 'bg-[#141416] text-white'
                  : 'bg-[#F5F5F8] text-[#6B6B7B] hover:bg-[#EBEBEF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ───────────────────────────── */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 bg-white border-r border-[#E8E8EF] flex-col">
        {/* Back */}
        <div className="px-5 pt-6 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B7B] hover:text-[#141416] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Back
          </button>
        </div>

        {/* Identity block */}
        <div className="px-5 pb-6 border-b border-[#E8E8EF]">
          <div className="flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <UserAvatar
                name={displayName}
                src={profile.avatarUrl}
                sizeClass="w-12 h-12"
                textClass="text-base"
                ringClass="ring-2 ring-[#E8E8EF]"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus-visible:opacity-100 focus-visible:outline-none"
                aria-label="Change photo"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#141416] truncate">{displayName || 'Reader'}</p>
              <p className="text-xs text-[#9994A8] truncate mt-0.5">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="Profile sections">
          <ul className="space-y-0.5">
            {sideNavItems.map(({ id, label, icon: Icon, desc }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${
                    activeSection === id
                      ? 'bg-[#F5F5F8] text-[#141416]'
                      : 'text-[#6B6B7B] hover:bg-[#F9F9FB] hover:text-[#141416]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${activeSection === id ? 'text-[#4B3AE8]' : 'text-[#A0A0B0]'}`} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium leading-tight">{label}</span>
                    <span className="block text-[11px] text-[#A0A0B0] mt-0.5">{desc}</span>
                  </span>
                  {activeSection === id && (
                    <span className="w-1 h-1 rounded-full bg-[#4B3AE8] flex-shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer hint */}
        <div className="px-5 py-4 border-t border-[#E8E8EF]">
          <p className="text-[11px] text-[#C4C0CC] leading-relaxed">JPG, PNG or WebP · Max 5 MB</p>
        </div>
      </aside>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="sr-only"
      />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 bg-[#F9F9FB] px-4 sm:px-6 lg:px-10 xl:px-14 py-5 lg:py-8 overflow-y-auto">

        {/* Page heading */}
        <div className="mb-5 lg:mb-7">
          <h1 className="text-lg lg:text-xl font-semibold text-[#141416] tracking-tight">
            {activeSection === 'profile' && 'Edit Profile'}
            {activeSection === 'security' && 'Security'}
            {activeSection === 'storage' && 'Storage'}
          </h1>
          <p className="text-sm text-[#9994A8] mt-1">
            {activeSection === 'profile' && 'Update your profile photo and display name.'}
            {activeSection === 'security' && 'Manage your email and account credentials.'}
            {activeSection === 'storage' && 'View your storage usage and uploaded files.'}
          </p>
        </div>

        {/* ── PROFILE ───────────────────────────────────────────────────── */}
        {activeSection === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">

            {/* Photo card */}
            <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
              <div className="px-6 py-5">
                <h2 className="text-sm font-semibold text-[#141416]">Profile photo</h2>
                <p className="text-xs text-[#9994A8] mt-0.5">Shown in your navbar and account menu</p>
              </div>

              <div className="px-6 py-5 flex items-center gap-4">
                <div className="relative group flex-shrink-0">
                  <UserAvatar
                    name={displayName}
                    src={profile.avatarUrl}
                    sizeClass="w-16 h-16"
                    textClass="text-xl"
                    ringClass="ring-2 ring-[#E8E8EF]"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus-visible:opacity-100 focus-visible:outline-none"
                    aria-label="Change photo"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#141416]">{displayName || 'Reader'}</p>
                  <p className="text-xs text-[#9994A8] mt-0.5">{profile.email}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-[#141416] hover:bg-[#27272D] rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141416]"
                >
                  <ImagePlus className="w-4 h-4" />
                  Upload photo
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPhotoError(''); setPhotoPanel((p) => (p === 'defaults' ? 'none' : 'defaults')); }}
                    className="flex items-center justify-center gap-1.5 h-10 px-3 text-sm font-medium text-[#524E48] bg-white border border-[#E8E8EF] hover:bg-[#F5F5F8] rounded-xl transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#9994A8]" />
                    Avatars
                  </button>
                  {Boolean(profile.avatarUrl) && (
                    <button
                      type="button"
                      onClick={() => { onRemoveAvatar(); setPhotoPanel('none'); setSavedStatus('Photo removed'); setTimeout(() => setSavedStatus(''), 2500); }}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 text-sm font-medium text-[#9994A8] bg-white border border-[#E8E8EF] hover:bg-[#F5F5F8] hover:text-[#524E48] rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                {photoError && (
                  <p role="alert" className="text-xs text-[#DC2626] flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {photoError}
                  </p>
                )}
              </div>

              {/* Crop panel */}
              {photoPanel === 'upload' && imageSrc && (
                <div className="px-6 py-5 space-y-4">
                  <p className="text-xs font-semibold text-[#524E48]">Adjust your photo</p>
                  <div className="flex items-start gap-4">
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={() => setIsDragging(false)}
                      onPointerCancel={() => setIsDragging(false)}
                      className="relative w-28 h-28 rounded-full overflow-hidden border border-[#E8E8EF] bg-[#F5F5F8] cursor-grab active:cursor-grabbing touch-none select-none flex-shrink-0"
                      aria-label="Circular crop preview. Drag to adjust."
                    >
                      <img
                        ref={imgElementRef}
                        src={imageSrc}
                        alt="Crop preview"
                        onLoad={(e) => setImageNatural({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
                        draggable={false}
                        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label htmlFor="edit-profile-zoom" className="block text-xs text-[#9994A8] mb-1.5">
                          Zoom — {Math.round(zoom * 100)}%
                        </label>
                        <input id="edit-profile-zoom" type="range" min="1" max="3" step="0.05" value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#4B3AE8]" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={handleConfirmUpload} disabled={isUploading}
                          className="flex-1 h-9 text-xs font-semibold bg-[#141416] hover:bg-[#27272D] text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                          {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {isUploading ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" onClick={() => { setPhotoPanel('none'); setImageSrc(null); }}
                          className="flex-1 h-9 text-xs font-medium text-[#6B6B7B] border border-[#E8E8EF] hover:bg-[#F5F5F8] rounded-lg transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Default avatars */}
              {photoPanel === 'defaults' && (
                <div className="px-6 py-5 space-y-3">
                  <p className="text-xs font-semibold text-[#524E48]">Choose a default avatar</p>
                  <div className="grid grid-cols-4 gap-2">
                    {DEFAULT_AVATARS.map((item) => {
                      const isSelected = selectedDefault === item.dataUrl;
                      return (
                        <button key={item.id} type="button" onClick={() => setSelectedDefault(item.dataUrl)}
                          aria-label={item.label} aria-pressed={isSelected}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                            isSelected ? 'border-[#141416] bg-[#F5F5F8]' : 'border-transparent bg-[#F9F9FB] hover:border-[#D4D4D8]'
                          }`}
                        >
                          <img src={item.dataUrl} alt="" className="w-9 h-9 rounded-full" />
                          <span className="text-[9px] text-[#9994A8] truncate w-full text-center">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleConfirmDefault} disabled={!selectedDefault || isUploading}
                      className="flex-1 h-9 text-xs font-semibold bg-[#141416] hover:bg-[#27272D] text-white rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors">
                      {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Use this avatar
                    </button>
                    <button type="button" onClick={() => setPhotoPanel('none')}
                      className="flex-1 h-9 text-xs font-medium text-[#6B6B7B] border border-[#E8E8EF] hover:bg-[#F5F5F8] rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Display name card */}
            <form onSubmit={handleSaveName} noValidate>
              <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
                <div className="px-6 py-5">
                  <h2 className="text-sm font-semibold text-[#141416]">Display name</h2>
                  <p className="text-xs text-[#9994A8] mt-0.5">Shown in your account menu and reading notes</p>
                </div>

                <div className="px-6 py-5 space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-profile-name" className="block text-xs font-medium text-[#524E48]">
                      Name
                    </label>
                    <input
                      id="edit-profile-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onBlur={() => setNameTouched(true)}
                      aria-invalid={showNameError}
                      placeholder="Your display name"
                      className={`w-full h-10 bg-[#F9F9FB] border rounded-xl px-3.5 text-sm text-[#141416] placeholder:text-[#C4C0CC] transition-colors focus:outline-none focus:bg-white focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/10 ${
                        showNameError ? 'border-[#EF4444]' : 'border-[#E8E8EF]'
                      }`}
                    />
                    {showNameError ? (
                      <p role="alert" className="text-xs text-[#DC2626] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {nameError}
                      </p>
                    ) : (
                      <p className="text-xs text-[#C4C0CC]">Between 2 and 40 characters</p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div role="status" aria-live="polite">
                      {savedStatus && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
                          <Check className="w-3.5 h-3.5" />
                          {savedStatus}
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!isNameDirty || Boolean(nameError)}
                      className="h-10 px-5 rounded-xl bg-[#141416] hover:bg-[#27272D] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141416]"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── SECURITY ──────────────────────────────────────────────────── */}
        {activeSection === 'security' && (
          <div className="max-w-xl space-y-5">
            <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
              <div className="px-6 py-5">
                <h2 className="text-sm font-semibold text-[#141416]">Email address</h2>
                <p className="text-xs text-[#9994A8] mt-0.5">Used to sign in to your account</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between gap-3 bg-[#F9F9FB] border border-[#E8E8EF] rounded-xl px-4 py-3">
                  <span className="text-sm text-[#524E48] break-all">{profile.email}</span>
                  <span className="text-[10px] font-medium text-[#9994A8] bg-[#F0F0F5] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">Read‑only</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
              <div className="px-6 py-5">
                <h2 className="text-sm font-semibold text-[#141416]">Account security</h2>
                <p className="text-xs text-[#9994A8] mt-0.5">Manage password and login options</p>
              </div>
              <div className="divide-y divide-[#F0F0F5]">
                {['Change password', 'Two-factor authentication', 'Active sessions'].map((item) => (
                  <button key={item} type="button"
                    className="w-full flex items-center justify-between px-6 py-4 text-sm text-[#524E48] hover:bg-[#F9F9FB] hover:text-[#141416] transition-colors group">
                    {item}
                    <ChevronRight className="w-4 h-4 text-[#D4D4D8] group-hover:text-[#9994A8]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STORAGE ───────────────────────────────────────────────────── */}
        {activeSection === 'storage' && (
          <div className="max-w-xl space-y-5">
            <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
              <div className="px-6 py-5">
                <h2 className="text-sm font-semibold text-[#141416]">Storage usage</h2>
                <p className="text-xs text-[#9994A8] mt-0.5">1.2 GB of 5 GB used</p>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-[#9994A8] mb-2">
                    <span>1.2 GB used</span>
                    <span>3.8 GB free</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F0F0F5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4B3AE8] rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'PDF', count: '8 files' },
                    { label: 'DOCX', count: '2 files' },
                    { label: 'Other', count: '2 files' },
                  ].map(({ label, count }) => (
                    <div key={label} className="bg-[#F9F9FB] border border-[#E8E8EF] rounded-xl p-4">
                      <p className="text-sm font-semibold text-[#141416]">{label}</p>
                      <p className="text-xs text-[#9994A8] mt-0.5">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8EF] rounded-2xl divide-y divide-[#F0F0F5] shadow-sm">
              <div className="px-6 py-5">
                <h2 className="text-sm font-semibold text-[#141416]">Recent files</h2>
                <p className="text-xs text-[#9994A8] mt-0.5">12 files uploaded</p>
              </div>
              <div className="divide-y divide-[#F0F0F5]">
                {['Machine Learning Basics.pdf', 'Product Strategy Q2.docx', 'Design Patterns.pdf'].map((name) => (
                  <div key={name} className="flex items-center gap-3 px-6 py-3.5">
                    <FileText className="w-4 h-4 text-[#C4C0CC] flex-shrink-0" />
                    <span className="text-sm text-[#524E48] flex-1 truncate">{name}</span>
                    <ChevronRight className="w-4 h-4 text-[#D4D4D8] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
