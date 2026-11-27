import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  AlignJustify,
  Lock,
  Star,
  ThumbsUp,
  Type,
  SlidersHorizontal,
} from 'lucide-react';
import HomeBookCover from './HomeBookCover';
import BookCommentsPage from './BookCommentsPage';
import { trendingBooks, freeClassicBooks } from '../data/homeBooksData';

const DEFAULT_CHAPTERS = [
  { num: '01', title: 'Starting where you are', access: 'Free sample', isFree: true },
  { num: '02', title: 'The first breath', access: 'After purchase', isFree: false },
  { num: '03', title: 'Noticing without fixing', access: 'After purchase', isFree: false },
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Ananya S.',
    verified: true,
    date: '12 November 2026',
    rating: 5,
    title: 'Small chapters made a big difference',
    body: 'I could finish a chapter without feeling overwhelmed. The language is clear, and listening while following the text helped me stay focused.',
    helpful: 24,
  },
  {
    id: 'rev-2',
    name: 'Rahul M.',
    verified: true,
    date: '8 November 2026',
    rating: 5,
    title: 'A book I can read at my own pace',
    body: 'The exercises are simple enough to use on a busy day. I tried the free sample first, then rented it. A gentle place to start.',
    helpful: 18,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 105, pct: 82 },
  { stars: 4, count: 18, pct: 14 },
  { stars: 3, count: 3, pct: 2.5 },
  { stars: 2, count: 1, pct: 1 },
  { stars: 1, count: 1, pct: 1 },
];

