import React, { useState } from 'react';

const COVER_IDS = new Set([
  'atomic-habits',
  'mountain-is-you',
  'deep-work',
  'psychology-of-money',
  'creative-act',
  'four-thousand-weeks',
  'midnight-library',
  'pride-and-prejudice',
  'alice-in-wonderland',
  'garden-of-hours',
  'quiet-mind-method',
  'stars-over-water',
  'curious-atom',
  'letters-young-reader',
  'slow-mornings',
  'maps-small-places',
  'patient-builder',
  'sleep-simply',
  'words-in-color',
  'gentle-focus-workbook',
  'notes-on-kindness',
]);

export default function HomeBookCover({
  bookId,
  title = '',
  author = '',
  className = '',
  aspectClass = 'aspect-[3/4]',
}) {
  const [err, setErr] = useState(false);
  const hasCover = COVER_IDS.has(bookId) && !err;

  if (hasCover) {
    return (
      <div
        className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-[#F4F1EB] border border-[#E7E3DC] select-none ${className}`}
      >
        <img
          src={`./covers/${bookId}.jpg`}
          alt={`${title}${author ? ` by ${author}` : ''}`}
          loading="lazy"
          onError={() => setErr(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspectClass} w-full rounded-xl bg-gradient-to-br from-[#EFECE6] to-[#DFD9CE] border border-[#DBD5C9] flex flex-col justify-between p-3.5 select-none ${className}`}
    >
      <span className="text-xs font-bold leading-snug line-clamp-3 text-[#1E1D24]">{title}</span>
      {author && (
        <span className="text-[10px] tracking-wider uppercase text-[#6B665F] font-semibold truncate">
          {author}
        </span>
      )}
    </div>
  );
}
