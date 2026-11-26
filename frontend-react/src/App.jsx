import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PickUpSection from './components/PickUpSection';
import CuriositySection from './components/CuriositySection';
import MyFilesSection from './components/MyFilesSection';
import LibrarySection from './components/LibrarySection';
import SavedBooksSection from './components/SavedBooksSection';
import HighlightsSection from './components/HighlightsSection';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import SearchModal from './components/SearchModal';
import AddFileModal from './components/AddFileModal';
import AudioPlayerModal from './components/AudioPlayerModal';
import PreferencesModal from './components/PreferencesModal';
import ProfileModal from './components/ProfileModal';
import ReaderView from './components/ReaderView';

export default function App() {
  // Accessibility & Preferences State
  const [fontMode, setFontMode] = useState('inter'); // 'inter' | 'dyslexic'
  const [textSize, setTextSize] = useState(0); // -1, 0, 1, 2, 3
  const [focusMode, setFocusMode] = useState(false);

  // Navigation State
  const [activeNav, setActiveNav] = useState('home');
  const [readerBook, setReaderBook] = useState(null);

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAudioBook, setSelectedAudioBook] = useState(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Text scaling class mapping
  const textSizeClasses = {
    '-1': 'text-[92%]',
    0: 'text-[100%]',
    1: 'text-[108%]',
    2: 'text-[116%]',
    3: 'text-[124%]',
  }[textSize] || 'text-[100%]';

  // Handlers
  const handleOpenAudioBook = (book) => {
    setSelectedAudioBook(book);
    setIsAudioPlayerOpen(true);
  };

  const handleOpenReader = (book) => {
    setReaderBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen bg-[#F5F1EA] text-[#141416] ${
        fontMode === 'dyslexic' ? 'font-dyslexic' : ''
      }`}
    >
      {readerBook ? (
        /* Dedicated 3-Pane / Mobile-Tabbed Accessible Reader View */
        <ReaderView
          book={readerBook}
          onBack={() => setReaderBook(null)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAddFile={() => setIsAddFileOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      ) : (
        /* App Frame */
        <div className={`min-h-screen flex flex-col ${textSizeClasses}`}>
          {/* Top Horizontal Header / Menu Bar */}
          <Navbar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenVoiceReader={() => {
              setSelectedAudioBook(null);
              setIsAudioPlayerOpen(true);
            }}
          />

          {/* Main Centered Container */}
          <div className="flex-1 flex max-w-[1280px] w-full mx-auto">
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 pb-10">
              {activeNav === 'library' ? (
                /* Library View */
                <LibrarySection onOpenReader={handleOpenReader} />
              ) : activeNav === 'my-files' ? (
                /* My Files View */
                <MyFilesSection
                  onOpenFile={handleOpenReader}
                  onOpenUpload={() => setIsAddFileOpen(true)}
                />
              ) : activeNav === 'saved-books' ? (
                /* Saved Books View */
                <SavedBooksSection
                  onOpenReader={handleOpenReader}
                  onOpenAudio={handleOpenAudioBook}
                  onExploreLibrary={() => setActiveNav('library')}
                />
              ) : activeNav === 'highlights' ? (
                /* Highlights View */
                <HighlightsSection onOpenReader={handleOpenReader} />
              ) : (
                /* Home View */
                <>
                  {/* Hero Banner: "A LIBRARY THAT GETS YOU" */}
                  <div className={focusMode ? 'focus-dimmed' : ''}>
                    <HeroBanner
                      onExplore={() => setActiveNav('library')}
                      onTryAudio={() => {
                        setSelectedAudioBook(null);
                        setIsAudioPlayerOpen(true);
                      }}
                    />
                  </div>

                  {/* Weekly Reading Goal Horizontal Banner Card */}
                  <div className="bg-white border border-[#E5DFD3] rounded-2xl px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 shadow-2xs">
                    <div>
                      <span className="text-[11px] font-medium text-[#6B665F] block mb-0.5">
                        Your weekly reading goal
                      </span>
                      <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
                        3 of 5 days
                      </span>
                    </div>

                    {/* 5 Circular Progress Dots */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {[1, 2, 3, 4, 5].map((day) => {
                        const completed = day <= 3;
                        return (
                          <div
                            key={day}
                            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full transition-all ${
                              completed
                                ? 'bg-[#3A2AD9] shadow-2xs'
                                : 'border border-dashed border-[#CFC7B8] bg-transparent'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 1: "Pick up where you left off" */}
                  <div className={focusMode ? 'focus-active p-2 rounded-3xl bg-white' : ''}>
                    <PickUpSection
                      onContinueReading={handleOpenReader}
                      onContinueListening={handleOpenAudioBook}
                      onViewHistory={() => setActiveNav('saved-books')}
                    />
                  </div>

                  {/* Section 2: "A little curiosity goes a long way" */}
                  <div id="curiosity-section" className={focusMode ? 'focus-dimmed' : ''}>
                    <CuriositySection
                      onSelectBook={handleOpenReader}
                      onExploreAll={() => setActiveNav('library')}
                    />
                  </div>

                  {/* Section 3: Pastel Editorial Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-2">
                    {/* Card 1: Lavender */}
                    <div className="bg-[#E3DFFA] rounded-2xl p-6 sm:p-7">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3A2AD9] block mb-2">
                        READ
                      </span>
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#141416] mb-1.5">
                        At your pace
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#4C485C] leading-relaxed">
                        Adjust spacing, size and focus so every page feels comfortable.
                      </p>
                    </div>

                    {/* Card 2: Peach */}
                    <div className="bg-[#FAD8C4] rounded-2xl p-6 sm:p-7">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#9A421C] block mb-2">
                        LISTEN
                      </span>
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#141416] mb-1.5">
                        When you like
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#5C4438] leading-relaxed">
                        Switch between text and voice without losing your place.
                      </p>
                    </div>

                    {/* Card 3: Soft White */}
                    <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-7">
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3A2AD9] block mb-2">
                        BELONG
                      </span>
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#141416] mb-1.5">
                        Made for every mind
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#5E5A54] leading-relaxed">
                        A world of stories, open to everyone.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>

          {/* Full-Bleed Dark Editorial Footer */}
          <Footer />

          {/* Mobile Bottom Navigation Bar (< 768px) */}
          <MobileBottomNav
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>
      )}

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBook={handleOpenReader}
      />

      <AddFileModal
        isOpen={isAddFileOpen}
        onClose={() => setIsAddFileOpen(false)}
        onFileAdded={(newFile) => {
          alert(`File "${newFile.title}" successfully added! Ready for accessible reading.`);
        }}
      />

      <AudioPlayerModal
        isOpen={isAudioPlayerOpen}
        onClose={() => setIsAudioPlayerOpen(false)}
        book={selectedAudioBook}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        fontMode={fontMode}
        setFontMode={setFontMode}
        textSize={textSize}
        setTextSize={setTextSize}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenPreferences={() => {
          setIsProfileOpen(false);
          setIsPreferencesOpen(true);
        }}
        onOpenHighlights={() => {
          setIsProfileOpen(false);
          setActiveNav('highlights');
        }}
      />
    </div>
  );
}
