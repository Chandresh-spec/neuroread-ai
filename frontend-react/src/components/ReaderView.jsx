import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Clock,
  Menu,
  Search,
  Plus,
  Check,
  Square,
  Play,
  Pause,
  FastForward,
  Copy,
  X,
  ChevronDown,
  Highlighter,
  Eye,
  Accessibility,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getDocumentContent,
  translationLanguages,
  sampleTranslations,
} from '../data/readerContent';

const COLOR_THEMES = {
  cream: {
    id: 'cream',
    label: 'Cream',
    bg: '#F5F1EA',
    panel: '#FAF8F5',
    card: '#EFEAE0',
    text: '#141416',
    muted: '#5E5A54',
    border: '#E5DFD3',
    accent: '#3A2AD9',
    accentText: '#3A2AD9',
    accentBg: '#E3DFFA',
    btnBg: '#ffffff',
    btnText: '#141416',
  },
  sky: {
    id: 'sky',
    label: 'Sky Blue',
    bg: '#e8f1fa',
    panel: '#dce8f5',
    card: '#d0e0f0',
    text: '#0f172a',
    muted: '#475569',
    border: '#c2d3e6',
    accent: '#2563eb',
    accentText: '#1d4ed8',
    accentBg: '#dbeafe',
    btnBg: '#ffffff',
    btnText: '#0f172a',
  },
  sage: {
    id: 'sage',
    label: 'Sage',
    bg: '#e9f2ea',
    panel: '#dde9df',
    card: '#d2e2d5',
    text: '#142619',
    muted: '#4b6b53',
    border: '#c2d7c6',
    accent: '#2e6f40',
    accentText: '#235932',
    accentBg: '#d1fae5',
    btnBg: '#ffffff',
    btnText: '#142619',
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    bg: '#15171c',
    panel: '#1a1d24',
    card: '#222630',
    text: '#e5e7eb',
    muted: '#9ca3af',
    border: '#2c303b',
    accent: '#457b55',
    accentText: '#70b886',
    accentBg: '#1c2c21',
    btnBg: '#1f232b',
    btnText: '#e5e7eb',
  },
  contrast: {
    id: 'contrast',
    label: 'Contrast',
    bg: '#070908',
    panel: '#0a0d0b',
    card: '#111613',
    text: '#ffffff',
    muted: '#9ca3af',
    border: '#1f2923',
    accent: '#427652',
    accentText: '#74c68e',
    accentBg: '#18291f',
    btnBg: '#0e1310',
    btnText: '#ffffff',
  },
};

