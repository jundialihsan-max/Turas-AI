import { Bookmark, UserNote, ReadingProgress, UserPreferences, Book, DalilItem } from '../types';

const STORAGE_KEYS = {
  BOOKMARKS: 'maktabah_bookmarks_v1',
  NOTES: 'maktabah_notes_v1',
  HISTORY: 'maktabah_history_v1',
  PREFERENCES: 'maktabah_user_prefs_v1',
  CUSTOM_BOOKS: 'maktabah_custom_books_v1',
  CUSTOM_DALILS: 'maktabah_custom_dalils_v1',
};

export const defaultPreferences: UserPreferences = {
  readerFontSize: 16,
  readerArabicFontSize: 26,
  readerLineHeight: 2.2,
  readerTheme: 'sepia', // classic warm parchment feel
  showHarakat: true,
  bilingualMode: 'bilingual',
  dailyGoalMinutes: 15,
  userName: 'Penuntut Ilmu',
  dailyStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  todayMinutes: 5,
  completedLessons: [],
  completedModules: [],
};

// Safe LocalStorage helpers
export const storage = {
  getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const list = storage.getBookmarks();
    const existingIndex = list.findIndex(
      (b) => b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId && b.sectionId === bookmark.sectionId
    );

    if (existingIndex >= 0) {
      return list[existingIndex];
    }

    const newItem: Bookmark = {
      ...bookmark,
      id: 'bm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };

    const updated = [newItem, ...list];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return newItem;
  },

  removeBookmark(id: string) {
    const list = storage.getBookmarks().filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
  },

  isBookmarked(bookId: string, chapterId: string, sectionId?: string): boolean {
    return storage.getBookmarks().some(
      (b) => b.bookId === bookId && b.chapterId === chapterId && (sectionId ? b.sectionId === sectionId : true)
    );
  },

  getNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveNote(note: Omit<UserNote, 'id' | 'updatedAt'> & { id?: string }): UserNote {
    const list = storage.getNotes();
    const now = Date.now();
    let updated: UserNote[];

    if (note.id) {
      updated = list.map((n) => (n.id === note.id ? { ...n, ...note, updatedAt: now } : n));
    } else {
      const newItem: UserNote = {
        ...note,
        id: 'note_' + now + '_' + Math.random().toString(36).substring(2, 6),
        updatedAt: now,
      };
      updated = [newItem, ...list];
    }

    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    return updated[0];
  },

  deleteNote(id: string) {
    const list = storage.getNotes().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(list));
  },

  getReadingHistory(): ReadingProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveReadingProgress(item: ReadingProgress) {
    const list = storage.getReadingHistory().filter((h) => h.bookId !== item.bookId);
    const updated = [{ ...item, updatedAt: Date.now() }, ...list];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated.slice(0, 15)));
  },

  getUserPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return defaultPreferences;
      return { ...defaultPreferences, ...JSON.parse(data) };
    } catch {
      return defaultPreferences;
    }
  },

  saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = storage.getUserPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  },

  markLessonComplete(lessonId: string, moduleId?: string): UserPreferences {
    const current = storage.getUserPreferences();
    const completed = new Set(current.completedLessons);
    completed.add(lessonId);

    const completedModules = new Set(current.completedModules);
    if (moduleId) {
      completedModules.add(moduleId);
    }

    return storage.saveUserPreferences({
      completedLessons: Array.from(completed),
      completedModules: Array.from(completedModules),
      todayMinutes: current.todayMinutes + 10,
    });
  },

  getCustomBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOOKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomBook(book: Book) {
    const list = storage.getCustomBooks().filter((b) => b.id !== book.id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BOOKS, JSON.stringify([book, ...list]));
  },

  getCustomDalils(): DalilItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_DALILS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomDalil(dalil: DalilItem) {
    const list = storage.getCustomDalils().filter((d) => d.id !== dalil.id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DALILS, JSON.stringify([dalil, ...list]));
  },

  exportBackupJson(): string {
    const exportData = {
      appName: 'Al-Maktabah Al-Islamiyyah',
      exportedAt: new Date().toISOString(),
      bookmarks: storage.getBookmarks(),
      notes: storage.getNotes(),
      history: storage.getReadingHistory(),
      preferences: storage.getUserPreferences(),
      customBooks: storage.getCustomBooks(),
      customDalils: storage.getCustomDalils(),
    };
    return JSON.stringify(exportData, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
      if (parsed.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(parsed.notes));
      if (parsed.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      if (parsed.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(parsed.preferences));
      if (parsed.customBooks) localStorage.setItem(STORAGE_KEYS.CUSTOM_BOOKS, JSON.stringify(parsed.customBooks));
      if (parsed.customDalils) localStorage.setItem(STORAGE_KEYS.CUSTOM_DALILS, JSON.stringify(parsed.customDalils));
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON:', e);
      return false;
    }
  },
};
