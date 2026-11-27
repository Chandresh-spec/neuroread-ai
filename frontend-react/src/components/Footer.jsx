import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, Check, X } from 'lucide-react';

const LANGUAGES = ['English (IN)', 'English (US)', 'English (UK)', 'Español', 'Français'];

export default function Footer({ onNavigate, onOpenPreferences, onUploadPdf }) {
  const [language, setLanguage] = useState('English (IN)');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAction = (action) => {
    if (action?.modal === 'upload' && onUploadPdf) {
      onUploadPdf();
      return;
    }
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
      setNotice(action.notice);
    }
  };

  const sections = [
    {
      id: 'explore',
      title: 'Explore',
      links: [
        { label: 'Discover books', nav: 'library' },
        { label: 'Free books', nav: 'library' },
        { label: 'My library', nav: 'saved-books' },
        { label: 'Upload a PDF', modal: 'upload', nav: 'my-files' },
      ],
    },
    {
      id: 'made-for-you',
      title: 'Made for you',
      links: [
        { label: 'Reading preferences', modal: 'preferences' },
        { label: 'Accessibility', nav: 'accessibility' },
        { label: 'Premium storage', nav: 'my-files' },
      ],
    },
    {
      id: 'here-to-help',
      title: 'Here to help',
      links: [
        { label: 'Help centre', nav: 'help' },
        {
          label: 'Contact us',
          notice: 'Reach our accessibility support team anytime at support@neuroread.app.',
        },
        {
          label: 'Share feedback',
          notice: 'Thanks for reading with NeuroRead! Send suggestions to feedback@neuroread.app.',
        },
      ],
    },
  ];

  const linkClass =
    'text-[13px] text-[#5A5864] hover:text-[#141416] hover:underline font-normal transition-colors text-left py-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]';

  return (
    <footer className="w-full bg-[#F7F6F3] border-t border-[#E6E3DC] text-[#141416] mt-10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-11 sm:pt-14 pb-24 md:pb-8">
        {/* Top Brand + Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Brand Block */}
          <div className="md:col-span-5 lg:col-span-5">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#3B2FD6] text-white flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-[#141416]">
                NeuroRead
              </span>
            </div>

            <p className="text-[13px] text-[#5A5864] max-w-[260px] leading-relaxed">
              Good books. Fewer barriers.
              <br />A little more reading, your way.
            </p>

            <p className="text-xs font-medium text-[#3B2FD6] mt-4">
              Built for different minds.
            </p>
          </div>

          {/* Right Link Columns (2-col on Mobile, 3-col on Tablet/Desktop) */}
          <nav
            aria-label="Footer"
            className="md:col-span-7 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7"
          >
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-xs font-bold text-[#141416] mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => handleAction(link)}
                        className={linkClass}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Non-blocking Info Notice */}
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex items-center justify-between gap-3 bg-white border border-[#E2DFD7] rounded-xl px-4 py-2.5 text-xs text-[#3D3B46]"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Dismiss notice"
              className="p-1 text-[#6B6874] hover:text-[#141416] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Bottom Legal & Language Row */}
        <div className="mt-9 pt-5 border-t border-[#E6E3DC] flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 text-xs text-[#6B6874]">
          <p>© 2026 NeuroRead. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-between sm:justify-start md:justify-end gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() =>
                setNotice(
                  'NeuroRead Privacy: Your reading notes and uploaded PDFs stay private to your workspace.'
                )
              }
              className="text-xs text-[#5A5864] hover:text-[#141416] hover:underline transition-colors py-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              Privacy policy
            </button>

            <button
              type="button"
              onClick={() =>
                setNotice(
                  'NeuroRead Terms: Built for personal, accessible, and educational reading.'
                )
              }
              className="text-xs text-[#5A5864] hover:text-[#141416] hover:underline transition-colors py-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
            >
              Terms of use
            </button>

            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isLangOpen}
                aria-label={`Language selector, current language ${language}`}
                className="inline-flex items-center gap-1 text-xs text-[#5A5864] hover:text-[#141416] py-1 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
              >
                <span>{language}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isLangOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isLangOpen && (
                <div
                  role="menu"
                  aria-label="Select language"
                  className="absolute right-0 bottom-full mb-2 w-36 bg-white border border-[#E2DFD7] rounded-xl py-1 shadow-lg z-30"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        language === lang
                          ? 'text-[#3B2FD6] bg-[#F2F0FF] font-semibold'
                          : 'text-[#4A4752] hover:text-[#141416] hover:bg-[#F7F6F3]'
                      }`}
                    >
                      <span>{lang}</span>
                      {language === lang && (
                        <Check className="w-3 h-3 text-[#3B2FD6]" aria-hidden="true" />
                      )}
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