export default function ReaderView({
  book,
  onBack,
  onOpenSearch,
  onOpenAddFile,
  onOpenProfile,
  isSimulatedMobile = false,
  isSimulatedTablet = false,
}) {
  const isCompactPreview = isSimulatedMobile || isSimulatedTablet;
  const doc = getDocumentContent(book);

  // Mobile Tab State: 'settings' | 'reader' | 'assistant'
  const [mobileTab, setMobileTab] = useState('reader');

  // Desktop Collapsible Settings Menu Drawer State
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  // Left Settings Panel Tab: 'reading' | 'tools'
  const [settingsTab, setSettingsTab] = useState('reading');

  // Typography & Appearance Settings
  const [fontSize, setFontSize] = useState(20);
  const [letterSpacing, setLetterSpacing] = useState(0.14);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [wordSpacing, setWordSpacing] = useState(0.1);
  const [paragraphGap, setParagraphGap] = useState(1.5);
  const [readingFont, setReadingFont] = useState('lexend'); // 'lexend' | 'inter' | 'dyslexic' | 'atkinson' | 'serif'
  const [colorTheme, setColorTheme] = useState('cream');

  // Tools Tab Toggles
  const [readingRuler, setReadingRuler] = useState(false);
  const [bionicReading, setBionicReading] = useState(false);
  const [rulerY, setRulerY] = useState(260);
  const [highlights, setHighlights] = useState([]);
  const [isMarkedRead, setIsMarkedRead] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  // Audio TTS Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeParaIndex, setActiveParaIndex] = useState(0);
  const [ttsStatus, setTtsStatus] = useState('Ready');

  // AI Assistant State
  const [aiTab, setAiTab] = useState('simplify'); // 'simplify' | 'structure' | 'selected' | 'translate' | 'word'
  const [targetLang, setTargetLang] = useState('kn');
  const [assistantOutput, setAssistantOutput] = useState({
    visible: true,
    title: 'SIMPLIFIED TEXT',
    body: doc.simplified,
  });
  const [copied, setCopied] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.contrast;
  const readingPaneRef = useRef(null);

  // Stop speech when leaving or unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Font class mapping
  const fontFamilyMap = {
    lexend: "'Lexend', 'Inter', sans-serif",
    inter: "'Inter', sans-serif",
    dyslexic: "'OpenDyslexic', 'Atkinson Hyperlegible', sans-serif",
    atkinson: "'Atkinson Hyperlegible', sans-serif",
    serif: "Georgia, Cambria, 'Times New Roman', serif",
  };

  // Speech Synthesis Helpers
  const speakParagraph = (index, rate = playbackSpeed) => {
    if (!('speechSynthesis' in window)) {
      setTtsStatus('Audio unsupported');
      return;
    }
    window.speechSynthesis.cancel();

    if (index >= doc.paragraphs.length) {
      setIsPlaying(false);
      setActiveParaIndex(0);
      setTtsStatus('Finished');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(doc.paragraphs[index]);
    utterance.rate = rate;
    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveParaIndex(index);
      setTtsStatus(`Reading ${index + 1}/${doc.paragraphs.length}`);
    };
    utterance.onend = () => {
      if (index + 1 < doc.paragraphs.length) {
        speakParagraph(index + 1, rate);
      } else {
        setIsPlaying(false);
        setActiveParaIndex(0);
        setTtsStatus('Ready');
      }
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setTtsStatus('Ready');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setTtsStatus('Paused');
    } else {
      speakParagraph(activeParaIndex, playbackSpeed);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveParaIndex(0);
    setTtsStatus('Ready');
  };

  const handleNextParagraph = () => {
    const nextIdx = (activeParaIndex + 1) % doc.paragraphs.length;
    setActiveParaIndex(nextIdx);
    if (isPlaying) {
      speakParagraph(nextIdx, playbackSpeed);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    if (isPlaying) {
      speakParagraph(activeParaIndex, newSpeed);
    }
  };

  // AI Assistant Handlers
  const handleSimplify = () => {
    setAiTab('simplify');
    setIsLoadingAI(true);
    setTimeout(() => {
      setAssistantOutput({
        visible: true,
        title: 'SIMPLIFIED TEXT',
        body: doc.simplified,
      });
      setIsLoadingAI(false);
    }, 200);
  };

  const handleStructure = () => {
    setAiTab('structure');
    setIsLoadingAI(true);
    setTimeout(() => {
      setAssistantOutput({
        visible: true,
        title: 'STRUCTURED NOTES',
        body: doc.structured,
      });
      setIsLoadingAI(false);
    }, 200);
  };

  const handleSimplifySelected = () => {
    setAiTab('selected');
    const snippet = selectedText.trim() || doc.paragraphs[0];
    setAssistantOutput({
      visible: true,
      title: 'SELECTED SIMPLIFICATION',
      body: selectedText.trim()
        ? `Simplified view of your selection:\n"${snippet}"\n\nIn plain words: Focus on the main point—take it step by step at your own pace.`
        : `No text selected yet — highlight any sentence in the reader, or review this core takeaway:\n\n${doc.simplified}`,
    });
  };

  const handleTranslate = () => {
    setAiTab('translate');
    const langObj = translationLanguages.find((l) => l.code === targetLang);
    const translatedBody = sampleTranslations[targetLang] || sampleTranslations.kn;
    setAssistantOutput({
      visible: true,
      title: `TRANSLATION (${langObj?.label.toUpperCase() || targetLang.toUpperCase()})`,
      body: translatedBody,
    });
  };

  const handleWordClick = (word) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9'-]/g, '');
    if (!cleanWord || cleanWord.length < 2) return;

    setAiTab('word');
    setAssistantOutput({
      visible: true,
      title: `WORD EXPLANATION: "${cleanWord.toUpperCase()}"`,
      body: `"${cleanWord}" — In this context, it reinforces the rhythm and meaning of the passage. Tap another word anytime for an instant plain-language definition.`,
    });

    // On mobile, briefly show assistant badge or let user switch cleanly
  };

  const handleCopyOutput = () => {
    navigator.clipboard?.writeText(assistantOutput.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleTextSelection = () => {
    const sel = window.getSelection()?.toString();
    if (sel && sel.trim().length > 2) {
      setSelectedText(sel.trim());
    }
  };

  const handleAddHighlight = () => {
    const textToSave = selectedText.trim() || doc.paragraphs[activeParaIndex];
    if (!highlights.includes(textToSave)) {
      setHighlights((prev) => [...prev, textToSave]);
    }
  };

  // Bionic Reading & Clickable Words Renderer
  const renderInteractiveParagraph = (paragraphText) => {
    const words = paragraphText.split(' ');
    return words.map((word, idx) => {
      const cleanLen = word.length;
      const boldCount = Math.ceil(cleanLen * 0.45);
      const firstPart = word.slice(0, boldCount);
      const restPart = word.slice(boldCount);

      return (
        <React.Fragment key={idx}>
          <span
            onClick={() => handleWordClick(word)}
            className="cursor-pointer rounded px-[1px] hover:bg-[#457b55]/30 transition-colors"
            title="Tap word to explain"
          >
            {bionicReading ? (
              <>
                <strong className="font-extrabold">{firstPart}</strong>
                <span className="opacity-85">{restPart}</span>
              </>
            ) : (
              word
            )}
          </span>{' '}
        </React.Fragment>
      );
    });
  };

  const isDarkTheme = colorTheme === 'dark' || colorTheme === 'contrast';

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {/* 1. Top Reader Header + Progress Bar */}
      <header
        className="sticky top-0 z-40 border-b transition-colors"
        style={{
          backgroundColor: theme.panel,
          borderColor: theme.border,
        }}
      >
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Left: Menu Toggle + Brand Badge */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Reading Settings Menu Button */}
            <button
              onClick={() => setIsSettingsDrawerOpen((prev) => !prev)}
              aria-label="Toggle Reading Settings Menu"
              title="Open Reading Settings"
              className={`${
                isCompactPreview ? 'hidden' : 'hidden lg:inline-flex'
              } items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:opacity-90`}
              style={
                isSettingsDrawerOpen
                  ? {
                      backgroundColor: theme.accentBg,
                      borderColor: theme.accent,
                      color: theme.accentText,
                    }
                  : {
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }
              }
            >
              <Menu className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={onBack}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: theme.accent }}
              title="Return to Library"
            >
              NR
            </button>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight leading-none">
                NeuroRead
              </span>
              <span
                className="text-[10px] font-medium hidden sm:inline mt-0.5"
                style={{ color: theme.muted }}
              >
                Inclusive Digital Library
              </span>
            </div>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className={`${isCompactPreview ? 'hidden' : 'hidden lg:flex'} flex-1 max-w-sm mx-4`}>
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2 rounded-full px-4 py-1.5 text-xs border transition-colors"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.muted,
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search books...</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Add File & Tools */}
            <button
              onClick={onOpenAddFile}
              className={`${isCompactPreview ? 'hidden' : 'hidden sm:inline-flex'} items-center gap-1.5 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:opacity-90`}
              style={{ backgroundColor: theme.accent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add File</span>
            </button>

            <button
              onClick={handleAddHighlight}
              title="Highlight current passage"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-colors"
              style={{ borderColor: theme.border, color: theme.text }}
            >
              <Clock className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                setColorTheme((prev) => (prev === 'contrast' ? 'cream' : 'contrast'))
              }
              title="Quick toggle theme"
              className={`${isCompactPreview ? 'hidden' : 'hidden sm:flex'} w-9 h-9 rounded-full border items-center justify-center transition-colors`}
              style={{ borderColor: theme.border, color: theme.text }}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Mobile Menu / Back to Library */}
            <button
              onClick={onBack}
              title="Back to Library"
              className={`${isCompactPreview ? 'flex' : 'flex lg:hidden'} w-8 h-8 rounded-full border items-center justify-center transition-colors`}
              style={{ borderColor: theme.border, color: theme.text }}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Desktop Profile & Exit */}
            <button
              onClick={onOpenProfile}
              className={`${isCompactPreview ? 'hidden' : 'hidden lg:inline-flex'} items-center px-3 py-1.5 rounded-full border text-xs font-semibold`}
              style={{ borderColor: theme.border }}
            >
              Alex Morgan
            </button>
            <button
              onClick={onBack}
              className={`${isCompactPreview ? 'hidden' : 'hidden lg:inline-flex'} items-center px-4 py-1.5 rounded-full font-bold text-xs hover:opacity-90 transition-opacity`}
              style={{ backgroundColor: theme.text, color: theme.bg }}
            >
              Exit Reader
            </button>
          </div>
        </div>

        {/* Thin Accent Progress Bar */}
        <div className="w-full h-[3px] bg-black/10">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${isMarkedRead ? 100 : doc.progress}%`,
              backgroundColor: theme.accent,
            }}
          />
        </div>
      </header>

      {/* 2. Main Workspace (Collapsible Docked Left Settings + Reader + AI Assistant) */}
      <div className={`flex-1 w-full grid grid-cols-1 ${isCompactPreview ? '' : 'lg:grid-cols-12'}`}>
        {/* LEFT PANE: READING SETTINGS (Docked in grid when clicked on desktop, tab === 'settings' on mobile) */}
        <aside
          className={`${
            mobileTab === 'settings' ? 'block' : 'hidden'
          } ${
            isCompactPreview
              ? ''
              : isSettingsDrawerOpen
              ? 'lg:block lg:col-span-3 lg:pb-8'
              : 'lg:hidden'
          } border-r p-4 sm:p-5 pb-28 overflow-y-auto`}
          style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: theme.muted }}
            >
              Reading Settings
            </p>
            {!isCompactPreview && (
              <button
                onClick={() => setIsSettingsDrawerOpen(false)}
                aria-label="Close Reading Settings"
                title="Hide Reading Settings"
                className="hidden lg:flex w-6 h-6 rounded-md border items-center justify-center hover:opacity-80 transition-opacity"
                style={{ borderColor: theme.border, color: theme.muted }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sub-tabs: Reading | Tools */}
          <div
            className="grid grid-cols-2 p-1 rounded-xl border mb-5"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <button
              onClick={() => setSettingsTab('reading')}
              className="py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                settingsTab === 'reading'
                  ? { backgroundColor: theme.accentBg, color: theme.accentText }
                  : { color: theme.muted }
              }
            >
              Reading
            </button>
            <button
              onClick={() => setSettingsTab('tools')}
              className="py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                settingsTab === 'tools'
                  ? { backgroundColor: theme.accentBg, color: theme.accentText }
                  : { color: theme.muted }
              }
            >
              Tools
            </button>
          </div>

          {settingsTab === 'reading' ? (
            <div className="space-y-4">
              {/* Slider 1: Font Size */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">Font Size</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                    style={{ backgroundColor: theme.accentBg, color: theme.accentText }}
                  >
                    {fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="32"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="reader-slider"
                />
              </div>

              {/* Slider 2: Letter Spacing */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">Letter Spacing</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                    style={{ backgroundColor: theme.accentBg, color: theme.accentText }}
                  >
                    {letterSpacing.toFixed(2)}em
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.01"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="reader-slider"
                />
              </div>

              {/* Slider 3: Line Height */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">Line Height</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                    style={{ backgroundColor: theme.accentBg, color: theme.accentText }}
                  >
                    {lineHeight.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="reader-slider"
                />
              </div>

              {/* Slider 4: Word Spacing */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">Word Spacing</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                    style={{ backgroundColor: theme.accentBg, color: theme.accentText }}
                  >
                    {wordSpacing.toFixed(1)}em
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.02"
                  value={wordSpacing}
                  onChange={(e) => setWordSpacing(Number(e.target.value))}
                  className="reader-slider"
                />
              </div>

              {/* Slider 5: Paragraph Gap */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">Paragraph Gap</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                    style={{ backgroundColor: theme.accentBg, color: theme.accentText }}
                  >
                    {paragraphGap.toFixed(1)}em
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={paragraphGap}
                  onChange={(e) => setParagraphGap(Number(e.target.value))}
                  className="reader-slider"
                />
              </div>

              {/* Reading Font Dropdown */}
              <div className="pt-1">
                <label className="block text-xs font-medium mb-1.5">Reading Font</label>
                <div className="relative">
                  <select
                    value={readingFont}
                    onChange={(e) => setReadingFont(e.target.value)}
                    className="w-full appearance-none rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none"
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <option value="lexend">Lexend (Recommended)</option>
                    <option value="inter">Inter (Clean Sans)</option>
                    <option value="dyslexic">OpenDyslexic</option>
                    <option value="atkinson">Atkinson Hyperlegible</option>
                    <option value="serif">Georgia (Classic Serif)</option>
                  </select>
                  <ChevronDown
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: theme.muted }}
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="pt-2">
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-2.5"
                  style={{ color: theme.muted }}
                >
                  Color Theme
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {['cream', 'sky', 'sage', 'dark'].map((key) => {
                    const t = COLOR_THEMES[key];
                    const isSelected = colorTheme === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setColorTheme(key)}
                        className="py-2 px-3 rounded-xl text-xs font-bold border transition-all"
                        style={{
                          backgroundColor: t.bg,
                          color: t.text,
                          borderColor: isSelected ? t.accent : t.border,
                          boxShadow: isSelected ? `0 0 0 2px ${t.accent}` : 'none',
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Contrast Theme Full Width Pill */}
                <button
                  onClick={() => setColorTheme('contrast')}
                  className="w-full mt-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: '#070908',
                    color: '#ffffff',
                    borderColor: colorTheme === 'contrast' ? '#427652' : '#2a332d',
                    boxShadow: colorTheme === 'contrast' ? '0 0 0 1px #427652' : 'none',
                  }}
                >
                  Contrast {colorTheme === 'contrast' ? '(selected)' : ''}
                </button>
              </div>
            </div>
          ) : (
            /* Tools Tab */
            <div className="space-y-4">
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div>
                  <p className="text-xs font-bold">Reading Ruler</p>
                  <p className="text-[11px]" style={{ color: theme.muted }}>
                    Horizontal focus guide band
                  </p>
                </div>
                <button
                  onClick={() => setReadingRuler(!readingRuler)}
                  className="w-10 h-5 rounded-full transition-colors relative"
                  style={{ backgroundColor: readingRuler ? theme.accent : '#2a302c' }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      readingRuler ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div
                className="p-3.5 rounded-xl border flex items-center justify-between"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div>
                  <p className="text-xs font-bold">Bionic Reading</p>
                  <p className="text-[11px]" style={{ color: theme.muted }}>
                    Bold word starts for ADHD focus
                  </p>
                </div>
                <button
                  onClick={() => setBionicReading(!bionicReading)}
                  className="w-10 h-5 rounded-full transition-colors relative"
                  style={{ backgroundColor: bionicReading ? theme.accent : '#2a302c' }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      bionicReading ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div
                className="p-3.5 rounded-xl border"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Highlighter className="w-3.5 h-3.5" style={{ color: theme.accentText }} />
                    Saved Highlights ({highlights.length})
                  </span>
                  {highlights.length > 0 && (
                    <button
                      onClick={() => setHighlights([])}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {highlights.length === 0 ? (
                  <p className="text-[11px]" style={{ color: theme.muted }}>
                    Select text or tap the clock icon to save highlights.
                  </p>
                ) : (
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                    {highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-[11px] p-2 rounded-lg border line-clamp-2"
                        style={{ borderColor: theme.border }}
                      >
                        "{h}"
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER PANE: READING CANVAS (Desktop col-span-8, Mobile tab === 'reader') */}
        <section
          ref={readingPaneRef}
          onMouseMove={(e) => {
            if (readingRuler && readingPaneRef.current) {
              const rect = readingPaneRef.current.getBoundingClientRect();
              setRulerY(e.clientY - rect.top);
            }
          }}
          onMouseUp={handleTextSelection}
          className={`${
            mobileTab === 'reader' ? 'flex' : 'hidden'
          } ${
            isCompactPreview
              ? ''
              : isSettingsDrawerOpen
              ? 'lg:flex lg:col-span-5 lg:px-7 lg:pb-0'
              : 'lg:flex lg:col-span-8 lg:px-8 lg:pb-0'
          } flex-col justify-between relative px-4 sm:px-6 py-5 sm:py-6 pb-28 min-h-[calc(100vh-64px)]`}
        >
          {/* Optional Reading Ruler Focus Band */}
          {readingRuler && (
            <div
              className="pointer-events-none absolute left-0 right-0 h-11 transition-all duration-75 z-10 border-y"
              style={{
                top: Math.max(80, rulerY - 22),
                backgroundColor: isDarkTheme
                  ? 'rgba(116, 198, 142, 0.12)'
                  : 'rgba(61, 107, 75, 0.12)',
                borderColor: theme.accent,
              }}
            />
          )}

          <div className="w-full">
            {/* Back Link + Desktop Quick Settings Toggle */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
                style={{ color: theme.muted }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className={isSimulatedMobile ? 'inline' : 'sm:hidden'}>Library</span>
                <span className={isSimulatedMobile ? 'hidden' : 'hidden sm:inline'}>Back to Library</span>
              </button>

              <button
                onClick={() => setIsSettingsDrawerOpen((prev) => !prev)}
                className={`${
                  isCompactPreview ? 'hidden' : 'hidden lg:inline-flex'
                } items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:opacity-90`}
                style={
                  isSettingsDrawerOpen
                    ? {
                        backgroundColor: theme.accentBg,
                        borderColor: theme.accent,
                        color: theme.accentText,
                      }
                    : {
                        backgroundColor: theme.panel,
                        borderColor: theme.border,
                        color: theme.text,
                      }
                }
              >
                <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: theme.accentText }} />
                <span>Reading Settings</span>
              </button>
            </div>

            {/* Title & Author */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {doc.title}
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme.muted }}>
              {doc.author}{' '}
              <span className={isSimulatedMobile ? 'inline' : 'sm:hidden'}>· {doc.readTime}</span>
            </p>

            {/* Desktop Metadata & Marked as Read Row */}
            <div
              className={`${isSimulatedMobile ? 'hidden' : 'hidden sm:flex'} items-center justify-between gap-3 mt-4 pb-4 border-b text-xs`}
              style={{ borderColor: theme.border, color: theme.muted }}
            >
              <div className="flex items-center gap-3">
                <span>{doc.readTime}</span>
                <span>{isMarkedRead ? '100% complete' : `${doc.progress}% complete`}</span>
                <span>{highlights.length} highlights</span>
              </div>

              <button
                onClick={() => setIsMarkedRead(!isMarkedRead)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all"
                style={
                  isMarkedRead
                    ? {
                        backgroundColor: theme.accentBg,
                        borderColor: theme.accent,
                        color: theme.accentText,
                      }
                    : { borderColor: theme.border, color: theme.muted }
                }
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isMarkedRead ? 'Marked as Read' : 'Mark as Read'}</span>
              </button>
            </div>

            {/* Dynamic Accessible Text Content */}
            <article
              className="mt-6 sm:mt-8 pb-16 select-text"
              style={{
                fontFamily: fontFamilyMap[readingFont],
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}em`,
                lineHeight: lineHeight,
                wordSpacing: `${wordSpacing}em`,
              }}
            >
              {doc.paragraphs.map((para, idx) => {
                const isActiveSpoken = isPlaying && activeParaIndex === idx;
                return (
                  <p
                    key={idx}
                    style={{
                      marginBottom: `${paragraphGap}em`,
                      borderLeft: isActiveSpoken ? `3px solid ${theme.accent}` : 'none',
                      paddingLeft: isActiveSpoken ? '12px' : '0px',
                    }}
                    className="transition-all duration-200"
                  >
                    {renderInteractiveParagraph(para)}
                  </p>
                );
              })}
            </article>
          </div>

          {/* Floating Bottom Audio Player Bar */}
          <div
            className={`mt-4 flex justify-center sticky ${
              isCompactPreview ? 'bottom-16' : 'bottom-20 lg:bottom-0'
            } z-20 pt-6 pb-5 pointer-events-none`}
            style={{
              background: `linear-gradient(to top, ${theme.bg} 65%, transparent)`,
            }}
          >
            <div
              className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border shadow-2xl backdrop-blur-md"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(12, 16, 14, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: theme.border,
              }}
            >
              {/* Stop */}
              <button
                onClick={handleStopAudio}
                aria-label="Stop audio"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ borderColor: theme.border }}
              >
                <Square className="w-3 h-3 fill-current" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform active:scale-95"
                style={{ backgroundColor: theme.accent }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>

              {/* Next / Skip */}
              <button
                onClick={handleNextParagraph}
                aria-label="Next paragraph"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ borderColor: theme.border }}
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>

              {/* Speed Pills */}
              {[1, 1.5, 2].map((spd) => {
                const isActive = playbackSpeed === spd;
                return (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      spd === 1.5
                        ? isSimulatedMobile
                          ? 'hidden'
                          : 'hidden sm:inline-flex'
                        : 'inline-flex'
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: theme.accent, color: '#ffffff' }
                        : {
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                          }
                    }
                  >
                    {spd}x
                  </button>
                );
              })}

              <span
                className={`${isSimulatedMobile ? 'hidden' : 'hidden sm:inline'} text-xs font-medium px-2`}
                style={{ color: theme.muted }}
              >
                {ttsStatus}
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT PANE: AI READING ASSISTANT (Desktop col-span-4, Mobile tab === 'assistant') */}
        <aside
          className={`${
            mobileTab === 'assistant' ? 'block' : 'hidden'
          } ${isCompactPreview ? '' : 'lg:block lg:col-span-4 lg:pb-8'} border-l p-4 sm:p-5 pb-28 overflow-y-auto`}
          style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
          }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2
              className="text-base sm:text-lg font-extrabold tracking-tight"
              style={{ color: theme.accentText }}
            >
              AI Reading Assistant
            </h2>
            <span
              className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full border"
              style={{ borderColor: theme.border, color: theme.text }}
            >
              Tap a word to explain it
            </span>
          </div>

          {/* 3 Action Cards: Simplify | Structure | Selected */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={handleSimplify}
              className="p-2.5 sm:p-3 rounded-2xl border text-center transition-all hover:opacity-90"
              style={{
                backgroundColor: aiTab === 'simplify' ? theme.accentBg : theme.bg,
                borderColor: aiTab === 'simplify' ? theme.accent : theme.border,
              }}
            >
              <p className="text-xs sm:text-sm font-extrabold">Simplify</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: theme.muted }}>
                Make easier to read
              </p>
            </button>

            <button
              onClick={handleStructure}
              className="p-2.5 sm:p-3 rounded-2xl border text-center transition-all hover:opacity-90"
              style={{
                backgroundColor: aiTab === 'structure' ? theme.accentBg : theme.bg,
                borderColor: aiTab === 'structure' ? theme.accent : theme.border,
              }}
            >
              <p className="text-xs sm:text-sm font-extrabold">Structure</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: theme.muted }}>
                Bullets &amp; headings
              </p>
            </button>

            <button
              onClick={handleSimplifySelected}
              className="p-2.5 sm:p-3 rounded-2xl border text-center transition-all hover:opacity-90"
              style={{
                backgroundColor: aiTab === 'selected' ? theme.accentBg : theme.bg,
                borderColor: aiTab === 'selected' ? theme.accent : theme.border,
              }}
            >
              <p className="text-xs sm:text-sm font-extrabold">Selected</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: theme.muted }}>
                Simplify selection
              </p>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px my-4" style={{ backgroundColor: theme.border }} />

          {/* Translate Text Section */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2">Translate Text</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full appearance-none rounded-full border px-4 py-2 text-xs font-semibold focus:outline-none"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  {translationLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: theme.muted }}
                />
              </div>

              <button
                onClick={handleTranslate}
                className="px-5 py-2 rounded-full text-white font-bold text-xs transition-opacity hover:opacity-90 shadow-sm"
                style={{ backgroundColor: theme.accent }}
              >
                Translate
              </button>
            </div>
          </div>

          {/* Warm Cream Assistant Output Card */}
          {assistantOutput.visible && (
            <div className="bg-[#f5f0e1] text-[#1c1917] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg border border-[#e3dac4] animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10.5px] font-extrabold tracking-widest uppercase text-[#3d6b4b]">
                  {assistantOutput.title}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyOutput}
                    className="px-3 py-1 rounded-xl bg-[#0e1210] text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() =>
                      setAssistantOutput((prev) => ({ ...prev, visible: false }))
                    }
                    aria-label="Close assistant card"
                    className="w-7 h-7 rounded-xl bg-[#0e1210] text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isLoadingAI ? (
                <div className="py-4 text-xs text-neutral-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[#3d6b4b]" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-[13.5px] leading-relaxed font-medium whitespace-pre-line text-[#1f1e1b]">
                  {assistantOutput.body}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* 3. Mobile Bottom Tab Bar (Settings | Reader | Assistant) */}
      <nav
        className={`${
          isCompactPreview ? 'flex sticky bottom-0' : 'flex lg:hidden fixed bottom-0 left-0 right-0'
        } z-40 border-t px-3 py-2 items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.4)] w-full`}
        style={{
          backgroundColor: theme.panel,
          borderColor: theme.border,
        }}
      >
        {[
          { id: 'settings', label: 'Settings' },
          { id: 'reader', label: 'Reader' },
          { id: 'assistant', label: 'Assistant' },
        ].map((tab) => {
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className="flex-1 max-w-[120px] py-2.5 px-3 rounded-2xl text-xs font-bold transition-all text-center"
              style={
                isActive
                  ? { backgroundColor: theme.accentBg, color: theme.accentText }
                  : { color: theme.muted }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
