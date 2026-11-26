import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#141417] text-neutral-400 mt-10 pt-12 pb-28 md:pb-10 border-t border-[#222227]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#3A2AD9] flex items-center justify-center font-black text-white text-sm select-none">
                NR
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                NeuroRead
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-400 max-w-xs leading-relaxed">
              Good books. Fewer barriers.<br />
              A world of stories, open to every mind.
            </p>
          </div>

          {/* 3 Link Columns */}
          <div className="md:col-span-7 grid grid-cols-2 xs:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Explore
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Discover books
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Your library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    My files
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Built for you
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preferences
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shortcuts
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 xs:col-span-1">
              <h4 className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Need a hand?
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Share feedback
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Language Row */}
        <div className="pt-6 border-t border-[#222228] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© 2026 NeuroRead. All minds welcome.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Privacy policy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Terms of use
            </a>
            <span>·</span>
            <div className="inline-flex items-center gap-1 hover:text-neutral-300 cursor-pointer transition-colors">
              <Globe className="w-3 h-3" />
              <span>English (US)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
