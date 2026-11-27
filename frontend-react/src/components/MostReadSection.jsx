import React from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { mostReadBooks } from '../data/homeBooksData';

export default function MostReadSection({ onSelectBook, onBookAction, onExploreAll }) {
  return (
    <section>
      {/* Header Row */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#111115] tracking-[-0.02em]">
            Most read this week
          </h2>
          <p className="text-sm text-[#686472] mt-1">
            The books readers keep coming back to.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreAll}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors whitespace-nowrap"
        >
          <span>Explore popular</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3-Column Horizontal Cards on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {mostReadBooks.map((book) => (
          <article
            key={book.id}
            onClick={() => onSelectBook?.(book)}
            className="group bg-white hover:bg-[#FAF9FC] border border-[#EAE6F0] hover:border-[#CFC7DF] rounded-2xl p-4 flex items-center gap-3.5 sm:gap-4 transition-all hover:shadow-[0_10px_24px_rgba(20,20,30,0.05)] cursor-pointer"
          >
            {/* Rank Index */}
            <span className="text-xs font-extrabold text-[#8B8598] group-hover:text-[#4B3AE8] tabular-nums w-5 flex-shrink-0 transition-colors">
              {book.rank}
            </span>

            {/* Book Cover Thumbnail */}
            <div className="w-16 h-22 sm:w-[70px] sm:h-[96px] flex-shrink-0">
              <HomeBookCover
                bookId={book.id}
                title={book.title}
                author={book.author}
                aspectClass=""
                className="w-full h-full !rounded-lg shadow-xs"
              />
            </div>

            {/* Book Metadata & Rent Link */}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#141416] group-hover:text-[#4B3AE8] transition-colors leading-snug line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-[#6B6675] mt-0.5 truncate">{book.author}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookAction ? onBookAction(book, 'rent') : onSelectBook?.(book);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3AE8] hover:text-[#3929D1] mt-2.5 transition-colors"
              >
                <span>Rent from ₹{book.rentFrom}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile Explore Link */}
      <div className="flex sm:hidden mt-4">
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1]"
        >
          <span>Explore popular</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
