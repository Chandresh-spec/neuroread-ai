import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { curatedBooks, readingHistory } from '../data/booksData';
import { libraryBooks } from '../data/libraryBooksData';

export default function SearchModal({ isOpen, onClose, onSelectBook }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allBooks = [...readingHistory, ...curatedBooks, ...libraryBooks];
  const results = query.trim()
    ? allBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
      )
    : allBooks.slice(0, 5);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5DFD3] bg-white">
          <Search className="w-5 h-5 text-[#3A2AD9]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, topics..."
            className="w-full bg-transparent text-[#141416] placeholder-[#8C867E] text-sm sm:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B665F] hover:text-[#141416] hover:bg-[#F3EFE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1.5">
          <p className="text-[10.5px] font-bold text-[#7B756D] uppercase tracking-widest px-2 py-1">
            {query.trim() ? 'Matching Results' : 'Suggested Reads'}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-8 text-[#6B665F] text-sm">
              No books found matching "{query}"
            </div>
          ) : (
            results.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  onSelectBook(book);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E5DFD3] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-10 rounded-lg bg-[#E3DFFA] flex items-center justify-center text-xs font-bold text-[#3A2AD9]">
                    {book.title[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#6B665F]">{book.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#6B665F] text-xs">
                  <span className="hidden sm:inline font-medium group-hover:text-[#3A2AD9]">Open</span>
                  <ArrowRight className="w-4 h-4 text-[#8C867E] group-hover:text-[#3A2AD9] group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="bg-[#F5F1EA] px-4 py-2 border-t border-[#E5DFD3] flex items-center justify-between text-[11px] text-[#6B665F]">
          <span>Click any book to start reading</span>
          <kbd className="px-2 py-0.5 rounded bg-white border border-[#DED8CB] font-mono text-[#141416]">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
