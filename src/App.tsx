import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ReaderView } from './components/reader/ReaderView';
import { DalilView } from './components/dalil/DalilView';
import { LearnView } from './components/learn/LearnView';
import { ProfileView } from './components/profile/ProfileView';
import { AcademyView } from './components/academy/AcademyView';
import { EncyclopediaView } from './components/encyclopedia/EncyclopediaView';
import { KhutbahStudio } from './components/khutbah/KhutbahStudio';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AboutModal } from './components/about/AboutModal';
import { GlossaryModal } from './components/glossary/GlossaryModal';
import { ReportModal } from './components/feedback/ReportModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

import { BOOKS_DATABASE } from './data/booksData';
import { THEMATIC_DALIL_DATABASE } from './data/dalilData';
import { LEARNING_MODULES_DATABASE } from './data/learningData';
import { storage } from './utils/storage';
import { Book, Bookmark, UserNote, ReadingProgress, UserPreferences, DalilItem } from './types';

interface NavState {
  tab: string;
  bookId?: string | null;
  chapterId?: string;
  category?: string;
  branchId?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');
  const [selectedAcademyBranch, setSelectedAcademyBranch] = useState<string>('aqidah');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // History stack for in-app and Android Back button navigation
  const [navHistory, setNavHistory] = useState<NavState[]>([{ tab: 'home' }]);

