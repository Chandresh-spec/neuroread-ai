import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Upload,
  BookOpen,
  Headphones,
  ArrowRight,
  HardDrive,
  Gift,
} from 'lucide-react';

export default function HeroBanner({
  onExplore,
  onTryAudio,
  onUploadPdf,
  onExplorePremium,
}) {
  const slides = [
    {
      id: 'bestsellers-rent',
      tag: 'BOOKS & RENTALS',
      title: 'Read, rent or own top bestsellers.',
      subtitle: 'Rent 30 days from ₹29 or buy forever. Dyslexia fonts & voice built in.',
      gradient: 'from-[#18122B] via-[#271C4A] to-[#3B2878]',
      covers: [
        { src: './covers/deep-work.jpg', alt: 'Deep Work' },
        { src: './covers/psychology-of-money.jpg', alt: 'The Psychology of Money' },
        { src: './covers/atomic-habits.jpg', alt: 'Atomic Habits' },
      ],
      promoLabel: 'FLEXIBLE PRICING',
      promoTitle: 'Rent from ₹29 · Buy or Read Free',
      promoIcon: BookOpen,
      ctaLabel: 'Explore books',
      onAction: onExplore,
    },
    {
      id: 'premium-subscription',
      tag: 'NEUROREADER PLUS',
      title: 'A bigger home for all your PDFs.',
      subtitle: 'Upgrade for 15 GB–50 GB cloud vault & cross-device library sync.',
      gradient: 'from-[#14182E] via-[#24245C] to-[#4B3AE8]',
      covers: [
        { src: './covers/creative-act.jpg', alt: 'The Creative Act' },
        { src: './covers/four-thousand-weeks.jpg', alt: 'Four Thousand Weeks' },
      ],
      isSubscriptionSlide: true,
      promoLabel: 'SUBSCRIPTION PLANS',
      promoTitle: 'Reader Plus ₹149/mo · 20% Off Rentals',
      promoIcon: Crown,
      ctaLabel: 'Explore Premium',
      onAction: onExplorePremium,
    },
    {
      id: 'pdf-accessible',
      tag: 'BRING YOUR OWN PDF',
      title: 'Turn any PDF into a calm page.',
      subtitle: 'Upload notes or textbooks with OpenDyslexic, warm tint & read-aloud.',
      gradient: 'from-[#0E2620] via-[#153B30] to-[#1D6B4B]',
      covers: [
        { src: './covers/mountain-is-you.jpg', alt: 'The Mountain Is You' },
        { src: './covers/quiet-mind-method.jpg', alt: 'The Quiet Mind Method' },
      ],
      promoLabel: 'ACCESSIBILITY SUITE',
      promoTitle: '500 MB Free Storage · Voice Reader',
      promoIcon: Headphones,
      ctaLabel: 'Upload your PDF',
      onAction: onUploadPdf,
    },
    {
      id: 'free-classics',
      tag: 'THE FREE BOOKSHELF',
      title: 'Great stories. Zero cost forever.',
      subtitle: 'Dive straight into timeless classics with audio & focus line unlocked.',
      gradient: 'from-[#1F1733] via-[#34235C] to-[#56389E]',
      covers: [
        { src: './covers/pride-and-prejudice.jpg', alt: 'Pride and Prejudice' },
        { src: './covers/alice-in-wonderland.jpg', alt: 'Alice in Wonderland' },
        { src: './covers/midnight-library.jpg', alt: 'The Midnight Library' },
      ],
      promoLabel: 'FREE ACCESS',
      promoTitle: '₹0 Classics · No Subscription Needed',
      promoIcon: Gift,
      ctaLabel: 'Read for free',
      onAction: onExplore,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, slides.length]);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  const currentSlide = slides[activeIndex];
  const PromoIcon = currentSlide.promoIcon;

  return (
    <section
      aria-label="Featured books and subscriptions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full"
    >
      {/* Full-Width Clean Carousel Banner (no cropped side-peek strips) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px]">
        {/* Active Banner Card */}
        <div
          className={`relative w-full rounded-2xl sm:rounded-[24px] bg-gradient-to-r ${currentSlide.gradient} text-white overflow-hidden shadow-[0_14px_34px_rgba(20,16,44,0.16)] min-h-[240px] sm:min-h-[275px] lg:min-h-[300px] flex items-center transition-all duration-500`}
        >
          {/* Ambient Glow Circles */}
          <div className="absolute -top-20 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 right-10 w-64 h-64 rounded-full bg-[#A29BFE]/20 blur-[90px] pointer-events-none" />

          <div className="relative z-10 w-full px-5 py-7 sm:px-14 sm:py-8 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Visual: Real Book Covers Fan + Subscription Symbols */}
            <div className="hidden md:flex md:col-span-4 lg:col-span-4 items-center justify-center">
              <div className="relative flex items-center justify-center h-[195px] lg:h-[225px] w-full">
                {currentSlide.covers.map((cov, idx) => {
                  const rotations =
                    currentSlide.covers.length === 3
                      ? ['-rotate-10 -translate-x-12 translate-y-2 z-0', 'z-20 -translate-y-1', 'rotate-10 translate-x-12 translate-y-2 z-10']
                      : ['-rotate-6 -translate-x-7 translate-y-1 z-10', 'rotate-6 translate-x-7 -translate-y-1 z-20'];
                  return (
                    <div
                      key={cov.src}
                      className={`absolute w-[108px] lg:w-[126px] h-[154px] lg:h-[180px] rounded-xl overflow-hidden shadow-[0_18px_36px_rgba(0,0,0,0.45)] border border-white/25 bg-[#1B1630] transition-all duration-500 ${
                        rotations[idx] || ''
                      }`}
                    >
                      <img src={cov.src} alt={cov.alt} className="w-full h-full object-cover" />
                    </div>
                  );
                })}

                {/* Floating Subscription Symbol Badge on Slide */}
                {currentSlide.isSubscriptionSlide && (
                  <div className="absolute -bottom-1 right-2 z-30 flex items-center gap-1.5 bg-[#FFD166] text-[#1A1233] text-[10.5px] font-black px-3 py-1 rounded-full shadow-lg">
                    <Crown className="w-3.5 h-3.5 fill-[#1A1233]" />
                    <span>PLUS VAULT</span>
                  </div>
                )}
              </div>
            </div>

            {/* Center/Right: Editorial Offer Copy & Subscription Symbol Box (BookMyShow Banner Pattern) */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-center">
              {/* Top Pill Row: Tag + Quick Subscription/Book Symbols */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] uppercase bg-white/15 backdrop-blur-xs border border-white/20 text-white px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-[#C8C1FF]" />
                  <span>{currentSlide.tag}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/85 bg-black/25 px-2.5 py-1 rounded-full">
                  <HardDrive className="w-3 h-3 text-[#9FE6C3]" />
                  <span>PDF Vault</span>
                </span>

                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-white/85 bg-black/25 px-2.5 py-1 rounded-full">
                  <Headphones className="w-3 h-3 text-[#FFD166]" />
                  <span>Voice Reader</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-[-0.02em] leading-[1.12] mb-2">
                {currentSlide.title}
              </h1>

              <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed mb-4 sm:mb-5">
                {currentSlide.subtitle}
              </p>

              {/* BookMyShow-style Split Bottom Strip: Promo Symbol Box + Primary CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Subscription / Offer Symbol Box */}
                <button
                  type="button"
                  onClick={currentSlide.onAction}
                  className="flex items-center gap-3 bg-black/30 hover:bg-black/40 border border-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2.5 text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white text-[#4B3AE8] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <PromoIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#C9C2FF]">
                      {currentSlide.promoLabel}
                    </span>
                    <span className="block text-xs sm:text-[13px] font-bold text-white truncate">
                      {currentSlide.promoTitle}
                    </span>
                  </div>
                </button>

                {/* Primary Pill CTA + Secondary Audio/Upload Shortcut */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={currentSlide.onAction}
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#F4F1FF] text-[#141416] font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    <span>{currentSlide.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {currentSlide.id !== 'pdf-accessible' && (
                    <button
                      type="button"
                      onClick={onUploadPdf}
                      title="Upload your PDF"
                      className="inline-flex items-center justify-center gap-1.5 bg-white/12 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 sm:py-3 rounded-full transition-all whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Upload PDF</span>
                    </button>
                  )}

                  {currentSlide.id === 'pdf-accessible' && (
                    <button
                      type="button"
                      onClick={onTryAudio}
                      className="inline-flex items-center justify-center gap-1.5 bg-white/12 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 sm:py-3 rounded-full transition-all whitespace-nowrap"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Try voice</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Left & Right Carousel Arrow Controls */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white items-center justify-center backdrop-blur-xs transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white items-center justify-center backdrop-blur-xs transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Bottom Indicator Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${idx + 1}: ${s.tag}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'w-5 bg-white'
                    : 'w-1.5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
