import React, { useState, useMemo } from 'react';
import {
  FileText,
  Database,
  Crown,
  UploadCloud,
  Upload,
  BookOpen,
  Headphones,
  Sparkles,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Play,
  Bookmark,
  MoreHorizontal,
  Check,
  ChevronDown,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { initialUserFiles, fileFormats } from '../data/filesData';

export default function MyFilesSection({ onOpenFile, onOpenUpload }) {
  const [files, setFiles] = useState(initialUserFiles);
  const [activeFormat, setActiveFormat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        const matchesFormat = activeFormat === 'all' || file.format === activeFormat;
        const matchesSearch =
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFormat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return b.timestamp - a.timestamp;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
        if (sortBy === 'progress') return (b.progressPercent || 0) - (a.progressPercent || 0);
        return 0;
      });
  }, [files, activeFormat, searchQuery, sortBy]);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isBookmarked: !f.isBookmarked } : f))
    );
  };

  const handleDeleteFile = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const renderFileThumbnail = (format) => {
    const formatStyles = {
      pdf: { label: 'PDF', bg: '#DC2626', text: '#ffffff' },
      docx: { label: 'DOCX', bg: '#2563EB', text: '#ffffff' },
      txt: { label: 'TXT', bg: '#475569', text: '#ffffff' },
      epub: { label: 'EPUB', bg: '#D97706', text: '#ffffff' },
    }[format] || { label: 'FILE', bg: '#4B5563', text: '#ffffff' };

    return (
      <div className="relative w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0 select-none">
        <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-xs">
          <path
            d="M8 2 C8 2, 42 2, 42 2 L54 14 L54 64 C54 66.2 52.2 68 50 68 L10 68 C7.8 68 6 66.2 6 64 L6 6 C6 3.8 7.8 2 10 2 Z"
            fill="#FAF8F5"
            stroke="#DFD8CA"
            strokeWidth="1.4"
          />
          <path d="M42 2 L42 14 L54 14 Z" fill="#D5CEC0" />
          <line x1="14" y1="20" x2="36" y2="20" stroke="#D5CEC0" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="26" x2="44" y2="26" stroke="#D5CEC0" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="52" x2="44" y2="52" stroke="#E5DFD3" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="14" y1="58" x2="34" y2="58" stroke="#E5DFD3" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="11" y="32" width="38" height="15" rx="4" fill={formatStyles.bg} />
          <text
            x="30"
            y="43"
            textAnchor="middle"
            fill={formatStyles.text}
            fontSize="8.5"
            fontWeight="900"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            letterSpacing="0.06em"
          >
            {formatStyles.label}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E3DFFA] border border-[#3A2AD9]/20 flex items-center justify-center text-[#3A2AD9] flex-shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight leading-tight">
              My Files
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5A54] mt-0.5 font-normal">
              Your uploaded books, notes, and documents — read, listen, summarize, and more.
            </p>
          </div>
        </div>

        {/* Storage Meter Widget & Upgrade Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="bg-white border border-[#E5DFD3] rounded-2xl px-4 py-2.5 flex items-center gap-3.5 shadow-2xs min-w-[270px] flex-1 sm:flex-initial">
            <div className="w-8 h-8 rounded-xl bg-[#EBE8FD] flex items-center justify-center text-[#3A2AD9] flex-shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 text-[11px] mb-1">
                <span className="font-bold text-[#141416] whitespace-nowrap">Storage Usage</span>
                <span className="text-[#6B665F] font-mono whitespace-nowrap">1.2 GB of 5 GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#EAE4D7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3A2AD9] rounded-full transition-all duration-500"
                    style={{ width: '24%' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#5E5A54] font-mono">24%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Upgrade to NeuroRead Pro for 50 GB storage and unlimited AI speech.')}
            className="border border-[#D8D1C5] hover:border-[#3A2AD9] bg-white hover:bg-[#EBE8FD]/40 text-[#3A2AD9] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-95 whitespace-nowrap self-stretch sm:self-auto"
          >
            <Crown className="w-4 h-4 text-[#3A2AD9]" />
            <span>Upgrade</span>
          </button>
        </div>
      </div>

      {/* 2. Upload Hero Banner */}
      <div className="relative bg-white border border-[#E5DFD3] rounded-2xl sm:rounded-3xl p-5 sm:p-7 overflow-hidden shadow-2xs">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Dropzone Box */}
          <div className="lg:col-span-7">
            <div
              onClick={onOpenUpload}
              className="border-2 border-dashed border-[#3A2AD9]/30 hover:border-[#3A2AD9] bg-[#FAF8F5] hover:bg-[#EBE8FD]/25 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E3DFFA] flex items-center justify-center text-[#3A2AD9] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
                <UploadCloud className="w-6 h-6 stroke-[2.2]" />
              </div>

              <p className="text-sm sm:text-base font-bold text-[#141416] mb-1">
                Drag &amp; drop your files here, or{' '}
                <span className="text-[#3A2AD9] underline decoration-[#3A2AD9]/40 hover:decoration-[#3A2AD9]">
                  browse
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-[#6B665F] mb-4 font-normal">
                Upload PDF, TXT, DOCX, or EPUB (max 100 MB per file)
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 bg-[#141416] hover:bg-[#2a2a2f] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
              >
                <Upload className="w-4 h-4 stroke-[2.2]" />
                <span>Upload Files</span>
              </button>
            </div>
          </div>

          {/* Right: Feature Highlights + Floating PDF Graphic */}
          <div className="lg:col-span-5 flex items-center justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-lg bg-[#E3DFFA] flex items-center justify-center text-[#3A2AD9] flex-shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors">
                    Read with full control
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-[#6B665F]">
                    Adjust font, spacing, and colors
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-lg bg-[#FAD8C4] flex items-center justify-center text-[#8B3D1A] flex-shrink-0 mt-0.5">
                  <Headphones className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors">
                    Listen to your files
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-[#6B665F]">
                    Convert text to natural speech
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-lg bg-[#EAE4D7] flex items-center justify-center text-[#141416] flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors">
                    Summarize &amp; explain
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-[#6B665F]">
                    Get key points and clear explanations
                  </p>
                </div>
              </div>
            </div>

            {/* Pastel Illustrated PDF Stack */}
            <div className="hidden sm:flex flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28 items-center justify-center relative select-none">
              <div className="absolute inset-1 bg-[#E3DFFA] rounded-full blur-lg opacity-80" />
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <polygon points="25,18 70,12 80,72 35,78" fill="#DED9FA" />
                <polygon points="20,24 66,18 76,80 30,86" fill="#FAD8C4" />
                <polygon points="16,30 62,24 70,88 24,94" fill="#FFFFFF" stroke="#E5DFD3" strokeWidth="1.2" />
                <line x1="26" y1="42" x2="52" y2="38" stroke="#9E988E" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="26" y1="50" x2="56" y2="46" stroke="#D6CFC2" strokeWidth="2" strokeLinecap="round" />
                <line x1="26" y1="58" x2="48" y2="54" stroke="#D6CFC2" strokeWidth="2" strokeLinecap="round" />
                <polygon points="22,66 58,61 60,78 24,83" fill="#3A2AD9" />
                <text
                  x="41"
                  y="76"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9.5"
                  fontWeight="900"
                  fontFamily="sans-serif"
                  letterSpacing="0.08em"
                  transform="rotate(-8 41 76)"
                >
                  PDF
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 pt-1">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {fileFormats.map((fmt) => {
            const isActive = activeFormat === fmt.id;

            return (
              <button
                key={fmt.id}
                onClick={() => setActiveFormat(fmt.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#141416] text-white border-[#141416] shadow-2xs'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#5E5A54] border-[#DED8CB]'
                }`}
              >
                {fmt.id !== 'all' && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fmt.color }} />
                )}
                <span>{fmt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#F0ECE3] text-[#6B665F]'
                  }`}
                >
                  {fmt.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#7B756D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in my files..."
              className="w-full bg-white text-xs text-[#141416] placeholder-[#8C867E] rounded-full pl-9 pr-3 py-2 border border-[#DED8CB] focus:outline-none focus:border-[#3A2AD9] transition-colors"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="flex items-center gap-1.5 bg-white hover:bg-[#FAF8F5] text-[#5E5A54] border border-[#DED8CB] rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3A2AD9]" />
              <span className="hidden xs:inline">Sort:</span>
              <span className="font-bold text-[#141416] capitalize">{sortBy}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isSortOpen && (
              <div
                className="absolute right-0 mt-1 w-40 bg-white border border-[#E5DFD3] rounded-2xl py-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsSortOpen(false)}
              >
                {[
                  { id: 'recent', label: 'Recent' },
                  { id: 'name', label: 'Name (A-Z)' },
                  { id: 'size', label: 'File Size' },
                  { id: 'progress', label: 'Reading Progress' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id)}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                      sortBy === opt.id
                        ? 'text-[#3A2AD9] bg-[#EBE8FD]/50 font-bold'
                        : 'text-[#5E5A54] hover:text-[#141416] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#3A2AD9]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-white border border-[#DED8CB] rounded-full p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#141416] text-white shadow-2xs'
                  : 'text-[#6B665F] hover:text-[#141416]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'list'
                  ? 'bg-[#141416] text-white shadow-2xs'
                  : 'text-[#6B665F] hover:text-[#141416]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Files Grid / List */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-10 text-center shadow-2xs">
          <FileText className="w-10 h-10 text-[#8C867E] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#141416] mb-1">No matching files found</h3>
          <p className="text-xs text-[#6B665F] max-w-sm mx-auto mb-4">
            Try adjusting your search query or format filter, or upload a new file.
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs px-5 py-2 rounded-full transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New File</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
          {filteredFiles.map((file) => {
            const hasProgress = typeof file.progressPercent === 'number';

            return (
              <div
                key={file.id}
                onClick={() => onOpenFile(file)}
                className={`bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-md relative ${
                  file.isHighlighted
                    ? 'border-2 border-[#3A2AD9]/60 shadow-[0_6px_24px_rgba(58,42,217,0.08)]'
                    : 'border border-[#E5DFD3] hover:border-[#CFC7B8]'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    {renderFileThumbnail(file.format)}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#141416] tracking-tight leading-snug group-hover:text-[#3A2AD9] transition-colors truncate">
                        {file.name}
                      </h3>
                      <p className="text-[11px] text-[#6B665F] mt-0.5 truncate font-normal">
                        {file.size} • {file.uploadedAt}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {file.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3EFE6] text-[#5E5A54] border border-[#E5DFD3]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {hasProgress && (
                    <div className="mt-3 mb-1">
                      <div className="flex items-center justify-between text-[10.5px] text-[#6B665F] mb-1">
                        <div className="w-full h-1 bg-[#EAE4D7] rounded-full overflow-hidden mr-2">
                          <div
                            className="h-full bg-[#3A2AD9] rounded-full"
                            style={{ width: `${file.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#141416] font-mono flex-shrink-0">
                          {file.progressPercent}% read
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-[#EEE9DF]">
                  {hasProgress ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFile(file);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#141416] hover:bg-[#2a2a2f] text-white font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span>Continue Reading</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFile(file);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span>Read Now</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-[#6B665F]">
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, file.id)}
                      aria-label="Bookmark file"
                      className={`p-1.5 rounded-lg hover:bg-[#F3EFE6] transition-colors ${
                        file.isBookmarked ? 'text-[#3A2AD9]' : 'hover:text-[#141416]'
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${file.isBookmarked ? 'fill-[#3A2AD9]' : ''}`}
                      />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === file.id ? null : file.id);
                        }}
                        aria-label="More options"
                        className="p-1.5 rounded-lg hover:text-[#141416] hover:bg-[#F3EFE6] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === file.id && (
                        <div
                          className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-[#E5DFD3] rounded-xl py-1 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenFile(file);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#6B665F]" />
                            <span>Open Reader</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Launching text-to-speech for "${file.name}"`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <Headphones className="w-3.5 h-3.5 text-[#3A2AD9]" />
                            <span>Listen (TTS)</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Generating AI Summary for "${file.name}"`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#3A2AD9]" />
                            <span>AI Summary</span>
                          </button>
                          <div className="h-px bg-[#EEE9DF] my-1" />
                          <button
                            onClick={(e) => handleDeleteFile(e, file.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove File</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E5DFD3] rounded-2xl overflow-hidden divide-y divide-[#EEE9DF] shadow-2xs">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => onOpenFile(file)}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {renderFileThumbnail(file.format)}
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#141416] group-hover:text-[#3A2AD9] transition-colors truncate">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#6B665F] mt-0.5">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploadedAt}</span>
                    {file.progressPercent && (
                      <>
                        <span>•</span>
                        <span className="text-[#3A2AD9] font-bold font-mono">
                          {file.progressPercent}% read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFile(file);
                  }}
                  className="bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-bold text-xs px-4 py-1.5 rounded-full transition-all"
                >
                  Read
                </button>
                <button
                  type="button"
                  onClick={(e) => toggleBookmark(e, file.id)}
                  className={`p-1.5 rounded-lg hover:bg-[#F3EFE6] transition-colors ${
                    file.isBookmarked ? 'text-[#3A2AD9]' : 'text-[#6B665F] hover:text-[#141416]'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${file.isBookmarked ? 'fill-[#3A2AD9]' : ''}`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
