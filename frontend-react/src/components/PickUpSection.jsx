import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookCover from './BookCover';
import { readingHistory } from '../data/booksData';

export default function PickUpSection({ onContinueReading, onContinueListening, onViewHistory }) {
  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
          Pick up where you left off
        </h2>
        <button
          onClick={onViewHistory}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3A2AD9] hover:underline transition-colors"
        >
          <span>History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {readingHistory.map((book) => {
          const isAudio = book.type === 'Audiobook';

          return (
            <div
              key={book.id}
              onClick={() => onContinueReading(book)}
              className="bg-white hover:bg-[#FAF8F5] border border-[#E5DFD3] hover:border-[#CFC7B8] rounded-2xl p-4 sm:p-5 flex flex-row items-start gap-4 transition-all shadow-2xs hover:shadow-md group cursor-pointer"
            >
              {/* Book Cover Thumbnail */}
              <div className="w-[74px] sm:w-[88px] h-[106px] sm:h-[126px] flex-shrink-0">
                <BookCover book={book} width="w-full" height="h-full" />
              </div>

              {/* Book Details & Progress */}
              <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                <div>
                  <span className="text-[10.5px] font-medium text-[#7B756D] block mb-0.5">
                    {book.type}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#141416] tracking-tight leading-snug group-hover:text-[#3A2AD9] transition-colors truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#6B665F] mt-0.5 truncate font-normal">
                    {book.currentLocation}
                  </p>
                </div>

                {/* Progress Bar & Label */}
                <div className="my-2.5">
                  <div className="w-full h-1 bg-[#EAE4D7] rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-[#3A2AD9] rounded-full transition-all duration-500"
                      style={{ width: `${book.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#7B756D] font-medium truncate">
                    {book.progressLabel} · {book.progressPercent}%
                  </p>
                </div>

                {/* Pill Action Button */}
                <div className="flex items-center justify-start pt-0.5">
                  {isAudio ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContinueListening(book);
                      }}
                      className="inline-flex items-center justify-center bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-semibold text-xs px-5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                    >
                      Listen
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContinueReading(book);
                      }}
                      className="inline-flex items-center justify-center bg-[#141416] hover:bg-[#2a2a2e] text-white font-semibold text-xs px-5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