  // Persistent storage data
  const [preferences, setPreferences] = useState<UserPreferences>(() => storage.getUserPreferences());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => storage.getBookmarks());
  const [notes, setNotes] = useState<UserNote[]>(() => storage.getNotes());
  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>(() => storage.getReadingHistory());
  
  // Custom books merged with default database
  const [allBooks, setAllBooks] = useState<Book[]>(() => {
    const custom = storage.getCustomBooks();
    return [...BOOKS_DATABASE, ...custom];
  });

  // Custom dalils merged with default database
  const [allDalils, setAllDalils] = useState<DalilItem[]>(() => {
    const custom = storage.getCustomDalils();
    return [...THEMATIC_DALIL_DATABASE, ...custom];
  });

  const refreshUserData = useCallback(() => {
    setBookmarks(storage.getBookmarks());
    setNotes(storage.getNotes());
    setReadingHistory(storage.getReadingHistory());
    setPreferences(storage.getUserPreferences());
    const customB = storage.getCustomBooks();
    setAllBooks([...BOOKS_DATABASE, ...customB]);
    const customD = storage.getCustomDalils();
    setAllDalils([...THEMATIC_DALIL_DATABASE, ...customD]);
  }, []);

  // Sync Android / Browser Hardware Back Button via popstate
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isSearchOpen || isAboutOpen || isGlossaryOpen || isReportOpen) {
        setIsSearchOpen(false);
        setIsAboutOpen(false);
        setIsGlossaryOpen(false);
        setIsReportOpen(false);
        return;
      }

      if (e.state && e.state.appNav) {
        const state: NavState = e.state.appNav;
        setActiveTab(state.tab);
        setActiveBookId(state.bookId || null);
        setActiveChapterId(state.chapterId);
        if (state.category) setSelectedCatalogCategory(state.category);
        if (state.branchId) setSelectedAcademyBranch(state.branchId);
      } else {
        if (activeBookId) {
          setActiveBookId(null);
          setActiveChapterId(undefined);
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSearchOpen, isAboutOpen, isGlossaryOpen, isReportOpen, activeBookId, activeTab]);

  // Navigate to a new state and push history
  const navigateTo = useCallback((newState: NavState) => {
    try {
      window.history.pushState({ appNav: newState }, '');
    } catch {
      // Ignore in restricted sandboxes
    }

    setNavHistory((prev) => [...prev, newState]);
    setActiveTab(newState.tab);
    setActiveBookId(newState.bookId || null);
    setActiveChapterId(newState.chapterId);
    if (newState.category) setSelectedCatalogCategory(newState.category);
    if (newState.branchId) setSelectedAcademyBranch(newState.branchId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Back button handler (both UI and Android)
  const handleBack = useCallback(() => {
    if (isSearchOpen || isAboutOpen || isGlossaryOpen || isReportOpen) {
      setIsSearchOpen(false);
      setIsAboutOpen(false);
      setIsGlossaryOpen(false);
      setIsReportOpen(false);
      return;
    }

    if (activeBookId) {
      setActiveBookId(null);
      setActiveChapterId(undefined);
      refreshUserData();
      return;
    }

    if (navHistory.length > 1) {
      const newHist = [...navHistory];
      newHist.pop();
      const prev = newHist[newHist.length - 1];
      setNavHistory(newHist);
      setActiveTab(prev.tab);
      setActiveBookId(prev.bookId || null);
      setActiveChapterId(prev.chapterId);
      if (prev.category) setSelectedCatalogCategory(prev.category);
      if (prev.branchId) setSelectedAcademyBranch(prev.branchId);
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    }
  }, [isSearchOpen, isAboutOpen, isGlossaryOpen, isReportOpen, activeBookId, navHistory, activeTab, refreshUserData]);

  const handleOpenBook = useCallback((bookId: string, chapterId?: string) => {
    navigateTo({
      tab: 'catalog',
      bookId,
      chapterId,
    });
  }, [navigateTo]);

  const handleOpenCategory = useCallback((cat: string) => {
    setSelectedCatalogCategory(cat);
    navigateTo({
      tab: 'catalog',
      category: cat,
    });
  }, [navigateTo]);

  const handleOpenCurriculumBranch = useCallback((branchId: string) => {
    setSelectedAcademyBranch(branchId);
    navigateTo({
      tab: 'academy',
      branchId,
    });
  }, [navigateTo]);

  const handleUpdatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    const updated = storage.saveUserPreferences(newPrefs);
    setPreferences(updated);
  }, []);

  const activeBook = activeBookId ? allBooks.find((b) => b.id === activeBookId) : null;

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-stone-900 font-sans flex flex-col antialiased">
      {/* Connectivity status banner for PWA offline operation */}
      <OfflineIndicator />

      {/* Main Top Navigation Header */}
      {!activeBook && (
        <Navbar
          currentTab={activeTab}
          hasActiveReader={false}
          activeBookTitle={undefined}
          onBack={handleBack}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateTab={(tab) => navigateTo({ tab })}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-5">
        {activeBook ? (
          <ReaderView
            book={activeBook}
            initialChapterId={activeChapterId}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onBack={handleBack}
            onGoHome={() => navigateTo({ tab: 'home' })}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                books={allBooks}
                readingHistory={readingHistory}
                preferences={preferences}
                onOpenBook={handleOpenBook}
                onNavigateTab={(tab) => navigateTo({ tab })}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenCategory={handleOpenCategory}
                onOpenAbout={() => setIsAboutOpen(true)}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
              />
            )}

            {activeTab === 'academy' && (
              <AcademyView
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
                initialBranchId={selectedAcademyBranch}
                onOpenAdminTopic={(topicId) => {
                  navigateTo({ tab: 'admin' });
                }}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView
                onBackToApp={() => navigateTo({ tab: 'home' })}
                onOpenBook={handleOpenBook}
                onNavigateTab={(tab) => navigateTo({ tab })}
              />
            )}

            {activeTab === 'encyclopedia' && (
              <EncyclopediaView
                onOpenBook={handleOpenBook}
                onOpenCurriculumTopic={handleOpenCurriculumBranch}
              />
            )}

            {activeTab === 'khutbah' && (
              <KhutbahStudio />
            )}

            {activeTab === 'catalog' && (
              <CatalogView
                books={allBooks}
                selectedCategory={selectedCatalogCategory}
                onSelectCategory={(cat) => setSelectedCatalogCategory(cat)}
                onOpenBook={handleOpenBook}
              />
            )}

            {activeTab === 'dalil' && (
              <DalilView dalils={allDalils} />
            )}

            {activeTab === 'learn' && (
              <LearnView
                modules={LEARNING_MODULES_DATABASE}
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                preferences={preferences}
                bookmarks={bookmarks}
                notes={notes}
                readingHistory={readingHistory}
                onOpenBook={handleOpenBook}
                onUpdatePreferences={handleUpdatePreferences}
                onRefreshData={refreshUserData}
                onAddNewCustomBook={(newBook) => {
                  setAllBooks((prev) => [...prev, newBook]);
                }}
                onAddNewCustomDalil={(newDalil) => {
                  setAllDalils((prev) => [...prev, newDalil]);
                }}
                onOpenAbout={() => setIsAboutOpen(true)}
                onOpenReportModal={() => setIsReportOpen(true)}
                onNavigateTab={(tab) => navigateTo({ tab })}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation (Fixed on mobile/tablet, hidden while reading in focus) */}
      <BottomNav
        currentTab={activeTab}
        onSelectTab={(tab) => navigateTo({ tab })}
        hideOnReader={!!activeBook}
      />

      {/* Global Intelligent Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={allBooks}
        dalils={allDalils}
        onOpenBook={handleOpenBook}
        onOpenDalilTab={() => {
          setIsSearchOpen(false);
          navigateTo({ tab: 'dalil' });
        }}
      />

      {/* About App & Creator Attribution Modal (Section XIV) */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Islamic Term Glossary & Arabic Lexicon */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Scientific Error & Content Reporting Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
