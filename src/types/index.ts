/**
 * Data structures for Al-Maktabah Al-Islamiyyah
 */

export type BookCategory =
  | 'quran'
  | 'hadits'
  | 'akidah'
  | 'fikih'
  | 'akhlak'
  | 'sirah'
  | 'bahasa_arab'
  | 'fatwa';

export type ContentClassification =
  | 'quran'
  | 'hadits'
  | 'atsar'
  | 'penjelasan_ulama'
  | 'perbedaan_mazhab'
  | 'catatan_editorial';

export interface TakhrijInfo {
  grade: 'Shahih' | 'Hasan' | 'Dhaif' | 'Mutawatir';
  scholars: string; // e.g. "Diriwayatkan Al-Bukhari & Muslim, disepakati keshahihannya (Muttafaqun 'Alaih)"
  rawi?: string; // e.g. "Umar bin Al-Khattab radhiyallahu 'anhu"
  referenceNumber: string; // e.g. "HR. Bukhari no. 1, Muslim no. 1907"
  editionNote?: string; // e.g. "Penomoran Fathul Bari"
}

export interface Section {
  id: string;
  number: number;
  titleAr?: string;
  titleId?: string;
  classification: ContentClassification;
  contentAr: string;
  contentId: string;
  takhrij?: TakhrijInfo;
  tafsirReference?: string;
  scholarlyNotes?: string;
  audioUrl?: string; // real audio URL if available or undefined
}

export interface Chapter {
  id: string;
  number: number;
  titleAr: string;
  titleId: string;
  sections: Section[];
}

export interface Book {
  id: string;
  titleAr: string;
  titleId: string;
  author: string;
  authorDeathYear: string; // e.g. "w. 204 H" or "w. 774 H"
  category: BookCategory;
  categoryLabel: string;
  language: string;
  manuscriptSource: string;
  publisherEdition: string;
  completionStatus: 'Lengkap' | 'Seleksi Bab Pokok' | 'Naskah Mu\'tamad' | 'Dalam Proses Digitalisasi';
  verifiedDate: string;
  verifiedBy: string;
  sourceUrl?: string;
  description: string;
  chaptersCount: number;
  audioAvailable: boolean;
  audioUrl?: string;
  chapters: Chapter[];
}

export interface DalilItem {
  id: string;
  theme: string;
  classification: ContentClassification;
  arabic: string;
  indonesian: string;
  sourceBook: string;
  numberOrRef: string;
  takhrijGrade?: 'Shahih' | 'Hasan' | 'Dhaif' | 'Mutawatir';
  takhrijScholar?: string;
  rawi?: string;
  explanation?: string;
  mazhabViews?: {
    hanafi?: string;
    maliki?: string;
    syafii?: string;
    hanbali?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceDalil: string;
}

export interface Flashcard {
  id: string;
  termAr: string;
  termId: string;
  category: string;
  definition: string;
  dalilProof: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  content: string[];
  keyDalil: {
    classification: ContentClassification;
    arabic: string;
    indonesian: string;
    source: string;
  }[];
  summary: string;
  durationMinutes: number;
}

export interface LearningModule {
  id: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan' | 'Kajian Tematik';
  title: string;
  titleAr: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  estimatedHours: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface Bookmark {
  id: string;
  bookId: string;
  bookTitleId: string;
  bookTitleAr: string;
  chapterId: string;
  chapterTitle: string;
  sectionId?: string;
  textSnippet: string;
  createdAt: number;
}

export interface UserNote {
  id: string;
  bookId: string;
  bookTitleId: string;
  chapterId: string;
  chapterTitle: string;
  quoteSnippet: string;
  noteText: string;
  tags: string[];
  updatedAt: number;
}

export interface ReadingProgress {
  bookId: string;
  bookTitle: string;
  lastChapterId: string;
  lastChapterTitle: string;
  progressPercent: number;
  updatedAt: number;
}

export interface UserPreferences {
  readerFontSize: number;
  readerArabicFontSize: number;
  readerLineHeight: number;
  readerTheme: 'light' | 'sepia' | 'dark';
  showHarakat: boolean;
  bilingualMode: 'bilingual' | 'arabic-only' | 'translation-only';
  dailyGoalMinutes: number;
  userName: string;
  dailyStreak: number;
  lastActiveDate: string;
  todayMinutes: number;
  completedLessons: string[]; // lesson ids
  completedModules: string[]; // module ids
}
