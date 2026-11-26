import React, { useState, useMemo } from 'react';
import {
  Highlighter,
  Search,
  Copy,
  Check,
  Trash2,
  BookOpen,
  MessageSquarePlus,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import AccountPageLayout from './AccountPageLayout';
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
    <AccountPageLayout
      activePage="highlights"
      onBack={onBackToProfile}
      title="Highlights"
      subtitle="Key passages, quotes, and notes saved across your reading sessions."
      headerRight={
        <div className="inline-flex items-center gap-2 border border-[#E4E4E7] rounded-full px-3.5 py-1.5 text-xs text-[#524E48]">
          <span className="font-semibold text-[#141416]">{highlights.length}</span>
          <span>highlights</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#141416]">{uniqueBooks.length}</span>
          <span>books</span>
        </div>
      }
    >
      {lastDeleted && (
        <div className="bg-white border border-[#E4E4E7] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#524E48] truncate">
            Deleted highlight from <strong className="text-[#141416]">{lastDeleted.bookTitle}</strong>.
          </span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="min-h-[44px] px-2 text-[#3B2FD6] font-semibold hover:underline flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar (stacked vertically inside 720px column) */}
      <div className="border-t border-[#E4E4E7] pt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveColor('all')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-colors border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
              activeColor === 'all'
                ? 'bg-[#141416] text-white border-[#141416]'
                : 'bg-white hover:bg-[#F4F4F5] text-[#524E48] border-[#D4D4D8]'
            }`}
          >
            All colors
          </button>
          {Object.entries(COLOR_STYLES).map(([key, cfg]) => {
            const isActive = activeColor === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveColor(key)}
                className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isActive
                    ? 'bg-[#ECEAFD] text-[#3B2FD6] border-[#3B2FD6]'
                    : 'bg-white hover:bg-[#F4F4F5] text-[#524E48] border-[#D4D4D8]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} aria-hidden="true" />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <select
            aria-label="Filter highlights by book"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full sm:w-56 min-h-[44px] bg-white border border-[#D4D4D8] rounded-md px-3.5 py-2 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
          >
            <option value="all">All books ({uniqueBooks.length})</option>
            {uniqueBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#524E48] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search quotes or notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes or notes..."
              className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md pl-9 pr-3 py-2 text-sm text-[#141416] placeholder-[#6B665F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
            />
          </div>
        </div>
      </div>

      {/* Highlights List / Grid */}
      {filteredHighlights.length === 0 ? (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 text-center">
          <Highlighter className="w-8 h-8 text-[#524E48] mx-auto mb-2.5" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#141416] mb-1">No matching highlights</h2>
          <p className="text-sm text-[#524E48] max-w-sm mx-auto">
            Try clearing your search filter, or highlight passages while reading any book.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredHighlights.map((hl) => {
            const colorCfg = COLOR_STYLES[hl.color] || COLOR_STYLES.indigo;
            const isEditing = editingNoteId === hl.id;

            return (
              <article
                key={hl.id}
                className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor: colorCfg.badgeBg,
                            color: colorCfg.badgeText,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: colorCfg.dot }}
                            aria-hidden="true"
                          />
                          {hl.bookTitle}
                        </span>
                        <span className="text-xs text-[#524E48]">
                          {hl.location}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-[#524E48] flex-shrink-0">
                      {hl.savedAt}
                    </span>
                  </div>

                  <blockquote
                    className="pl-3.5 py-0.5 text-sm text-[#141416] leading-relaxed"
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
                          className="w-full bg-white border border-[#D4D4D8] rounded-md p-2.5 text-sm text-[#141416] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
                        />
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="w-full sm:w-auto min-h-[44px] px-3 rounded-md border border-[#D4D4D8] text-xs text-[#524E48] hover:text-[#141416]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(hl.id)}
                            className="w-full sm:w-auto min-h-[44px] px-4 rounded-md bg-[#3B2FD6] hover:bg-[#3126B8] text-white font-semibold text-xs"
                          >
                            Save note
                          </button>
                        </div>
                      </div>
                    ) : hl.note ? (
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(hl)}
                        className="w-full text-left bg-[#FAFAFA] border border-[#E4E4E7] hover:border-[#A1A1AA] rounded-xl px-3 py-2.5 text-xs text-[#524E48] flex items-start justify-between gap-2 group min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                      >
                        <p className="leading-relaxed">
                          <span className="text-[#141416] font-semibold mr-1.5">Note:</span>
                          {hl.note}
                        </p>
                        <Edit3 className="w-3.5 h-3.5 text-[#524E48] group-hover:text-[#3B2FD6] flex-shrink-0 mt-0.5 pointer-events-none" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(hl)}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-xs font-semibold text-[#524E48] hover:text-[#3B2FD6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                        <span>Add a note</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-4 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={() => onOpenReader(resolveBookForReader(hl))}
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                  >
                    <BookOpen className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                    <span>Open in Reader</span>
                    <ArrowRight className="w-3 h-3 pointer-events-none" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(hl)}
                      className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-md border border-[#E4E4E7] hover:bg-[#F4F4F5] text-[#524E48] hover:text-[#141416] text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      {copiedId === hl.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2F5947] pointer-events-none" aria-hidden="true" />
                          <span className="text-[#2F5947]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(hl)}
                      aria-label={`Delete highlight from ${hl.bookTitle}`}
                      title="Delete highlight"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#524E48] hover:text-[#8F291E] hover:bg-[#FDF4F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                    >
                      <Trash2 className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AccountPageLayout>
  );
}
