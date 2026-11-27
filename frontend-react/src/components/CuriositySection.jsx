import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { homeCategories, homeCatalogueBooks } from '../data/homeBooksData';

export default function CuriositySection({ onSelectBook, onExploreAll }) {
  const [activeCategory, setActiveCategory] = useState('for-you');

  const filteredBooks = homeCatalogueBooks
    .filter((book) => book.categories.includes(activeCategory))
    .slice(0, 4);

  return (
    <section aria-labelledby="home-catalogue-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2
            id="home-catalogue-heading"
            className="text-2xl sm:text-[28px] font-bold text-[#141416] tracking-tight leading-tight"
          >
            Find your next favourite
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5864] mt-1">
            Trending now. Ready for your reading style.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreAll}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
        >
          <span>View all books</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {homeCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] ${isActive
                ? 'bg-[#141416] text-white border-[#141416]'
                : 'bg-white text-[#4A4752] hover:text-[#141416] border-[#E0DCD3] hover:border-[#BEB8AC]'
                }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Responsive Grid: 2 Columns on Mobile, 4 Columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {filteredBooks.map((book) => (
          <article
            key={book.id}
            className="group bg-white border border-[#E8E4DC] hover:border-[#C8C2B6] rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-colors shadow-2xs"
          >
            <button
              type="button"
              onClick={() => onSelectBook?.(book)}
              className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded-xl"
            >
              {/* Soft Cover Stage */}
              <div className="relative bg-[#F5F3EE] rounded-xl p-3 sm:p-4 pt-8 sm:pt-9 mb-3 flex items-center justify-center">
                <span className="absolute top-2.5 left-2.5 bg-white/95 border border-[#E6E2D9] text-[#45424C] text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded">
                  {book.badge}
                </span>
                <div className="w-24 sm:w-28 h-32 sm:h-40 rounded-lg overflow-hidden shadow-md group-hover:scale-[1.02] transition-transform">
                  <HomeBookCover book={book} />
                </div>
              </div>

              <h3 className="text-sm sm:text-[15px] font-bold text-[#141416] group-hover:text-[#3B2FD6] transition-colors leading-snug line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-[#5A5864] mt-0.5 truncate">
                {book.author}
              </p>
            </button>

            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3 mt-3 border-t border-[#F0EDE6] text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => onSelectBook?.(book)}
                className="font-bold text-[#141416] hover:text-[#3B2FD6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
              >
                Buy {book.buyPrice}
              </button>
              <button
                type="button"
                onClick={() => onSelectBook?.(book)}
                className="inline-flex items-center gap-1 font-semibold text-[#3B2FD6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
              >
                <span>Rent {book.rentPrice}</span>
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile View All Link & Pricing Note */}
      <div className="mt-4 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onExploreAll}
          className="sm:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2FD6] hover:underline self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6] rounded"
        >
          <span>View all books</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <p className="text-xs text-[#6B6874]">
          Rentals last 30 days. Prices shown in INR.
        </p>
      </div>
    </section>
  );
}
