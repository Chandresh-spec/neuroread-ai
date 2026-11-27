import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import BodySearchBar from './components/BodySearchBar';
import HeroBanner from './components/HeroBanner';
import TrendingSection from './components/TrendingSection';
import PickUpSection from './components/PickUpSection';
import ReadingFeaturesSection from './components/ReadingFeaturesSection';
import MostReadSection from './components/MostReadSection';
import FreeBookshelfSection from './components/FreeBookshelfSection';
import PremiumSection from './components/PremiumSection';
import PdfWorkflowSection from './components/PdfWorkflowSection';
import CuriositySection from './components/CuriositySection';
import MyFilesSection from './components/MyFilesSection';
import LibrarySection from './components/LibrarySection';
import SavedBooksSection from './components/SavedBooksSection';
import HighlightsSection from './components/HighlightsSection';
import EditProfilePage from './components/EditProfilePage';
import SettingsPage from './components/SettingsPage';
import AccessibilityPage from './components/AccessibilityPage';
import HelpPage from './components/HelpPage';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import SearchModal from './components/SearchModal';
import AddFileModal from './components/AddFileModal';
import AudioPlayerModal from './components/AudioPlayerModal';
import PreferencesModal from './components/PreferencesModal';
import AccountDrawer from './components/AccountDrawer';
import LoginModal from './components/LoginModal';
import BookActionModal from './components/BookActionModal';
import BookDetailPage from './components/BookDetailPage';
import ReaderView from './components/ReaderView';
import { INITIAL_SAVED_ITEMS, INITIAL_HIGHLIGHTS } from './data/userCollections';
import { initialUserFiles } from './data/filesData';

const INITIAL_PROFILE = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@neuroread.app',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
};

const ACCOUNT_SUBPAGES = new Set([
  'edit-profile',
  'highlights',
  'saved-books',
  'accessibility',
  'settings',
  'help',
]);

