import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  List, 
  Settings2, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck, 
  Share2, 
  Copy, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  PenTool, 
  Check, 
  Search,
  BookOpen,
  Info,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Book, Chapter, Section, UserPreferences, ContentClassification } from '../../types';
import { storage } from '../../utils/storage';
import { copyWithAttribution, removeHarakat } from '../../utils/arabic';

interface ReaderViewProps {
  book: Book;
  initialChapterId?: string;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onBack: () => void;
  onGoHome: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  initialChapterId,
  preferences,
  onUpdatePreferences,
  onBack,
  onGoHome,
}) => {
  // Current active chapter
  const [activeChapterIndex, setActiveChapterIndex] = useState(() => {
    if (initialChapterId) {
      const idx = book.chapters.findIndex((c) => c.id === initialChapterId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const activeChapter: Chapter = book.chapters[activeChapterIndex] || book.chapters[0];

  // Table of Contents drawer state
  const [showTOC, setShowTOC] = useState(false);
  // Settings popup state
  const [showSettings, setShowSettings] = useState(false);
  // Focus / Zen mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  // Search within book
  const [searchInBookQuery, setSearchInBookQuery] = useState('');
  const [showSearchInBook, setShowSearchInBook] = useState(false);

  // Note dialog state
  const [activeNoteSection, setActiveNoteSection] = useState<Section | null>(null);
  const [noteInputText, setNoteInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio player state
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bookmarking state for chapter
  const [isChapterBookmarked, setIsChapterBookmarked] = useState(false);

  // Check and save reading progress on chapter change
  useEffect(() => {
    if (activeChapter) {
      storage.saveReadingProgress({
        bookId: book.id,
        bookTitle: book.titleId,
        lastChapterId: activeChapter.id,
        lastChapterTitle: activeChapter.titleId,
        progressPercent: Math.round(((activeChapterIndex + 1) / book.chapters.length) * 100),
        updatedAt: Date.now(),
      });

      setIsChapterBookmarked(storage.isBookmarked(book.id, activeChapter.id));
    }
    // Stop any playing audio on chapter shift
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAudioUrl(null);
    }
  }, [book.id, book.titleId, book.chapters.length, activeChapterIndex, activeChapter]);

  // Audio event handlers
  const handleTogglePlayAudio = (url: string) => {
    if (playingAudioUrl === url && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setPlayingAudioUrl(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio playback error', e));
      }
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Bookmark toggle
  const handleToggleBookmark = (section?: Section) => {
    const sectionId = section?.id;
    const isCurrentlyBookmarked = storage.isBookmarked(book.id, activeChapter.id, sectionId);

    if (isCurrentlyBookmarked) {
      const allBookmarks = storage.getBookmarks();
      const target = allBookmarks.find(
        (b) => b.bookId === book.id && b.chapterId === activeChapter.id && (sectionId ? b.sectionId === sectionId : true)
      );
      if (target) {
        storage.removeBookmark(target.id);
      }
    } else {
      storage.saveBookmark({
        bookId: book.id,
        bookTitleId: book.titleId,
        bookTitleAr: book.titleAr,
        chapterId: activeChapter.id,
        chapterTitle: activeChapter.titleId,
        sectionId: sectionId,
        textSnippet: section ? section.contentId.slice(0, 100) + '...' : activeChapter.titleId,
      });
    }

    if (!sectionId) {
      setIsChapterBookmarked(!isCurrentlyBookmarked);
    }
  };

  // Copy text with attribution
  const handleCopySection = async (section: Section) => {
    const sourceString = `${book.titleId} (${book.author}) - ${activeChapter.titleId}`;
    const success = await copyWithAttribution(section.contentAr, section.contentId, sourceString);
    if (success) {
      setCopiedId(section.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Note saving
  const handleOpenNoteModal = (section: Section) => {
    setActiveNoteSection(section);
    setNoteInputText('');
  };

  const handleSaveNote = () => {
    if (!activeNoteSection || !noteInputText.trim()) return;

    storage.saveNote({
      bookId: book.id,
      bookTitleId: book.titleId,
      chapterId: activeChapter.id,
      chapterTitle: activeChapter.titleId,
      quoteSnippet: activeNoteSection.contentId.slice(0, 120),
      noteText: noteInputText.trim(),
      tags: [book.categoryLabel],
    });

    setActiveNoteSection(null);
    setNoteInputText('');
  };

  // Filter sections if search within book is active
  const displayedSections = activeChapter.sections.filter((s) => {
    if (!searchInBookQuery.trim()) return true;
    const query = searchInBookQuery.trim().toLowerCase();
    const cleanAr = removeHarakat(s.contentAr.toLowerCase());
    const cleanQuery = removeHarakat(query);
    return (
      cleanAr.includes(cleanQuery) ||
      s.contentId.toLowerCase().includes(query) ||
      (s.tafsirReference && s.tafsirReference.toLowerCase().includes(query)) ||
      (s.scholarlyNotes && s.scholarlyNotes.toLowerCase().includes(query))
    );
  });

  // Classification styling helper
  const renderClassificationBadge = (classification: ContentClassification) => {
    switch (classification) {
      case 'quran':
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Ayat Al-Qur'an
          </span>
        );
      case 'hadits':
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300">
            Hadits Nabi ﷺ
          </span>
        );
      case 'atsar':
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
            Atsar Sahabat / Salaf
          </span>
        );
      case 'perbedaan_mazhab':
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300">
            Fikih Perbandingan Mazhab
          </span>
        );
      case 'penjelasan_ulama':
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300">
            Penjelasan Ulama Muktabar
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
            Catatan Editorial
          </span>
        );
    }
  };

  // Determine current theme container class
  const themeClass =
    preferences.readerTheme === 'dark'
      ? 'reader-theme-dark'
      : preferences.readerTheme === 'sepia'
      ? 'reader-theme-sepia'
      : 'reader-theme-light';

  return (
    <div className={`min-h-screen ${themeClass} flex flex-col transition-colors duration-200 pb-20`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Reader Control Header */}
      {!isFocusMode && (
        <header className="sticky top-0 z-30 bg-inherit border-b border-black/10 shadow-xs backdrop-blur-md px-4 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
            {/* Left navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-black/5 text-inherit transition"
                title="Kembali ke Daftar Kitab"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTOC(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-semibold transition"
                title="Daftar Isi Bab"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar Isi</span>
              </button>
            </div>

            {/* Center: Book & Chapter indicator */}
            <div className="text-center min-w-0 px-2">
              <h2 className="text-xs font-bold truncate text-inherit">
                {book.titleId}
              </h2>
              <p className="text-[11px] opacity-75 truncate">
                Bab {activeChapter.number}: {activeChapter.titleId}
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowSearchInBook(!showSearchInBook)}
                className={`p-2 rounded-lg transition ${showSearchInBook ? 'bg-amber-400 text-stone-900' : 'hover:bg-black/5 text-inherit'}`}
                title="Cari dalam Bab Ini"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleBookmark()}
                className={`p-2 rounded-lg transition ${isChapterBookmarked ? 'text-amber-600 bg-amber-50' : 'hover:bg-black/5 text-inherit'}`}
                title={isChapterBookmarked ? 'Hapus Penanda Bab' : 'Tandai Bab Ini'}
              >
                {isChapterBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <BookmarkIcon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-black/5 text-inherit transition"
                title="Pengaturan Tampilan & Huruf"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFocusMode(true)}
                className="p-2 rounded-lg hover:bg-black/5 text-inherit transition hidden sm:inline-flex"
                title="Mode Fokus Membaca"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search within book dropdown bar */}
          {showSearchInBook && (
            <div className="max-w-5xl mx-auto pt-2 pb-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInBookQuery}
                  onChange={(e) => setSearchInBookQuery(e.target.value)}
                  placeholder="Cari lafaz Arab atau terjemahan dalam bab ini..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-black/5 border border-black/10 text-xs focus:outline-hidden focus:border-emerald-600"
                />
                {searchInBookQuery && (
                  <button
                    onClick={() => setSearchInBookQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Exit focus mode floating button */}
      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 text-stone-100 text-xs font-semibold shadow-lg hover:bg-stone-950 transition active:scale-95 backdrop-blur-md"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Keluar Mode Fokus</span>
        </button>
      )}

      {/* Settings Dialog Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white text-stone-900 p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-700" />
                Pengaturan Membaca
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tema Latar Belakang */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Tema Warna Kertas</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdatePreferences({ readerTheme: 'light' })}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                    preferences.readerTheme === 'light'
                      ? 'border-emerald-600 ring-2 ring-emerald-600/30 font-bold bg-white text-stone-900'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  Terang
                </button>
                <button
                  onClick={() => onUpdatePreferences({ readerTheme: 'sepia' })}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                    preferences.readerTheme === 'sepia'
                      ? 'border-amber-700 ring-2 ring-amber-600/30 font-bold bg-[#F8F4EA] text-[#382E22]'
                      : 'border-amber-200 bg-[#F8F4EA] text-[#382E22]'
                  }`}
                >
                  Klasik Sepia
                </button>
                <button
                  onClick={() => onUpdatePreferences({ readerTheme: 'dark' })}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                    preferences.readerTheme === 'dark'
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 font-bold bg-[#0F172A] text-white'
                      : 'border-slate-700 bg-[#0F172A] text-white'
                  }`}
                >
                  Malam Gelap
                </button>
              </div>
            </div>

            {/* Mode Tampilan Teks */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Format Bahasa</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => onUpdatePreferences({ bilingualMode: 'bilingual' })}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    preferences.bilingualMode === 'bilingual' ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-900' : 'border-stone-200'
                  }`}
                >
                  Arab & Indo
                </button>
                <button
                  onClick={() => onUpdatePreferences({ bilingualMode: 'arabic-only' })}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    preferences.bilingualMode === 'arabic-only' ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-900' : 'border-stone-200'
                  }`}
                >
                  Hanya Arab
                </button>
                <button
                  onClick={() => onUpdatePreferences({ bilingualMode: 'translation-only' })}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    preferences.bilingualMode === 'translation-only' ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-900' : 'border-stone-200'
                  }`}
                >
                  Hanya Terjemah
                </button>
              </div>
            </div>

            {/* Ukuran Huruf Arab */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Ukuran Teks Arab</span>
                <span className="text-stone-500 font-mono">{preferences.readerArabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="40"
                step="2"
                value={preferences.readerArabicFontSize}
                onChange={(e) => onUpdatePreferences({ readerArabicFontSize: Number(e.target.value) })}
                className="w-full accent-emerald-700"
              />
            </div>

            {/* Ukuran Huruf Terjemahan */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Ukuran Huruf Terjemahan</span>
                <span className="text-stone-500 font-mono">{preferences.readerFontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={preferences.readerFontSize}
                onChange={(e) => onUpdatePreferences({ readerFontSize: Number(e.target.value) })}
                className="w-full accent-emerald-700"
              />
            </div>

            {/* Harakat Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-stone-700">Tampilkan Harakat / Syakal</span>
              <button
                onClick={() => onUpdatePreferences({ showHarakat: !preferences.showHarakat })}
                className={`w-11 h-6 rounded-full transition relative ${
                  preferences.showHarakat ? 'bg-emerald-700' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.showHarakat ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-800 text-amber-100 font-semibold text-xs hover:bg-emerald-900 transition"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* Table of Contents Drawer */}
      {showTOC && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white text-stone-900 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Daftar Isi Kitab
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate max-w-xs">{book.titleId}</p>
                </div>
                <button
                  onClick={() => setShowTOC(false)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-800 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                {book.chapters.map((chap, idx) => {
                  const isCurrent = idx === activeChapterIndex;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setShowTOC(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-900 text-amber-200 font-semibold shadow-xs'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                          Bab {chap.number}
                        </span>
                        <p className="text-xs truncate">{chap.titleId}</p>
                      </div>
                      <span className="font-arabic text-xs opacity-75 shrink-0" dir="rtl">
                        {chap.titleAr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 text-center">
              <button
                onClick={() => setShowTOC(false)}
                className="w-full py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-xs font-semibold"
              >
                Tutup Daftar Isi
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowTOC(false)} />
        </div>
      )}

      {/* Main Content Reading Canvas */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Chapter Header Card */}
        <section className="text-center py-6 border-b border-black/10 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {book.titleId} · Bab {activeChapter.number}
          </span>
          <h1 className="font-arabic text-2xl sm:text-3xl font-bold leading-relaxed pt-2" dir="rtl">
            {activeChapter.titleAr}
          </h1>
          <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-800">
            {activeChapter.titleId}
          </h2>
        </section>

        {/* Global Book Audio Player Banner (if active audio) */}
        {playingAudioUrl && (
          <div className="sticky top-14 z-20 rounded-xl bg-emerald-950 text-amber-100 p-3 shadow-lg border border-emerald-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => handleTogglePlayAudio(playingAudioUrl)}
                className="p-2 rounded-full bg-amber-400 text-emerald-950 hover:bg-amber-300 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="text-xs truncate">
                <p className="font-semibold text-amber-300 truncate">Memutar Tilawah Ayat</p>
                <p className="text-[10px] text-emerald-300">Qari: Syaikh Mishary Rashid Alafasy</p>
              </div>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1.5">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    playbackSpeed === speed
                      ? 'bg-amber-400 text-emerald-950 font-bold'
                      : 'bg-emerald-900 text-emerald-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime = 0;
                }}
                className="p-1 rounded text-emerald-300 hover:text-white"
                title="Ulangi dari Awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Sections Listing */}
        <div className="space-y-6">
          {displayedSections.map((section) => {
            const hasAudio = !!section.audioUrl;
            const isPlayingThis = playingAudioUrl === section.audioUrl && isPlaying;
            const isCopied = copiedId === section.id;
            const isItemBookmarked = storage.isBookmarked(book.id, activeChapter.id, section.id);

            const displayArabic = preferences.showHarakat ? section.contentAr : removeHarakat(section.contentAr);

            return (
              <article
                key={section.id}
                className="reader-card rounded-2xl border border-black/10 p-5 sm:p-7 shadow-xs space-y-5 transition-shadow hover:shadow-md"
              >
                {/* Section Top Header: Classification and actions */}
                <div className="flex items-center justify-between pb-3 border-b border-black/5 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold opacity-60">
                      #{section.number}
                    </span>
                    {renderClassificationBadge(section.classification)}
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {/* Audio Button */}
                    {hasAudio ? (
                      <button
                        onClick={() => handleTogglePlayAudio(section.audioUrl!)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          isPlayingThis
                            ? 'bg-emerald-700 text-amber-200'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        title="Dengarkan Tilawah"
                      >
                        {isPlayingThis ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span className="hidden sm:inline">Audio Tilawah</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic hidden sm:inline" title="Audio belum tersedia dari rekaman resmi yang terverifikasi">
                        Audio belum tersedia
                      </span>
                    )}

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(section)}
                      className={`p-1.5 rounded-md hover:bg-black/5 transition ${isItemBookmarked ? 'text-amber-600' : 'opacity-60'}`}
                      title="Tandai Bagian Ini"
                    >
                      {isItemBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <BookmarkIcon className="w-4 h-4" />}
                    </button>

                    {/* Catatan Pribadi */}
                    <button
                      onClick={() => handleOpenNoteModal(section)}
                      className="p-1.5 rounded-md hover:bg-black/5 opacity-60 hover:opacity-100 transition"
                      title="Tambah Catatan Pribadi"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>

                    {/* Copy with attribution */}
                    <button
                      onClick={() => handleCopySection(section)}
                      className="p-1.5 rounded-md hover:bg-black/5 opacity-60 hover:opacity-100 transition"
                      title="Salin Teks beserta Sumber"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Text Display */}
                {preferences.bilingualMode !== 'translation-only' && (
                  <div
                    className="arabic-text font-arabic"
                    style={{
                      fontSize: `${preferences.readerArabicFontSize}px`,
                      lineHeight: preferences.readerLineHeight,
                    }}
                  >
                    {displayArabic}
                  </div>
                )}

                {/* Indonesian Translation */}
                {preferences.bilingualMode !== 'arabic-only' && (
                  <div
                    className="font-sans leading-relaxed opacity-90 border-t border-black/5 pt-3"
                    style={{ fontSize: `${preferences.readerFontSize}px` }}
                  >
                    {section.contentId}
                  </div>
                )}

                {/* Takhrij / Sanad / Perawi info card */}
                {section.takhrij && (
                  <div className="rounded-xl bg-amber-50/70 text-amber-950 border border-amber-200/80 p-3.5 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-amber-900">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        Takhrij & Status Riwayat:
                      </span>
                      <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px]">
                        {section.takhrij.grade}
                      </span>
                    </div>
                    <p><strong>Ulama Penghimpun:</strong> {section.takhrij.scholars}</p>
                    {section.takhrij.rawi && <p><strong>Perawi Utama:</strong> {section.takhrij.rawi}</p>}
                    <p><strong>Nomor Referensi:</strong> {section.takhrij.referenceNumber}</p>
                    {section.takhrij.editionNote && (
                      <p className="text-[11px] text-amber-800/80 italic">{section.takhrij.editionNote}</p>
                    )}
                  </div>
                )}

                {/* Tafsir or Scholarly notes */}
                {section.tafsirReference && (
                  <div className="rounded-xl bg-emerald-50/70 text-emerald-950 border border-emerald-200/80 p-3.5 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      Penjelasan & Tafsir Muktabar:
                    </span>
                    <p className="leading-relaxed opacity-90">{section.tafsirReference}</p>
                  </div>
                )}

                {section.scholarlyNotes && (
                  <div className="rounded-xl bg-stone-100/80 text-stone-900 border border-stone-200 p-3.5 text-xs space-y-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-stone-600" />
                      Faidah & Catatan Ulama:
                    </span>
                    <p className="leading-relaxed opacity-90">{section.scholarlyNotes}</p>
                  </div>
                )}
              </article>
            );
          })}

          {displayedSections.length === 0 && (
            <div className="text-center py-12 p-6 rounded-2xl border border-black/10">
              <Search className="w-8 h-8 opacity-40 mx-auto mb-2" />
              <p className="text-xs opacity-70">
                Tidak ada teks yang cocok dengan kata kunci "{searchInBookQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Chapter Navigation Footer (Prev & Next Chapter) */}
        <nav className="pt-8 pb-12 border-t border-black/10 flex items-center justify-between gap-4">
          {activeChapterIndex > 0 ? (
            <button
              onClick={() => {
                setActiveChapterIndex(activeChapterIndex - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bab Sebelumnya</span>
            </button>
          ) : (
            <div />
          )}

          <div className="text-center text-xs opacity-60">
            Bab {activeChapterIndex + 1} dari {book.chapters.length}
          </div>

          {activeChapterIndex < book.chapters.length - 1 ? (
            <button
              onClick={() => {
                setActiveChapterIndex(activeChapterIndex + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold transition shadow-xs active:scale-95"
            >
              <span>Bab Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-amber-100 text-xs font-semibold transition"
            >
              <span>Selesai Membaca Kitab</span>
            </button>
          )}
        </nav>
      </main>

      {/* Note Taking Modal */}
      {activeNoteSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-700" />
                Tambah Catatan Pribadi
              </h3>
              <button
                onClick={() => setActiveNoteSection(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 italic">
              "{activeNoteSection.contentId.slice(0, 150)}..."
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Catatan / Pemahaman Anda:
              </label>
              <textarea
                value={noteInputText}
                onChange={(e) => setNoteInputText(e.target.value)}
                placeholder="Tuliskan faidah ilmiah, renungan, atau catatan pelajaran dari teks ini..."
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveNoteSection(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteInputText.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold disabled:opacity-50"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
