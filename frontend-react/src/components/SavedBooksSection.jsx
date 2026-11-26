import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  BookOpen,
  Headphones,
  Search,
} from 'lucide-react';
import BookCover from './BookCover';
import AccountPageLayout from './AccountPageLayout';
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
    { id: 'all', label: 'All saved', count: savedItems.length },
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
    <AccountPageLayout
      activePage="saved-books"
      onBack={onBack}
      title="Saved books"
      subtitle="Books and documents you bookmarked to read or listen to later."
      headerRight={
        <div className="inline-flex items-center gap-2 border border-[#E4E4E7] rounded-full px-3.5 py-1.5 text-xs text-[#524E48]">
          <span className="font-semibold text-[#141416]">{savedItems.length}</span>
          <span>saved items</span>
        </div>
      }
    >
      {lastRemoved && (
        <div className="bg-white border border-[#E4E4E7] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#524E48] truncate">
            Removed <strong className="text-[#141416]">{lastRemoved.title}</strong> from Saved books.
          </span>
          <button
            type="button"
            onClick={handleUndoRemove}
            className="min-h-[44px] px-2 text-[#3B2FD6] font-semibold hover:underline flex-shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* Tabs + Search Toolbar (stacked vertically inside 720px column) */}
      <div className="border-t border-[#E4E4E7] pt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E4E7] pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${
                  isActive
                    ? 'bg-[#ECEAFD] text-[#3B2FD6]'
                    : 'text-[#524E48] hover:text-[#141416] hover:bg-[#F4F4F5]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs opacity-80">({tab.count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#524E48] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search saved books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved books..."
            className="w-full min-h-[44px] bg-white border border-[#D4D4D8] rounded-md pl-9 pr-3 py-2 text-sm text-[#141416] placeholder-[#6B665F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2FD6]"
          />
        </div>
      </div>

      {/* Saved Items Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 text-center">
          <Bookmark className="w-8 h-8 text-[#524E48] mx-auto mb-2.5" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#141416] mb-1">No saved books here</h2>
          <p className="text-sm text-[#524E48] max-w-sm mx-auto mb-4">
            Bookmark books from the Library or Home feed to keep them handy for later.
          </p>
          <button
            type="button"
            onClick={onExploreLibrary}
            className="w-full sm:w-auto min-h-[44px] bg-[#3B2FD6] hover:bg-[#3126B8] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
          >
            Browse Library
          </button>
        </div>
      ) : (
        <>
          {/* Mobile List Layout (< 640px) */}
          <div className="flex sm:hidden flex-col gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenReader(item)}
                className="bg-white border border-[#E4E4E7] rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
              >
                <div className="w-[62px] h-[86px] flex-shrink-0">
                  {renderThumbnail(item, true)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#524E48] truncate">
                    {item.category}
                  </p>
                  <h2 className="text-sm font-semibold text-[#141416] truncate mt-0.5">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#524E48] truncate">{item.author}</p>

                  {typeof item.progressPercent === 'number' && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#E4E4E7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3B2FD6] rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#524E48]">
                        {item.progressPercent}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveBookmark(e, item)}
                    aria-label={`Remove ${item.title} from saved`}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-[#ECEAFD] text-[#3B2FD6]"
                  >
                    <Bookmark className="w-4 h-4 fill-[#3B2FD6] pointer-events-none" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(item);
                    }}
                    className="min-h-[44px] px-4 rounded-md bg-[#141416] text-white font-semibold text-xs"
                  >
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Grid (fits 720px cleanly in 2–3 cols) */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenReader(item)}
                className="bg-white border border-[#E4E4E7] hover:border-[#A1A1AA] rounded-2xl p-3.5 flex flex-col justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3">
                    {renderThumbnail(item, false)}

                    <button
                      type="button"
                      onClick={(e) => handleRemoveBookmark(e, item)}
                      aria-label={`Remove ${item.title} from Saved books`}
                      title="Remove from Saved books"
                      className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/95 text-[#3B2FD6] hover:bg-white shadow-sm"
                    >
                      <Bookmark className="w-4 h-4 fill-[#3B2FD6] pointer-events-none" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-[10px] font-semibold tracking-wider text-[#524E48] uppercase truncate">
                    {item.category}
                  </p>
                  <h2 className="text-sm font-semibold text-[#141416] tracking-tight truncate group-hover:text-[#3B2FD6] transition-colors mt-0.5">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#524E48] truncate mt-0.5">
                    {item.author}
                  </p>

                  {typeof item.progressPercent === 'number' && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[11px] text-[#524E48] mb-1">
                        <span>{item.savedAt}</span>
                        <span className="font-semibold text-[#141416]">
                          {item.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#E4E4E7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3B2FD6] rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReader(item);
                    }}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-[#141416] hover:bg-[#2a2a2f] text-white font-semibold text-xs rounded-md transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 pointer-events-none" aria-hidden="true" />
                    <span>{item.progressPercent ? 'Continue' : 'Read'}</span>
                  </button>

                  {item.hasAudio && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAudio(item);
                      }}
                      aria-label={`Listen to ${item.title}`}
                      title="Listen to audiobook"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-white hover:bg-[#ECEAFD] border border-[#D4D4D8] text-[#524E48] hover:text-[#3B2FD6] transition-colors"
                    >
                      <Headphones className="w-4 h-4 pointer-events-none" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AccountPageLayout>
  );
}
