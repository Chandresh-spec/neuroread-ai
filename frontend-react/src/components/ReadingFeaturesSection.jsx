import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Eye, SlidersHorizontal, Play, Pause } from 'lucide-react';

const PREVIEW_FONTS = [
  { id: 'sans', label: 'Aa', name: 'Clean Sans', className: 'font-sans' },
  { id: 'lexend', label: 'Aa', name: 'Lexend', className: 'font-lexend' },
  { id: 'dyslexic', label: 'Aa', name: 'OpenDyslexic', className: 'font-dyslexic' },
  { id: 'serif', label: 'Aa', name: 'Editorial Serif', className: 'font-editorial' },
];

const PREVIEW_TONES = [
  { id: 'warm', label: 'Warm page', bg: 'bg-[#FBF8F1]', border: 'border-[#EDE6D6]' },
  { id: 'white', label: 'Paper white', bg: 'bg-[#FFFFFF]', border: 'border-[#E6E3DC]' },
  { id: 'lavender', label: 'Soft tint', bg: 'bg-[#F6F4FF]', border: 'border-[#E3DDFB]' },
];

const SPEEDS = [1.0, 1.25, 1.5];

const PREVIEW_TEXT =
  'Alice was beginning to get very tired of sitting by her sister on the bank, A new adventure was about to begin.';

export default function ReadingFeaturesSection({ onOpenPreferences }) {
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [toneIdx, setToneIdx] = useState(0);
  const [focusHighlight, setFocusHighlight] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [activeLineIdx, setActiveLineIdx] = useState(1);
  const timerRef = useRef(null);

  const lines = [
    'Alice was beginning to get very tired',
    'of sitting by her sister on the bank,',
    'A new adventure was about to begin.',
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    setActiveLineIdx(0);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(PREVIEW_TEXT);
        utterance.rate = SPEEDS[speedIdx];
        utterance.onend = () => stopPlayback();
        utterance.onerror = () => stopPlayback();
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback silently to visual line advance if speechSynthesis is restricted
      }
    }

    const stepMs = Math.round(1800 / SPEEDS[speedIdx]);
    let idx = 0;
    timerRef.current = setInterval(() => {
      idx += 1;
      if (idx >= lines.length) {
        stopPlayback();
      } else {
        setActiveLineIdx(idx);
      }
    }, stepMs);
  };

  const currentFont = PREVIEW_FONTS[fontIdx];
  const currentTone = PREVIEW_TONES[toneIdx];

  return (
    <section aria-labelledby="home-features-heading" className="pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Features Copy */}
        <div className="lg:col-span-5">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#3B2FD6] block mb-2.5">
            LESS EFFORT. MORE STORY.
          </span>

          <h2
            id="home-features-heading"
            className="text-3xl sm:text-[34px] font-bold text-[#141416] tracking-tight leading-[1.12] mb-3"
          >
            Made for the way
            <br />
            you read
          </h2>

          <p className="text-sm text-[#5A5864] leading-relaxed mb-6">
            Support for dyslexia and different reading needs. You choose what feels
            comfortable.
          </p>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setFontIdx((prev) => (prev + 1) % PREVIEW_FONTS.length)}
              className="w-full text-left flex items-start gap-3.5 p-2 -mx-2 rounded-xl hover:bg-[#F7F6F3] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <span className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B2FD6] flex items-center justify-center text-xs font-bold flex-shrink-0">
                Aa
              </span>
              <span>
                <span className="block text-sm font-bold text-[#141416]">
                  Make the page your own
                </span>
                <span className="block text-xs text-[#5A5864] mt-0.5 leading-relaxed">
                  Adjust your font, text size, spacing and background colour.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleAudio}
              className="w-full text-left flex items-start gap-3.5 p-2 -mx-2 rounded-xl hover:bg-[#F7F6F3] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <span className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B2FD6] flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#141416]">
                  Read with your ears, too
                </span>
                <span className="block text-xs text-[#5A5864] mt-0.5 leading-relaxed">
                  Listen with read aloud and follow each highlighted word.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFocusHighlight((prev) => !prev)}
              className="w-full text-left flex items-start gap-3.5 p-2 -mx-2 rounded-xl hover:bg-[#F7F6F3] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <span className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B2FD6] flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#141416]">
                  A little less distraction
                </span>
                <span className="block text-xs text-[#5A5864] mt-0.5 leading-relaxed">
                  Use a focus line and save your place. Come back whenever you&rsquo;re ready.
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Accessible Reader Preview Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E5E2DA] rounded-3xl shadow-sm overflow-hidden">
            {/* Mockup Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFECE5]">
              <span className="text-xs font-medium text-[#5A5864]">
                Alice in Wonderland
              </span>
              <button
                type="button"
                onClick={onOpenPreferences}
                aria-label="Open full reading preferences"
                title="Open full reading preferences"
                className="p-1.5 rounded-lg text-[#5A5864] hover:text-[#141416] hover:bg-[#F5F3EE] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Interactive Sample Page */}
            <div className="p-4 sm:p-6">
              <div
                className={`${currentTone.bg} ${currentTone.border} border rounded-2xl p-5 sm:p-7 transition-colors`}
              >
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#3B2FD6] block mb-1.5">
                  CHAPTER 01
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#141416] mb-3">
                  Down the rabbit-hole
                </h3>

                <div
                  className={`${currentFont.className} text-[#2D2B35] space-y-1.5 leading-relaxed`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {lines.map((line, idx) => {
                    const isActive = focusHighlight && idx === activeLineIdx;
                    return (
                      <p
                        key={line}
                        onClick={() => setActiveLineIdx(idx)}
                        className={`rounded px-1.5 -mx-1.5 py-0.5 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#E5E0FF] text-[#141416] underline decoration-[#3B2FD6] decoration-2 underline-offset-4'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Live Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFontIdx((prev) => (prev + 1) % PREVIEW_FONTS.length)}
                    aria-label={`Switch preview font, current ${currentFont.name}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F5F1] hover:bg-[#ECE9E1] border border-[#E3DFD6] text-xs font-bold text-[#141416] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    <span>Aa</span>
                    <span className="text-[11px] font-medium text-[#5A5864] hidden sm:inline">
                      {currentFont.name}
                    </span>
                  </button>

                  <div className="inline-flex items-center bg-[#F6F5F1] border border-[#E3DFD6] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                      aria-label="Decrease preview text size"
                      className="px-2.5 py-1.5 text-xs font-bold text-[#4A4752] hover:text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="px-2 text-xs font-semibold text-[#141416] tabular-nums">
                      {fontSize}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFontSize((s) => Math.min(22, s + 1))}
                      aria-label="Increase preview text size"
                      className="px-2.5 py-1.5 text-xs font-bold text-[#4A4752] hover:text-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setToneIdx((prev) => (prev + 1) % PREVIEW_TONES.length)}
                  className="px-3 py-1.5 rounded-lg bg-[#F6F5F1] hover:bg-[#ECE9E1] border border-[#E3DFD6] text-xs font-medium text-[#4A4752] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  {currentTone.label}
                </button>
              </div>

              {/* Audio Preview Bar */}
              <div className="mt-3 bg-[#3B2FD6] rounded-xl flex items-center justify-between overflow-hidden">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className="flex-1 hover:bg-[#3125BE] text-white px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                  )}
                  <span>{isPlaying ? 'Pause preview' : 'Listen to this page'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedIdx((prev) => (prev + 1) % SPEEDS.length)}
                  aria-label="Cycle playback speed"
                  className="mr-2 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {SPEEDS[speedIdx].toFixed(1)}×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