export default function App() {
  // User Profile & Audio Defaults State
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [audioDefaults, setAudioDefaults] = useState({
    voiceId: 'system-default',
    playbackSpeed: 1.0,
  });

  // Shared Library Collections
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const [highlights, setHighlights] = useState(INITIAL_HIGHLIGHTS);
  const [userFiles, setUserFiles] = useState(initialUserFiles);

  // Accessibility & Preferences State
  const [fontMode, setFontMode] = useState('inter');
  const [textSize, setTextSize] = useState(0);
  const [lineSpacing, setLineSpacing] = useState('relaxed');
  const [readerTheme, setReaderTheme] = useState('cream');
  const [focusMode, setFocusMode] = useState(false);

  // Navigation State
  const [activeNav, setActiveNav] = useState('home');
  const [detailBook, setDetailBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);
  const [accountNotice, setAccountNotice] = useState('');
  const [openedFromAccountMenu, setOpenedFromAccountMenu] = useState(false);
  const navBeforeAccountRef = useRef('home');
  const skipNextAccountPopRef = useRef(false);
  const avatarTriggerRef = useRef(null);
  const bodySearchRef = useRef(null);

  // Modals & Drawer State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('neuroread_auth') === 'true'
  );
  const [selectedAudioBook, setSelectedAudioBook] = useState(null);
  const [bookActionTarget, setBookActionTarget] = useState(null);
  const [isPremiumPlansOpen, setIsPremiumPlansOpen] = useState(false);

  const handleNavChange = (nextNav) => {
    setIsAccountMenuOpen(false);
    setOpenedFromAccountMenu(false);
    setDetailBook(null);
    setActiveNav(nextNav);
  };

  const handleSelectAccountItem = (itemId) => {
    if (!ACCOUNT_SUBPAGES.has(activeNav)) {
      navBeforeAccountRef.current = activeNav;
    }
    setOpenedFromAccountMenu(true);
    setIsAccountMenuOpen(false);
    setActiveNav(itemId);
    window.history.pushState({ neuroreadAccountPage: itemId }, '');
  };

  const handleBackFromAccountPage = useCallback((fromPopState = false) => {
    setOpenedFromAccountMenu(false);
    setActiveNav(navBeforeAccountRef.current || 'home');
    setIsAccountMenuOpen(true);
    if (!fromPopState && window.history.state?.neuroreadAccountPage) {
      skipNextAccountPopRef.current = true;
      window.history.back();
    }
  }, []);

  // Keyboard shortcut: Ctrl+K/Cmd+K for search; Esc on account-opened subpages returns to account menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if (
        e.key === 'Escape' &&
        openedFromAccountMenu &&
        ACCOUNT_SUBPAGES.has(activeNav) &&
        !isSearchOpen &&
        !isAddFileOpen &&
        !isAudioPlayerOpen &&
        !isPreferencesOpen &&
        !isAccountMenuOpen &&
        !readerBook
      ) {
        e.preventDefault();
        handleBackFromAccountPage(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeNav,
    openedFromAccountMenu,
    isSearchOpen,
    isAddFileOpen,
    isAudioPlayerOpen,
    isPreferencesOpen,
    isAccountMenuOpen,
    readerBook,
    handleBackFromAccountPage,
  ]);

  // Browser back button support when a page was opened from the account menu
  useEffect(() => {
    const handlePopState = () => {
      if (skipNextAccountPopRef.current) {
        skipNextAccountPopRef.current = false;
        return;
      }
      if (openedFromAccountMenu && ACCOUNT_SUBPAGES.has(activeNav)) {
        handleBackFromAccountPage(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeNav, openedFromAccountMenu, handleBackFromAccountPage]);

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

  const handleOpenBookDetail = (book) => {
    setDetailBook(book);
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

  const handleAuthSuccess = (authUser) => { setProfile((prev) => ({ ...prev, displayName: authUser?.displayName || prev.displayName, email: authUser?.email || prev.email })); setIsAuthenticated(true); localStorage.setItem('neuroread_auth', 'true'); setAccountNotice(`Welcome back, ${authUser?.displayName || profile.displayName}!`); setTimeout(() => setAccountNotice(''), 4000); };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('neuroread_auth');
    localStorage.removeItem('neuroread_access_token');
    setIsAccountMenuOpen(false);
    setOpenedFromAccountMenu(false);
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
    setOpenedFromAccountMenu(false);
    setActiveNav('home');
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
          onOpenProfile={() => setIsAccountMenuOpen(true)}
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
            onOpenProfile={() => setIsAccountMenuOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
            isAuthenticated={isAuthenticated}
            onOpenVoiceReader={() => {
              setSelectedAudioBook(null);
              setIsAudioPlayerOpen(true);
            }}
            profile={profile}
            avatarButtonRef={avatarTriggerRef}
          />

          {accountNotice && (
            <div
              role="status"
              aria-live="polite"
              className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-4"
            >
              <div className="bg-white border border-[#E4E4E7] rounded-md px-4 py-3 text-sm text-[#141416]">
                {accountNotice}
              </div>
            </div>
          )}

          {/* Main Centered Container */}
          <div className="flex-1 flex w-full">
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-8 sm:space-y-10 pb-6">
              {detailBook ? (
                <BookDetailPage
                  key={detailBook.id}
                  book={detailBook}
                  onBack={() => setDetailBook(null)}
                  onStartReading={handleOpenReader}
                  onSelectBook={handleOpenBookDetail}
                  onOpenReaderSettings={() => setIsPreferencesOpen(true)}
                  onOpenAudio={handleOpenAudioBook}
                  onExploreAll={() => {
                    setDetailBook(null);
                    handleNavChange('library');
                  }}
                  onBookAction={(book, mode) => setBookActionTarget({ book, mode })}
                />
              ) : activeNav === 'library' ? (
                <LibrarySection onOpenReader={handleOpenReader} />
              ) : activeNav === 'my-files' ? (
                <MyFilesSection
                  files={userFiles}
                  onUpdateFiles={setUserFiles}
                  onOpenFile={handleOpenReader}
                  onOpenAudio={handleOpenAudioBook}
                  onOpenUpload={() => setIsAddFileOpen(true)}
                />
              ) : activeNav === 'saved-books' ? (
                <SavedBooksSection
                  onOpenReader={handleOpenReader}
                  onOpenAudio={handleOpenAudioBook}
                  onExploreLibrary={() => handleNavChange('library')}
                  savedItems={savedItems}
                  setSavedItems={setSavedItems}
                  onBack={
                    openedFromAccountMenu
                      ? () => handleBackFromAccountPage(false)
                      : () => handleNavChange('home')
                  }
                />
              ) : activeNav === 'highlights' ? (
                <HighlightsSection
                  onOpenReader={handleOpenReader}
                  highlights={highlights}
                  setHighlights={setHighlights}
                  onBackToProfile={() => handleBackFromAccountPage(false)}
                />
              ) : activeNav === 'edit-profile' ? (
                <EditProfilePage
                  profile={profile}
                  onSaveProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
                  onUploadAvatar={handleUploadAvatar}
                  onRemoveAvatar={handleRemoveAvatar}
                  onBack={() => handleBackFromAccountPage(false)}
                />
              ) : activeNav === 'accessibility' ? (
                <AccessibilityPage
                  accessibilityState={accessibilityState}
                  onChangeAccessibility={handleChangeAccessibility}
                  onBack={() => handleBackFromAccountPage(false)}
                />
              ) : activeNav === 'settings' ? (
                <SettingsPage
                  profile={profile}
                  onSaveProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
                  accessibilityState={accessibilityState}
                  onChangeAccessibility={handleChangeAccessibility}
                  audioDefaults={audioDefaults}
                  onSaveAudioDefaults={setAudioDefaults}
                  onOpenEditProfile={() => handleSelectAccountItem('edit-profile')}
                  onDownloadData={handleDownloadData}
                  onDeleteAccount={handleDeleteAccount}
                  onBack={() => handleBackFromAccountPage(false)}
                />
              ) : activeNav === 'help' ? (
                <HelpPage
                  onBack={() => handleBackFromAccountPage(false)}
                />
              ) : (
                /* Home View */
                <>
                  {/* Hero Banner */}
                  <HeroBanner
                    onExplore={() => handleNavChange('library')}
                    onTryAudio={() => {
                      setSelectedAudioBook(null);
                      setIsAudioPlayerOpen(true);
                    }}
                    onUploadPdf={() => setIsAddFileOpen(true)}
                    onExplorePremium={() => setIsPremiumPlansOpen(true)}
                  />

                  {/* Trending Now */}
                  <TrendingSection
                    onSelectBook={handleOpenBookDetail}
                    onBookAction={(book, mode) => setBookActionTarget({ book, mode })}
                    onExploreAll={() => handleNavChange('library')}
                  />

                  {/* Pick up where you left off (visible for signed-in readers) */}
                  {isAuthenticated && (
                    <PickUpSection
                      onContinueReading={handleOpenReader}
                      onContinueListening={handleOpenAudioBook}
                      onViewHistory={() => handleNavChange('saved-books')}
                    />
                  )}

                  {/* Reading Features + Live Interactive Reader Preview */}
                  <ReadingFeaturesSection />

                  {/* Most Read This Week */}
                  <MostReadSection
                    onSelectBook={handleOpenBookDetail}
                    onBookAction={(book, mode) => setBookActionTarget({ book, mode })}
                    onExploreAll={() => handleNavChange('library')}
                  />

                  {/* Free Bookshelf */}
                  <FreeBookshelfSection
                    onSelectBook={handleOpenBookDetail}
                    onExploreAll={() => handleNavChange('library')}
                  />

                  {/* Premium Storage */}
                  <PremiumSection
                    isPlansOpen={isPremiumPlansOpen}
                    onOpenChange={setIsPremiumPlansOpen}
                  />

                  {/* PDF Workflow */}
                  <PdfWorkflowSection
                    onUploadPdf={() => setIsAddFileOpen(true)}
                  />
                </>
              )}
            </main>
          </div>

          {/* Full-Bleed Dark Editorial Footer */}
          <Footer
            onNavigate={handleNavChange}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
          />

          {/* Mobile Bottom Navigation Bar (< 768px) */}
          <MobileBottomNav
            activeNav={activeNav}
            setActiveNav={handleNavChange}
            onOpenProfile={() => setIsAccountMenuOpen((prev) => !prev)}
            onOpenLogin={() => setIsLoginOpen(true)}
            isAccountMenuOpen={isAccountMenuOpen}
            isAuthenticated={isAuthenticated}
            profile={profile}
          />
        </div>
      )}

      {/* Modals & Account Drawer */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBook={handleOpenBookDetail}
      />

      <AddFileModal
        isOpen={isAddFileOpen}
        onClose={() => setIsAddFileOpen(false)}
        onFileAdded={(newFile) => {
          const format = newFile.format || 'pdf';
          const uploadedEntry = {
            id: newFile.id || `upload-${Date.now()}`,
            name: newFile.name || newFile.title,
            format,
            size: newFile.size || '1.0 MB',
            sizeBytes: newFile.sizeBytes || 1048576,
            uploadedAt: 'Uploaded just now',
            timestamp: Date.now(),
            tags: [format.toUpperCase(), 'Uploaded'],
            progressPercent: null,
            isBookmarked: false,
          };
          setUserFiles((prev) => [uploadedEntry, ...prev]);
          setAccountNotice(`File "${newFile.title}" added to My files.`);
          setTimeout(() => setAccountNotice(''), 4000);
        }}
      />

      <AudioPlayerModal
        key={selectedAudioBook?.id || 'default'}
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

      <AccountDrawer
        isOpen={isAccountMenuOpen}
        onClose={() => setIsAccountMenuOpen(false)}
        profile={profile}
        activeItem={ACCOUNT_SUBPAGES.has(activeNav) ? activeNav : ''}
        onSelectItem={handleSelectAccountItem}
        onSignOut={handleSignOut}
        savedCount={savedItems.length}
        highlightsCount={highlights.length}
        onUpgradePremium={() => setIsPremiumPlansOpen(true)}
        accessibilityState={accessibilityState}
        onChangeAccessibility={handleChangeAccessibility}
        returnFocusRef={avatarTriggerRef}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <BookActionModal
        key={bookActionTarget ? `${bookActionTarget.book.id}-${bookActionTarget.mode}` : 'none'}
        book={bookActionTarget?.book}
        initialMode={bookActionTarget?.mode || 'rent'}
        isOpen={!!bookActionTarget}
        onClose={() => setBookActionTarget(null)}
        onStartReading={handleOpenReader}
      />

      <span className="hidden" aria-hidden="true"
      />
    </div>
  );
}
