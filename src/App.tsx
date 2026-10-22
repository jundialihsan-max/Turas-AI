import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ReaderView } from './components/reader/ReaderView';
import { DalilView } from './components/dalil/DalilView';
import { LearnView } from './components/learn/LearnView';
import { ProfileView } from './components/profile/ProfileView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { BOOKS_DATABASE } from './data/booksData';
import { THEMATIC_DALIL_DATABASE } from './data/dalilData';
import { LEARNING_MODULES_DATABASE } from './data/learningData';
import { storage, defaultPreferences } from './utils/storage';
import { Book, Bookmark, UserNote, ReadingProgress, UserPreferences, DalilItem } from './types';

interface NavState {
  tab: string;
  bookId?: string | null;
  chapterId?: string;
  category?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

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
      if (isSearchOpen) {
        setIsSearchOpen(false);
        return;
      }

      if (e.state && e.state.appNav) {
        const state: NavState = e.state.appNav;
        setActiveTab(state.tab);
        setActiveBookId(state.bookId || null);
        setActiveChapterId(state.chapterId);
        if (state.category) setSelectedCatalogCategory(state.category);
      } else {
        // Fallback pop
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
  }, [isSearchOpen, activeBookId, activeTab]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Back button handler (both UI and Android)
  const handleBack = useCallback(() => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      return;
    }

    if (activeBookId) {
      // Return from Reader to Catalog or Home
      setActiveBookId(null);
      setActiveChapterId(undefined);
      refreshUserData();
      return;
    }

    if (navHistory.length > 1) {
      const newHist = [...navHistory];
      newHist.pop(); // remove current
      const prev = newHist[newHist.length - 1];
      setNavHistory(newHist);
      setActiveTab(prev.tab);
      setActiveBookId(prev.bookId || null);
      setActiveChapterId(prev.chapterId);
      if (prev.category) setSelectedCatalogCategory(prev.category);
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    }
  }, [isSearchOpen, activeBookId, navHistory, activeTab, refreshUserData]);

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
              />
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
    </div>
  );
}
