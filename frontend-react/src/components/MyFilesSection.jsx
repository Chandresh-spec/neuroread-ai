import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  Headphones,
  Sparkles,
  Bookmark,
  MoreHorizontal,
  Check,
  ChevronDown,
  Trash2,
  ExternalLink,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { initialUserFiles } from '../data/filesData';

const ITEMS_PER_PAGE = 6;

const SORT_OPTIONS = [
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name (A-Z)' },
  { id: 'size', label: 'File Size' },
  { id: 'progress', label: 'Progress' },
];

const ACCEPTED_EXTENSIONS = new Set(['pdf', 'docx', 'txt', 'epub', 'md']);

function formatAgeLabel(uploadedAt = '') {
  return uploadedAt.replace(/^Uploaded\s+/i, '') || 'Just now';
}

function formatFileSize(bytes = 0) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function MyFilesSection({
  files: controlledFiles,
  onUpdateFiles,
  onOpenFile,
  onOpenAudio,
  onOpenUpload,
}) {
  const [localFiles, setLocalFiles] = useState(initialUserFiles);
  const files = controlledFiles ?? localFiles;
  const setFiles = onUpdateFiles ?? setLocalFiles;

  const [activeFormat, setActiveFormat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  const sortRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
      setActiveMenuId(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSortOpen(false);
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatTabs = useMemo(() => {
    const counts = files.reduce((acc, file) => {
      acc[file.format] = (acc[file.format] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'all', label: 'All', count: files.length },
      { id: 'pdf', label: 'PDF', count: counts.pdf || 0 },
      { id: 'docx', label: 'DOCX', count: counts.docx || 0 },
      { id: 'txt', label: 'TXT', count: counts.txt || 0 },
      { id: 'epub', label: 'EPUB', count: counts.epub || 0 },
    ];
  }, [files]);

  const storageStats = useMemo(() => {
    const baseInitialBytes = initialUserFiles.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
    const currentBytes = files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
    const deltaGb = (currentBytes - baseInitialBytes) / (1024 * 1024 * 1024);
    const totalGb = 5.0;
    const usedGb = Math.min(totalGb, Math.max(0.1, Number((1.2 + deltaGb).toFixed(2))));
    const freeGb = Math.max(0, Number((totalGb - usedGb).toFixed(1)));
    const usedPercent = Math.min(100, Math.round((usedGb / totalGb) * 100));
    return {
      usedLabel: usedGb.toFixed(1),
      freeLabel: freeGb.toFixed(1),
      totalLabel: totalGb.toFixed(0),
      usedPercent,
    };
  }, [files]);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return files
      .filter((file) => {
        const matchesFormat = activeFormat === 'all' || file.format === activeFormat;
        const matchesSearch =
          !query ||
          file.name.toLowerCase().includes(query) ||
          (file.tags || []).some((tag) => tag.toLowerCase().includes(query));
        return matchesFormat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return (b.timestamp || 0) - (a.timestamp || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'size') return (b.sizeBytes || 0) - (a.sizeBytes || 0);
        if (sortBy === 'progress') return (b.progressPercent || 0) - (a.progressPercent || 0);
        return 0;
      });
  }, [files, activeFormat, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedFiles = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFiles, safePage]);

  const startItem = filteredFiles.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, filteredFiles.length);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isBookmarked: !f.isBookmarked } : f))
    );
  };

  const handleResetProgress = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, progressPercent: null } : f))
    );
  };

  const handleDeleteFile = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleListenFile = (file) => {
    setActiveMenuId(null);
    if (onOpenAudio) {
      onOpenAudio({
        ...file,
        title: file.name,
        author: `Uploaded ${(file.format || 'PDF').toUpperCase()}`,
      });
    } else {
      setStatusNotice(`Launching voice playback for "${file.name}".`);
    }
  };

  const handleDropFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    const added = [];
    let rejected = 0;

    for (const rawFile of incoming) {
      const ext = rawFile.name.split('.').pop()?.toLowerCase() || '';
      if (!ACCEPTED_EXTENSIONS.has(ext)) {
        rejected += 1;
        continue;
      }
      const normalizedFormat = ext === 'md' ? 'txt' : ext;
      added.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: rawFile.name,
        format: normalizedFormat,
        size: formatFileSize(rawFile.size),
        sizeBytes: rawFile.size,
        uploadedAt: 'Uploaded just now',
        timestamp: Date.now(),
        tags: [normalizedFormat.toUpperCase(), 'Uploaded'],
        progressPercent: null,
        isBookmarked: false,
      });
    }

    if (added.length > 0) {
      setFiles((prev) => [...added, ...prev]);
      setCurrentPage(1);
      setStatusNotice(
        added.length === 1
          ? `Added "${added[0].name}" to My Files.`
          : `Added ${added.length} files to My Files.`
      );
    } else if (rejected > 0) {
      setStatusNotice('Supported formats: PDF, DOCX, TXT, or EPUB.');
    }
  };

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Recent';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-[#4B3AE8] mb-1.5">
            {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
          </span>
          <h1 className="text-3xl sm:text-[36px] font-extrabold text-[#141416] tracking-tight leading-none">
            My <span className="text-[#4B3AE8]">Files</span>
          </h1>
          <p className="text-xs sm:text-[13.5px] text-[#64606E] mt-2 font-normal">
            Your uploaded books, notes and documents. Read, listen, summarize and more.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center justify-center gap-2 bg-[#141416] hover:bg-[#27272D] text-white font-semibold text-xs sm:text-[13px] px-5 py-2.5 rounded-full transition-colors self-start sm:self-center flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
        >
          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          <span>Upload</span>
        </button>
      </div>

      {/* 2. Storage Usage Bar */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
        <span className="text-xs text-[#64606E] whitespace-nowrap">
          <strong className="font-bold text-[#141416] tabular-nums">
            {storageStats.usedLabel} GB
          </strong>{' '}
          of {storageStats.totalLabel} GB used
        </span>

        <div className="flex-1 h-1.5 bg-[#ECECF2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4B3AE8] rounded-full transition-all duration-300"
            style={{ width: `${storageStats.usedPercent}%` }}
          />
        </div>

        <span className="text-xs text-[#64606E] whitespace-nowrap tabular-nums">
          {storageStats.freeLabel} GB free
        </span>
      </div>

      {/* 3. Format Filter Chips + Search & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Format Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {formatTabs.map((tab) => {
            const isActive = activeFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFormat(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${isActive
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white hover:bg-[#F7F7FA] text-[#141416] border-[#E5E5EA]'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-medium tabular-nums ${isActive ? 'text-white/75' : 'text-[#8A8692]'
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
          <div className="relative flex-1 sm:w-56 md:w-64">
            <Search
              className="w-3.5 h-3.5 text-[#8A8692] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search in my files...."
              aria-label="Search in my files"
              className="w-full bg-white text-xs text-[#141416] placeholder-[#8A8692] rounded-lg pl-8 pr-7 py-2 border border-[#E5E5EA] focus:outline-none focus:border-[#4B3AE8] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#8A8692] hover:text-[#141416]"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isSortOpen}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7FA] text-[#141416] border border-[#E5E5EA] rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
            >
              <span>{activeSortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64606E]" aria-hidden="true" />
            </button>

            {isSortOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E5E5EA] rounded-xl py-1.5 shadow-xl z-30"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sortBy === opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setCurrentPage(1);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${sortBy === opt.id
                      ? 'text-[#4B3AE8] bg-[#F2F0FF] font-semibold'
                      : 'text-[#52525B] hover:text-[#141416] hover:bg-[#F7F7FA]'
                      }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#4B3AE8]" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Status Notice */}
      {statusNotice && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 bg-[#F6F4FF] border border-[#DFD8FA] rounded-xl px-4 py-2.5 text-xs text-[#2D2758]"
        >
          <span>{statusNotice}</span>
          <button
            type="button"
            onClick={() => setStatusNotice('')}
            aria-label="Dismiss notice"
            className="p-1 text-[#5B5482] hover:text-[#141416] rounded"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 4. 4-Column White File Cards Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white border border-[#E5E5EA] rounded-2xl p-10 text-center">
          <FileText className="w-9 h-9 text-[#8A8692] mx-auto mb-2.5" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#141416] mb-1">
            No matching files found
          </h2>
          <p className="text-xs text-[#64606E] max-w-sm mx-auto mb-4">
            Try adjusting your search query or format filter, or upload a new file.
          </p>
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-[#141416] hover:bg-[#27272D] text-white font-semibold text-xs px-5 py-2 rounded-full transition-colors"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Upload New File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {paginatedFiles.map((file) => {
            const hasProgress =
              typeof file.progressPercent === 'number' && file.progressPercent > 0;
            const formatLabel = (file.format || 'FILE').toUpperCase();
            const tags = file.tags || [];
            const visibleTags = tags.slice(0, 2);
            const extraTagCount = Math.max(0, tags.length - 2);

            return (
              <article
                key={file.id}
                onClick={() => onOpenFile(file)}
                className="group min-w-0 bg-white rounded-2xl border border-[#E6E6EB] hover:border-[#CFC7F8] p-3 sm:p-5 flex flex-col justify-between transition-all cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_20px_rgba(75,58,232,0.08)] relative"
              >
                <div>
                  {/* Card Top Row: Lavender Format Pill + Bookmark */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2.5 sm:mb-3.5">
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold tracking-[0.06em] uppercase bg-[#EFEBFD] text-[#4B3AE8]">
                      {formatLabel}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, file.id)}
                      aria-label={file.isBookmarked ? 'Remove bookmark' : 'Bookmark file'}
                      aria-pressed={!!file.isBookmarked}
                      className={`p-1 -m-1 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${
                        file.isBookmarked
                          ? 'text-[#4B3AE8]'
                          : 'text-[#8A8692] hover:text-[#4B3AE8]'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          file.isBookmarked ? 'text-[#4B3AE8] fill-[#4B3AE8]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* File Title */}
                  <h2 className="text-[13px] sm:text-[15px] font-bold text-[#141416] leading-snug group-hover:text-[#4B3AE8] transition-colors line-clamp-2 break-words">
                    {file.name}
                  </h2>

                  {/* Size · Upload Age */}
                  <p className="text-[10.5px] sm:text-[11px] text-[#7A7782] mt-1 sm:mt-1.5 truncate">
                    {file.size} · {formatAgeLabel(file.uploadedAt)}
                  </p>

                  {/* Tags (max 2 + "+N") */}
                  {visibleTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                      {visibleTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10.5px] font-medium bg-white border border-[#E5E5EA] text-[#52525B]"
                        >
                          {tag}
                        </span>
                      ))}
                      {extraTagCount > 0 && (
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10.5px] font-medium bg-[#F7F7FA] border border-[#E5E5EA] text-[#64606E] tabular-nums">
                          +{extraTagCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress + Actions */}
                <div className="mt-3 sm:mt-4">
                  <div>
                    <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] mb-1.5">
                      <span className="text-[#7A7782] truncate">
                        {hasProgress ? 'Progress' : 'Not started yet'}
                      </span>
                      {hasProgress && (
                        <span className="font-bold text-[#4B3AE8] tabular-nums">
                          {file.progressPercent}%
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-[#ECECF2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4B3AE8] rounded-full transition-all duration-300"
                        style={{ width: `${hasProgress ? file.progressPercent : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Footer Actions: Primary CTA + More Options */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFile(file);
                      }}
                      className="flex-1 min-w-0 bg-[#141416] hover:bg-[#27272D] text-white py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-colors text-center leading-tight truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
                    >
                      {hasProgress ? (
                        <>
                          <span className="sm:hidden">Continue</span>
                          <span className="hidden sm:inline">Continue reading</span>
                        </>
                      ) : (
                        'Read now'
                      )}
                    </button>

                    <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId((prev) => (prev === file.id ? null : file.id));
                        }}
                        aria-label={`More options for ${file.name}`}
                        aria-expanded={activeMenuId === file.id}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] flex items-center justify-center text-[#64606E] hover:text-[#141416] transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8]"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                      </button>

                      {activeMenuId === file.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -right-1 sm:right-0 bottom-full mb-1.5 w-40 sm:w-44 bg-white border border-[#E5E5EA] rounded-xl py-1.5 shadow-xl z-20"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenFile(file);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#F7F7FA] flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#64606E]" />
                            <span>Open Reader</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleListenFile(file)}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#F7F7FA] flex items-center gap-2"
                          >
                            <Headphones className="w-3.5 h-3.5 text-[#4B3AE8]" />
                            <span>Listen (TTS)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              setStatusNotice(
                                `AI Summary ready for "${file.name}" — open the reader and select Simplified or Structured mode.`
                              );
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#F7F7FA] flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#4B3AE8]" />
                            <span>AI Summary</span>
                          </button>
                          {hasProgress && (
                            <button
                              type="button"
                              onClick={(e) => handleResetProgress(e, file.id)}
                              className="w-full text-left px-3.5 py-1.5 text-xs text-[#141416] hover:bg-[#F7F7FA] flex items-center gap-2"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#64606E]" />
                              <span>Reset progress</span>
                            </button>
                          )}
                          <div className="h-px bg-[#EEEEF2] my-1" />
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
              </article>
            );
          })}

          {/* In-Grid Drop a File to Upload Tile */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
              handleDropFiles(e.dataTransfer.files);
            }}
            className="col-span-2 lg:col-span-1 flex"
          >
            <button
              type="button"
              onClick={onOpenUpload}
              className={`w-full min-h-[160px] lg:min-h-[220px] rounded-2xl border border-dashed p-5 flex flex-col items-center justify-center text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B3AE8] ${
                dragActive
                  ? 'border-[#4B3AE8] bg-[#F4F2FF]'
                  : 'border-[#DCD8EE] hover:border-[#4B3AE8] bg-white hover:bg-[#FAF9FF]'
              }`}
            >
              <span className="w-10 h-10 rounded-xl bg-[#EFEBFD] text-[#4B3AE8] flex items-center justify-center mb-3">
                <Upload className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#141416]">
                Drop a file to upload
              </span>
              <span className="text-[11px] text-[#7A7782] mt-1">
                PDF, DOCX, TXT or EPUB
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Pagination Footer */}
      {filteredFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#7A7782]">
            Showing {startItem}–{endItem} of {filteredFiles.length}{' '}
            {filteredFiles.length === 1 ? 'file' : 'files'}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-full border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] flex items-center justify-center text-[#64606E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
              const isCurrent = page === safePage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors border ${isCurrent
                    ? 'bg-[#141416] text-white border-[#141416]'
                    : 'bg-white hover:bg-[#F7F7FA] text-[#52525B] border-[#E5E5EA]'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-full border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] flex items-center justify-center text-[#141416] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
