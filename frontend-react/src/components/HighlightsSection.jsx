import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Download,
  Edit3,
  Highlighter,
  MessageSquarePlus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { curatedBooks, readingHistory } from '../data/booksData';
import { libraryBooks } from '../data/libraryBooksData';
import { INITIAL_HIGHLIGHTS } from '../data/userCollections';

const COLOR_STYLES = {
  indigo: {
    label: 'Indigo',
    dot: '#4B3AE8',
    border: '#4B3AE8',
    badgeBg: '#EFEBFD',
    badgeText: '#4B3AE8',
    quoteBg: '#F9F8FF',
  },
  sage: {
    label: 'Forest Sage',
    dot: '#1D7A4C',
    border: '#1D7A4C',
    badgeBg: '#E8F5ED',
    badgeText: '#1D7A4C',
    quoteBg: '#F4FAF6',
  },
  peach: {
    label: 'Warm Peach',
    dot: '#C85A32',
    border: '#D97B54',
    badgeBg: '#FDECE4',
    badgeText: '#9A3F1E',
    quoteBg: '#FFF8F4',
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
  const [exportNotice, setExportNotice] = useState('');

  const uniqueBooks = useMemo(() => {
    const map = new Map();
    highlights.forEach((h) => {
      if (!map.has(h.bookId)) map.set(h.bookId, h.bookTitle);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [highlights]);

  const colorCounts = useMemo(() => {
    const counts = { indigo: 0, sage: 0, peach: 0 };
    highlights.forEach((h) => {
      if (counts[h.color] !== undefined) counts[h.color] += 1;
    });
    return counts;
  }, [highlights]);

  const filteredHighlights = useMemo(() => {
    return highlights.filter((h) => {
      const matchesColor = activeColor === 'all' || h.color === activeColor;
      const matchesBook = selectedBook === 'all' || h.bookId === selectedBook;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        h.quote.toLowerCase().includes(q) ||
        (h.note || '').toLowerCase().includes(q) ||
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

  const handleExportNotes = () => {
    const content = filteredHighlights
      .map(
        (h) =>
          `## ${h.bookTitle} (${h.location})\n> "${h.quote}"\n${
            h.note ? `Note: ${h.note}\n` : ''
          }`
      )
      .join('\n---\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neuroreader-highlights.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportNotice(`Exported ${filteredHighlights.length} highlight(s) as Markdown.`);
    setTimeout(() => setExportNotice(''), 3000);
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

  const hasActiveFilters =
    activeColor !== 'all' || selectedBook !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="w-full max-w-[1140px] mx-auto pb-12">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#EFECE6] mb-6 sm:mb-8">
        <button
          type="button"
          onClick={onBackToProfile}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="hidden sm:inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#8B8598]">
          HIGHLIGHTS &amp; NOTES
        </span>
      </div>

      {/* Editorial Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.14em] uppercase text-[#4B3AE8] bg-[#EFEBFD] px-2.5 py-1 rounded-full mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>READING MEMORY</span>
          </span>
          <h1 className="text-3xl sm:text-[36px] font-extrabold text-[#111115] tracking-[-0.025em] leading-tight">
            Highlights
          </h1>
          <p className="text-sm text-[#686472] mt-1.5 max-w-xl">
            Key passages, quotes, and personal reflections saved across your reading sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#E5E0EE] bg-[#FAF9FC] px-3.5 py-2 text-xs text-[#5E5A68]">
            <span className="font-extrabold text-[#141416]">{highlights.length}</span>
            <span>highlights</span>
            <span aria-hidden="true">·</span>
            <span className="font-extrabold text-[#141416]">{uniqueBooks.length}</span>
            <span>books</span>
          </div>

          {filteredHighlights.length > 0 && (
            <button
              type="button"
              onClick={handleExportNotes}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFDBE8] hover:border-[#4B3AE8] bg-white hover:bg-[#FAF8FF] px-3.5 py-2 text-xs font-bold text-[#141416] hover:text-[#4B3AE8] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export notes</span>
            </button>
          )}
        </div>
      </div>

      {exportNotice && (
        <div
          role="status"
          className="mb-5 rounded-xl bg-[#E8F5ED] border border-[#B6D7C1] px-4 py-2.5 text-xs font-semibold text-[#1D7A4C]"
        >
          {exportNotice}
        </div>
      )}

      {lastDeleted && (
        <div className="mb-5 rounded-xl bg-[#FAF9FC] border border-[#E5E0EE] px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#585462] truncate">
            Deleted highlight from{' '}
            <strong className="text-[#141416]">{lastDeleted.bookTitle}</strong>.
          </span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="px-2.5 py-1 rounded-lg bg-[#EFEBFD] text-[#4B3AE8] font-bold hover:bg-[#E4DDFB] transition-colors flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-4 sm:p-5 mb-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              className="w-4 h-4 text-[#8B8598] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              aria-label="Search quotes or notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes, notes, or book titles..."
              className="w-full rounded-xl border border-[#E5E0EE] bg-white pl-10 pr-9 py-2.5 text-sm text-[#141416] placeholder-[#8B8598] focus:outline-none focus:border-[#4B3AE8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8598] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            aria-label="Filter highlights by book"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full sm:w-60 rounded-xl border border-[#E5E0EE] bg-white px-3.5 py-2.5 text-sm font-medium text-[#141416] focus:outline-none focus:border-[#4B3AE8]"
          >
            <option value="all">All books ({uniqueBooks.length})</option>
            {uniqueBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveColor('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activeColor === 'all'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white hover:border-[#BFB8CB] text-[#524E5B] border-[#E4E0EB]'
              }`}
            >
              All colors ({highlights.length})
            </button>

            {Object.entries(COLOR_STYLES).map(([key, cfg]) => {
              const isActive = activeColor === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveColor(key)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#EFEBFD] text-[#4B3AE8] border-[#4B3AE8]'
                      : 'bg-white hover:border-[#BFB8CB] text-[#524E5B] border-[#E4E0EB]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.dot }}
                    aria-hidden="true"
                  />
                  <span>
                    {cfg.label} ({colorCounts[key] || 0})
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setActiveColor('all');
                setSelectedBook('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#4B3AE8] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Highlights Grid */}
      {filteredHighlights.length === 0 ? (
        <div className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EFEBFD] text-[#4B3AE8] flex items-center justify-center mx-auto mb-3">
            <Highlighter className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-extrabold text-[#141416] mb-1">
            No matching highlights
          </h2>
          <p className="text-sm text-[#686472] max-w-sm mx-auto mb-4">
            Try clearing your search filter, or highlight passages while reading any book.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setActiveColor('all');
                setSelectedBook('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#4B3AE8] text-white text-xs font-bold hover:bg-[#3C2CD6] transition-colors"
            >
              Show all highlights
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHighlights.map((hl) => {
            const colorCfg = COLOR_STYLES[hl.color] || COLOR_STYLES.indigo;
            const isEditing = editingNoteId === hl.id;

            return (
              <article
                key={hl.id}
                className="rounded-2xl border border-[#EAE6F0] hover:border-[#D4CCE3] bg-white p-5 flex flex-col justify-between transition-all hover:shadow-[0_10px_26px_rgba(20,16,44,0.05)]"
              >
                <div>
                  {/* Card Header: Book Badge + Location + Timestamp */}
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
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
                      <span className="text-xs text-[#736E7D]">{hl.location}</span>
                    </div>

                    <span className="text-[11px] font-medium text-[#8B8598] flex-shrink-0">
                      {hl.savedAt}
                    </span>
                  </div>

                  {/* Quote Block */}
                  <blockquote
                    className="rounded-r-xl px-4 py-3 text-[14.5px] text-[#141416] leading-relaxed font-medium"
                    style={{
                      borderLeft: `3px solid ${colorCfg.border}`,
                      backgroundColor: colorCfg.quoteBg,
                    }}
                  >
                    “{hl.quote}”
                  </blockquote>

                  {/* Reflection Note */}
                  <div className="mt-3.5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Write your reflection or study note..."
                          className="w-full rounded-xl border border-[#DFDBE8] bg-white p-3 text-sm text-[#141416] focus:outline-none focus:border-[#4B3AE8]"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="px-3.5 py-1.5 rounded-lg border border-[#DFDBE8] text-xs font-semibold text-[#585462] hover:text-[#141416]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(hl.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#4B3AE8] hover:bg-[#3C2CD6] text-white font-bold text-xs"
                          >
                            Save note
                          </button>
                        </div>
                      </div>
                    ) : hl.note ? (
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(hl)}
                        className="w-full text-left bg-[#FAF9FC] border border-[#EAE6F0] hover:border-[#CFC7DF] rounded-xl px-3.5 py-2.5 text-xs text-[#585462] flex items-start justify-between gap-2.5 group transition-colors"
                      >
                        <p className="leading-relaxed">
                          <span className="text-[#141416] font-bold mr-1.5">Note:</span>
                          {hl.note}
                        </p>
                        <Edit3
                          className="w-3.5 h-3.5 text-[#8B8598] group-hover:text-[#4B3AE8] flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(hl)}
                        className="inline-flex items-center gap-1.5 px-1 py-1 text-xs font-semibold text-[#686472] hover:text-[#4B3AE8] transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add a note</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between gap-2 pt-3.5 mt-4 border-t border-[#F1EEF7]">
                  <button
                    type="button"
                    onClick={() => onOpenReader(resolveBookForReader(hl))}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open in Reader</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(hl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2EE] hover:border-[#CFC7DF] bg-white text-[#524E5B] hover:text-[#141416] text-xs font-semibold transition-colors"
                    >
                      {copiedId === hl.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1D7A4C]" aria-hidden="true" />
                          <span className="text-[#1D7A4C]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(hl)}
                      aria-label={`Delete highlight from ${hl.bookTitle}`}
                      title="Delete highlight"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#736E7D] hover:text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
