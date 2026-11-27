import React, { useState } from 'react';

const COVER_IMAGE_IDS = new Set([
  'atomic-habits',
  'mountain-is-you',
  'deep-work',
  'psychology-of-money',
  'creative-act',
  'four-thousand-weeks',
  'midnight-library',
  'pride-and-prejudice',
  'alice-in-wonderland',
]);

export default function BookCover({
  book,
  width = 'w-full',
  height = 'h-full',
  className = '',
}) {
  const [imgError, setImgError] = useState(false);
  const { id, title, author } = book;
  const hasRealCover = COVER_IMAGE_IDS.has(id) && !imgError;

  if (hasRealCover) {
    return (
      <div
        className={`relative ${width} ${height} rounded-xl overflow-hidden bg-[#F5F1EA] border border-[#E5DFD3]/80 shadow-sm select-none ${className}`}
      >
        <img
          src={`./covers/${id}.jpg`}
          alt={`${title}${author ? ` by ${author}` : ''}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-[#ECE7DC] border border-[#DBD3C3] rounded-xl p-3 text-[#141416] flex flex-col justify-between ${width} ${height} ${className}`}
    >
      <span className="text-[11px] font-bold leading-snug line-clamp-3">{title}</span>
      {author && (
        <span className="text-[9px] tracking-wider uppercase text-[#6B665F] font-semibold truncate">
          {author}
        </span>
      )}
    </div>
  );
}
