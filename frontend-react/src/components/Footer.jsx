import React, { useState } from 'react';
import { BookOpen, Layers, Headphones, Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

const LANGUAGES = ['English (US)', 'English (UK)', 'Español', 'Français'];

export default function Footer({ onNavigate, onOpenPreferences }) {
  const [openSection, setOpenSection] = useState(null);
  const [language, setLanguage] = useState('English (US)');
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

  const sections = [
    {
      id: 'explore',
      title: 'Explore',
      icon: BookOpen,
      links: [
        { label: 'Discover books', nav: 'library' },
        { label: 'Your library', nav: 'saved-books' },
        { label: 'My files', nav: 'my-files' },
      ],
    },
    {
      id: 'built-for-you',
      title: 'Built for you',
      icon: Layers,
      links: [
        { label: 'Accessibility', nav: 'accessibility' },
        { label: 'Preferences', modal: 'preferences' },
        { label: 'Shortcuts', notice: 'Keyboard shortcuts: Press Ctrl+K to search books anytime.' },
      ],
    },
    {
      id: 'need-a-hand',
      title: 'Need a hand?',
      icon: Headphones,
      links: [
        { label: 'Help center', nav: 'help' },
        { label: 'Share feedback', notice: 'Thanks for reading with NeuroRead! Send feedback to feedback@neuroread.app.' },
        { label: 'Contact us', notice: 'Reach our accessibility support team at support@neuroread.app.' },
      ],
    },
  ];

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <footer
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 mt-6 pb-24 md:pb-8"
      onClick={() => isLangOpen && setIsLangOpen(false)}
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF8FF] via-[#F4F0FE] to-[#ECE6FC] border border-[#DDD6F8] rounded-[24px] sm:rounded-[28px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 shadow-[0_12px_36px_rgba(58,42,217,0.06)]">
        {/* Bottom Lavender Waves Decoration */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 130"
          preserveAspectRatio="none"
          className="pointer-events-none select-none absolute bottom-0 left-0 right-0 w-full h-24 sm:h-28"
        >
          <path
            d="M0,78 C160,118 320,38 520,76 C650,100 740,56 800,32 L800,130 L0,130 Z"
            fill="#E3DBFA"
            opacity="0.7"
          />
          <path
            d="M0,102 C190,62 360,115 560,82 C680,62 745,78 800,66 L800,130 L0,130 Z"
            fill="#DCD2F9"
            opacity="0.8"
          />
        </svg>

        {/* Bottom-Right Botanical Open Book Illustration */}
        <svg
          aria-hidden="true"
          viewBox="0 0 180 140"
          className="pointer-events-none select-none absolute -bottom-1 right-1 sm:right-4 w-32 h-24 sm:w-40 sm:h-32 z-0"
        >
          {/* Leaves behind right side of book */}
          <path d="M138,108 C142,80 148,54 156,28" stroke="#6856E8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="157" cy="24" rx="5.5" ry="9.5" transform="rotate(15 157 24)" fill="#6C5CE7" />
          <ellipse cx="141" cy="48" rx="5" ry="9" transform="rotate(-32 141 48)" fill="#8B7DF2" />
          <ellipse cx="155" cy="54" rx="5.5" ry="9.5" transform="rotate(34 155 54)" fill="#6C5CE7" />
          <ellipse cx="137" cy="70" rx="5" ry="8.5" transform="rotate(-38 137 70)" fill="#9E92F6" />
          <ellipse cx="152" cy="77" rx="5" ry="9" transform="rotate(38 152 77)" fill="#7A6BEF" />

          {/* Small left botanical stem */}
          <path d="M56,112 C48,96 40,86 32,76" stroke="#7A6BEF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <ellipse cx="29" cy="73" rx="4.2" ry="7.5" transform="rotate(-32 29 73)" fill="#8B7DF2" />
          <ellipse cx="32" cy="91" rx="4" ry="7" transform="rotate(-65 32 91)" fill="#A498F8" />
          <ellipse cx="44" cy="84" rx="3.8" ry="6.8" transform="rotate(14 44 84)" fill="#7A6BEF" />

          {/* Soft shadow under book */}
          <ellipse cx="95" cy="122" rx="46" ry="7" fill="#C9BEF4" opacity="0.7" />

          {/* Book Cover */}
          <path
            d="M46,105 L92,120 L142,102 L140,95 L92,113 L48,98 Z"
            fill="#4334DE"
          />
          {/* Left Page */}
          <path
            d="M48,98 L61,60 C72,62 84,68 92,77 L92,113 C82,105 66,100 48,98 Z"
            fill="#FBF9FF"
            stroke="#DFD7F8"
            strokeWidth="1.2"
          />
          {/* Right Page */}
          <path
            d="M140,95 L127,57 C115,59 102,66 92,77 L92,113 C104,104 122,98 140,95 Z"
            fill="#FFFFFF"
            stroke="#DFD7F8"
            strokeWidth="1.2"
          />
          {/* Spine shadow */}
          <line x1="92" y1="77" x2="92" y2="113" stroke="#CEC4F2" strokeWidth="1.4" />
          {/* Left page text lines */}
          <line x1="63" y1="71" x2="84" y2="78" stroke="#D5CCF4" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="61" y1="78" x2="84" y2="85" stroke="#DFD8F7" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="59" y1="85" x2="84" y2="92" stroke="#DFD8F7" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="57" y1="92" x2="77" y2="98" stroke="#E7E1FA" strokeWidth="2.2" strokeLinecap="round" />
          {/* Right page text lines */}
          <line x1="100" y1="78" x2="122" y2="70" stroke="#D5CCF4" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="100" y1="85" x2="124" y2="77" stroke="#DFD8F7" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="100" y1="92" x2="126" y2="84" stroke="#DFD8F7" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="100" y1="99" x2="118" y2="92" stroke="#E7E1FA" strokeWidth="2.2" strokeLinecap="round" />
        </svg>

        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Mobile Layout (< md) */}
          <div className="md:hidden">
            <div className="mb-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5242F5] to-[#3A2AD9] flex items-center justify-center font-black text-white text-sm shadow-[0_4px_14px_rgba(58,42,217,0.3)] select-none">
                    NR
                  </div>
                  <span className="font-extrabold text-[19px] tracking-tight text-[#141416]">
                    NeuroRead
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3A2AD9] bg-[#E5DFFA] border border-[#D4CAFA] rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#3A2AD9]" />
                  <span>Inclusive</span>
                </span>
              </div>

              <p className="text-[13.5px] text-[#524E63] mt-3 leading-relaxed">
                Good books. Fewer barriers.
              </p>
            </div>

            <div className="divide-y divide-[#DFD8F3]">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpen = openSection === section.id;

                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={isOpen}
                      className="w-full py-3.5 flex items-center justify-between gap-3 text-left focus:outline-none group"
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
                            isOpen
                              ? 'bg-[#3A2AD9] border-[#3A2AD9] text-white shadow-xs'
                              : 'bg-[#EAE4FC] border-[#DDD5FA] text-[#3A2AD9] group-hover:bg-[#E1D9FA]'
                          }`}
                        >
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </span>
                        <span className="text-[15px] font-bold text-[#141416] tracking-tight">
                          {section.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#141416] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#3A2AD9]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="pl-[50px] pb-3.5 space-y-2 text-[13px] text-[#524E63] animate-in fade-in duration-150">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <button
                              type="button"
                              onClick={() => handleAction(link)}
                              className="hover:text-[#3A2AD9] font-medium transition-colors text-left"
                            >
                              {link.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop & Tablet Layout (md+) */}
          <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12 mb-9">
            {/* Brand & Mission Statement */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5242F5] to-[#3A2AD9] flex items-center justify-center font-black text-white text-sm shadow-[0_4px_14px_rgba(58,42,217,0.3)] select-none">
                    NR
                  </div>
                  <span className="font-extrabold text-[19px] tracking-tight text-[#141416]">
                    NeuroRead
                  </span>
                </div>

                <p className="text-[13.5px] text-[#524E63] max-w-xs leading-relaxed">
                  Good books. Fewer barriers.
                  <br />A world of stories, open to every mind.
                </p>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3A2AD9] bg-[#E5DFFA] border border-[#D4CAFA] rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#3A2AD9]" />
                  <span>Inclusive</span>
                </span>
              </div>
            </div>

            {/* 3 Link Columns */}
            <div className="md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <span className="w-8 h-8 rounded-lg bg-[#EAE4FC] border border-[#DDD5FA] flex items-center justify-center text-[#3A2AD9] flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </span>
                      <h4 className="text-xs font-bold text-[#141416] tracking-tight">
                        {section.title}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <button
                            type="button"
                            onClick={() => handleAction(link)}
                            className="text-[#524E63] hover:text-[#3A2AD9] font-medium transition-colors text-left"
                          >
                            {link.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Legal & Language Row */}
          <div className="mt-2 md:mt-0 pt-5 border-t border-[#DFD8F3] flex flex-col md:flex-row md:items-center justify-between gap-3.5 text-xs text-[#4C485C] md:pr-32">
            <p className="text-left">© 2026 NeuroRead · Crafted for every mind</p>

            <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 pr-24 sm:pr-0">
              <button
                type="button"
                onClick={() =>
                  handleAction({
                    notice:
                      'NeuroRead Privacy: Your reading notes and files stay private to your workspace.',
                  })
                }
                className="text-[#141416] hover:text-[#3A2AD9] font-medium transition-colors"
              >
                Privacy
              </button>
              <span className="text-[#9E97B8]">·</span>
              <button
                type="button"
                onClick={() =>
                  handleAction({
                    notice:
                      'NeuroRead Terms: Designed for inclusive personal and educational reading.',
                  })
                }
                className="text-[#141416] hover:text-[#3A2AD9] font-medium transition-colors"
              >
                Terms
              </button>
              <span className="text-[#9E97B8]">·</span>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 bg-[#EAE4FC] hover:bg-[#E1D8FA] border border-[#D8CEFA] rounded-full px-3 py-1 text-[11.5px] font-medium text-[#141416] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#3A2AD9]" />
                  <span>{language}</span>
                  <ChevronDown className="w-3 h-3 text-[#4C485C]" />
                </button>

                {isLangOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-2 w-36 bg-white border border-[#DDD6F8] rounded-xl py-1 shadow-xl z-30">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                          language === lang
                            ? 'text-[#3A2AD9] bg-[#ECEAFD] font-semibold'
                            : 'text-[#524E63] hover:text-[#141416] hover:bg-[#FAF8FF]'
                        }`}
                      >
                        <span>{lang}</span>
                        {language === lang && <Check className="w-3 h-3 text-[#3A2AD9]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
