import React, { useEffect, useRef } from 'react';
import { X, Sliders } from 'lucide-react';
import AccessibilityPanel from './AccessibilityPanel';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function PreferencesModal({
  isOpen,
  onClose,
  fontMode,
  setFontMode,
  textSize,
  setTextSize,
  lineSpacing,
  setLineSpacing,
  readerTheme,
  setReaderTheme,
  focusMode,
  setFocusMode,
}) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const previousFocusRef = useRef(null);

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-modal-title"
        className="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white border-t sm:border border-[#E4E4E7] rounded-none sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="shrink-0 bg-white px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#E4E4E7] relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <X className="w-5 h-5 pointer-events-none" aria-hidden="true" />
          </button>

          <div className="pr-12">
            <div className="flex items-center gap-2 mb-1 text-[#3B2FD6]">
              <Sliders className="w-4 h-4 pointer-events-none" aria-hidden="true" />
              <span className="text-xs font-semibold">Reading experience</span>
            </div>

            <h2
              id="accessibility-modal-title"
              ref={headingRef}
              tabIndex={-1}
              className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1 focus:outline-none"
            >
              Accessibility &amp; reading preferences
            </h2>
            <p className="text-sm text-[#524E48]">
              Tailor typography, line spacing, theme, and focus support to your mind.
            </p>
          </div>
        </div>

        {/* Scrollable Middle Content Area (inset from rounded edge) */}
        <div className="flex-1 min-h-0 overflow-y-auto modal-scroll mr-1.5 sm:mr-2 pl-5 sm:pl-6 pr-3.5 sm:pr-4 pt-5 pb-8">
          <AccessibilityPanel
            fontMode={fontMode}
            setFontMode={setFontMode}
            textSize={textSize}
            setTextSize={setTextSize}
            lineSpacing={lineSpacing}
            setLineSpacing={setLineSpacing}
            readerTheme={readerTheme}
            setReaderTheme={setReaderTheme}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
          />
        </div>

        {/* Fixed Solid Footer */}
        <div className="shrink-0 bg-white border-t border-[#E4E4E7] px-5 sm:px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] bg-[#3B2FD6] hover:bg-[#3126B8] text-white font-semibold text-sm py-2.5 rounded-full transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
