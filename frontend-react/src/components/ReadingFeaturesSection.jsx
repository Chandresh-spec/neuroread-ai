import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Eye, SlidersHorizontal, Play, Pause, Minus, Plus } from 'lucide-react';

const PAPER_THEMES = [
  { id: 'warm', label: 'Warm page', bg: 'bg-[#FCF7EE]', text: 'text-[#231F1A]', border: 'border-[#EDE3D2]' },
  { id: 'white', label: 'Crisp white', bg: 'bg-white', text: 'text-[#141416]', border: 'border-[#E6E2EE]' },
  { id: 'sky', label: 'Sky tint', bg: 'bg-[#EFF6FD]', text: 'text-[#132238]', border: 'border-[#D5E4F4]' },
  { id: 'sage', label: 'Soft sage', bg: 'bg-[#F0F7F2]', text: 'text-[#16291D]', border: 'border-[#D6E8DC]' },
];

const SAMPLE_LINES = [
  'Alice was beginning to get very tired',
  'of sitting by her sister on the bank,',
  'A new adventure was about to begin.',
];

const SAMPLE_WORDS = SAMPLE_LINES.join(' ').split(' ');
const SPEEDS = [1.0, 1.25, 1.5];

export default function ReadingFeaturesSection() {
  const [fontSize, setFontSize] = useState(18);
  const [themeIndex, setThemeIndex] = useState(0);
  const [focusLineMode, setFocusLineMode] = useState(false);
  const [activeLine, setActiveLine] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [activeFeature, setActiveFeature] = useState('custom');
  const timerRef = useRef(null);

  const currentTheme = PAPER_THEMES[themeIndex];
  const currentSpeed = SPEEDS[speedIdx];

  useEffect(() => {
    if (!isSpeaking) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = Math.round(320 / currentSpeed);
    timerRef.current = setInterval(() => {
      setActiveWordIdx((prev) => {
        const next = prev + 1;
        if (next >= SAMPLE_WORDS.length) {
          setIsSpeaking(false);
          return -1;
        }
        return next;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSpeaking, currentSpeed]);

  const toggleSpeak = () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      setActiveWordIdx(-1);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setActiveWordIdx(0);
    setIsSpeaking(true);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(SAMPLE_LINES.join(' '));
        utter.rate = currentSpeed;
        window.speechSynthesis.speak(utter);
      } catch {
        // Fallback word-highlight timer still runs smoothly
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const features = [
    {
      id: 'custom',
      badge: 'Aa',
      title: 'Make the page your own',
      desc: 'Adjust your font, text size, spacing and background colour.',
      onClick: () => {
        setActiveFeature('custom');
        setThemeIndex((i) => (i + 1) % PAPER_THEMES.length);
      },
    },
    {
      id: 'audio',
      icon: Volume2,
      title: 'Read with your ears, too',
      desc: 'Listen with read-aloud and follow each highlighted word.',
      onClick: () => {
        setActiveFeature('audio');
        toggleSpeak();
      },
    },
    {
      id: 'focus',
      icon: Eye,
      title: 'A little less distraction',
      desc: "Use a focus line and save your place. Come back whenever you're ready.",
      onClick: () => {
        setActiveFeature('focus');
        setFocusLineMode((prev) => !prev);
      },
    },
  ];

  // Track cumulative word offsets per line for word-by-word highlight
  let runningWordCounter = 0;

  return (
    <section className="rounded-[28px] bg-[#FAF9FC] border border-[#ECE8F4] p-5 sm:p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Copy & 3 Interactive Feature Cards */}
        <div className="lg:col-span-6">
          <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#4B3AE8] block mb-2">
            LESS EFFORT. MORE STORY.
          </span>

          <h2 className="text-3xl sm:text-[36px] font-extrabold text-[#111115] tracking-[-0.02em] leading-[1.08] mb-3">
            Made for the way
            <br />
            you read
          </h2>

          <p className="text-sm sm:text-[15px] text-[#64606E] leading-relaxed max-w-md mb-6">
            Support for dyslexia and different reading needs. You choose what feels comfortable.
          </p>

          <div className="space-y-3">
            {features.map((feat) => {
              const Icon = feat.icon;
              const isSelected =
                activeFeature === feat.id || (feat.id === 'focus' && focusLineMode);

              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={feat.onClick}
                  className={`w-full text-left bg-white rounded-2xl p-4 sm:p-4.5 border transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? 'border-[#4B3AE8]/40 shadow-[0_6px_20px_rgba(75,58,232,0.07)]'
                      : 'border-[#EAE6F2] hover:border-[#CFC7DF]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F3F0FC] border border-[#E4DDFB] flex items-center justify-center text-[#4B3AE8] font-bold text-sm flex-shrink-0">
                    {feat.badge ? feat.badge : <Icon className="w-4.5 h-4.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[14.5px] font-bold text-[#141416] group-hover:text-[#4B3AE8] transition-colors">
                        {feat.title}
                      </h3>
                      {feat.id === 'focus' && focusLineMode && (
                        <span className="text-[10px] font-bold text-[#4B3AE8] bg-[#EFEBFD] px-2 py-0.5 rounded-full">
                          Focus on
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#686472] leading-relaxed mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Mini-Reader Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-[24px] border border-[#E6E2EE] shadow-[0_14px_38px_rgba(20,20,35,0.06)] overflow-hidden">
            {/* Reader Card Header */}
            <div className="px-5 py-3.5 border-b border-[#F1EEF6] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5E5A68]">Alice in Wonderland</span>
              <button
                type="button"
                onClick={() => setFocusLineMode((prev) => !prev)}
                title="Toggle focus line"
                className={`p-1.5 rounded-lg transition-colors ${
                  focusLineMode
                    ? 'bg-[#EFEBFD] text-[#4B3AE8]'
                    : 'text-[#7B7685] hover:bg-[#F5F3F9]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Live Page Area */}
            <div className="p-4 sm:p-5 space-y-4">
              <div
                className={`${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-2xl p-5 sm:p-6 transition-colors duration-200`}
              >
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#4B3AE8] block mb-1.5">
                  CHAPTER 01
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold tracking-tight mb-3">
                  Down the rabbit-hole
                </h4>

                <div
                  className="space-y-1.5 transition-all"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                >
                  {SAMPLE_LINES.map((line, lineIdx) => {
                    const words = line.split(' ');
                    const lineStartIdx = runningWordCounter;
                    runningWordCounter += words.length;
                    const dimmedByFocus = focusLineMode && activeLine !== lineIdx;

                    return (
                      <p
                        key={lineIdx}
                        onClick={() => focusLineMode && setActiveLine(lineIdx)}
                        className={`rounded-lg px-1.5 -mx-1.5 transition-all ${
                          focusLineMode ? 'cursor-pointer' : ''
                        } ${
                          focusLineMode && activeLine === lineIdx
                            ? 'bg-[#4B3AE8]/10 ring-1 ring-[#4B3AE8]/25'
                            : ''
                        } ${dimmedByFocus ? 'opacity-35' : 'opacity-100'}`}
                      >
                        {words.map((word, wIdx) => {
                          const globalIdx = lineStartIdx + wIdx;
                          const isCurrentWord = isSpeaking && activeWordIdx === globalIdx;
                          return (
                            <span
                              key={wIdx}
                              className={`inline-block mr-[0.28em] rounded px-0.5 transition-colors ${
                                isCurrentWord
                                  ? 'bg-[#4B3AE8] text-white font-semibold'
                                  : ''
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Typography & Theme Controls */}
              <div className="flex items-center justify-between gap-2 bg-[#FAF9FC] border border-[#EDEAEF] rounded-xl px-3.5 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#141416] pr-1">Aa</span>
                  <button
                    type="button"
                    aria-label="Decrease sample font size"
                    onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6E2EE] hover:border-[#4B3AE8] flex items-center justify-center text-[#524E5B] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-[#141416] w-5 text-center tabular-nums">
                    {fontSize}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase sample font size"
                    onClick={() => setFontSize((s) => Math.min(22, s + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6E2EE] hover:border-[#4B3AE8] flex items-center justify-center text-[#524E5B] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setThemeIndex((i) => (i + 1) % PAPER_THEMES.length)}
                  className="text-xs font-semibold text-[#5E5A68] hover:text-[#4B3AE8] bg-white border border-[#E6E2EE] rounded-lg px-3 py-1.5 transition-colors"
                >
                  {currentTheme.label}
                </button>
              </div>

              {/* Read-Aloud Interactive Pill Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeak}
                  className="flex-1 bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white font-semibold text-sm rounded-full px-5 py-3 flex items-center justify-between transition-all shadow-sm active:scale-[0.99]"
                >
                  <span className="inline-flex items-center gap-2">
                    {isSpeaking ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                    <span>{isSpeaking ? 'Pause reading' : 'Listen to this page'}</span>
                  </span>

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpeedIdx((i) => (i + 1) % SPEEDS.length);
                    }}
                    title="Cycle reading speed"
                    className="text-xs font-bold bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    {currentSpeed.toFixed(1).replace('.0', '.0')}×
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
