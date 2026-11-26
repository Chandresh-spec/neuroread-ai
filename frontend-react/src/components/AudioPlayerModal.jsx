import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, X, Headphones } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AudioPlayerModal({
  isOpen,
  onClose,
  book,
  defaultSpeed = 1.0,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedOverride, setSpeedOverride] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(25);
  const playbackSpeed = speedOverride ?? defaultSpeed;
  const setPlaybackSpeed = (speed) => setSpeedOverride(speed);

  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => (prev >= 100 ? 0 : prev + 0.4 * playbackSpeed));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, playbackSpeed]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    requestAnimationFrame(() => {
      headingRef.current?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentBook = book || {
    title: 'The Mountain Is You',
    author: 'Brianna Wiest',
    chapter: 'Chapter 2 · There is no such thing as self-sabotage',
  };

  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-reader-title"
        className="w-full max-w-md bg-[#FAF8F5] border border-[#E5DFD3] rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top accent (explicitly below controls and non-interactive) */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-32 bg-[#E3DFFA] rounded-full blur-2xl opacity-80 z-0 pointer-events-none"
        />

        {/* Close Button: 44x44px hit area, highest z-index, icon non-interactive */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] active:bg-[#DFD8CA] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          <X
            className="w-5 h-5 pointer-events-none"
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
          />
        </button>

        <div className="relative z-10 flex items-center gap-2 mb-4 pr-12 text-[#3A2AD9]">
          <Headphones className="w-4 h-4 pointer-events-none" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-widest uppercase">
            Accessible Voice Reader
          </span>
        </div>

        <div className="relative z-10 text-center my-6">
          <div className="w-20 h-28 mx-auto rounded-2xl bg-[#193B32] flex items-center justify-center shadow-lg mb-4">
            <Headphones className="w-8 h-8 text-white" aria-hidden="true" />
          </div>

          <h3
            id="voice-reader-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1 focus:outline-none"
          >
            {currentBook.title}
          </h3>
          <p className="text-xs text-[#5E5A54] font-medium mb-2">
            {currentBook.author}
          </p>
          <p className="text-xs text-[#3A2AD9] bg-[#E3DFFA] px-3 py-1 rounded-full inline-block font-semibold">
            {currentBook.chapter || currentBook.currentLocation || 'Chapter 1 · Introduction'}
          </p>
        </div>

        <div className="relative z-10 my-5">
          <div className="w-full h-2 bg-[#EAE4D7] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#3A2AD9] rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#5E5A54] mt-1.5 font-mono">
            <span>01:14:22</span>
            <span>05:35:00</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-6 my-6">
          <button
            type="button"
            onClick={() => setCurrentProgress((p) => Math.max(0, p - 5))}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors motion-reduce:transition-none flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            aria-label="Rewind 15 seconds"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-5 h-5 pointer-events-none" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-[#3A2AD9] hover:bg-[#3021C2] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white pointer-events-none" aria-hidden="true" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5 pointer-events-none" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentProgress((p) => Math.min(100, p + 5))}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors motion-reduce:transition-none flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            aria-label="Fast forward 15 seconds"
            title="Fast forward 15 seconds"
          >
            <RotateCw className="w-5 h-5 pointer-events-none" aria-hidden="true" />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#E5DFD3]">
          <span className="text-xs text-[#5E5A54] font-medium">Speed</span>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#DED8CB]">
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPlaybackSpeed(s)}
                aria-pressed={playbackSpeed === s}
                className={`min-h-[36px] px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  playbackSpeed === s
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'text-[#5E5A54] hover:text-[#141416]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
