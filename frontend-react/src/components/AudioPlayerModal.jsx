import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, X, Headphones } from 'lucide-react';

export default function AudioPlayerModal({ isOpen, onClose, book }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentProgress, setCurrentProgress] = useState(25);

  useEffect(() => {
    let interval;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => (prev >= 100 ? 0 : prev + 0.4 * playbackSpeed));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, playbackSpeed]);

  if (!isOpen) return null;

  const currentBook = book || {
    title: 'The Mountain Is You',
    author: 'Brianna Wiest',
    chapter: 'Chapter 2 · There is no such thing as self-sabotage',
  };

  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] border border-[#E5DFD3] rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-32 bg-[#E3DFFA] rounded-full blur-2xl pointer-events-none opacity-80" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#6B665F] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative flex items-center gap-2 mb-4 text-[#3A2AD9]">
          <Headphones className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-widest uppercase">
            Accessible Voice Reader
          </span>
        </div>

        <div className="relative text-center my-6">
          <div className="w-20 h-28 mx-auto rounded-2xl bg-[#193B32] flex items-center justify-center shadow-lg mb-4">
            <Headphones className="w-8 h-8 text-white" />
          </div>

          <h3 className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1">
            {currentBook.title}
          </h3>
          <p className="text-xs text-[#5E5A54] font-medium mb-2">
            {currentBook.author}
          </p>
          <p className="text-xs text-[#3A2AD9] bg-[#E3DFFA] px-3 py-1 rounded-full inline-block font-semibold">
            {currentBook.chapter || currentBook.currentLocation || 'Chapter 1 · Introduction'}
          </p>
        </div>

        <div className="my-5">
          <div className="w-full h-2 bg-[#EAE4D7] rounded-full overflow-hidden cursor-pointer relative">
            <div
              className="h-full bg-[#3A2AD9] rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6B665F] mt-1.5 font-mono">
            <span>01:14:22</span>
            <span>05:35:00</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 my-6">
          <button
            onClick={() => setCurrentProgress((p) => Math.max(0, p - 5))}
            className="p-2.5 rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-[#3A2AD9] hover:bg-[#3021C2] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentProgress((p) => Math.min(100, p + 5))}
            className="p-2.5 rounded-full text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
            title="Fast forward 15 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E5DFD3]">
          <span className="text-xs text-[#6B665F] font-medium">Speed</span>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#DED8CB]">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  playbackSpeed === s
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'text-[#6B665F] hover:text-[#141416]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
