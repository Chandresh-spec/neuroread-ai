import React, { useState, useMemo } from 'react';
import {
  Highlighter,
  Search,
  Copy,
  Check,
  Trash2,
  BookOpen,
  MessageSquarePlus,
  ArrowLeft,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { curatedBooks, readingHistory } from '../data/booksData';
import { libraryBooks } from '../data/libraryBooksData';
import { INITIAL_HIGHLIGHTS } from '../data/userCollections';

const COLOR_STYLES = {
  indigo: {
    label: 'Indigo',
    dot: '#3A2AD9',
    border: '#3A2AD9',
    badgeBg: '#E3DFFA',
    badgeText: '#3A2AD9',
  },
  sage: {
    label: 'Forest Sage',
    dot: '#193B32',
    border: '#193B32',
    badgeBg: '#E2EFE7',
    badgeText: '#193B32',
  },
  peach: {
    label: 'Warm Peach',
    dot: '#B8542C',
    border: '#D97B54',
    badgeBg: '#FAD8C4',
    badgeText: '#7C371E',
  },
};

export default function HighlightsSection({
  onOpenReader,
  highlights: externalHighlights,
  setHighlights: setExternalHighlights,
  onBackToProfile,
}) {
  const [internalHighlights, setInternalHighlights] = useState(INITIAL_HIGHLIGHTS);
  const highlights = externalHighlights ?? internalHighlights;
  const setHighlights = setExternalHighlights ?? setInternalHighlights;
  const [activeColor, setActiveColor] = useState('all');
  const [selectedBook, setSelectedBook] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [lastDeleted, setLastDeleted] = useState(null);

  const uniqueBooks = useMemo(() => {
    const map = new Map();
    highlights.forEach((h) => {
      if (!map.has(h.bookId)) map.set(h.bookId, h.bookTitle);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [highlights]);

  const filteredHighlights = useMemo(() => {
    return highlights.filter((h) => {
      const matchesColor = activeColor === 'all' || h.color === activeColor;
      const matchesBook = selectedBook === 'all' || h.bookId === selectedBook;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        h.quote.toLowerCase().includes(q) ||
        h.note.toLowerCase().includes(q) ||
        h.bookTitle.toLowerCase().includes(q);
      return matchesColor && matchesBook && matchesSearch;
    });
  }, [highlights, activeColor, selectedBook, searchQuery]);

  const handleCopy = (hl) => {
    navigator.clipboard?.writeText(`"${hl.quote}" — ${hl.bookTitle} (${hl.author})`);
    setCopiedId(hl.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (hl) => {
    setLastDeleted(hl);
    setHighlights((prev) => prev.filter((item) => item.id !== hl.id));
  };

  const handleUndoDelete = () => {
    if (lastDeleted) {
      setHighlights((prev) => [lastDeleted, ...prev]);
      setLastDeleted(null);
    }
  };

  const handleStartEditNote = (hl) => {
    setEditingNoteId(hl.id);
    setNoteDraft(hl.note || '');
  };

  const handleSaveNote = (id) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note: noteDraft.trim() } : h))
    );
    setEditingNoteId(null);
  };

  const resolveBookForReader = (hl) => {
    const allSources = [...readingHistory, ...curatedBooks, ...libraryBooks];
    const match = allSources.find((b) => b.id === hl.bookId);
    if (match) return match;
    return {
      id: hl.bookId,
      title: hl.bookTitle,
      author: hl.author,
    };
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {onBackToProfile && (
        <div>
          <button
            type="button"
            onClick={onBackToProfile}
            aria-label="Back to Profile"
            className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 -ml-3 rounded-full text-sm font-semibold text-[#3B2FD6] hover:bg-[#ECEAFD]/60 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" aria-hidden="true" />
            <span>Back to Profile</span>
          </button>
        </div>
      )}

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E3DFFA] border border-[#3A2AD9]/20 flex items-center justify-center text-[#3A2AD9] flex-shrink-0">
            <Highlighter className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight leading-tight">
              Highlights
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5A54] mt-0.5">
              Key passages, quotes, and notes saved across your reading sessions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-white border border-[#E5DFD3] rounded-full px-4 py-2 text-xs flex items-center gap-2 shadow-2xs">
            <Highlighter className="w-3.5 h-3.5 text-[#3A2AD9]" />
            <span className="font-bold text-[#141416]">{highlights.length}</span>
            <span className="text-[#6B665F]">highlights</span>
            <span className="text-[#CFC7B8]">·</span>
            <span className="font-bold text-[#141416]">{uniqueBooks.length}</span>
            <span className="text-[#6B665F]">books</span>
          </div>
        </div>
      </div>

      {lastDeleted && (
        <div className="bg-white border border-[#E5DFD3] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <span className="text-[#5E5A54] truncate">
            Deleted highlight from <strong className="text-[#141416]">{lastDeleted.bookTitle}</strong>.
          </span>
          <button
            onClick={handleUndoDelete}
            className="text-[#3A2AD9] font-bold hover:underline flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveColor('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              activeColor === 'all'
                ? 'bg-[#141416] text-white border-[#141416] shadow-2xs'
                : 'bg-white hover:bg-[#FAF8F5] text-[#5E5A54] border-[#DED8CB]'
            }`}
          >
            All Colors
          </button>
          {Object.entries(COLOR_STYLES).map(([key, cfg]) => {
            const isActive = activeColor === key;
            return (
              <button
                key={key}
                onClick={() => setActiveColor(key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#EBE8FD] text-[#3A2AD9] border-[#3A2AD9]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#5E5A54] border-[#DED8CB]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="bg-white border border-[#DED8CB] rounded-full px-3.5 py-2 text-xs text-[#141416] font-semibold focus:outline-none focus:border-[#3A2AD9]"
          >
            <option value="all">All Books ({uniqueBooks.length})</option>
            {uniqueBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          <div className="relative sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#7B756D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes or notes..."
              className="w-full bg-white border border-[#DED8CB] rounded-full pl-8 pr-3 py-2 text-xs text-[#141416] placeholder-[#8C867E] focus:outline-none focus:border-[#3A2AD9] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Highlights Grid */}
      {filteredHighlights.length === 0 ? (
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-10 text-center shadow-2xs">
          <Highlighter className="w-9 h-9 text-[#8C867E] mx-auto mb-2.5" />
          <h3 className="text-base font-bold text-[#141416] mb-1">No matching highlights</h3>
          <p className="text-xs text-[#6B665F] max-w-sm mx-auto">
            Try clearing your search filter, or highlight passages while reading any book.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHighlights.map((hl) => {
            const colorCfg = COLOR_STYLES[hl.color] || COLOR_STYLES.indigo;
            const isEditing = editingNoteId === hl.id;

            return (
              <div
                key={hl.id}
                className="bg-white hover:bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#CFC7B8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: colorCfg.badgeBg,
                            color: colorCfg.badgeText,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: colorCfg.dot }}
                          />
                          {hl.bookTitle}
                        </span>
                        <span className="text-[11px] text-[#6B665F] font-medium">
                          {hl.location}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10.5px] text-[#8C867E] flex-shrink-0">
                      {hl.savedAt}
                    </span>
                  </div>

                  <blockquote
                    className="pl-3.5 py-0.5 text-sm sm:text-[15px] text-[#141416] leading-relaxed font-medium"
                    style={{ borderLeft: `3px solid ${colorCfg.border}` }}
                  >
                    “{hl.quote}”
                  </blockquote>

                  <div className="mt-3.5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Write your reflection or study note..."
                          className="w-full bg-[#FAF8F5] border border-[#DED8CB] rounded-xl p-2.5 text-xs text-[#141416] focus:outline-none focus:border-[#3A2AD9]"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1 rounded-lg text-xs text-[#6B665F] hover:text-[#141416]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(hl.id)}
                            className="px-3.5 py-1 rounded-full bg-[#3A2AD9] text-white font-bold text-xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : hl.note ? (
                      <div
                        onClick={() => handleStartEditNote(hl)}
                        className="bg-[#F5F1EA] border border-[#E5DFD3] hover:border-[#CFC7B8] rounded-xl px-3 py-2 text-xs text-[#47433E] flex items-start justify-between gap-2 cursor-pointer group"
                      >
                        <p className="leading-relaxed">
                          <span className="text-[#8C867E] font-semibold mr-1.5">Note:</span>
                          {hl.note}
                        </p>
                        <Edit3 className="w-3 h-3 text-[#8C867E] group-hover:text-[#3A2AD9] flex-shrink-0 mt-0.5" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditNote(hl)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6B665F] hover:text-[#3A2AD9] transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Add a note</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 mt-4 border-t border-[#EEE9DF]">
                  <button
                    onClick={() => onOpenReader(resolveBookForReader(hl))}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3A2AD9] hover:underline transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in Reader</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(hl)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#EBE8FD] border border-[#E5DFD3] text-[#5E5A54] hover:text-[#3A2AD9] text-[11px] font-semibold transition-colors"
                    >
                      {copiedId === hl.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(hl)}
                      title="Delete highlight"
                      className="p-1.5 rounded-lg text-[#8C867E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
