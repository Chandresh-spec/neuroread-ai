import React from 'react';
import { Check } from 'lucide-react';
import {
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
  LINE_SPACING_OPTIONS,
  READER_THEME_OPTIONS,
} from '../utils/profileHelpers';

/**
 * Shared Accessibility & Reading Preferences panel.
 * Stacks all sections vertically inside a single column for consistent readability.
 */
export default function AccessibilityPanel({
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
  layout = 'modal', // 'modal' | 'page'
}) {
  const profiles = [
    {
      id: 'general',
      name: 'Everyday reading',
      desc: 'Balanced contrast and clean typography for comfortable daily reading.',
    },
    {
      id: 'dyslexia',
      name: 'Dyslexia friendly',
      desc: 'Weighted letterforms with extra spacing to make lines easier to track.',
    },
    {
      id: 'adhd',
      name: 'Focus support',
      desc: 'Dims surrounding content so your eyes stay anchored on the current section.',
    },
    {
      id: 'visual',
      name: 'High contrast',
      desc: 'Dark background with crisp white text for sensitive eyes.',
    },
  ];

  const getActiveProfile = () => {
    if (readerTheme === 'contrast') return 'visual';
    if (fontMode === 'dyslexic') return 'dyslexia';
    if (focusMode) return 'adhd';
    return 'general';
  };

  const activeProfile = getActiveProfile();

  const applyProfile = (profileId) => {
    if (profileId === 'dyslexia') {
      setFontMode('dyslexic');
      setLineSpacing?.('spacious');
      setFocusMode(false);
    } else if (profileId === 'adhd') {
      setFocusMode(true);
      if (fontMode === 'dyslexic') setFontMode('inter');
    } else if (profileId === 'visual') {
      setReaderTheme?.('contrast');
      setFontMode('inter');
      setFocusMode(false);
    } else {
      setFontMode('inter');
      setLineSpacing?.('relaxed');
      setReaderTheme?.('cream');
      setFocusMode(false);
    }
  };

  const sectionDivider = layout === 'page' ? 'border-t border-[#E4E4E7] pt-8' : '';

  return (
    <div className={layout === 'page' ? 'space-y-8' : 'space-y-6'}>
      {/* Cognitive Reading Presets */}
      <fieldset className={`space-y-3 ${sectionDivider}`}>
        <legend className="text-sm font-semibold text-[#141416]">
          Reading preset
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profiles.map((p) => {
            const isSelected = activeProfile === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => applyProfile(p.id)}
                className={`w-full text-left p-3.5 min-h-[44px] rounded-xl border transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isSelected
                    ? 'bg-[#ECEAFD] border-[#3B2FD6] text-[#141416]'
                    : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA] text-[#141416]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#3B2FD6] flex-shrink-0" aria-hidden="true" />
                  )}
                </div>
                <p className="text-xs text-[#524E48] leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Default Font */}
      <fieldset className={sectionDivider}>
        <legend className="text-sm font-semibold text-[#141416] mb-2">
          Default font
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected = fontMode === font.id;
            return (
              <button
                key={font.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setFontMode(font.id)}
                className={`p-3 min-h-[44px] rounded-xl border text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  font.className || ''
                } ${
                  isSelected
                    ? 'bg-[#3B2FD6] text-white border-[#3B2FD6]'
                    : 'bg-white border-[#E4E4E7] text-[#141416] hover:border-[#A1A1AA]'
                }`}
              >
                <span className="block text-sm font-semibold">{font.label}</span>
                <span
                  className={`block text-xs mt-0.5 ${
                    isSelected ? 'text-[#EBE9FC]' : 'text-[#524E48]'
                  }`}
                >
                  {font.description}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Text Size */}
      <div className={sectionDivider}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span id="pref-text-size-label" className="text-sm font-semibold text-[#141416]">
            Text size
          </span>
          <span className="text-xs font-medium text-[#3B2FD6]" aria-live="polite">
            {TEXT_SIZE_OPTIONS.find((o) => o.value === textSize)?.label || 'Standard'} (
            {TEXT_SIZE_OPTIONS.find((o) => o.value === textSize)?.scale || '100%'})
          </span>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="pref-text-size-label"
          className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-white p-1.5 rounded-xl border border-[#E4E4E7]"
        >
          {TEXT_SIZE_OPTIONS.map((opt) => {
            const isSelected = textSize === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTextSize(opt.value)}
                className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isSelected
                    ? 'bg-[#3B2FD6] text-white'
                    : 'text-[#141416] hover:bg-[#F4F4F5]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Line Spacing */}
      <div className={sectionDivider}>
        <span id="pref-line-spacing-label" className="block text-sm font-semibold text-[#141416] mb-2">
          Line spacing
        </span>
        <div
          role="radiogroup"
          aria-labelledby="pref-line-spacing-label"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-1.5 rounded-xl border border-[#E4E4E7]"
        >
          {LINE_SPACING_OPTIONS.map((opt) => {
            const isSelected = lineSpacing === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setLineSpacing?.(opt.id)}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isSelected
                    ? 'bg-[#3B2FD6] text-white'
                    : 'text-[#141416] hover:bg-[#F4F4F5]'
                }`}
              >
                {opt.label} ({opt.value})
              </button>
            );
          })}
        </div>
      </div>

      {/* Reader Theme */}
      <div className={sectionDivider}>
        <span id="pref-theme-label" className="block text-sm font-semibold text-[#141416] mb-2">
          Reader theme
        </span>
        <div
          role="radiogroup"
          aria-labelledby="pref-theme-label"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {READER_THEME_OPTIONS.map((t) => {
            const isSelected = readerTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setReaderTheme?.(t.id)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border flex items-center gap-2.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isSelected
                    ? 'bg-[#ECEAFD] border-[#3B2FD6] text-[#141416]'
                    : 'bg-white border-[#E4E4E7] text-[#141416] hover:border-[#A1A1AA]'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-[#D4D4D8] flex-shrink-0"
                  style={{ backgroundColor: t.swatch }}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Mode Switch */}
      <div className={sectionDivider}>
        <div className="flex items-center justify-between gap-4 p-3.5 bg-white border border-[#E4E4E7] rounded-xl">
          <div className="min-w-0">
            <p id="focus-mode-title" className="text-sm font-semibold text-[#141416]">
              Focus mode
            </p>
            <p id="focus-mode-desc" className="text-xs text-[#524E48]">
              Softens surrounding sections while you read
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={focusMode}
            aria-labelledby="focus-mode-title"
            aria-describedby="focus-mode-desc"
            onClick={() => setFocusMode(!focusMode)}
            className="min-w-[52px] min-h-[44px] flex items-center justify-center rounded-xl px-1 flex-shrink-0 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <span
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors motion-reduce:transition-none ${
                focusMode ? 'bg-[#3B2FD6]' : 'bg-[#D4D4D8]'
              }`}
            >
              <span
                className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform motion-reduce:transition-none ${
                  focusMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
