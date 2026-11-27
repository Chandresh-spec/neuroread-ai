import React from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { mostReadBooks } from '../data/homeBooksData';

export default function MostReadSection({ onSelectBook, onExplorePopular }) {
  return (
    <section aria-labelledby="home-most-read-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <h2
            id="home-most-read-heading"
            className="text-2xl sm:text-[28px] font-bold text-[#141416] tracking-tight leading-tight"
          >
            Most read this week
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5864] mt-1">
            The books readers keep coming back to.
          </p>
        </div>

        <button
          type="button"
          onClick={onExplorePopular}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
        >
          <span>Explore popular</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {mostReadBooks.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => onSelectBook?.(book)}
            className="group text-left bg-white hover:bg-[#FAF9F7] border border-[#E8E4DC] hover:border-[#C8C2B6] rounded-2xl p-4 flex items-center gap-3.5 transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <span className="text-base sm:text-lg font-bold text-[#C4C0CE] tabular-nums w-6 flex-shrink-0">
              {book.rank}
            </span>

            <div className="w-12 sm:w-14 h-16 sm:h-20 rounded-lg overflow-hidden shadow-xs flex-shrink-0">
              <HomeBookCover book={book} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-[15px] font-bold text-[#141416] group-hover:text-[#3B2FD6] transition-colors leading-snug truncate">
                {book.title}
              </h3>
              <p className="text-xs text-[#5A5864] mt-0.5 truncate">
                {book.author}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B2FD6] mt-2">
                <span>{book.rentLabel}</span>
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="sm:hidden mt-4">
        <button
          type="button"
          onClick={onExplorePopular}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
        >
          <span>Explore popular</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
