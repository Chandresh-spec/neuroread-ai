import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = ['English (IN)', 'English (US)', 'English (UK)', 'Español', 'Français'];

export default function Footer({ onNavigate, onOpenPreferences }) {
  const [language, setLanguage] = useState('English (IN)');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleAction = (action) => {
    if (action?.nav && onNavigate) {
      onNavigate(action.nav);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (action?.modal === 'preferences' && onOpenPreferences) {
      onOpenPreferences();
      return;
    }
    if (action?.notice) {
      alert(action.notice);
    }
  };

  const columns = [
    {
      title: 'Explore',
      links: [
        { label: 'Discover books', nav: 'library' },
        { label: 'Free books', nav: 'library' },
        { label: 'My library', nav: 'saved-books' },
        { label: 'Upload a PDF', nav: 'my-files' },
      ],
    },
    {
      title: 'Made for you',
      links: [
        { label: 'Reading preferences', modal: 'preferences' },
        { label: 'Accessibility', nav: 'accessibility' },
        {
          label: 'Premium storage',
          notice: 'Upgrade to NeuroReader Premium for up to 50 GB PDF storage across all devices.',
        },
      ],
    },
    {
      title: 'Here to help',
      links: [
        { label: 'Help centre', nav: 'help' },
        { label: 'Contact us', notice: 'Reach our accessibility team at support@neuroread.app.' },
        { label: 'Share feedback', notice: 'Send suggestions anytime to feedback@neuroread.app.' },
      ],
    },
  ];

  return (
    <footer
      className="w-full bg-[#FAF9FC] border-t border-[#ECE8F4] mt-10 pb-20 md:pb-8"
      onClick={() => isLangOpen && setIsLangOpen(false)}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-6">
        {/* Top Row: Brand + 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#4B3AE8] flex items-center justify-center font-black text-white text-xs select-none">
                NR
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#141416]">
                NeuroReader
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-[#686472] leading-relaxed max-w-xs">
              Good books. Fewer barriers.
              <br />A little more reading, your way.
            </p>

            <p className="text-xs font-semibold text-[#4B3AE8] mt-3">
              Built for different minds.
            </p>
          </div>

          {/* Link Columns (2-col on mobile, 3-col on tablet/desktop) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-[#141416] mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => handleAction(link)}
                        className="text-xs text-[#686472] hover:text-[#4B3AE8] transition-colors text-left font-medium"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Language Bar */}
        <div className="pt-5 border-t border-[#EAE6F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#7B7685]">
          <p>© 2026 NeuroReader. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() =>
                handleAction({
                  notice:
                    'NeuroReader Privacy: Your uploaded PDFs, notes, and reading preferences stay private.',
                })
              }
              className="hover:text-[#4B3AE8] transition-colors"
            >
              Privacy policy
            </button>
            <button
              type="button"
              onClick={() =>
                handleAction({
                  notice:
                    'NeuroReader Terms: Designed for inclusive personal and educational reading.',
                })
              }
              className="hover:text-[#4B3AE8] transition-colors"
            >
              Terms of use
            </button>

            {/* Language Selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsLangOpen((p) => !p)}
                className="inline-flex items-center gap-1.5 text-[#5E5A68] hover:text-[#141416] font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isLangOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-2 w-40 bg-white border border-[#E6E2EE] rounded-xl py-1.5 shadow-xl z-30">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        language === lang
                          ? 'text-[#4B3AE8] bg-[#F3F0FC] font-semibold'
                          : 'text-[#5E5A68] hover:bg-[#FAF9FC]'
                      }`}
                    >
                      <span>{lang}</span>
                      {language === lang && <Check className="w-3 h-3 text-[#4B3AE8]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
