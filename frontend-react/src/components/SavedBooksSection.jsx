import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  BookOpen,
  Headphones,
  Search,
} from 'lucide-react';
import BookCover from './BookCover';
import { curatedBooks, readingHistory } from '../data/booksData';
import { libraryBooks } from '../data/libraryBooksData';

const INITIAL_SAVED_ITEMS = [
  {
    ...curatedBooks.find((b) => b.id === 'psychology-of-money'),
    savedType: 'ebook',
    savedAt: 'Saved today',
    progressPercent: 15,
    hasCoverComponent: true,
  },
  {
    ...readingHistory.find((b) => b.id === 'atomic-habits'),
    category: 'HABITS & SYSTEMS',
    duration: '5h 30m',
    hasAudio: true,
    hasBook: true,
    savedType: 'ebook',
    savedAt: 'Saved 2 days ago',
    hasCoverComponent: true,
  },
  {
    ...curatedBooks.find((b) => b.id === 'deep-work'),
    savedType: 'ebook',
    savedAt: 'Saved 3 days ago',
    progressPercent: 48,
    hasCoverComponent: true,
  },
  {
    ...readingHistory.find((b) => b.id === 'mountain-is-you'),
    category: 'SELF-DISCOVERY',
    duration: '5h 35m',
    hasAudio: true,
    hasBook: true,
    savedType: 'audiobook',
    savedAt: 'Saved 5 days ago',
    hasCoverComponent: true,
  },
  {
    ...libraryBooks.find((b) => b.id === 'garden-of-hours'),
    category: 'VERIFIED LIBRARY',
    duration: '1 min read',
    rating: 4.9,
    hasAudio: true,
    hasBook: true,
    savedType: 'ebook',
    savedAt: 'Saved 1 week ago',
    progressPercent: 100,
    hasCoverComponent: false,
  },
  {
    id: 'dsa-algo',
    title: 'Data Structures & Algorithms.pdf',
    author: 'Uploaded PDF · DSA',
    category: 'UPLOADED PDF',
    duration: '18.4 MB',
    rating: 4.8,
    hasAudio: true,
    hasBook: true,
    savedType: 'file',
    savedAt: 'Saved 5 days ago',
    progressPercent: 12,
    hasCoverComponent: false,
    format: 'pdf',
  },
];

