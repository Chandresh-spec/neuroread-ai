import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import UserAvatar from './UserAvatar';
import AccountPageLayout from './AccountPageLayout';
import {
  DEFAULT_AVATARS,
  validateAvatarFile,
  validateDisplayName,
} from '../utils/profileHelpers';

/**
 * Full-page Edit Profile view inside the shared 720px centered layout.
 */
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

  // Photo editor state
  const [photoPanel, setPhotoPanel] = useState('none'); // 'none' | 'upload' | 'defaults'
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
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
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
    setSavedStatus('Saved');
    setTimeout(() => setSavedStatus(''), 2500);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateAvatarFile(file);
    if (err) {
      setPhotoError(err);
      e.target.value = '';
      return;
    }
    setPhotoError('');
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(URL.createObjectURL(file));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setPhotoPanel('upload');
  };

  const handlePointerDown = (e) => {
    if (!imageSrc) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
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

    const baseScale = Math.max(
      previewSize / imageNatural.width,
      previewSize / imageNatural.height
    );
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
    if (!cropped) {
      setPhotoError('Could not prepare that image. Please try another file.');
      return;
    }
    setIsUploading(true);
    try {
      await onUploadAvatar(cropped);
      setPhotoPanel('none');
      setImageSrc(null);
      setSavedStatus('Photo updated');
      setTimeout(() => setSavedStatus(''), 2500);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDefault = async () => {
    if (!selectedDefault) return;
    setIsUploading(true);
    try {
      await onUploadAvatar(selectedDefault);
      setPhotoPanel('none');
      setSavedStatus('Photo updated');
      setTimeout(() => setSavedStatus(''), 2500);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AccountPageLayout
      activePage="edit-profile"
      onBack={onBack}
      title="Edit profile"
      subtitle="Update your profile photo and display name."
    >
      {/* Section 1: Photo */}
      <section
        aria-labelledby="edit-photo-heading"
        className="border-t border-[#E4E4E7] pt-8 space-y-4"
      >
        <div>
          <h2 id="edit-photo-heading" className="text-sm font-semibold text-[#141416]">
            Profile photo
          </h2>
          <p className="text-xs text-[#524E48] mt-0.5">
            JPG, PNG, or WebP up to 5 MB. Shown in your account menu and navigation bar.
          </p>
        </div>

        {/* Avatar on the left with name & email next to it */}
        <div className="flex items-center gap-4 min-w-0">
          <UserAvatar
            name={displayName}
            src={profile.avatarUrl}
            sizeClass="w-16 h-16 flex-shrink-0"
            textClass="text-lg"
            ringClass="ring-1 ring-[#E4E4E7]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium text-[#141416] truncate">
              {displayName || 'Reader'}
            </p>
            <p className="text-sm text-[#524E48] truncate">{profile.email}</p>
          </div>
        </div>

        {/* Photo actions directly under the avatar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelected}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto min-h-[44px] px-4 text-sm font-medium text-[#141416] border border-[#D4D4D8] hover:bg-[#F4F4F5] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            Upload photo
          </button>
          <button
            type="button"
            onClick={() => {
              setPhotoError('');
              setPhotoPanel((p) => (p === 'defaults' ? 'none' : 'defaults'));
            }}
            className="w-full sm:w-auto min-h-[44px] px-4 text-sm font-medium text-[#141416] border border-[#D4D4D8] hover:bg-[#F4F4F5] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            Default avatars
          </button>
          {Boolean(profile.avatarUrl) && (
            <button
              type="button"
              onClick={() => {
                onRemoveAvatar();
                setPhotoPanel('none');
                setSavedStatus('Photo removed');
                setTimeout(() => setSavedStatus(''), 2500);
              }}
              className="w-full sm:w-auto min-h-[44px] px-3 text-sm text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              Remove
            </button>
          )}
        </div>

        {photoError && (
          <p role="alert" className="text-xs text-[#8F291E] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
            <span>{photoError}</span>
          </p>
        )}

        {photoPanel === 'upload' && imageSrc && (
          <div className="pt-4 space-y-4 border-t border-[#E4E4E7]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
                onPointerCancel={() => setIsDragging(false)}
                className="relative w-48 h-48 max-w-full aspect-square rounded-lg overflow-hidden border border-[#D4D4D8] bg-[#F4F4F5] cursor-grab active:cursor-grabbing touch-none select-none flex-shrink-0"
                aria-label="Square crop preview. Drag to adjust."
              >
                <img
                  ref={imgElementRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={(e) =>
                    setImageNatural({
                      width: e.currentTarget.naturalWidth,
                      height: e.currentTarget.naturalHeight,
                    })
                  }
                  draggable={false}
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div>
                  <label htmlFor="edit-profile-zoom" className="block text-sm text-[#141416] mb-1">
                    Zoom ({Math.round(zoom * 100)}%)
                  </label>
                  <input
                    id="edit-profile-zoom"
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#3B2FD6]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="w-full sm:w-auto min-h-[44px] px-4 text-sm font-semibold bg-[#3B2FD6] hover:bg-[#3126B8] text-white rounded-md flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    {isUploading && (
                      <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    )}
                    <span>{isUploading ? 'Saving...' : 'Save photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPanel('none');
                      setImageSrc(null);
                    }}
                    className="w-full sm:w-auto min-h-[44px] px-3 text-sm text-[#524E48] hover:text-[#141416] border border-[#D4D4D8] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {photoPanel === 'defaults' && (
          <div className="pt-4 space-y-3 border-t border-[#E4E4E7]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_AVATARS.map((item) => {
                const isSelected = selectedDefault === item.dataUrl;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDefault(item.dataUrl)}
                    aria-label={item.label}
                    aria-pressed={isSelected}
                    className={`p-2.5 rounded-md border flex items-center gap-2.5 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                      isSelected ? 'border-[#3B2FD6] bg-[#F5F4FE]' : 'border-[#E4E4E7] hover:border-[#A1A1AA]'
                    }`}
                  >
                    <img src={item.dataUrl} alt="" className="w-9 h-9 rounded-full flex-shrink-0" />
                    <span className="text-xs text-[#141416] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmDefault}
                disabled={!selectedDefault || isUploading}
                className="w-full sm:w-auto min-h-[44px] px-4 text-sm font-semibold bg-[#3B2FD6] hover:bg-[#3126B8] text-white rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Use photo
              </button>
              <button
                type="button"
                onClick={() => setPhotoPanel('none')}
                className="w-full sm:w-auto min-h-[44px] px-3 text-sm text-[#524E48] hover:text-[#141416] border border-[#D4D4D8] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Display Name & Email (Stacked vertically inside same column) */}
      <form
        onSubmit={handleSaveName}
        noValidate
        className="border-t border-[#E4E4E7] pt-8 space-y-6"
      >
        <div>
          <h2 className="text-sm font-semibold text-[#141416]">Identity</h2>
          <p className="text-xs text-[#524E48] mt-0.5">
            Your display name appears on your account menu and reading notes.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-profile-name" className="block text-sm font-medium text-[#141416]">
            Display name
          </label>
          <input
            id="edit-profile-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            aria-invalid={showNameError}
            className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2.5 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
          />
          {showNameError ? (
            <p role="alert" className="text-xs text-[#8F291E]">
              {nameError}
            </p>
          ) : (
            <p className="text-xs text-[#524E48]">2–40 characters.</p>
          )}
        </div>

        <div className="space-y-1 border-t border-[#E4E4E7] pt-5">
          <span className="block text-sm font-medium text-[#141416]">Email</span>
          <p className="text-sm text-[#524E48] break-all">{profile.email}</p>
        </div>

        <div className="border-t border-[#E4E4E7] pt-6 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <div role="status" aria-live="polite" className="text-sm text-[#2F5947]">
            {savedStatus && (
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                <span>{savedStatus}</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!isNameDirty || Boolean(nameError)}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-md bg-[#3B2FD6] hover:bg-[#3126B8] text-white text-sm font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            Save changes
          </button>
        </div>
      </form>
    </AccountPageLayout>
  );
}
