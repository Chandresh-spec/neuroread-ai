import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  ZoomIn,
  ZoomOut,
  Check,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { DEFAULT_AVATARS, validateAvatarFile } from '../utils/profileHelpers';

/**
 * Internal view for uploading & square-cropping an avatar photo (with zoom & pan)
 * or choosing from default avatars. Uses fixed header/footer + scrollable middle.
 */
export default function AvatarCropper({
  mode = 'upload', // 'upload' | 'defaults'
  currentAvatarUrl,
  onSaveAvatar,
  onCancel,
  onCloseModal,
  headingRef,
  backLabel = 'Back to Profile',
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageNatural, setImageNatural] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState(currentAvatarUrl || '');

  const fileInputRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, origX: 0, origY: 0 });
  const imgElementRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    setError('');
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleImageLoad = (e) => {
    setImageNatural({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
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

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const renderCroppedDataUrl = () => {
    const imgEl = imgElementRef.current;
    if (!imgEl || !imageNatural.width || !imageNatural.height) return null;

    const outputSize = 320;
    const previewSize = 224;
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
    ctx.drawImage(
      imgEl,
      drawX * ratio,
      drawY * ratio,
      drawnW * ratio,
      drawnH * ratio
    );

    return canvas.toDataURL('image/png', 0.92);
  };

  const handleConfirmUpload = async () => {
    if (!imageSrc) {
      setError('Please choose a photo before saving.');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      const croppedUrl = renderCroppedDataUrl();
      if (!croppedUrl) {
        setError('Could not prepare that image. Please try another file.');
        setIsUploading(false);
        return;
      }
      await onSaveAvatar(croppedUrl);
    } catch {
      setError('Something went wrong while saving your photo. Please try again.');
      setIsUploading(false);
    }
  };

  const handleConfirmDefault = async () => {
    if (!selectedDefault) return;
    setIsUploading(true);
    try {
      await onSaveAvatar(selectedDefault);
    } finally {
      setIsUploading(false);
    }
  };

  const isDefaults = mode === 'defaults';

  return (
    <div className="flex flex-col flex-1 min-h-0">
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

        <div className="pr-12 mb-2">
          <button
            type="button"
            onClick={onCancel}
            aria-label={backLabel}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 -ml-3 rounded-full text-sm font-semibold text-[#3B2FD6] hover:bg-[#ECEAFD]/60 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" aria-hidden="true" />
            <span>{backLabel}</span>
          </button>
        </div>

        <h2
          id="avatar-dialog-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-editorial text-2xl font-bold text-[#141416] tracking-tight focus:outline-none"
        >
          {isDefaults ? 'Choose a default photo' : 'Upload profile photo'}
        </h2>
        <p className="text-sm text-[#524E48] mt-0.5">
          {isDefaults
            ? 'Pick one of our calm editorial portraits for your profile.'
            : 'JPG, PNG, or WebP up to 5 MB. Adjust the square crop before saving.'}
        </p>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto modal-scroll mr-1.5 sm:mr-2 pl-5 sm:pl-6 pr-3.5 sm:pr-4 pt-5 pb-8">
        {isDefaults ? (
          <div
            role="radiogroup"
            aria-label="Default profile photos"
            className="grid grid-cols-3 gap-3"
          >
            {DEFAULT_AVATARS.map((item) => {
              const isSelected = selectedDefault === item.dataUrl;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={item.label}
                  onClick={() => setSelectedDefault(item.dataUrl)}
                  className={`relative p-2.5 rounded-2xl border bg-white flex flex-col items-center gap-2 min-h-[44px] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                    isSelected
                      ? 'border-[#3B2FD6] ring-2 ring-[#3B2FD6]/25'
                      : 'border-[#E4E4E7] hover:border-[#A1A1AA]'
                  }`}
                >
                  <img
                    src={item.dataUrl}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-[#141416]">
                    {item.label}
                  </span>
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#3B2FD6] text-white flex items-center justify-center"
                    >
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelected}
              className="sr-only"
              id="avatar-file-input"
            />

            {!imageSrc ? (
              <div className="bg-white border border-dashed border-[#C7C0B2] rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#ECEAFD] text-[#3B2FD6] flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5 pointer-events-none" aria-hidden="true" />
                </div>
                <p className="text-sm text-[#524E48]">
                  Select an image from your device to preview and crop.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] text-white text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  Choose image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="relative w-56 h-56 rounded-2xl overflow-hidden border border-[#D4D4D8] bg-[#F4F4F5] cursor-grab active:cursor-grabbing touch-none select-none"
                    aria-label="Square crop preview. Drag to reposition your photo."
                  >
                    <img
                      ref={imgElementRef}
                      src={imageSrc}
                      alt="Crop preview"
                      onLoad={handleImageLoad}
                      draggable={false}
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      }}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border-2 border-white/80 pointer-events-none shadow-[0_0_0_9999px_rgba(20,20,22,0.28)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[44px] px-3 py-1.5 text-sm font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-lg"
                  >
                    Choose a different image
                  </button>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="avatar-zoom-slider" className="font-semibold text-[#141416]">
                      Zoom
                    </label>
                    <span className="text-[#524E48] font-medium">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Zoom out"
                      onClick={() => setZoom((z) => Math.max(1, Number((z - 0.15).toFixed(2))))}
                      className="min-w-[44px] min-h-[44px] rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] hover:bg-[#F4F4F5] flex items-center justify-center text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      <ZoomOut className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                    </button>
                    <input
                      id="avatar-zoom-slider"
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 accent-[#3B2FD6] h-2"
                    />
                    <button
                      type="button"
                      aria-label="Zoom in"
                      onClick={() => setZoom((z) => Math.min(3, Number((z + 0.15).toFixed(2))))}
                      className="min-w-[44px] min-h-[44px] rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] hover:bg-[#F4F4F5] flex items-center justify-center text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      <ZoomIn className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#D8B4AE] bg-[#FDF4F2] p-3 text-sm text-[#8F291E]"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 pointer-events-none" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Solid Footer */}
      <div className="shrink-0 bg-white border-t border-[#E4E4E7] px-5 sm:px-6 py-3.5 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="min-h-[44px] px-4 py-2 rounded-full border border-[#D4D4D8] bg-white text-sm font-semibold text-[#141416] hover:bg-[#F4F4F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={isDefaults ? handleConfirmDefault : handleConfirmUpload}
          disabled={(isDefaults ? !selectedDefault : !imageSrc) || isUploading}
          className="min-h-[44px] px-5 py-2 rounded-full bg-[#3B2FD6] hover:bg-[#3126B8] disabled:bg-[#A1A1AA] disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          {isUploading && (
            <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none pointer-events-none" aria-hidden="true" />
          )}
          <span>
            {isUploading
              ? isDefaults
                ? 'Saving...'
                : 'Saving photo...'
              : isDefaults
              ? 'Use photo'
              : 'Save photo'}
          </span>
        </button>
      </div>
    </div>
  );
}
