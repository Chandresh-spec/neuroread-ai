import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Headphones,
  Sparkles,
  Bookmark,
  MoreHorizontal,
  Check,
  ChevronDown,
  Trash2,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { initialUserFiles } from '../data/filesData';

const ITEMS_PER_PAGE = 6;

const FORMAT_THEMES = {
  pdf: {
    label: 'PDF',
    stripBg: '#F9E4E5',
    badgeBg: '#DF3B3B',
  },
  docx: {
    label: 'DOCX',
    stripBg: '#E1E9FB',
    badgeBg: '#2F6FED',
  },
  txt: {
    label: 'TXT',
    stripBg: '#E6E2D8',
    badgeBg: '#4A4E54',
  },
  epub: {
    label: 'EPUB',
    stripBg: '#F9ECD7',
    badgeBg: '#D97706',
  },
};

const SORT_OPTIONS = [
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name (A-Z)' },
  { id: 'size', label: 'File Size' },
  { id: 'progress', label: 'Progress' },
];

export default function MyFilesSection({ onOpenFile, onOpenUpload }) {
  const [files, setFiles] = useState(initialUserFiles);
  const [activeFormat, setActiveFormat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const formatTabs = useMemo(() => {
    const counts = files.reduce(
      (acc, file) => {
        acc[file.format] = (acc[file.format] || 0) + 1;
        return acc;
      },
      {}
    );

    return [
      { id: 'all', label: 'All', count: files.length },
      { id: 'pdf', label: 'PDF', count: counts.pdf || 0 },
      { id: 'docx', label: 'DOCX', count: counts.docx || 0 },
      { id: 'txt', label: 'TXT', count: counts.txt || 0 },
      { id: 'epub', label: 'EPUB', count: counts.epub || 0 },
    ];
  }, [files]);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return files
      .filter((file) => {
        const matchesFormat = activeFormat === 'all' || file.format === activeFormat;
        const matchesSearch =
          !query ||
          file.name.toLowerCase().includes(query) ||
          file.tags.some((tag) => tag.toLowerCase().includes(query));
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

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFormat, searchQuery, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFiles, currentPage]);

  const startItem = filteredFiles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredFiles.length);

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

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Recent';

  return (
    <div
      className="space-y-6 sm:space-y-7 animate-in fade-in duration-300"
      onClick={() => {
        if (activeMenuId) setActiveMenuId(null);
        if (isSortOpen) setIsSortOpen(false);
      }}
    >
      {/* 1. Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#3A2AD9] mb-2">
            {files.length} {files.length === 1 ? 'FILE' : 'FILES'} • 1.2 OF 5 GB USED
          </span>
          <h1 className="font-editorial text-4xl sm:text-[44px] font-bold text-[#141416] tracking-tight leading-none">
            My <span className="italic text-[#3A2AD9] font-semibold">Files</span>
          </h1>
          <p className="text-xs sm:text-[13.5px] text-[#6B665F] mt-2.5 font-normal">
            Your uploaded books, notes and documents. Read, listen, summarize and more.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center justify-center gap-2 bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-semibold text-xs sm:text-[13px] px-5 py-2.5 rounded-full transition-all shadow-xs active:scale-95 self-start sm:self-end flex-shrink-0"
        >
          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload</span>
        </button>
      </div>

      {/* 2. Format Filter Pills + Search & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pt-1">
        {/* Left: Format Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {formatTabs.map((tab) => {
            const isActive = activeFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormat(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#141416] text-white border-[#141416]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#141416] border-[#E5DFD3]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? 'text-white/75' : 'text-[#8C867E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search & Sort */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 sm:w-56 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in my files..."
              className="w-full bg-white text-xs text-[#141416] placeholder-[#8C867E] rounded-full px-4 py-2 border border-[#E5DFD3] focus:outline-none focus:border-[#3A2AD9] transition-colors"
            />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#141416] border border-[#E5DFD3] rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap"
            >
              <span>{activeSortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B665F]" />
            </button>

            {isSortOpen && (
              <div
                className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E5DFD3] rounded-2xl py-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsSortOpen(false)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
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
        </div>
      </div>

      {/* 3. Files 3-Column Card Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white border border-[#E5DFD3] rounded-[20px] p-10 text-center shadow-2xs">
          <FileText className="w-10 h-10 text-[#8C867E] mx-auto mb-2.5" />
          <h3 className="font-editorial text-lg font-bold text-[#141416] mb-1">
            No matching files found
          </h3>
          <p className="text-xs text-[#6B665F] max-w-sm mx-auto mb-4">
            Try adjusting your search query or format filter, or upload a new file.
          </p>
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-[#3A2AD9] hover:bg-[#3021C2] text-white font-semibold text-xs px-5 py-2 rounded-full transition-all shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {paginatedFiles.map((file) => {
            const hasProgress = typeof file.progressPercent === 'number';
            const theme = FORMAT_THEMES[file.format] || {
              label: (file.format || 'FILE').toUpperCase(),
              stripBg: '#EAE6DD',
              badgeBg: '#4A4E54',
            };

            return (
              <div
                key={file.id}
                onClick={() => onOpenFile(file)}
                className="bg-white rounded-[20px] border border-[#EAE4D8] hover:border-[#D5CEC0] flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-[0_1px_2px_rgba(20,20,22,0.03)] hover:shadow-md relative"
              >
                {/* Top Tinted Format Strip */}
                <div
                  className="px-5 py-3.5 rounded-t-[19px] flex items-center justify-between"
                  style={{ backgroundColor: theme.stripBg }}
                >
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-white"
                    style={{ backgroundColor: theme.badgeBg }}
                  >
                    {theme.label}
                  </span>
                  <span className="text-[11px] font-medium text-[#6B665F]">{file.size}</span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-[17px] sm:text-[18px] font-semibold text-[#141416] leading-snug group-hover:text-[#3A2AD9] transition-colors mb-3.5">
                      {file.name}
                    </h3>

                    <p className="text-[11px] text-[#7D7870] mb-2">{file.uploadedAt}</p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                      {file.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#EFEBE2] text-[#5E5A54]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {hasProgress ? (
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-[#7D7870]">Progress</span>
                          <span className="font-bold text-[#3A2AD9]">{file.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#ECE7DD] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3A2AD9] rounded-full transition-all duration-300"
                            style={{ width: `${file.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#7D7870]">Not started yet</p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center gap-2 mt-5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFile(file);
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold transition-all active:scale-[0.98] text-center ${
                        hasProgress
                          ? 'bg-[#141416] hover:bg-[#27272C] text-white'
                          : 'bg-[#3A2AD9] hover:bg-[#3021C2] text-white'
                      }`}
                    >
                      {hasProgress ? 'Continue reading' : 'Read now'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, file.id)}
                      aria-label="Bookmark file"
                      className="w-9 h-9 rounded-full border border-[#E5DFD3] bg-white hover:bg-[#FAF8F5] flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          file.isBookmarked
                            ? 'text-[#281F88] fill-[#281F88]'
                            : 'text-[#6B665F]'
                        }`}
                      />
                    </button>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === file.id ? null : file.id)
                        }
                        aria-label="More options"
                        className="w-9 h-9 rounded-full border border-[#E5DFD3] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#7D7870] hover:text-[#141416] transition-colors flex-shrink-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === file.id && (
                        <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white border border-[#E5DFD3] rounded-2xl py-1.5 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenFile(file);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#6B665F]" />
                            <span>Open Reader</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Launching text-to-speech for "${file.name}"`);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <Headphones className="w-3.5 h-3.5 text-[#3A2AD9]" />
                            <span>Listen (TTS)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Generating AI Summary for "${file.name}"`);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#FAF8F5] flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#3A2AD9]" />
                            <span>AI Summary</span>
                          </button>
                          <div className="h-px bg-[#EEE9DF] my-1" />
                          <button
                            type="button"
                            onClick={(e) => handleDeleteFile(e, file.id)}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
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
      )}

      {/* 4. Pagination Footer */}
      {filteredFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#7D7870]">
            Showing {startItem}–{endItem} of {filteredFiles.length}{' '}
            {filteredFiles.length === 1 ? 'file' : 'files'}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-full border border-[#E5DFD3] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#6B665F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors border ${
                    isCurrent
                      ? 'bg-[#141416] text-white border-[#141416]'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#5E5A54] border-[#E5DFD3]'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-full border border-[#E5DFD3] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#141416] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
