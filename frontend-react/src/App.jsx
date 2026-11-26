import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PickUpSection from './components/PickUpSection';
import CuriositySection from './components/CuriositySection';
import MyFilesSection from './components/MyFilesSection';
import LibrarySection from './components/LibrarySection';
import SavedBooksSection from './components/SavedBooksSection';
import HighlightsSection from './components/HighlightsSection';
import { INITIAL_SAVED_ITEMS, INITIAL_HIGHLIGHTS } from './data/userCollections';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import SearchModal from './components/SearchModal';
import AddFileModal from './components/AddFileModal';
import AudioPlayerModal from './components/AudioPlayerModal';
import PreferencesModal from './components/PreferencesModal';
import ProfileModal from './components/ProfileModal';
import ReaderView from './components/ReaderView';

const INITIAL_PROFILE = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@neuroread.app',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
  membershipBadge: 'Inclusive Library Member',
};

export default function App() {
  // User Profile & Audio Defaults State
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [audioDefaults, setAudioDefaults] = useState({
    voiceId: 'system-default',
    playbackSpeed: 1.0,
  });

  // Shared Library Collections (used for real Profile counts & data export)
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const [highlights, setHighlights] = useState(INITIAL_HIGHLIGHTS);

  // Accessibility & Preferences State
  const [fontMode, setFontMode] = useState('inter'); // 'inter' | 'dyslexic' | 'lexend' | 'atkinson'
  const [textSize, setTextSize] = useState(0); // -1, 0, 1, 2, 3
  const [lineSpacing, setLineSpacing] = useState('relaxed'); // 'compact' | 'relaxed' | 'spacious'
  const [readerTheme, setReaderTheme] = useState('cream'); // 'cream' | 'sky' | 'sage' | 'dark' | 'contrast'
  const [focusMode, setFocusMode] = useState(false);

  // Navigation State
  const [activeNav, setActiveNav] = useState('home');
  const [readerBook, setReaderBook] = useState(null);
  const [accountNotice, setAccountNotice] = useState('');
  const [highlightsFromProfile, setHighlightsFromProfile] = useState(false);
  const navBeforeHighlightsRef = useRef('home');
  const skipNextHighlightsPopRef = useRef(false);

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAudioBook, setSelectedAudioBook] = useState(null);

  const handleNavChange = (nextNav) => {
    setHighlightsFromProfile(false);
    setActiveNav(nextNav);
  };

  const handleBackToProfileFromHighlights = useCallback((fromPopState = false) => {
    setHighlightsFromProfile(false);
    setActiveNav(navBeforeHighlightsRef.current || 'home');
    setIsProfileOpen(true);
    if (!fromPopState && window.history.state?.neuroreadScreen === 'highlights-from-profile') {
      skipNextHighlightsPopRef.current = true;
      window.history.back();
    }
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search; Esc on Highlights opened from Profile returns to Profile
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if (
        e.key === 'Escape' &&
        activeNav === 'highlights' &&
        highlightsFromProfile &&
        !isSearchOpen &&
        !isAddFileOpen &&
        !isAudioPlayerOpen &&
        !isPreferencesOpen &&
        !isProfileOpen &&
        !readerBook
      ) {
        e.preventDefault();
        handleBackToProfileFromHighlights(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeNav,
    highlightsFromProfile,
    isSearchOpen,
    isAddFileOpen,
    isAudioPlayerOpen,
    isPreferencesOpen,
    isProfileOpen,
    readerBook,
    handleBackToProfileFromHighlights,
  ]);

  // Browser back button support when Highlights was opened from Profile
  useEffect(() => {
    const handlePopState = () => {
      if (skipNextHighlightsPopRef.current) {
        skipNextHighlightsPopRef.current = false;
        return;
      }
      if (activeNav === 'highlights' && highlightsFromProfile) {
        handleBackToProfileFromHighlights(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeNav, highlightsFromProfile, handleBackToProfileFromHighlights]);

  // Text scaling & font class mapping
  const textSizeClasses = {
    '-1': 'text-[92%]',
    0: 'text-[100%]',
    1: 'text-[108%]',
    2: 'text-[116%]',
    3: 'text-[124%]',
  }[textSize] || 'text-[100%]';

  const fontClass =
    {
      dyslexic: 'font-dyslexic',
      lexend: 'font-lexend',
      atkinson: 'font-atkinson',
      inter: '',
    }[fontMode] || '';

  const lineSpacingClass =
    {
      compact: 'leading-normal',
      relaxed: 'leading-relaxed',
      spacious: 'leading-loose',
    }[lineSpacing] || 'leading-relaxed';

  // Handlers
  const handleOpenAudioBook = (book) => {
    setSelectedAudioBook(book);
    setIsAudioPlayerOpen(true);
  };

  const handleOpenReader = (book) => {
    setReaderBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadAvatar = async (croppedDataUrl) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    setProfile((prev) => ({ ...prev, avatarUrl: croppedDataUrl }));
  };

  const handleRemoveAvatar = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleDownloadData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile: {
        displayName: profile.displayName,
        email: profile.email,
      },
      accessibilityPreferences: {
        fontMode,
        textSize,
        lineSpacing,
        readerTheme,
        focusMode,
      },
      audioDefaults,
      savedBooks: savedItems.map((b) => ({ id: b.id, title: b.title, author: b.author })),
      highlights,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neuroread-account-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    setAccountNotice('You have signed out of your session.');
    setTimeout(() => setAccountNotice(''), 4000);
  };

  const handleDeleteAccount = () => {
    setProfile({
      ...INITIAL_PROFILE,
      displayName: 'Guest Reader',
      email: 'guest@neuroread.app',
      avatarUrl: '',
    });
    setSavedItems([]);
    setHighlights([]);
    setAccountNotice('Your account data has been cleared from this session.');
    setTimeout(() => setAccountNotice(''), 5000);
  };

  const accessibilityState = {
    fontMode,
    textSize,
    lineSpacing,
    readerTheme,
    focusMode,
  };

  const handleChangeAccessibility = (patch) => {
    if ('fontMode' in patch) setFontMode(patch.fontMode);
    if ('textSize' in patch) setTextSize(patch.textSize);
    if ('lineSpacing' in patch) setLineSpacing(patch.lineSpacing);
    if ('readerTheme' in patch) setReaderTheme(patch.readerTheme);
    if ('focusMode' in patch) setFocusMode(patch.focusMode);
  };

  return (
    <div className={`min-h-screen bg-white text-[#141416] ${fontClass} ${lineSpacingClass}`}>
      {readerBook ? (
        /* Dedicated 3-Pane / Mobile-Tabbed Accessible Reader View */
        <ReaderView
          book={readerBook}
          onBack={() => setReaderBook(null)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAddFile={() => setIsAddFileOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          defaultTheme={readerTheme}
          defaultFont={fontMode === 'inter' ? 'lexend' : fontMode}
          defaultSpeed={audioDefaults.playbackSpeed}
        />
      ) : (
        /* App Frame */
        <div className={`min-h-screen flex flex-col ${textSizeClasses}`}>
          {/* Top Horizontal Header / Menu Bar */}
          <Navbar
            activeNav={activeNav}
            setActiveNav={handleNavChange}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenVoiceReader={() => {
              setSelectedAudioBook(null);
              setIsAudioPlayerOpen(true);
            }}
            profile={profile}
          />

          {accountNotice && (
            <div
              role="status"
              aria-live="polite"
              className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4"
            >
              <div className="bg-[#F9F7F2] border border-[#E2DDD2] rounded-2xl px-4 py-3 text-sm text-[#141416]">
                {accountNotice}
              </div>
            </div>
          )}

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
                  savedItems={savedItems}
                  setSavedItems={setSavedItems}
                />
              ) : activeNav === 'highlights' ? (
                /* Highlights View */
                <HighlightsSection
                  onOpenReader={handleOpenReader}
                  highlights={highlights}
                  setHighlights={setHighlights}
                  onBackToProfile={
                    highlightsFromProfile
                      ? () => handleBackToProfileFromHighlights(false)
                      : undefined
                  }
                />
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
            setActiveNav={handleNavChange}
            onOpenProfile={() => setIsProfileOpen(true)}
            profile={profile}
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
        defaultSpeed={audioDefaults.playbackSpeed}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        fontMode={fontMode}
        setFontMode={setFontMode}
        textSize={textSize}
        setTextSize={setTextSize}
        lineSpacing={lineSpacing}
        setLineSpacing={setLineSpacing}
        readerTheme={readerTheme}
        setReaderTheme={setReaderTheme}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        onUploadAvatar={handleUploadAvatar}
        onRemoveAvatar={handleRemoveAvatar}
        audioDefaults={audioDefaults}
        onSaveAudioDefaults={setAudioDefaults}
        accessibilityState={accessibilityState}
        onChangeAccessibility={handleChangeAccessibility}
        savedCount={savedItems.length}
        highlightsCount={highlights.length}
        onOpenHighlights={() => {
          navBeforeHighlightsRef.current = activeNav;
          setHighlightsFromProfile(true);
          setIsProfileOpen(false);
          setActiveNav('highlights');
          window.history.pushState({ neuroreadScreen: 'highlights-from-profile' }, '');
        }}
        onDownloadData={handleDownloadData}
        onSignOut={handleSignOut}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
