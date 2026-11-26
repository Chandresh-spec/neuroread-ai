import React from 'react';

export default function BookCover({ book, width = 'w-full', height = 'h-full', className = '' }) {
  const { id } = book;

  if (id === 'atomic-habits') {
    return (
      <div className={`relative ${width} ${height} bg-[#FAF8F4] text-[#141416] rounded-xl overflow-hidden flex flex-col justify-between p-3 shadow-sm border border-[#E5DFD3] select-none ${className}`}>
        <div>
          <p className="text-[10px] sm:text-[11px] font-black tracking-[0.14em] uppercase leading-tight">
            ATOMIC HABITS
          </p>
        </div>
        <div className="grid grid-cols-5 gap-1 opacity-25 my-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#141416]" />
          ))}
        </div>
        <p className="text-[7.5px] tracking-widest uppercase text-[#6B665F] font-semibold truncate">
          JAMES CLEAR
        </p>
      </div>
    );
  }

  if (id === 'mountain-is-you') {
    return (
      <div className={`relative ${width} ${height} bg-[#193B32] text-white rounded-xl overflow-hidden flex flex-col justify-between p-3 shadow-sm select-none ${className}`}>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase leading-tight text-[#ECF3F0]">
            THE MOUNTAIN IS YOU
          </p>
        </div>
        <p className="text-[7.5px] tracking-widest uppercase text-[#A4C1B7] font-medium truncate">
          BRIANNA WIEST
        </p>
      </div>
    );
  }

  if (id === 'deep-work') {
    return (
      <div className={`relative ${width} ${height} bg-[#193B32] text-white rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-sm select-none ${className}`}>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.12em] uppercase text-[#EFF5F2]">
          DEEP WORK
        </p>
        <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#9EBAB0] font-semibold">
          CAL NEWPORT
        </p>
      </div>
    );
  }

  if (id === 'psychology-of-money') {
    return (
      <div className={`relative ${width} ${height} bg-[#7C371E] text-white rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-sm select-none ${className}`}>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase leading-snug text-[#FBECE6]">
          THE PSYCHOLOGY OF MONEY
        </p>
        <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#E2B5A3] font-semibold">
          MORGAN HOUSEL
        </p>
      </div>
    );
  }

  if (id === 'creative-act') {
    return (
      <div className={`relative ${width} ${height} bg-[#E6E0D0] text-[#1C1B18] rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-sm border border-[#D9D1BE] select-none ${className}`}>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.1em] uppercase leading-snug">
          THE CREATIVE ACT
        </p>
        <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#6E695E] font-semibold">
          RICK RUBIN
        </p>
      </div>
    );
  }

  if (id === 'four-thousand-weeks') {
    return (
      <div className={`relative ${width} ${height} bg-[#957CC8] text-[#191524] rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-sm select-none ${className}`}>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase leading-snug text-[#1B1726]">
          FOUR THOUSAND WEEKS
        </p>
        <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#372E4E] font-semibold">
          OLIVER BURKEMAN
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-[#ECE7DC] border border-[#DBD3C3] rounded-xl p-3 text-[#141416] flex items-end ${width} ${height} ${className}`}>
      <span className="text-xs font-bold">{book.title}</span>
    </div>
  );
}
