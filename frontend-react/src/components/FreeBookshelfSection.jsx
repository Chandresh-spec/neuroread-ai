import React from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { freeClassicBooks } from '../data/homeBooksData';

export default function FreeBookshelfSection({ onSelectBook, onExploreAll }) {
  return (
    <section className="rounded-[28px] bg-[#F3F8F4] border border-[#E0ECE3] p-5 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Intro Copy */}
        <div className="lg:col-span-4">
          <span className="text-[10.5px] font-bold tracking-[0.15em] uppercase text-[#1D7A4C] block mb-2">
            THE FREE BOOKSHELF
          </span>

          <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#111115] tracking-[-0.02em] leading-[1.1] mb-3">
            Great stories.
            <br />
            Zero cost.
          </h2>

          <p className="text-sm text-[#58635B] leading-relaxed mb-5">
            Start with a classic. No payment. No pressure.
          </p>

          <button
            type="button"
            onClick={onExploreAll}
            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-bold text-[#141416] hover:text-[#1D7A4C] transition-colors"
          >
            <span>Browse free books</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 2 Classic Free Books */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {freeClassicBooks.map((book) => (
            <article
              key={book.id}
              onClick={() => onSelectBook?.(book)}
              className="group bg-white hover:bg-[#FCFDFC] border border-[#E1ECE4] hover:border-[#B6D7C1] rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="w-20 h-28 flex-shrink-0">
                <HomeBookCover
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  aspectClass=""
                  className="w-full h-full !rounded-xl shadow-xs"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-bold text-[#1D7A4C] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full mb-1.5">
                  Free classic
                </span>
                <h3 className="text-[15px] font-bold text-[#141416] group-hover:text-[#1D7A4C] transition-colors leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-[#646D66] mt-0.5 truncate">{book.author}</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBook?.(book);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1D7A4C] hover:text-[#155E3A] mt-3 transition-colors"
                >
                  <span>Read for free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mobile Browse Link */}
      <div className="flex lg:hidden mt-5">
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#141416] hover:text-[#1D7A4C] transition-colors"
        >
          <span>Browse free books</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
