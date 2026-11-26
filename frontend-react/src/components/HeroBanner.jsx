import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroBanner({ onExplore, onTryAudio }) {
  return (
    <section className="relative py-2 sm:py-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Copy & Pill CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.18em] text-[#3A2AD9] uppercase mb-3">
            A LIBRARY THAT GETS YOU
          </span>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#141416] tracking-tight leading-[1.06] mb-4">
            Different minds.<br />
            <span className="italic text-[#3A2AD9] font-semibold">Endless</span><br />
            possibilities.
          </h1>

          <p className="text-sm sm:text-[15.5px] text-[#5E5A54] max-w-lg font-normal leading-relaxed mb-6 sm:mb-7">
            Discover great books with tools that adapt to how you think. Read at your pace,
            listen when you like, and make every page yours.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 bg-[#141416] hover:bg-[#2a2a2f] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-sm active:scale-95"
            >
              <span>Explore library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTryAudio}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#141416] border border-[#D8D1C5] hover:border-[#B8B0A2] font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all active:scale-95"
            >
              <span>Try audio reading</span>
            </button>
          </div>
        </div>

        {/* Right Column: Pastel Lavender & Peach Book Showcase Card */}
        <div className="lg:col-span-6">
          <div className="relative rounded-[28px] bg-[#E3DFFA] p-6 sm:p-10 min-h-[290px] sm:min-h-[340px] lg:min-h-[370px] flex items-center justify-center overflow-hidden shadow-sm">
            {/* Soft Peach Circle Accent (Bottom Left) */}
            <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#FAD8C4]/85 pointer-events-none" />

            {/* Tilted Books Pair */}
            <div className="relative z-10 flex items-center justify-center w-full max-w-[340px] h-[220px] sm:h-[250px]">
              {/* Book 1: Deep Work (Real Cover, tilted left) */}
              <div className="w-36 sm:w-44 h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FAF8F4] shadow-xl -rotate-6 -translate-x-6 translate-y-2 border border-white/60 select-none">
                <img
                  src="./covers/deep-work.jpg"
                  alt="Deep Work by Cal Newport"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book 2: The Psychology of Money (Real Cover, tilted right, overlapping) */}
              <div className="w-36 sm:w-44 h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FAF8F4] shadow-2xl rotate-6 translate-x-6 -translate-y-2 border border-white/60 select-none">
                <img
                  src="./covers/psychology-of-money.jpg"
                  alt="The Psychology of Money by Morgan Housel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating "Listening now" Card */}
            <button
              onClick={onTryAudio}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 bg-white hover:bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-lg transition-transform hover:scale-[1.02] text-left"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3A2AD9] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#141416] leading-tight">
                  Listening now
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#6B665F] mt-0.5">
                  Chapter 2 · 1h 12m of 5h 35m
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
