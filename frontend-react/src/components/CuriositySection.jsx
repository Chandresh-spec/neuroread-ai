import React, { useState } from 'react';
import { Star, Bookmark, ArrowRight } from 'lucide-react';
import BookCover from './BookCover';
import { bookCategories, curatedBooks } from '../data/booksData';

export default function CuriositySection({ onSelectBook, onExploreAll }) {
  const [activeCategory, setActiveCategory] = useState('for-you');
  const [bookmarks, setBookmarks] = useState({
    'psychology-of-money': true,
  });

  const toggleBookmark = (e, bookId) => {
    e.stopPropagation();
    setBookmarks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const filteredBooks =
    activeCategory === 'for-you'
      ? curatedBooks
      : curatedBooks.filter((b) => b.categoryId === activeCategory);

  return (
    <section>
      {/* Header with Editorial Serif Title and Indigo Link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
          A little curiosity goes a long way
        </h2>
        <button
          onClick={onExploreAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3A2AD9] hover:underline transition-colors"
        >
          <span>Explore all books</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 sm:mb-5 scrollbar-none">
        {bookCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-[#141416] text-white border-[#141416] shadow-2xs'
                  : 'bg-white text-[#5E5A54] hover:text-[#141416] border-[#DED8CB] hover:border-[#B8B0A2]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 2-Column on Mobile, 3 on Tablet, 4 on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {filteredBooks.map((book) => {
          const isBookmarked = !!bookmarks[book.id];

          return (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="flex flex-col justify-between group cursor-pointer"
            >
              {/* Cover Container */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-2.5 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                <BookCover book={book} width="w-full" height="h-full" />

                <button
                  onClick={(e) => toggleBookmark(e, book.id)}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark book'}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all ${
                    isBookmarked
                      ? 'bg-white/90 text-[#3A2AD9] shadow-sm'
                      : 'bg-black/25 text-white/90 hover:bg-black/45 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isBookmarked ? 'fill-[#3A2AD9]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Clean Editorial Info Below Cover */}
              <div>
                <p className="text-[9.5px] font-bold tracking-[0.08em] text-[#7B756D] uppercase truncate">
                  {book.category}
                </p>

                <h3 className="text-sm font-bold text-[#141416] tracking-tight leading-snug group-hover:text-[#3A2AD9] transition-colors truncate mt-0.5">
                  {book.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6B665F] mt-0.5">
                  <span>{book.rating}</span>
                  <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>·</span>
                  <span>{book.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
