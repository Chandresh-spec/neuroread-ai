import React, { useState, useMemo, useRef } from 'react';
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { trendingCategories, trendingBooks } from '../data/homeBooksData';

export default function TrendingSection({ onSelectBook, onBookAction, onExploreAll }) {
  const [activeCategory, setActiveCategory] = useState('for-you');
  const [bookmarks, setBookmarks] = useState({ 'psychology-of-money': true });
  const scrollContainerRef = useRef(null);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleBooks = useMemo(() => {
    if (activeCategory === 'for-you') return trendingBooks;
    const matching = trendingBooks.filter((b) => b.categoryId === activeCategory);
    return matching.length > 0 ? matching : trendingBooks;
  }, [activeCategory]);

  const scrollByAmount = (direction) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: direction * 440,
      behavior: 'smooth',
    });
  };

  return (
    <section>
      {/* Header Row */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#111115] tracking-[-0.02em]">
            Find your next favourite
          </h2>
          <p className="text-sm text-[#686472] mt-1">
            Trending now. Ready for your reading style.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreAll}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors whitespace-nowrap"
        >
          <span>View all books</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {trendingCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#524E5B] hover:text-[#141416] border-[#E4E0EB] hover:border-[#BFB8CB]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Compact Horizontal Scrollable Shelf */}
      <div className="relative group/shelf">
        {/* Left Scroll Button (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll books left"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#E4E0EB] shadow-md items-center justify-center text-[#141416] hover:text-[#4B3AE8] opacity-0 group-hover/shelf:opacity-100 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Scroll Button (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll books right"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#E4E0EB] shadow-md items-center justify-center text-[#141416] hover:text-[#4B3AE8] opacity-0 group-hover/shelf:opacity-100 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {visibleBooks.map((book) => {
            const isSaved = !!bookmarks[book.id];
            return (
              <article
                key={book.id}
                onClick={() => onSelectBook?.(book)}
                className="group w-[162px] sm:w-[184px] md:w-[196px] flex-shrink-0 snap-start bg-white border border-[#EAE6F0] hover:border-[#CFC7DF] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between transition-all hover:shadow-[0_10px_24px_rgba(20,20,30,0.06)] cursor-pointer"
              >
                <div>
                  {/* Top Pill + Bookmark */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className="inline-block text-[8.5px] sm:text-[9px] font-bold tracking-[0.07em] uppercase text-[#5C5668] bg-[#F5F3F9] px-2 py-0.5 rounded-full truncate">
                      {book.badge || book.genre}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, book.id)}
                      aria-label={isSaved ? 'Remove bookmark' : 'Save book'}
                      className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                        isSaved
                          ? 'text-[#4B3AE8] bg-[#EFEBFD]'
                          : 'text-[#9690A2] hover:text-[#4B3AE8] hover:bg-[#F5F3F9]'
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-[#4B3AE8]' : ''}`} />
                    </button>
                  </div>

                  {/* Compact Book Cover */}
                  <div className="mb-2.5">
                    <HomeBookCover
                      bookId={book.id}
                      title={book.title}
                      author={book.author}
                      className="group-hover:shadow-sm transition-shadow"
                    />
                  </div>

                  {/* Title & Author */}
                  <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#141416] tracking-tight leading-snug group-hover:text-[#4B3AE8] transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-[#6B6675] mt-0.5 truncate">{book.author}</p>
                </div>

                {/* Buy & Rent Row */}
                <div className="flex items-center justify-between gap-1.5 pt-2.5 mt-2.5 border-t border-[#F2EFF6]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookAction ? onBookAction(book, 'buy') : onSelectBook?.(book);
                    }}
                    className="text-[11px] sm:text-xs font-bold text-[#141416] hover:text-[#4B3AE8] transition-colors"
                  >
                    Buy ₹{book.buyPrice}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookAction ? onBookAction(book, 'rent') : onSelectBook?.(book);
                    }}
                    className="inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
                  >
                    <span>Rent ₹{book.rentPrice}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile View All Link */}
      <div className="flex sm:hidden items-center justify-between mt-3">
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1]"
        >
          <span>View all books</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11.5px] text-[#837E8E] mt-2">
        Rentals last 30 days. Prices shown in INR.
      </p>
    </section>
  );
}
