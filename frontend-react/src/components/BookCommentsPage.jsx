import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  ThumbsUp,
  Search,
  MessageSquare,
  CheckCircle2,
  Send,
} from 'lucide-react';
import HomeBookCover from './HomeBookCover';

const RATING_BREAKDOWN = [
  { stars: 5, count: 105, pct: 82 },
  { stars: 4, count: 18, pct: 14 },
  { stars: 3, count: 3, pct: 2.5 },
  { stars: 2, count: 1, pct: 1 },
  { stars: 1, count: 1, pct: 1 },
];

const EXTRA_COMMUNITY_REVIEWS = [
  {
    id: 'rev-3',
    name: 'Meera K.',
    verified: true,
    date: '2 November 2026',
    rating: 5,
    title: 'Easy on the eyes and easy to follow',
    body: 'Using OpenDyslexic with warm paper made evening reading effortless. Highly recommend starting with the free sample.',
    helpful: 15,
    tag: 'Accessibility',
  },
  {
    id: 'rev-4',
    name: 'Arjun V.',
    verified: true,
    date: '28 October 2026',
    rating: 4,
    title: 'Short, focused chapters without filler',
    body: 'Most books drag on for pages before making a point. Every chapter here respects your attention and ends with a practical takeaway.',
    helpful: 11,
    tag: 'Pacing',
  },
  {
    id: 'rev-5',
    name: 'Priya N.',
    verified: false,
    date: '19 October 2026',
    rating: 5,
    title: 'Voice reader + line focus is a game changer',
    body: 'I rented the 14-day edition first to test how it felt during my commute. Ended up buying it so I can revisit my highlights anytime.',
    helpful: 9,
    tag: 'Audio & Focus',
  },
  {
    id: 'rev-6',
    name: 'Karthik R.',
    verified: true,
    date: '11 October 2026',
    rating: 5,
    title: 'Calm reading experience from page one',
    body: 'No visual clutter, generous line spacing, and straightforward language. Finished the whole book over one quiet weekend.',
    helpful: 7,
    tag: 'Clarity',
  },
  {
    id: 'rev-7',
    name: 'Sneha D.',
    verified: true,
    date: '4 October 2026',
    rating: 3,
    title: 'Good introduction, though quite brief',
    body: 'The formatting and voice reader worked smoothly, and the exercises are helpful. I just wished the later chapters went a little deeper.',
    helpful: 6,
    tag: 'Pacing',
  },
  {
    id: 'rev-8',
    name: 'Vikram P.',
    verified: false,
    date: '26 September 2026',
    rating: 3,
    title: 'Helpful reminders for busy weeks',
    body: 'Simple concepts that are easy to revisit. Great if you prefer short, digestible sections over dense theory.',
    helpful: 4,
    tag: 'Overview',
  },
  {
    id: 'rev-9',
    name: 'Neha T.',
    verified: true,
    date: '18 September 2026',
    rating: 2,
    title: 'Too basic if you already read similar books',
    body: 'Readable layout as always on NeuroReader, but the core ideas felt very familiar to me.',
    helpful: 3,
    tag: 'Content',
  },
  {
    id: 'rev-10',
    name: 'Rohan B.',
    verified: false,
    date: '9 September 2026',
    rating: 1,
    title: 'Not the right fit for what I needed',
    body: 'I was looking for a workbook with longer case studies rather than short daily reflections.',
    helpful: 2,
    tag: 'Expectations',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All reviews' },
  { id: 'helpful', label: 'Most helpful' },
  { id: '5', label: '5 ★' },
  { id: '4', label: '4 ★' },
  { id: '3', label: '3 ★' },
  { id: '2', label: '2 ★' },
  { id: '1', label: '1 ★' },
  { id: 'verified', label: 'Verified readers' },
];

const COMMENTS_PER_PAGE = 4;

export default function BookCommentsPage({
  book,
  reviews,
  onAddReview,
  helpfulVoted,
  onToggleHelpful,
  onBackToBook,
  onStartReading,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [postedNotice, setPostedNotice] = useState('');

  const allReviews = useMemo(() => {
    const existingIds = new Set(reviews.map((r) => r.id));
    const extras = EXTRA_COMMUNITY_REVIEWS.filter((r) => !existingIds.has(r.id));
    return [...reviews, ...extras];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let list = [...allReviews];

    if (['5', '4', '3', '2', '1'].includes(activeFilter)) {
      const targetStar = Number(activeFilter);
      list = list.filter((r) => r.rating === targetStar);
    } else if (activeFilter === 'verified') {
      list = list.filter((r) => r.verified);
    } else if (activeFilter === 'helpful') {
      list.sort((a, b) => b.helpful - a.helpful);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allReviews, activeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / COMMENTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * COMMENTS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBody.trim()) return;
    onAddReview({
      id: `rev-${Date.now()}`,
      name: 'You',
      verified: true,
      date: 'Just now',
      rating: newRating,
      title: newTitle.trim() || 'Reader review',
      body: newBody.trim(),
      helpful: 0,
    });
    setNewTitle('');
    setNewBody('');
    setNewRating(5);
    setCurrentPage(1);
    setPostedNotice('Thanks! Your review has been added.');
    setTimeout(() => setPostedNotice(''), 3500);
  };

  if (!book) return null;

  const ratingValue = book.rating ?? 4.8;

  return (
    <div className="w-full max-w-[1140px] mx-auto pb-12">
      {/* Top Back Bar */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#EFECE6] mb-6">
        <button
          type="button"
          onClick={onBackToBook}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B3AE8] hover:text-[#3929D1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to book details</span>
        </button>

        <span className="hidden sm:inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#8B8598]">
          READER COMMUNITY · 128 REVIEWS
        </span>
      </div>

      {/* Compact Book Context Banner */}
      <div className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 sm:w-16 flex-shrink-0">
            <HomeBookCover
              bookId={book.id}
              title={book.title}
              author={book.author}
              className="!rounded-lg shadow-xs"
            />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#4B3AE8]">
              COMMUNITY REVIEWS
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#111115] truncate">
              {book.title}
            </h1>
            <p className="text-xs text-[#686472] truncate">by {book.author}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartReading?.(book)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-[#DFDBE8] hover:border-[#4B3AE8] text-xs font-bold text-[#4B3AE8] transition-colors whitespace-nowrap"
        >
          {book.isFree ? 'Read for free' : 'Read free sample'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Rating Summary + Write a Review */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-[#EAE6F0] bg-white p-5">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-4xl font-extrabold text-[#141416]">{ratingValue}</span>
              <span className="text-sm text-[#686472]">out of 5</span>
            </div>

            <div className="flex items-center gap-1 text-[#F59E0B] mb-1.5">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>

            <p className="text-xs text-[#686472] mb-4">Based on 128 reader reviews</p>

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

          {/* Add Review Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#4B3AE8]" />
              <h2 className="text-sm font-extrabold text-[#141416]">Add your review</h2>
            </div>

            {postedNotice && (
              <div className="rounded-lg bg-[#E8F5ED] text-[#1D7A4C] px-3 py-2 text-xs font-semibold">
                {postedNotice}
              </div>
            )}

            <div>
              <span className="block text-xs font-semibold text-[#585462] mb-1">Your rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    aria-label={`Rate ${star} stars`}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#D0CBD9]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Headline (optional)"
              className="w-full rounded-xl border border-[#DFDBE8] bg-white px-3.5 py-2 text-xs text-[#141416] placeholder-[#8B8598] focus:outline-none focus:border-[#4B3AE8]"
            />

            <textarea
              rows={3}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="What helped you while reading this book?"
              className="w-full rounded-xl border border-[#DFDBE8] bg-white px-3.5 py-2.5 text-xs text-[#141416] placeholder-[#8B8598] focus:outline-none focus:border-[#4B3AE8] resize-none"
            />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#4B3AE8] hover:bg-[#3C2CD6] text-white text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post review</span>
            </button>
          </form>
        </aside>

        {/* Right Column: Search, Filter Pills & Full Comment Stream */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search + Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8B8598] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search reader reviews and comments…"
                className="w-full rounded-xl border border-[#E5E0EE] bg-white pl-10 pr-4 py-2.5 text-sm text-[#141416] placeholder-[#8B8598] focus:outline-none focus:border-[#4B3AE8]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleFilterChange(tab.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isActive
                        ? 'bg-[#141416] text-white border-[#141416]'
                        : 'bg-white text-[#524E5B] border-[#E4E0EB] hover:border-[#BFB8CB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-[#EAE6F0] bg-[#FAF9FC] p-8 text-center">
              <p className="text-sm font-bold text-[#141416] mb-1">No matching comments</p>
              <p className="text-xs text-[#686472]">
                Try clearing your search or choosing another filter.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3.5">
                {paginatedReviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="rounded-2xl border border-[#EAE6F0] bg-white p-5 transition-colors hover:border-[#D7D0E4]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#141416]">{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D7A4C] bg-[#E8F5ED] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified reader</span>
                          </span>
                        )}
                        {rev.tag && (
                          <span className="text-[10.5px] font-semibold text-[#4B3AE8] bg-[#EFEBFD] px-2 py-0.5 rounded-full">
                            {rev.tag}
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
                      onClick={() => onToggleHelpful(rev.id)}
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
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#EFECE6]">
                <p className="text-xs text-[#686472]">
                  Showing <strong className="text-[#141416]">{startIndex + 1}</strong>–
                  <strong className="text-[#141416]">
                    {Math.min(startIndex + COMMENTS_PER_PAGE, filteredReviews.length)}
                  </strong>{' '}
                  of <strong className="text-[#141416]">{filteredReviews.length}</strong> comments
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => handlePageChange(safePage - 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E0EE] bg-white text-xs font-semibold text-[#141416] hover:border-[#4B3AE8] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={pageNum === safePage ? 'page' : undefined}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        pageNum === safePage
                          ? 'bg-[#4B3AE8] text-white'
                          : 'bg-white border border-[#E5E0EE] text-[#524E5B] hover:border-[#4B3AE8] hover:text-[#4B3AE8]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => handlePageChange(safePage + 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E0EE] bg-white text-xs font-semibold text-[#141416] hover:border-[#4B3AE8] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
