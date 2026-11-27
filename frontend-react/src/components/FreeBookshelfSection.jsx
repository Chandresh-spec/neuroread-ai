import React from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { freeClassicBooks } from '../data/homeBooksData';

export default function FreeBookshelfSection({ onSelectBook, onBrowseFree }) {
  return (
    <section
      aria-labelledby="home-free-bookshelf-heading"
      className="rounded-3xl bg-[#F3F5EE] border border-[#E2E6DA] p-6 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Left Intro Copy */}
        <div className="lg:col-span-5">
          <span className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#375341] block mb-2.5">
            THE FREE BOOKSHELF
          </span>

          <h2
            id="home-free-bookshelf-heading"
            className="text-2xl sm:text-[32px] font-bold text-[#141416] tracking-tight leading-[1.14] mb-2.5"
          >
            Great stories.
            <br />
            Zero cost.
          </h2>

          <p className="text-xs sm:text-sm text-[#4F564F] leading-relaxed mb-5">
            Start with a classic.
            <br />
            No payment. No pressure.
          </p>

          <button
            type="button"
            onClick={onBrowseFree}
            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3326] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
          >
            <span>Browse free books</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Right Classic Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {freeClassicBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => onSelectBook?.(book)}
              className="group text-left bg-white hover:bg-[#FAFBF8] border border-[#E2E6DA] hover:border-[#C5CCBE] rounded-2xl p-4 flex items-center gap-3.5 transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <div className="w-16 h-24 rounded-lg overflow-hidden shadow-xs flex-shrink-0">
                <HomeBookCover book={book} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#141416] group-hover:text-[#3B2FD6] transition-colors leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-[#5A5864] mt-0.5 truncate">
                  {book.author}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#141416] group-hover:text-[#3B2FD6] mt-3">
                  <span>Read for free</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile CTA Link */}
      <div className="lg:hidden mt-5">
        <button
          type="button"
          onClick={onBrowseFree}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3326] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
        >
          <span>Browse free books</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
