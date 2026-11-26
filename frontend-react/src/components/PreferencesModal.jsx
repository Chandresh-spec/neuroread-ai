import React from 'react';
import { X, Sliders, Check } from 'lucide-react';

export default function PreferencesModal({
  isOpen,
  onClose,
  fontMode,
  setFontMode,
  textSize,
  setTextSize,
  focusMode,
  setFocusMode,
}) {
  if (!isOpen) return null;

  const profiles = [
    {
      id: 'general',
      name: 'General / Optimized',
      desc: 'Balanced contrast and clean typography for comfortable everyday reading.',
    },
    {
      id: 'dyslexia',
      name: 'Dyslexia Friendly',
      desc: 'Weighted letter bottoms, increased character spacing, and warm tone.',
    },
    {
      id: 'adhd',
      name: 'ADHD / Focus Mode',
      desc: 'Ambient dimming, guiding ruler, and short paragraph sectioning.',
    },
    {
      id: 'visual',
      name: 'High Contrast / Sensitive Eyes',
      desc: 'Crisp warm paper palette with deep ink text and calm indigo accents.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] border border-[#E5DFD3] rounded-3xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#6B665F] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-[#3A2AD9]">
          <Sliders className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-widest uppercase">
            Reading Experience
          </span>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1">
          Accessibility &amp; Preferences
        </h3>
        <p className="text-xs text-[#5E5A54] mb-6">
          Tailor typography, focus guides, and cognitive accommodations to your mind.
        </p>

        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold text-[#141416] uppercase tracking-wider block">
            Cognitive Reading Profile
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {profiles.map((p) => {
              const isSelected = fontMode === (p.id === 'dyslexia' ? 'dyslexic' : 'inter');
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (p.id === 'dyslexia') {
                      setFontMode('dyslexic');
                    } else if (p.id === 'adhd') {
                      setFocusMode(true);
                      setFontMode('inter');
                    } else {
                      setFontMode('inter');
                      setFocusMode(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EBE8FD]/60 border-[#3A2AD9] text-[#141416] shadow-2xs'
                      : 'bg-white border-[#E5DFD3] hover:border-[#CFC7B8] text-[#141416]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{p.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#3A2AD9]" />}
                  </div>
                  <p className="text-xs text-[#6B665F] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#141416] uppercase tracking-wider block mb-2">
            Typeface
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFontMode('inter')}
              className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${
                fontMode === 'inter'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white border-[#E5DFD3] text-[#5E5A54] hover:text-[#141416]'
              }`}
            >
              Inter Sans
            </button>
            <button
              onClick={() => setFontMode('dyslexic')}
              className={`p-3 rounded-xl border text-sm font-bold transition-all font-dyslexic text-center ${
                fontMode === 'dyslexic'
                  ? 'bg-[#3A2AD9] text-white border-[#3A2AD9]'
                  : 'bg-white border-[#E5DFD3] text-[#5E5A54] hover:text-[#141416]'
              }`}
            >
              OpenDyslexic
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#141416] uppercase tracking-wider block mb-2">
            Scale / Size (Current: {textSize})
          </label>
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#E5DFD3]">
            <button
              onClick={() => setTextSize((p) => Math.max(-1, p - 1))}
              className="px-4 py-2 bg-[#F5F1EA] rounded-lg text-xs font-bold text-[#141416] hover:bg-[#EAE4D7]"
            >
              Smaller (A-)
            </button>
            <span className="text-xs font-mono text-[#3A2AD9] font-bold">
              {textSize === 0 ? 'Standard 100%' : `${100 + textSize * 15}%`}
            </span>
            <button
              onClick={() => setTextSize((p) => Math.min(3, p + 1))}
              className="px-4 py-2 bg-[#F5F1EA] rounded-lg text-xs font-bold text-[#141416] hover:bg-[#EAE4D7]"
            >
              Larger (A+)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5DFD3] rounded-xl mb-6">
          <div>
            <p className="text-sm font-bold text-[#141416]">Focus Mode</p>
            <p className="text-xs text-[#6B665F]">
              Minimizes peripheral distractions while reading
            </p>
          </div>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              focusMode ? 'bg-[#3A2AD9]' : 'bg-[#D6CFC2]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                focusMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-sm py-3 rounded-full transition-all shadow-md"
        >
          Done
        </button>
      </div>
    </div>
  );
}
