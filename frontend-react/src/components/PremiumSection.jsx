import React, { useState } from 'react';
import { Check, ArrowRight, FileText, FolderOpen } from 'lucide-react';
import { premiumSampleFiles } from '../data/homeBooksData';

export default function PremiumSection({ onSelectFile, onOpenMyFiles }) {
  const [showPlanNote, setShowPlanNote] = useState(false);

  return (
    <section
      aria-labelledby="home-premium-heading"
      className="rounded-3xl bg-gradient-to-br from-[#231B45] via-[#1C1639] to-[#2C2159] text-white p-6 sm:p-9 lg:p-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Pitch & Checklist */}
        <div className="lg:col-span-6">
          <span className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#B8B0F8] block mb-3">
            NEUROREAD PREMIUM
          </span>

          <h2
            id="home-premium-heading"
            className="text-3xl sm:text-[36px] font-bold text-white tracking-tight leading-[1.12] mb-3"
          >
            A bigger home
            <br />
            for your books.
          </h2>

          <p className="text-sm text-[#D7D2ED] leading-relaxed mb-5 max-w-md">
            More PDFs. More space. The same comfortable reading experience.
          </p>

          <ul className="space-y-2.5 text-sm text-[#ECE9FA] mb-7">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#A99DF9] flex-shrink-0" aria-hidden="true" />
              <span>More storage for your PDFs</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#A99DF9] flex-shrink-0" aria-hidden="true" />
              <span>Your library, across devices</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowPlanNote((prev) => !prev)}
              aria-expanded={showPlanNote}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1FF] text-[#1C1639] font-semibold text-sm px-5 py-3 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Explore Premium</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <span className="hidden lg:inline text-xs text-[#C7C0E8]">
              Reading tools stay free.
            </span>
          </div>

          {showPlanNote && (
            <div className="mt-4 rounded-2xl bg-white/10 border border-white/15 p-4 text-xs sm:text-sm text-[#ECE9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                Accessibility fonts, read-aloud, and focus tools are always free. Upgrade
                whenever you want extra PDF cloud storage.
              </p>
              <button
                type="button"
                onClick={onOpenMyFiles}
                className="inline-flex items-center gap-1.5 font-semibold text-white underline flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
              >
                <span>Open My Files</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Right Expanded Library Preview Card */}
        <div className="lg:col-span-6">
          <div className="bg-white text-[#141416] rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B2FD6] flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#141416] leading-tight">
                  Room for every chapter
                </h3>
                <p className="text-xs text-[#5A5864] mt-0.5">
                  Your expanded PDF library
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {premiumSampleFiles.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onSelectFile?.(file)}
                  className="w-full text-left flex items-center gap-3 bg-[#F8F7FC] hover:bg-[#EFEBFD] border border-[#EAE6F7] rounded-xl px-3.5 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
                >
                  <span className="w-8 h-8 rounded-lg bg-white border border-[#E4DFF5] text-[#3B2FD6] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs sm:text-sm font-semibold text-[#141416] truncate">
                      {file.title}
                    </span>
                    <span className="block text-[11px] text-[#5A5864] truncate">
                      {file.subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] font-medium text-[#5A5864] mt-4">
              More space. Less deleting.
            </p>
          </div>

          <p className="lg:hidden text-xs text-[#D3CEE6] mt-4 leading-relaxed">
            Reading tools stay free. Upgrade only when you need more space.
          </p>
        </div>
      </div>
    </section>
  );
}
