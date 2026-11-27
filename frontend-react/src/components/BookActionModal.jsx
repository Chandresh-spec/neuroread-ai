import React, { useState } from 'react';
import { X, BookOpen, Clock, ShoppingBag, CheckCircle2 } from 'lucide-react';
import HomeBookCover from './HomeBookCover';

export default function BookActionModal({
  book,
  initialMode = 'rent',
  isOpen,
  onClose,
  onStartReading,
}) {
  const [mode, setMode] = useState(initialMode);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !book) return null;

  const rentPrice = book.rentPrice || book.rentFrom || 49;
  const buyPrice = book.buyPrice || 299;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
      onStartReading?.(book);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E6E2EE] rounded-3xl max-w-lg w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-22 flex-shrink-0">
              <HomeBookCover
                bookId={book.id}
                title={book.title}
                author={book.author}
                aspectClass=""
                className="w-full h-full !rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#4B3AE8]">
                {book.genre || 'Featured Book'}
              </span>
              <h3 className="text-lg font-extrabold text-[#141416] leading-snug truncate">
                {book.title}
              </h3>
              <p className="text-xs text-[#686472]">{book.author}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full text-[#686472] hover:bg-[#F5F3F9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmed ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#1D7A4C] mx-auto" />
            <p className="text-base font-bold text-[#141416]">
              Added to your library!
            </p>
            <p className="text-xs text-[#686472]">Opening accessible reader...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setMode('rent')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'rent'
                    ? 'bg-[#FAF9FF] border-[#4B3AE8] ring-2 ring-[#4B3AE8]/15'
                    : 'bg-white border-[#E6E2EE] hover:border-[#CFC7DF]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B3AE8] mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Rent 30 days</span>
                </div>
                <p className="text-xl font-black text-[#141416]">₹{rentPrice}</p>
                <p className="text-[11px] text-[#686472] mt-0.5">Full book + voice</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('buy')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'buy'
                    ? 'bg-[#FAF9FF] border-[#4B3AE8] ring-2 ring-[#4B3AE8]/15'
                    : 'bg-white border-[#E6E2EE] hover:border-[#CFC7DF]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#141416] mb-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy forever</span>
                </div>
                <p className="text-xl font-black text-[#141416]">₹{buyPrice}</p>
                <p className="text-[11px] text-[#686472] mt-0.5">Lifetime access</p>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white font-bold text-sm py-3 rounded-full transition-colors"
              >
                {mode === 'rent' ? `Rent now for ₹${rentPrice}` : `Buy now for ₹${buyPrice}`}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartReading?.(book);
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-[#F5F3F9] hover:bg-[#EAE6F4] text-[#141416] font-semibold text-sm px-5 py-3 rounded-full transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Free sample</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
