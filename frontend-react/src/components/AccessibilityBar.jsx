import React from 'react';
import { Accessibility, ArrowRight } from 'lucide-react';

export default function AccessibilityBar({
  fontMode,
  setFontMode,
  textSize,
  setTextSize,
  focusMode,
  setFocusMode,
  onOpenAllPreferences,
}) {
  const handleIncreaseText = () => {
    setTextSize((prev) => Math.min(prev + 1, 3));
  };

  const handleDecreaseText = () => {
    setTextSize((prev) => Math.max(prev - 1, -1));
  };

  return (
    <div className="bg-[#141519] border border-[#23252c] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-sm transition-all overflow-hidden">
      {/* Mobile Top Row / Desktop Flex Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Section Header with Accessibility Figure Icon & Link on Mobile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#272517] border border-[#f6d23e]/30 flex items-center justify-center flex-shrink-0">
              <Accessibility className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f6d23e]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-none">
                Make it comfortable
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">
                Your reading, your rules
              </p>
            </div>
          </div>

          {/* Quick link visible on mobile top-right */}
          <button
            onClick={onOpenAllPreferences}
            className="lg:hidden inline-flex items-center gap-1 text-[11px] font-bold text-[#f6d23e] hover:underline"
          >
            <span>Prefs</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Controls Toolbar */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-neutral-300">
          {/* Font Selector: Inter / OpenDyslexic */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium hidden sm:inline">Font</span>
            <div className="inline-flex bg-[#0f1013] p-0.5 sm:p-1 rounded-xl border border-[#23252c] w-full sm:w-auto justify-center">
              <button
                onClick={() => setFontMode('inter')}
                className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                  fontMode === 'inter'
                    ? 'bg-[#2a2c35] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Inter
              </button>
              <button
                onClick={() => setFontMode('dyslexic')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all font-dyslexic ${
                  fontMode === 'dyslexic'
                    ? 'bg-[#f6d23e] text-black shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="OpenDyslexic font"
              >
                Dyslexic
              </button>
            </div>
          </div>

          {/* Text Size Scale: A- / A+ */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium hidden sm:inline">Text size</span>
            <div className="inline-flex items-center justify-between bg-[#0f1013] p-0.5 sm:p-1 rounded-xl border border-[#23252c] w-full sm:w-auto">
              <button
                onClick={handleDecreaseText}
                disabled={textSize <= -1}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#20222a] text-neutral-300 disabled:opacity-30 transition-colors font-bold text-xs"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-[10px] font-mono text-neutral-400 px-1 font-bold">
                {textSize === 0 ? '100%' : textSize > 0 ? `+${textSize}` : textSize}
              </span>
              <button
                onClick={handleIncreaseText}
                disabled={textSize >= 3}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#20222a] text-neutral-300 disabled:opacity-30 transition-colors font-bold text-xs"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Focus Mode Toggle (spanning 2 cols on mobile, inline on desktop) */}
          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-2 bg-[#0f1013] sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-[#23252c]">
            <span className="text-[11px] sm:text-[11px] text-neutral-400 font-medium">Focus mode</span>
            <button
              onClick={() => setFocusMode(!focusMode)}
              role="switch"
              aria-checked={focusMode}
              className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                focusMode ? 'bg-[#f6d23e]' : 'bg-[#23252c]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  focusMode ? 'translate-x-5 sm:translate-x-5 bg-black' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right: All Preferences Link (Desktop) */}
        <div className="hidden lg:flex items-center justify-end">
          <button
            onClick={onOpenAllPreferences}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f6d23e] hover:text-[#fae473] hover:underline transition-colors"
          >
            <span>All preferences</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