export default function BookDetailPage({
  book,
  onBack,
  onStartReading,
  onSelectBook,
  onOpenReaderSettings,
  onOpenAudio,
  onExploreAll,
  onBookAction,
}) {
  const [purchaseMode, setPurchaseMode] = useState('buy');
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showAllComments, setShowAllComments] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState({});
  const [commentText, setCommentText] = useState('');
  const [actionToast, setActionToast] = useState('');
  const commentBoxRef = useRef(null);

  const isFree = !!book?.isFree || book?.buyPrice === 0;
  const buyPrice = book?.buyPrice ?? 249;
  const rentPrice = book?.rentPrice ?? book?.rentFrom ?? 79;
  const activePrice = isFree ? 0 : purchaseMode === 'buy' ? buyPrice : rentPrice;
  const ratingValue = book?.rating ?? 4.8;
  const genreLabel = book?.genre || 'E-book / Mindfulness';
  const categoryTag = (book?.badge || book?.categoryId || 'SELF-HELP').replace(/-/g, ' ');
  const readTime = book?.duration || '42 min read';

  const recommendedBooks = useMemo(() => {
    const pool = [...trendingBooks, ...freeClassicBooks].filter((b) => b.id !== book?.id);
    return pool.slice(0, 4);
  }, [book?.id]);

  const handleToggleHelpful = (id) => {
    setHelpfulVoted((prev) => {
      const already = !!prev[id];
      setReviews((list) =>
        list.map((r) =>
          r.id === id ? { ...r, helpful: r.helpful + (already ? -1 : 1) } : r
        )
      );
      return { ...prev, [id]: !already };
    });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      name: 'You',
      verified: true,
      date: 'Just now',
      rating: 5,
      title: 'Reader note',
      body: trimmed,
      helpful: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    setCommentText('');
    setActionToast('Your comment was posted to the community.');
    setTimeout(() => setActionToast(''), 3500);
  };

  const handlePrimaryPurchase = () => {
    if (isFree) {
      onStartReading?.(book);
      return;
    }
    if (onBookAction) {
      onBookAction(book, purchaseMode);
    } else {
      onStartReading?.(book);
    }
  };

  const handleSecondaryPurchase = () => {
    const nextMode = purchaseMode === 'buy' ? 'rent' : 'buy';
    setPurchaseMode(nextMode);
    if (onBookAction) {
      onBookAction(book, nextMode);
    }
  };

  if (!book) return null;

  if (showAllComments) {
    return (
      <BookCommentsPage
        book={book}
        reviews={reviews}
        onAddReview={(newRev) => setReviews((prev) => [newRev, ...prev])}
        helpfulVoted={helpfulVoted}
        onToggleHelpful={handleToggleHelpful}
        onBackToBook={() => {
          setShowAllComments(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartReading={onStartReading}
      />
    );
  }

  return (
    <div className="w-full max-w-[1220px] mx-auto pb-12">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#EFECE6] mb-6 sm:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </button>

        <span className="hidden sm:inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#8B8598]">
          BOOK DETAILS
        </span>
      </div>

      {actionToast && (
        <div
          role="status"
          className="mb-6 rounded-xl bg-[#EFEBFD] border border-[#D8CFF9] px-4 py-3 text-sm font-medium text-[#3929D1]"
        >
          {actionToast}
        </div>
      )}

      {/* Main 3-Column Hero Detail Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-start">
        {/* Column 1: Cover + Read Free Sample CTA */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-stretch">
          <div className="w-44 sm:w-52 lg:w-full max-w-[240px]">
            <HomeBookCover
              bookId={book.id}
              title={book.title}
              author={book.author}
              className="shadow-[0_18px_36px_rgba(20,16,44,0.14)] !rounded-2xl"
            />
          </div>

          <button
            type="button"
            onClick={() => onStartReading?.(book)}
            className="mt-4 w-full max-w-[240px] py-2.5 px-4 rounded-xl border border-[#D9D4E6] hover:border-[#4B3AE8] bg-white hover:bg-[#FAF8FF] text-sm font-bold text-[#4B3AE8] transition-all text-center shadow-2xs"
          >
            {isFree ? 'Read for free' : 'Read free sample'}
          </button>
          <p className="mt-1.5 text-[11.5px] text-[#7A7585] text-center max-w-[240px]">
            {isFree ? 'Full book · No payment needed' : 'Chapter 1 · No payment needed'}
          </p>
        </div>

        {/* Column 2: Book Title, Author, Rating, Synopsis */}
        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-block text-[10.5px] font-extrabold tracking-[0.1em] uppercase bg-[#EFEBFD] text-[#4B3AE8] px-2.5 py-1 rounded-md">
              {categoryTag}
            </span>
            <span className="text-xs font-medium text-[#686472]">{genreLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-[36px] font-extrabold text-[#111115] tracking-[-0.025em] leading-[1.12] mb-3">
            {book.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="text-[#4B4754]">
              by <strong className="font-semibold text-[#141416]">{book.author}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3AE8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified author</span>
            </span>
          </div>

          {/* Star Rating Row */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-0.5 text-[#F59E0B]" aria-label={`${ratingValue} out of 5 stars`}>
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#141416]">{ratingValue}</span>
            <span className="text-xs text-[#736E7D]">128 reader reviews</span>
          </div>

          <p className="text-[15px] font-bold text-[#141416] mb-2">
            {book.synopsis || 'A calmer mind, one small step at a time.'}
          </p>

          <p className="text-sm text-[#585462] leading-relaxed mb-5">
            {book.description ||
              `A thoughtfully paced digital edition of ${book.title}. Designed with plain language, short chapters, and built-in dyslexia-friendly reading controls so you can read comfortably at your own rhythm.`}
          </p>

          {/* Metadata Footer Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#5E5A68] pt-3 border-t border-[#F0EDF5]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7C7788]" />
              <span>{readTime}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#7C7788]" />
              <span>12 short chapters</span>
            </span>
            <span>English · Digital edition</span>
          </div>
        </div>

        {/* Column 3: Make it your next read (Buy / Rent Card) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E5E0EE] rounded-2xl p-5 shadow-[0_12px_30px_rgba(20,16,44,0.06)]">
            <h2 className="text-base font-extrabold text-[#141416] mb-3.5">
              Make it your next read
            </h2>

            {!isFree ? (
              <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                {/* Buy Option */}
                <button
                  type="button"
                  onClick={() => setPurchaseMode('buy')}
                  className={`rounded-xl p-3 text-left border transition-all ${
                    purchaseMode === 'buy'
                      ? 'border-[#4B3AE8] bg-[#F7F5FF] ring-1 ring-[#4B3AE8]'
                      : 'border-[#E6E2EE] bg-white hover:border-[#CFC7DF]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        purchaseMode === 'buy' ? 'border-[#4B3AE8]' : 'border-[#BDB7CA]'
                      }`}
                    >
                      {purchaseMode === 'buy' && (
                        <span className="w-2 h-2 rounded-full bg-[#4B3AE8]" />
                      )}
                    </span>
                    <span className="text-xs font-bold text-[#141416]">Buy e-book</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#141416]">₹{buyPrice}</div>
                  <div className="text-[11px] text-[#6E6A78]">Yours to keep</div>
                </button>

                {/* Rent Option */}
                <button
                  type="button"
                  onClick={() => setPurchaseMode('rent')}
                  className={`rounded-xl p-3 text-left border transition-all ${
                    purchaseMode === 'rent'
                      ? 'border-[#4B3AE8] bg-[#F7F5FF] ring-1 ring-[#4B3AE8]'
                      : 'border-[#E6E2EE] bg-white hover:border-[#CFC7DF]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        purchaseMode === 'rent' ? 'border-[#4B3AE8]' : 'border-[#BDB7CA]'
                      }`}
                    >
                      {purchaseMode === 'rent' && (
                        <span className="w-2 h-2 rounded-full bg-[#4B3AE8]" />
                      )}
                    </span>
                    <span className="text-xs font-bold text-[#141416]">Rent e-book</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#141416]">₹{rentPrice}</div>
                  <div className="text-[11px] text-[#6E6A78]">Access for 14 days</div>
                </button>
              </div>
            ) : (
              <div className="rounded-xl p-3.5 border border-[#B6D7C1] bg-[#F3F8F4] mb-3.5">
                <div className="text-xs font-bold text-[#1D7A4C] uppercase tracking-wider">
                  Free Classic Edition
                </div>
                <div className="text-2xl font-extrabold text-[#141416] mt-0.5">₹0</div>
                <div className="text-xs text-[#4C5C51]">Full access included forever</div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-medium text-[#1D7A4C] mb-3.5">
              <Check className="w-3.5 h-3.5" />
              <span>Read anytime in your library</span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-[#F0EDF5] pt-3 mb-4">
              <div className="flex items-center justify-between text-[#686472]">
                <span>{purchaseMode === 'buy' || isFree ? 'E-book price' : '14-day rental'}</span>
                <span className="font-semibold text-[#141416]">₹{activePrice}</span>
              </div>
              <div className="flex items-center justify-between text-[#686472]">
                <span>Taxes &amp; fees</span>
                <span>Included</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-[#141416] pt-2 border-t border-[#F0EDF5]">
                <span>Total to pay</span>
                <span>₹{activePrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrimaryPurchase}
              className="w-full py-3 px-4 rounded-xl bg-[#4B3AE8] hover:bg-[#3C2CD6] text-white text-sm font-bold transition-all shadow-sm active:scale-[0.99]"
            >
              {isFree
                ? 'Start reading for free'
                : purchaseMode === 'buy'
                ? `Buy now · ₹${buyPrice}`
                : `Rent now · ₹${rentPrice}`}
            </button>

            {!isFree && (
              <button
                type="button"
                onClick={handleSecondaryPurchase}
                className="w-full mt-2.5 py-2.5 px-4 rounded-xl border border-[#DFDBE8] hover:border-[#4B3AE8] bg-white hover:bg-[#FAF8FF] text-xs font-bold text-[#4B3AE8] transition-all"
              >
                {purchaseMode === 'buy'
                  ? `Or rent for 14 days · ₹${rentPrice}`
                  : `Or buy to keep forever · ₹${buyPrice}`}
              </button>
            )}

            <div className="mt-3.5 pt-3 border-t border-[#F3F0F8] text-center space-y-1">
              <p className="inline-flex items-center justify-center gap-1 text-[11px] text-[#7A7585]">
                <Lock className="w-3 h-3" />
                <span>Secure payment · UPI, cards &amp; net banking</span>
              </p>
              <p className="text-[11px] text-[#908B9A]">
                No subscription. Rentals never auto-renew.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About This Book & A Look Inside */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* About This Book */}
        <div className="lg:col-span-6">
          <h2 className="text-xl font-extrabold text-[#111115] tracking-tight mb-2">
            About this book
          </h2>
          <p className="text-sm font-bold text-[#141416] mb-2">
            Less noise. More room for you.
          </p>
          <p className="text-sm text-[#585462] leading-relaxed mb-4">
            {book.title} offers clear, calm pacing designed for effortless reading. Explore focused
            ideas, everyday clarity, and accessible typography you can customize at your own pace.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {['Short chapters', 'Plain language', 'Practical exercises'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#F4F2FA] text-xs font-semibold text-[#4B3AE8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* A Look Inside */}
        <div className="lg:col-span-6">
          <h2 className="text-xl font-extrabold text-[#111115] tracking-tight mb-3">
            A look inside
          </h2>

          <div className="rounded-2xl border border-[#EAE6F0] bg-white divide-y divide-[#F1EEF7] overflow-hidden">
            {DEFAULT_CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className="px-4 py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF9FD] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-extrabold text-[#8B8598] tabular-nums w-5">
                    {ch.num}
                  </span>
                  <span className="text-sm font-semibold text-[#141416] truncate">
                    {ch.title}
                  </span>
                </div>

                {ch.isFree ? (
                  <button
                    type="button"
                    onClick={() => onStartReading?.(book)}
                    className="text-xs font-bold text-[#4B3AE8] hover:text-[#3929D1] whitespace-nowrap"
                  >
                    Free sample
                  </button>
                ) : (
                  <span className="text-xs text-[#8B8598] whitespace-nowrap">
                    {isFree ? 'Included' : ch.access}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-2.5 text-xs text-[#7D7888]">
            12 chapters · English · E-book
          </p>
        </div>
      </section>

      {/* From Our Reading Community */}
      <section className="mt-12 pt-10 border-t border-[#EFECE6]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111115] tracking-tight">
              From our reading community
            </h2>
            <p className="text-sm text-[#686472] mt-1">
              Honest thoughts from readers like you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => commentBoxRef.current?.focus()}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-[#DFDBE8] hover:border-[#4B3AE8] bg-white text-xs font-bold text-[#141416] hover:text-[#4B3AE8] transition-colors"
          >
            Write a review
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Rating Breakdown */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-5">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-4xl font-extrabold text-[#141416]">{ratingValue}</span>
                <span className="text-sm text-[#686472]">out of 5</span>
              </div>

              <div className="flex items-center gap-1 text-[#F59E0B] mb-1.5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              <p className="text-xs text-[#686472] mb-4">Based on 128 reviews</p>

              <div className="space-y-2">
                {RATING_BREAKDOWN.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2.5 text-xs">
                    <span className="w-6 font-semibold text-[#585462]">{row.stars} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E8E4F0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4B3AE8]"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-[#736E7D] tabular-nums">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAE6F0] bg-white p-4">
              <p className="text-xs font-bold text-[#141416] mb-1">A gentle reminder</p>
              <p className="text-xs text-[#686472] leading-relaxed">
                Everyone reads differently. Share what worked for you.
              </p>
            </div>
          </div>

          {/* Right Reviews List + Comment Form */}
          <div className="lg:col-span-8 space-y-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="rounded-2xl border border-[#EAE6F0] bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#141416]">{rev.name}</span>
                    {rev.verified && (
                      <span className="text-[11px] font-semibold text-[#1D7A4C] bg-[#E8F5ED] px-2 py-0.5 rounded-full">
                        Verified reader
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#8B8598]">{rev.date}</span>
                </div>

                <div className="flex items-center gap-0.5 text-[#F59E0B] mb-2">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>

                <h3 className="text-sm font-bold text-[#141416] mb-1">{rev.title}</h3>
                <p className="text-sm text-[#585462] leading-relaxed mb-3">{rev.body}</p>

                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    helpfulVoted[rev.id]
                      ? 'bg-[#EFEBFD] border-[#4B3AE8] text-[#4B3AE8]'
                      : 'bg-white border-[#E6E2EE] text-[#585462] hover:border-[#CFC7DF]'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpful})</span>
                </button>
              </article>
            ))}

            {/* Read All Comments Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAllComments(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DFDBE8] hover:border-[#4B3AE8] bg-white hover:bg-[#FAF8FF] text-xs font-bold text-[#4B3AE8] transition-all"
              >
                <span>Read all comments (128)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Join the Conversation */}
            <form
              onSubmit={handlePostComment}
              className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-5"
            >
              <label
                htmlFor="book-comment-input"
                className="block text-sm font-bold text-[#141416] mb-2"
              >
                Join the conversation
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={commentBoxRef}
                  id="book-comment-input"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share a thought or ask about this book…"
                  className="flex-1 rounded-xl border border-[#DFDBE8] bg-white px-3.5 py-2.5 text-sm text-[#141416] placeholder-[#8B8598] focus:outline-none focus:border-[#4B3AE8]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3C2CD6] text-white text-sm font-bold transition-colors whitespace-nowrap"
                >
                  Post comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Your Next Chapter (Recommended Reads) */}
      <section className="mt-12 pt-10 border-t border-[#EFECE6]">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111115] tracking-tight">
              Your next chapter
            </h2>
            <p className="text-sm text-[#686472] mt-1">
              More gentle reads for your everyday life.
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreAll}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
          >
            <span>Explore all books</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedBooks.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                onSelectBook?.(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group rounded-2xl border border-[#EAE6F0] hover:border-[#CFC7DF] bg-white p-3.5 flex sm:flex-col gap-3.5 cursor-pointer transition-all hover:shadow-[0_10px_24px_rgba(20,20,30,0.06)]"
            >
              <div className="w-20 sm:w-[136px] sm:mx-auto flex-shrink-0">
                <HomeBookCover
                  bookId={item.id}
                  title={item.title}
                  author={item.author}
                  className="shadow-xs"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#141416] group-hover:text-[#4B3AE8] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#686472] mt-0.5 truncate">{item.author}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#585462]">
                    <span className="inline-flex items-center gap-0.5 font-semibold text-[#141416]">
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      {item.rating ?? 4.7}
                    </span>
                    <span className="text-[#9A95A5]">E-book</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#F3F0F8] text-xs">
                  {item.isFree ? (
                    <>
                      <span className="font-bold text-[#1D7A4C]">Free to read</span>
                      <span className="text-[#8B8598]">No payment needed</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[#141416]">₹{item.buyPrice ?? 199}</span>
                      <span className="font-semibold text-[#4B3AE8]">
                        Rent ₹{item.rentPrice ?? 59}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