export default function SavedBooksSection({
  onOpenReader,
  onOpenAudio,
  onExploreLibrary,
}) {
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRemoved, setLastRemoved] = useState(null);

  const filteredItems = useMemo(() => {
    return savedItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
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
    { id: 'all', label: 'All Saved', count: savedItems.length },
    { id: 'ebook', label: 'E-books', count: savedItems.filter((i) => i.savedType === 'ebook').length },
    { id: 'audiobook', label: 'Audiobooks', count: savedItems.filter((i) => i.savedType === 'audiobook').length },
    { id: 'file', label: 'Files', count: savedItems.filter((i) => i.savedType === 'file').length },
  ];

  const renderThumbnail = (item, compact = false) => {
    if (item.hasCoverComponent) {
      return <BookCover book={item} width="w-full" height="h-full" />;
    }
    return (
      <div
        className={`w-full h-full rounded-xl bg-[#193B32] text-white flex flex-col justify-between ${
          compact ? 'p-2' : 'p-3.5'
        } select-none`}
      >
        <div>
          <span className="px-1.5 py-0.5 rounded bg-white/15 text-white text-[9px] font-bold uppercase tracking-wider">
            {item.format ? item.format.toUpperCase() : 'BOOK'}
          </span>
        </div>
        <p
          className={`${
            compact ? 'text-[10px]' : 'text-sm'
          } font-bold text-white leading-snug line-clamp-3`}
        >
          {item.title}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E3DFFA] border border-[#3A2AD9]/20 flex items-center justify-center text-[#3A2AD9] flex-shrink-0">
            <Bookmark className="w-5 h-5 fill-[#3A2AD9]" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight leading-tight">
              Saved Books
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5A54] mt-0.5">
              Books and documents you bookmarked to read or listen to later.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-white border border-[#E5DFD3] rounded-full px-4 py-2 text-xs self-start sm:self-auto shadow-2xs">
          <Bookmark className="w-3.5 h-3.5 text-[#3A2AD9]" />
          <span className="font-bold text-[#141416]">{savedItems.length}</span>
          <span className="text-[#6B665F]">saved items</span>
        </div>
      </div>

      {lastRemoved && (
        <div className="bg-white border border-[#E5DFD3] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <span className="text-[#5E5A54] truncate">
            Removed <strong className="text-[#141416]">{lastRemoved.title}</strong> from Saved Books.
          </span>
          <button
            onClick={handleUndoRemove}
            className="text-[#3A2AD9] font-bold hover:underline flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* 2. Tabs + Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD3] pb-0.5">
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs sm:text-sm font-bold transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                  isActive ? 'text-[#141416]' : 'text-[#6B665F] hover:text-[#141416]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-[#EBE8FD] text-[#3A2AD9]'
                      : 'bg-[#EAE4D7] text-[#6B665F]'
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#3A2AD9] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pb-2.5 sm:pb-2 w-full sm:w-60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7B756D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved books..."
              className="w-full bg-white border border-[#DED8CB] rounded-full pl-8 pr-3 py-1.5 text-xs text-[#141416] placeholder-[#8C867E] focus:outline-none focus:border-[#3A2AD9] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Saved Items Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-10 text-center shadow-2xs">
          <Bookmark className="w-9 h-9 text-[#8C867E] mx-auto mb-2.5" />
          <h3 className="text-base font-bold text-[#141416] mb-1">No saved books here</h3>
          <p className="text-xs text-[#6B665F] max-w-sm mx-auto mb-4">
            Bookmark books from the Library or Home feed to keep them handy for later.
          </p>
          <button
            onClick={onExploreLibrary}
            className="bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs px-5 py-2 rounded-full transition-all"
          >
            Browse Library
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Compact List Layout */}
          <div className="flex sm:hidden flex-col gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenReader(item)}
                className="bg-white border border-[#E5DFD3] rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-[#CFC7B8] transition-colors shadow-2xs"
              >
                <div className="w-[62px] h-[86px] flex-shrink-0">
                  {renderThumbnail(item, true)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#7B756D] truncate">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-bold text-[#141416] truncate mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B665F] truncate">{item.author}</p>

                  {typeof item.progressPercent === 'number' && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#EAE4D7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3A2AD9] rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#5E5A54] font-mono">
                        {item.progressPercent}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => handleRemoveBookmark(e, item)}
                    aria-label="Remove from saved"
                    className="p-1.5 rounded-lg bg-[#EBE8FD] text-[#3A2AD9]"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-[#3A2AD9]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(item);
                    }}
                    className="px-3.5 py-1 rounded-full bg-[#141416] text-white font-bold text-[11px]"
                  >
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenReader(item)}
                className="bg-white hover:bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#CFC7B8] rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer group shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3">
                    {renderThumbnail(item, false)}

                    <button
                      onClick={(e) => handleRemoveBookmark(e, item)}
                      title="Remove from Saved Books"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-[#3A2AD9] hover:bg-white shadow-sm transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-[#3A2AD9]" />
                    </button>
                  </div>

                  <p className="text-[9.5px] font-bold tracking-wider text-[#7B756D] uppercase truncate">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-bold text-[#141416] tracking-tight truncate group-hover:text-[#3A2AD9] transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B665F] truncate mt-0.5">
                    {item.author}
                  </p>

                  {typeof item.progressPercent === 'number' && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[10px] text-[#6B665F] mb-1">
                        <span>{item.savedAt}</span>
                        <span className="font-bold text-[#141416] font-mono">
                          {item.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#EAE4D7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3A2AD9] rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#EEE9DF]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(item);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#141416] hover:bg-[#2a2a2f] text-white font-semibold text-xs py-2 rounded-full transition-all active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{item.progressPercent ? 'Continue' : 'Read'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAudio(item);
                    }}
                    title="Listen in Audio Player"
                    className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#EBE8FD] border border-[#DED8CB] text-[#5E5A54] hover:text-[#3A2AD9] transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
