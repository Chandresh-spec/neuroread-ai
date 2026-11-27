import React from 'react';
import { Upload, ArrowUpRight, Play } from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import { homeCatalogueBooks } from '../data/homeBooksData';

export default function HeroBanner({ onExplore, onTryAudio, onUploadPdf, onSelectBook }) {
  const deepWork = homeCatalogueBooks[0];
  const psychMoney = homeCatalogueBooks[1];

  return (
    <section aria-labelledby="home-hero-heading" className="pt-2 pb-4 sm:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Headline & Action Buttons */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#3B2FD6] uppercase mb-3">
            MORE STORY. YOUR WAY.
          </span>

          <h1
            id="home-hero-heading"
            className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#141416] tracking-tight leading-[1.06] mb-4"
          >
            Big stories.
            <br />
            <span className="text-[#3B2FD6]">Your pace.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5A5864] max-w-md leading-relaxed mb-6 sm:mb-7">
            Discover your next favourite, or bring your own PDF. Read and listen in a way
            that feels right for you.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onUploadPdf}
              className="inline-flex items-center justify-center gap-2 bg-[#3B2FD6] hover:bg-[#3125BE] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              <span>Upload your PDF</span>
            </button>

            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F7F6F3] text-[#141416] border border-[#DEDAD2] hover:border-[#C2BDB3] font-semibold text-sm px-6 py-3 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <ArrowUpRight className="w-4 h-4 text-[#5A5864]" aria-hidden="true" />
              <span>Explore books</span>
            </button>
          </div>

          <p className="text-xs text-[#6E6B76] mt-4">
            Free to start. No subscription needed.
          </p>
        </div>

        {/* Right Column: Soft Lavender Book Showcase Card */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#F1EEFD] via-[#EAE5FC] to-[#E3DCFA] border border-[#DED6FA] p-5 sm:p-7">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#5346D9] block mb-4">
              A LITTLE INSPIRATION FOR YOUR SHELF
            </span>

            {/* Tilted Real Book Covers Pair */}
            <div className="relative flex items-center justify-center py-3 sm:py-4">
              <div className="flex items-center justify-center -space-x-4 sm:-space-x-3">
                <button
                  type="button"
                  onClick={() => onSelectBook?.(deepWork)}
                  aria-label="Open Deep Work in reader"
                  className="w-32 sm:w-40 h-44 sm:h-52 rounded-xl overflow-hidden bg-white shadow-lg -rotate-4 hover:rotate-0 hover:scale-[1.03] transition-transform border border-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <HomeBookCover book={deepWork} />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectBook?.(psychMoney)}
                  aria-label="Open The Psychology of Money in reader"
                  className="w-32 sm:w-40 h-44 sm:h-52 rounded-xl overflow-hidden bg-white shadow-xl rotate-4 translate-y-2 hover:rotate-0 hover:scale-[1.03] transition-transform border border-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <HomeBookCover book={psychMoney} />
                </button>
              </div>
            </div>

            {/* White Audio Player Callout */}
            <button
              type="button"
              onClick={onTryAudio}
              className="mt-4 w-full bg-white hover:bg-[#FAF9FF] border border-[#E4DFF5] rounded-2xl px-4 py-3 flex items-center gap-3.5 shadow-sm transition-colors text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <span className="w-9 h-9 rounded-full bg-[#3B2FD6] text-white flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-[#141416] leading-tight">
                  A good book. A gentler pace.
                </span>
                <span className="block text-[11px] sm:text-xs text-[#5A5864] mt-0.5 truncate">
                  Read it. Hear it. Make it yours.
                </span>
              </span>
            </button>

            <p className="hidden sm:block text-center text-[11px] font-medium text-[#4F43CF] mt-3">
              Buy it. Rent it. Or read for free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
