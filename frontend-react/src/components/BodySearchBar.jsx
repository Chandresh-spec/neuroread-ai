import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { curatedBooks, readingHistory } from '../data/booksData';
import { libraryBooks } from '../data/libraryBooksData';

export default function BodySearchBar({ onSelectBook, inputRef }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const allBooks = useMemo(() => {
    const seen = new Set();
    return [...readingHistory, ...curatedBooks, ...libraryBooks].filter((book) => {
      const key = book.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allBooks
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.genre && b.genre.toLowerCase().includes(q)) ||
          (b.category && b.category.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, allBooks]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (book) => {
    onSelectBook?.(book);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-3 w-full bg-[#F9F8FA] hover:bg-[#F4F2F7] focus-within:bg-white border border-[#E5E2EC] focus-within:border-[#4B3AE8] rounded-xl px-4 py-2.5 sm:py-3 transition-all shadow-2xs">
        <Search className="w-4 h-4 text-[#736E7D] flex-shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              e.currentTarget.blur();
            } else if (e.key === 'Enter' && results.length > 0) {
              e.preventDefault();
              handleSelect(results[0]);
            }
          }}
          placeholder="Search books, authors or topics"
          aria-label="Search books, authors or topics"
          className="w-full bg-transparent text-sm text-[#141416] placeholder-[#827D8C] focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef?.current?.focus();
            }}
            aria-label="Clear search"
            className="p-1 rounded-full text-[#6B665F] hover:text-[#141416] hover:bg-[#EAE6F0] transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-[#827D8C] bg-white border border-[#E5E2EC] rounded-md flex-shrink-0 select-none">
            Ctrl K
          </kbd>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5DFD3] rounded-2xl shadow-xl z-30 max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="text-center py-6 text-[#6B665F] text-sm">
              No books found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => handleSelect(book)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-left transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-10 rounded-lg bg-[#E3DFFA] flex items-center justify-center text-xs font-bold text-[#3A2AD9] flex-shrink-0">
                    {book.title[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#6B665F] truncate">{book.author}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#8C867E] group-hover:text-[#3A2AD9] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
