import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Headphones,
  Search,
  X,
} from 'lucide-react';
import BookCover from './BookCover';
import { INITIAL_SAVED_ITEMS } from '../data/userCollections';

export default function SavedBooksSection({
  onOpenReader,
  onOpenAudio,
  onExploreLibrary,
  savedItems: externalSavedItems,
  setSavedItems: setExternalSavedItems,
  onBack,
}) {
  const [internalSavedItems, setInternalSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const savedItems = externalSavedItems ?? internalSavedItems;
  const setSavedItems = setExternalSavedItems ?? setInternalSavedItems;
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRemoved, setLastRemoved] = useState(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return savedItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query));
      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      return item.savedType === activeTab;
    });
  }, [savedItems, activeTab, searchQuery]);

  const handleRemoveBookmark = (e, item) => {
    e.stopPropagation();
    setLastRemoved(item);
    setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleUndoRemove = () => {
    if (lastRemoved) {
      setSavedItems((prev) => [lastRemoved, ...prev]);
      setLastRemoved(null);
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: savedItems.length },
    {
      id: 'ebook',
      label: 'E-books',
      count: savedItems.filter((i) => i.savedType === 'ebook').length,
    },
    {
      id: 'audiobook',
      label: 'Audiobooks',
      count: savedItems.filter((i) => i.savedType === 'audiobook').length,
    },
    {
      id: 'file',
      label: 'Files',
      count: savedItems.filter((i) => i.savedType === 'file').length,
    },
  ];

  const getTypeBadge = (item) => {
    if (item.savedType === 'audiobook') {
      return { label: 'Audiobook', bg: 'bg-[#FAD8C4]/70', text: 'text-[#8B3D1A]' };
    }
    if (item.savedType === 'file') {
      return {
        label: item.format ? item.format.toUpperCase() : 'Document',
        bg: 'bg-[#F9E4E5]',
        text: 'text-[#B91C1C]',
      };
    }
    return { label: 'E-book', bg: 'bg-[#ECEAFD]', text: 'text-[#3A2AD9]' };
  };

  const renderCover = (item) => {
    if (item.hasCoverComponent) {
      return <BookCover book={item} width="w-full" height="h-full" />;
    }

    const isFile = item.savedType === 'file';
    const coverBg = isFile ? 'bg-[#2C2836]' : 'bg-[#193B32]';
    const badgeLabel = isFile
      ? (item.format || 'FILE').toUpperCase()
      : 'E-BOOK';

    return (
      <div
        className={`relative w-full h-full rounded-xl overflow-hidden ${coverBg} text-white flex flex-col justify-between p-2.5 select-none shadow-sm`}
      >
        {!isFile && (
          <>
            <img
              src={`./covers/${item.id}.jpg`}
              alt={item.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25 pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}
        <div className="relative z-10">
          <span className="inline-block whitespace-nowrap px-1.5 py-0.5 rounded bg-black/35 backdrop-blur-xs text-white text-[8.5px] font-bold uppercase tracking-wider">
            {badgeLabel}
          </span>
        </div>
        <p className="relative z-10 text-[10px] font-bold text-white leading-snug line-clamp-3">
          {item.title}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* 1. Editorial Header */}
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5E5A54] hover:text-[#3A2AD9] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#3A2AD9] mb-2">
              {savedItems.length} SAVED {savedItems.length === 1 ? 'ITEM' : 'ITEMS'} • READY TO READ
            </span>
            <h1 className="font-editorial text-4xl sm:text-[44px] font-bold text-[#141416] tracking-tight leading-none">
              Saved <span className="italic text-[#3A2AD9] font-semibold">Books</span>
            </h1>
            <p className="text-xs sm:text-[13.5px] text-[#6B665F] mt-2.5 font-normal">
              Books, audiobooks and documents you bookmarked to return to anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreLibrary}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#141416] border border-[#DED8CB] hover:border-[#3A2AD9]/40 font-semibold text-xs sm:text-[13px] px-4 py-2.5 rounded-full transition-all shadow-2xs self-start sm:self-end flex-shrink-0"
          >
            <span>Explore library</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3A2AD9]" />
          </button>
        </div>
      </div>

      {/* Undo Banner */}
      {lastRemoved && (
        <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#5E5A54] truncate">
            Removed <strong className="text-[#141416]">{lastRemoved.title}</strong> from Saved books.
          </span>
          <button
            type="button"
            onClick={handleUndoRemove}
            className="px-3 py-1 rounded-full bg-[#ECEAFD] text-[#3A2AD9] font-semibold hover:bg-[#E1DDFB] transition-colors flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* 2. Filter Pills + Inline Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#141416] text-white border-[#141416]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#141416] border-[#E5DFD3]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? 'text-white/75' : 'text-[#8C867E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-[#7B756D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="Search saved books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved books..."
            className="w-full bg-[#F7F6F3] hover:bg-[#F3F1EC] focus:bg-white text-xs sm:text-sm text-[#141416] placeholder-[#8C867E] rounded-full pl-10 pr-8 py-2 border border-[#E4E1DA] focus:outline-none focus:border-[#3A2AD9] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B756D] hover:text-[#141416]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Saved Books Responsive 3-Column Editorial Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5DFD3] rounded-[20px] p-10 text-center shadow-2xs">
          <Bookmark className="w-10 h-10 text-[#8C867E] mx-auto mb-2.5" />
          <h2 className="font-editorial text-lg font-bold text-[#141416] mb-1">
            No saved books here
          </h2>
          <p className="text-xs text-[#6B665F] max-w-sm mx-auto mb-4">
            Bookmark books from the Library or Home feed to keep them handy for later.
          </p>
          <button
            type="button"
            onClick={onExploreLibrary}
            className="inline-flex items-center gap-2 bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-xs"
          >
            Browse Library
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const hasProgress = typeof item.progressPercent === 'number';
            const isCompleted = item.progressPercent === 100;
            const badge = getTypeBadge(item);

            return (
              <div
                key={item.id}
                onClick={() => onOpenReader(item)}
                className="bg-white rounded-[20px] border border-[#EAE4D8] hover:border-[#D5CEC0] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-[0_1px_2px_rgba(20,20,22,0.03)] hover:shadow-md"
              >
                {/* Top: Book Cover + Editorial Metadata */}
                <div>
                  <div className="flex gap-4">
                    <div className="w-[78px] h-[112px] sm:w-[84px] sm:h-[120px] flex-shrink-0">
                      {renderCover(item)}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveBookmark(e, item)}
                            aria-label={`Remove ${item.title} from Saved books`}
                            title="Remove bookmark"
                            className="w-8 h-8 rounded-full bg-[#ECEAFD] hover:bg-[#E0DCFB] text-[#3A2AD9] flex items-center justify-center flex-shrink-0 transition-colors"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-[#3A2AD9] pointer-events-none" />
                          </button>
                        </div>

                        <h2 className="font-editorial text-[17px] sm:text-[18px] font-semibold text-[#141416] leading-snug line-clamp-2 group-hover:text-[#3A2AD9] transition-colors mt-2">
                          {item.title}
                        </h2>
                        <p className="text-xs text-[#6B665F] truncate mt-0.5">
                          {item.author}
                        </p>
                      </div>

                      <p className="text-[11px] text-[#8C867E] mt-2">
                        {item.savedAt}
                        {item.duration ? ` · ${item.duration}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-4">
                    {hasProgress ? (
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-[#7D7870]">
                            {isCompleted ? 'Completed' : 'Reading progress'}
                          </span>
                          <span className="font-bold text-[#3A2AD9]">
                            {item.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#ECE7DD] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3A2AD9] rounded-full transition-all duration-300"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#7D7870]">Ready to read</p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-[#F0ECE3]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(item);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                      hasProgress
                        ? 'bg-[#141416] hover:bg-[#27272C] text-white'
                        : 'bg-[#3A2AD9] hover:bg-[#3021C2] text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 pointer-events-none" />
                    <span>
                      {isCompleted
                        ? 'Read again'
                        : hasProgress
                        ? 'Continue reading'
                        : 'Read now'}
                    </span>
                  </button>

                  {item.hasAudio && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAudio?.(item);
                      }}
                      aria-label={`Listen to ${item.title}`}
                      title="Listen to audiobook"
                      className="w-9 h-9 rounded-full border border-[#E5DFD3] bg-white hover:bg-[#ECEAFD] hover:border-[#3A2AD9]/30 text-[#5E5A54] hover:text-[#3A2AD9] flex items-center justify-center flex-shrink-0 transition-colors"
                    >
                      <Headphones className="w-4 h-4 pointer-events-none" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
