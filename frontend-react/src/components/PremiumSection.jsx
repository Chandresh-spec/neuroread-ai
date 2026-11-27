import React, { useState } from 'react';
import { Check, ArrowRight, FileText, FolderOpen, X, Crown } from 'lucide-react';
import { premiumLibraryPreview, premiumPlans } from '../data/homeBooksData';

export default function PremiumSection({ isPlansOpen: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedPlanNotice, setSelectedPlanNotice] = useState('');

  const isPlansOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsPlansOpen = (val) => {
    setInternalOpen(val);
    onOpenChange?.(val);
  };

  return (
    <>
      <section id="premium-section" className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#231942] via-[#2A1E4F] to-[#1A1233] p-6 sm:p-10 lg:p-12 text-white shadow-[0_18px_48px_rgba(26,18,51,0.18)]">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#6E5CF6]/20 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#A29BFE]/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Premium Value Proposition */}
          <div className="lg:col-span-6">
            <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#BDB5FF] block mb-2.5">
              NEUROREADER PREMIUM
            </span>

            <h2 className="text-3xl sm:text-[38px] font-extrabold text-white tracking-[-0.02em] leading-[1.08] mb-3.5">
              A bigger home
              <br />
              for your books.
            </h2>

            <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed max-w-md mb-5">
              More PDFs. More space. The same comfortable reading experience.
            </p>

            <ul className="space-y-2.5 mb-7">
              <li className="flex items-center gap-2.5 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#C4BDFF]" />
                </span>
                <span>More storage for your PDFs</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#C4BDFF]" />
                </span>
                <span>Your library, across devices</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsPlansOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5F3FF] text-[#1A1233] font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md active:scale-[0.98]"
              >
                <span>Explore Premium</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-white/60 leading-snug">
                Reading tools stay free. Upgrade only when you need more space.
              </span>
            </div>
          </div>

          {/* Right Column: Expanded PDF Library Preview Card */}
          <div className="lg:col-span-6">
            <div className="bg-white/[0.08] border border-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-[#D4CEFF] flex-shrink-0">
                  <FolderOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Room for every chapter
                  </h3>
                  <p className="text-[11.5px] text-white/65">Your expanded PDF library</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {premiumLibraryPreview.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl px-3.5 py-3 text-[#141416] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EFEBFD] text-[#4B3AE8] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-[13px] font-bold text-[#141416] truncate">
                          {item.fileName}
                        </p>
                        <p className="text-[11px] text-[#686472] truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#4B3AE8] bg-[#F2EFFC] px-2.5 py-1 rounded-full flex-shrink-0">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-[11.5px]">
                <span className="text-white/75 font-medium">More space. Less deleting.</span>
                <span className="text-[#C4BDFF] font-semibold">Up to 50 GB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Storage Tiers Modal */}
      {isPlansOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPlansOpen(false)}
        >
          <div
            className="bg-white border border-[#E6E2EE] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto modal-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#4B3AE8] mb-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>NeuroReader Premium Storage</span>
                </span>
                <h3 className="text-2xl font-extrabold text-[#141416] tracking-tight">
                  Choose space that grows with your library
                </h3>
                <p className="text-sm text-[#686472] mt-1">
                  Dyslexia fonts, focus line, and voice reading are always free on every plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlansOpen(false)}
                aria-label="Close storage plans"
                className="p-2 rounded-full text-[#686472] hover:bg-[#F5F3F9] hover:text-[#141416]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPlanNotice && (
              <div className="mb-5 bg-[#EFEBFD] border border-[#D7CEF9] text-[#3526B8] rounded-xl px-4 py-3 text-sm font-medium">
                {selectedPlanNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {premiumPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-[#FAF9FF] border-[#4B3AE8] ring-2 ring-[#4B3AE8]/15'
                      : 'bg-white border-[#E6E2EE]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-[#141416]">{plan.name}</h4>
                      {plan.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#4B3AE8] text-white px-2.5 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-black text-[#141416]">{plan.price}</span>
                      <span className="text-xs text-[#686472]">{plan.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#4B3AE8] mb-4">{plan.storage}</p>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-[#4C4858]">
                          <Check className="w-3.5 h-3.5 text-[#4B3AE8] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPlanNotice(
                        plan.id === 'starter'
                          ? 'You are currently on the Free Starter plan (500 MB included).'
                          : `Selected ${plan.name} (${plan.price}${plan.period} · ${plan.storage}). Checkout integration ready when billing goes live.`
                      )
                    }
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition-all ${
                      plan.popular
                        ? 'bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white'
                        : plan.id === 'starter'
                          ? 'bg-[#F5F3F9] text-[#5E5A68]'
                          : 'bg-[#141416] hover:bg-[#2A2A32] text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
