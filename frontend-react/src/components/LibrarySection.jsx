import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Search,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { libraryBooks, libraryGenres } from '../data/libraryBooksData';

export default function LibrarySection({ onOpenReader }) {
  const [books, setBooks] = useState(libraryBooks);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [purchaseToast, setPurchaseToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-filter state
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [moreFilters, setMoreFilters] = useState({
    verifiedOnly: false,
    hasAudio: false,
    shortChapters: false,
    notReadYet: false,
  });

  const [openGroups, setOpenGroups] = useState({
    genre: true,
    price: true,
    format: true,
    readingTime: true,
    more: true,
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSelectedGenre('All genres');
    setSelectedPrice(null);
    setSelectedFormat(null);
    setSelectedTime(null);
    setMoreFilters({
      verifiedOnly: false,
      hasAudio: false,
      shortChapters: false,
      notReadYet: false,
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    (selectedGenre !== 'All genres' ? 1 : 0) +
    (selectedPrice ? 1 : 0) +
    (selectedFormat ? 1 : 0) +
    (selectedTime ? 1 : 0) +
    Object.values(moreFilters).filter(Boolean).length;

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || null,
    [books, selectedBookId]
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.genre.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (selectedGenre !== 'All genres' && book.genre !== selectedGenre) {
        return false;
      }

      if (selectedPrice === 'Free' && !book.isFree) return false;
      if (selectedPrice === 'Paid' && book.isFree) return false;
      if (selectedPrice === 'Under ₹100' && (book.isFree || book.price >= 100)) return false;
      if (selectedPrice === '₹100–300' && (book.price < 100 || book.price > 300)) return false;
      if (selectedPrice === 'Above ₹300' && book.price <= 300) return false;

      if (selectedFormat && book.format !== selectedFormat) return false;

      if (selectedTime === 'Under 15 min' && book.readingMinutes >= 15) return false;
      if (
        selectedTime === '15–30 min' &&
        (book.readingMinutes < 15 || book.readingMinutes > 30)
      )
        return false;
      if (
        selectedTime === '30–60 min' &&
        (book.readingMinutes <= 30 || book.readingMinutes > 60)
      )
        return false;
      if (selectedTime === 'Over 1 hour' && book.readingMinutes <= 60) return false;

      if (moreFilters.verifiedOnly && !book.verified) return false;
      if (moreFilters.hasAudio && !book.hasAudio) return false;
      if (moreFilters.shortChapters && !book.shortChapters) return false;
      if (moreFilters.notReadYet && !book.notReadYet) return false;

      return true;
    });
  }, [
    books,
    searchQuery,
    selectedGenre,
    selectedPrice,
    selectedFormat,
    selectedTime,
    moreFilters,
  ]);

  const handleBuyBook = (book) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              isPurchased: true,
              chapters: b.chapters.map((ch) => ({ ...ch, status: 'Unlocked' })),
            }
          : b
      )
    );
    setPurchaseToast(`"${book.title}" unlocked! All chapters are now ready to read.`);
    setTimeout(() => setPurchaseToast(''), 3000);
  };

  // Helper: Filter chip styling in light editorial palette
  const getChipClass = (isActive) =>
    `px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
      isActive
        ? 'border-[#3A2AD9] text-[#3A2AD9] bg-[#EBE8FD]'
        : 'border-[#E5DFD3] bg-[#FAF8F5] text-[#5E5A54] hover:border-[#B8B0A2] hover:text-[#141416]'
    }`;

  // Cover palette accents cycled nicely for editorial visual richness
  const getCoverPalette = (idx) => {
    const palettes = [
      { bg: '#193B32', text: '#EFF5F2' }, // Deep Forest
      { bg: '#7C371E', text: '#FBECE6' }, // Terracotta
      { bg: '#E6E0D0', text: '#1C1B18' }, // Warm Sand
      { bg: '#957CC8', text: '#1B1726' }, // Lavender
      { bg: '#22283A', text: '#F0F4F8' }, // Midnight Ink
      { bg: '#DED9FA', text: '#241B69' }, // Soft Lilac
    ];
    return palettes[idx % palettes.length];
  };

  const renderFilterCards = () => (
    <div className="space-y-3">
      {/* 1. Genre */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 shadow-2xs">
        <button
          onClick={() => toggleGroup('genre')}
          className="w-full flex items-center justify-between text-xs font-bold text-[#141416]"
        >
          <span>Genre</span>
          {openGroups.genre ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B665F]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
          )}
        </button>
        {openGroups.genre && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {libraryGenres
              .filter((g) => g !== 'All genres')
              .map((genre) => {
                const isActive = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() =>
                      setSelectedGenre(isActive ? 'All genres' : genre)
                    }
                    className={getChipClass(isActive)}
                  >
                    {genre}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* 2. Price */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 shadow-2xs">
        <button
          onClick={() => toggleGroup('price')}
          className="w-full flex items-center justify-between text-xs font-bold text-[#141416]"
        >
          <span>Price</span>
          {openGroups.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B665F]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
          )}
        </button>
        {openGroups.price && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Free', 'Paid', 'Under ₹100', '₹100–300', 'Above ₹300'].map((p) => {
              const isActive = selectedPrice === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPrice(isActive ? null : p)}
                  className={getChipClass(isActive)}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Format */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 shadow-2xs">
        <button
          onClick={() => toggleGroup('format')}
          className="w-full flex items-center justify-between text-xs font-bold text-[#141416]"
        >
          <span>Format</span>
          {openGroups.format ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B665F]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
          )}
        </button>
        {openGroups.format && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['E-book', 'Audiobook', 'Document'].map((fmt) => {
              const isActive = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(isActive ? null : fmt)}
                  className={getChipClass(isActive)}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Reading Time */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 shadow-2xs">
        <button
          onClick={() => toggleGroup('readingTime')}
          className="w-full flex items-center justify-between text-xs font-bold text-[#141416]"
        >
          <span>Reading time</span>
          {openGroups.readingTime ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B665F]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
          )}
        </button>
        {openGroups.readingTime && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Under 15 min', '15–30 min', '30–60 min', 'Over 1 hour'].map((t) => {
              const isActive = selectedTime === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTime(isActive ? null : t)}
                  className={getChipClass(isActive)}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. More Filters */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 shadow-2xs">
        <button
          onClick={() => toggleGroup('more')}
          className="w-full flex items-center justify-between text-xs font-bold text-[#141416]"
        >
          <span>More filters</span>
          {openGroups.more ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B665F]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
          )}
        </button>
        {openGroups.more && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              { key: 'verifiedOnly', label: 'Verified authors' },
              { key: 'hasAudio', label: 'Has audio' },
              { key: 'shortChapters', label: 'Short chapters' },
              { key: 'notReadYet', label: 'Not read yet' },
            ].map((item) => {
              const isActive = moreFilters[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setMoreFilters((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={getChipClass(isActive)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================
  // VIEW 2: BOOK DETAIL VIEW
  // =========================================================
  if (selectedBook) {
    const canReadFull = selectedBook.isFree || selectedBook.isPurchased;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedBookId(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3A2AD9] hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library</span>
        </button>

        {purchaseToast && (
          <div className="bg-[#EBE8FD] border border-[#3A2AD9]/30 text-[#3A2AD9] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{purchaseToast}</span>
          </div>
        )}

        <div className="bg-white border border-[#E5DFD3] rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-start gap-6 sm:gap-10 shadow-2xs">
          <div className="w-48 sm:w-64 h-64 sm:h-80 rounded-2xl bg-[#193B32] text-white p-5 sm:p-6 flex items-end shadow-lg flex-shrink-0">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight leading-snug">
              {selectedBook.title}
            </h2>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8FD] text-[#3A2AD9] text-[10px] font-bold uppercase tracking-wider">
                {selectedBook.genre}
              </span>
              <span className="text-xs text-[#6B665F]">
                {selectedBook.format} · {selectedBook.readTime}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-[#141416] tracking-tight leading-tight">
              {selectedBook.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#5E5A54] mt-2 flex items-center gap-1.5">
              <span className="font-medium text-[#141416]">{selectedBook.author}</span>
              {selectedBook.verified && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#3A2AD9] font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Verified author</span>
                  </span>
                </>
              )}
            </p>

            <p className="text-xs sm:text-sm text-[#5E5A54] mt-4 leading-relaxed max-w-2xl">
              {selectedBook.description}
            </p>

            <div className="mt-5">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
                {selectedBook.isPurchased
                  ? 'Purchased'
                  : selectedBook.isFree
                  ? 'Free'
                  : selectedBook.priceLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              {canReadFull ? (
                <button
                  onClick={() => onOpenReader(selectedBook)}
                  className="bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
                >
                  Read now
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleBuyBook(selectedBook)}
                    className="bg-[#141416] hover:bg-[#2a2a2f] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
                  >
                    Buy now
                  </button>
                  <button
                    onClick={() => onOpenReader(selectedBook)}
                    className="bg-white hover:bg-[#FAF8F5] text-[#141416] border border-[#D8D1C5] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all active:scale-95"
                  >
                    Read free sample
                  </button>
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xs sm:text-sm font-bold text-[#141416] pb-3 border-b border-[#E5DFD3]">
                Chapters
              </h3>

              <div className="divide-y divide-[#EEE9DF]">
                {selectedBook.chapters.map((ch) => {
                  const isLocked = ch.status === 'Locked';
                  return (
                    <button
                      key={ch.number}
                      onClick={() => {
                        if (isLocked) {
                          handleBuyBook(selectedBook);
                        } else {
                          onOpenReader(selectedBook);
                        }
                      }}
                      className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#FAF8F5] px-2 rounded-lg transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-medium text-[#141416] group-hover:text-[#3A2AD9]">
                        {ch.number}. {ch.title}
                      </span>
                      <span className="text-xs text-[#6B665F] flex items-center gap-1.5 flex-shrink-0">
                        {isLocked && <Lock className="w-3 h-3" />}
                        <span>{ch.status}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW 1: LIBRARY WITH LEFT FILTER SIDEBAR & RESIZED CARDS
  // =========================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
      {/* LEFT FILTER SIDEBAR (Desktop: lg:col-span-3) */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-20 space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-editorial text-lg font-bold text-[#141416] tracking-tight">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#3A2AD9] hover:underline transition-colors"
          >
            Clear all
          </button>
        </div>

        {renderFilterCards()}
      </aside>

      {/* RIGHT MAIN CATALOG AREA (Desktop: lg:col-span-9) */}
      <div className="lg:col-span-9 space-y-4 sm:space-y-5 min-w-0">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141416] tracking-tight leading-tight">
              Library
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5A54] mt-1">
              Books from verified authors. Read free titles now or buy the ones you like.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 bg-white border border-[#DED8CB] rounded-full px-3.5 py-1.5 text-xs font-bold text-[#141416] shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3A2AD9]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#3A2AD9] text-white text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="bg-white border border-[#E5DFD3] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#5E5A54] whitespace-nowrap shadow-2xs">
              {filteredBooks.length} Books
            </span>
          </div>
        </div>

        {/* Inline Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B665F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or genres..."
            className="w-full bg-[#F7F6F3] hover:bg-[#F3F1EC] focus:bg-white border border-[#E4E1DA] focus:border-[#3A2AD9] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#141416] placeholder-[#7B756D] focus:outline-none transition-colors"
          />
        </div>

        {/* Top Genre Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {libraryGenres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#141416] text-white border-[#141416] shadow-2xs'
                    : 'bg-white text-[#5E5A54] border-[#DED8CB] hover:border-[#B8B0A2] hover:text-[#141416]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* 3-Column Resized Book Cards Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white border border-[#E5DFD3] rounded-2xl p-10 text-center shadow-2xs">
            <p className="text-sm font-bold text-[#141416] mb-1">No books match your filters</p>
            <p className="text-xs text-[#5E5A54] mb-4">
              Try clearing one or more filter chips to explore more books.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs px-5 py-2 rounded-full"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredBooks.map((book, idx) => {
              const isReadable = book.isFree || book.isPurchased;
              const palette = getCoverPalette(idx);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className="bg-white hover:bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#CFC7B8] rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Compact Editorial Cover Box */}
                    <div
                      className="h-28 sm:h-32 rounded-xl p-3.5 flex items-end mb-3 transition-transform group-hover:scale-[1.01]"
                      style={{ backgroundColor: palette.bg, color: palette.text }}
                    >
                      <h3 className="text-sm sm:text-[15px] font-bold leading-snug tracking-tight line-clamp-2">
                        {book.title}
                      </h3>
                    </div>

                    {/* Title, Author, Format & Reading Time */}
                    <h4 className="text-sm font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors truncate">
                      {book.title}
                    </h4>

                    <p className="text-[11px] text-[#5E5A54] mt-0.5 flex items-center gap-1 truncate">
                      <span className="truncate">{book.author}</span>
                      {book.verified && (
                        <>
                          <span>·</span>
                          <Check className="w-3 h-3 text-[#3A2AD9] flex-shrink-0" />
                          <span className="flex-shrink-0">Verified author</span>
                        </>
                      )}
                    </p>

                    <p className="text-[11px] text-[#7B756D] mt-0.5 truncate">
                      {book.format} · {book.readTime}
                    </p>
                  </div>

                  {/* Bottom Price & Action Button Row */}
                  <div className="pt-3 mt-3 border-t border-[#EEE9DF] flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-[#8C867E] leading-none">
                        Price
                      </span>
                      <span className="text-sm sm:text-base font-black text-[#141416] leading-tight">
                        {book.isPurchased
                          ? 'Owned'
                          : book.isFree
                          ? 'Free'
                          : book.priceLabel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isReadable) {
                          onOpenReader(book);
                        } else {
                          setSelectedBookId(book.id);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isReadable
                          ? 'bg-[#3A2AD9] hover:bg-[#3021C2] text-white shadow-2xs'
                          : 'bg-[#FAF8F5] hover:bg-[#141416] text-[#141416] hover:text-white border border-[#D8D1C5]'
                      }`}
                    >
                      <span>{isReadable ? 'Read' : 'Buy'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MOBILE / TABLET SLIDE-OVER FILTER MODAL */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-[#F5F1EA] border-t sm:border border-[#E5DFD3] rounded-t-[28px] sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-editorial text-lg font-bold text-[#141416]">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#3A2AD9] hover:underline"
                >
                  Clear all
                </button>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderFilterCards()}

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs py-3 rounded-full shadow-md"
            >
              Show {filteredBooks.length} Books
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
