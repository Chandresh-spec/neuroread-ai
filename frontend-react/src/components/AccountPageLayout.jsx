import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Shared centered layout for all account pages.
 * Single centered column (max-w-[720px]) across every viewport width,
 * with Back link, serif heading, and sections aligned to the same left edge.
 */
export default function AccountPageLayout({
  activePage,
  onBack,
  title,
  subtitle,
  headerRight,
  children,
}) {
  const headingRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => headingRef.current?.focus());
  }, [activePage]);

  return (
    <div className="w-full max-w-[720px] mx-auto min-w-0">
      {/* Aligned Page Header */}
      <div className="mb-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="inline-flex items-center gap-2 min-w-[44px] min-h-[44px] pr-3 pl-0 text-sm text-[#141416] hover:text-[#3B2FD6] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
          >
            <ArrowLeft className="w-4 h-4 pointer-events-none" strokeWidth={1.75} aria-hidden="true" />
            <span>Back</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-1">
          <div className="min-w-0">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight focus:outline-none"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#524E48] mt-1">{subtitle}</p>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}
