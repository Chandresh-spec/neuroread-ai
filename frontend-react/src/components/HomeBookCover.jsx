import React, { useState } from 'react';

const COVER_IMAGES = new Set([
  'deep-work',
  'psychology-of-money',
  'creative-act',
  'atomic-habits',
  'mountain-is-you',
  'four-thousand-weeks',
  'notes-on-kindness',
]);

function MidnightLibraryCover({ className = '' }) {
  return (
    <div
      className={`relative w-full h-full rounded-lg overflow-hidden bg-[#10223E] text-[#F7E8B6] p-2.5 flex flex-col justify-between select-none ${className}`}
    >
      <div className="grid grid-cols-3 gap-1 opacity-90">
        {[1, 2, 3, 4, 5, 6].map((pane) => (
          <div
            key={pane}
            className={`h-4 rounded-[2px] border border-[#D4AF5A]/55 ${
              pane === 2 || pane === 4 || pane === 6
                ? 'bg-[#E5BC5E]/85'
                : 'bg-[#19335A]'
            }`}
          />
        ))}
      </div>
      <div className="text-center my-auto py-1">
        <p className="text-[7px] tracking-[0.2em] uppercase text-[#E5BC5E] font-semibold">
          The
        </p>
        <p className="font-editorial text-[11px] leading-tight font-bold text-[#FAF2D6] mt-0.5">
          Midnight Library
        </p>
      </div>
      <p className="text-[8px] tracking-[0.14em] uppercase text-center text-[#D7C792] font-semibold truncate">
        Matt Haig
      </p>
    </div>
  );
}

function ClassicBookCover({ variant, title, author, className = '' }) {
  const isPride = variant === 'pride';
  const palette = isPride
    ? {
        bg: 'bg-[#284237]',
        border: 'border-[#B9CBBF]/45',
        accent: 'text-[#DCE8DD]',
        titleColor: 'text-[#FAF8F2]',
        ornament: '#9BB6A4',
      }
    : {
        bg: 'bg-[#1F2D3A]',
        border: 'border-[#B8C7D6]/45',
        accent: 'text-[#C8D7E6]',
        titleColor: 'text-[#FAF9F6]',
        ornament: '#94AEC6',
      };

  return (
    <div
      className={`relative w-full h-full rounded-lg overflow-hidden ${palette.bg} p-2 flex flex-col justify-between select-none ${className}`}
    >
      <div
        className={`w-full h-full border ${palette.border} rounded-[5px] p-2 flex flex-col items-center justify-between text-center`}
      >
        <svg viewBox="0 0 24 12" className="w-6 h-3 flex-shrink-0" aria-hidden="true">
          <path
            d="M2 6 C6 2, 9 2, 12 6 C15 2, 18 2, 22 6"
            fill="none"
            stroke={palette.ornament}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8.5" r="1.3" fill={palette.ornament} />
        </svg>

        <p className={`font-editorial text-[10px] leading-tight font-bold ${palette.titleColor}`}>
          {title}
        </p>

        <p className={`text-[7.5px] uppercase tracking-[0.12em] font-semibold ${palette.accent} truncate w-full`}>
          {author}
        </p>
      </div>
    </div>
  );
}

export default function HomeBookCover({ book, className = '' }) {
  const [imgError, setImgError] = useState(false);

  if (book.coverType === 'midnight') {
    return <MidnightLibraryCover className={className} />;
  }

  if (book.coverType === 'pride' || book.coverType === 'alice') {
    return (
      <ClassicBookCover
        variant={book.coverType}
        title={book.title}
        author={book.author}
        className={className}
      />
    );
  }

  if (COVER_IMAGES.has(book.id) && !imgError) {
    return (
      <img
        src={`./covers/${book.id}.jpg`}
        alt={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
        loading="lazy"
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover rounded-lg select-none ${className}`}
      />
    );
  }

  return (
    <ClassicBookCover
      variant="alice"
      title={book.title}
      author={book.author || ''}
      className={className}
    />
  );
}
