import React from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  GraduationCap, 
  Bookmark, 
  Layers, 
  Flame,
  CheckCircle2,
  FileText,
  Compass
} from 'lucide-react';
import { Book, ReadingProgress, UserPreferences } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HomeViewProps {
  books: Book[];
  readingHistory: ReadingProgress[];
  preferences: UserPreferences;
  onOpenBook: (bookId: string, chapterId?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenCategory: (category: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  readingHistory,
  preferences,
  onOpenBook,
  onNavigateTab,
  onOpenSearch,
  onOpenCategory,
}) => {
  const latestRead = readingHistory[0];
  const latestBook = latestRead ? books.find((b) => b.id === latestRead.bookId) : null;

  // Selected featured quote of the day with complete verification metadata
  const featuredQuote = {
    arabic: 'مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الْجَنَّةِ',
    indonesian: 'Barangsiapa menempuh suatu jalan untuk mencari ilmu (syar\'i), niscaya Allah mudahkan baginya dengannya jalan menuju surga.',
    source: 'Shahih Muslim no. 2699',
    rawi: 'Abu Hurairah radhiyallahu \'anhu',
    grade: 'Shahih (Muttafaqun \'Alaih)',
    kitab: 'Kitabudz Dzikr wad Du\'a wat Tawbah wal Istighfar',
  };

  const categories = [
    {
      id: 'quran',
      title: 'Al-Qur\'an & Tafsir',
      titleAr: 'القرآن والتفسير',
      desc: 'Mushaf Rasm Utsmani, Tafsir Ibnu Katsir, Tafsir As-Sa\'di & Asbabun Nuzul',
      color: 'from-emerald-700 to-emerald-900',
      icon: BookOpen,
      count: 1,
    },
    {
      id: 'hadits',
      title: 'Hadits & Kutubus Sittah',
      titleAr: 'الحديث وعلومه',
      desc: 'Al-Arba\'in An-Nawawiyyah, Shahih Bukhari, Muslim & Bulughul Maram',
      color: 'from-amber-800 to-amber-950',
      icon: Sparkles,
      count: 2,
    },
    {
      id: 'akidah',
      title: 'Akidah Ahlusunah',
      titleAr: 'العقيدة السلفية',
      desc: 'Al-Ushul Ats-Tsalatsah, Al-Aqidah Al-Wasithiyyah & Ushuluddin',
      color: 'from-teal-800 to-teal-950',
      icon: ShieldCheck,
      count: 2,
    },
    {
      id: 'fikih',
      title: 'Fikih Empat Mazhab',
      titleAr: 'الفقه المقارن',
      desc: 'Komparasi mu\'tamad Hanafi, Maliki, Syafi\'i, dan Hanbali',
      color: 'from-slate-800 to-slate-950',
      icon: Layers,
      count: 1,
    },
    {
      id: 'sirah',
      title: 'Sirah Nabawiyyah',
      titleAr: 'السيرة والتاريخ',
      desc: 'Ar-Rahiq Al-Makhtum, Tarikh Khulafaur Rasyidin & Sahabat',
      color: 'from-stone-800 to-stone-950',
      icon: Compass,
      count: 1,
    },
    {
      id: 'bahasa_arab',
      title: 'Perangkat Bahasa Arab',
      titleAr: 'اللغة والعلوم',
      desc: 'Kaidah Nahwu, Sharaf, Balaghah & Musthalah Hadits',
      color: 'from-emerald-800 to-stone-900',
      icon: FileText,
      count: 1,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#043E2F] to-[#02241B] text-amber-50 p-6 sm:p-10 shadow-xl border border-emerald-700/50">
        {/* Subtle geometric backdrop pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg width="600" height="600" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <rect x="50" y="50" width="100" height="100" strokeWidth="1" transform="rotate(0 100 100)" />
            <rect x="50" y="50" width="100" height="100" strokeWidth="1" transform="rotate(45 100 100)" />
            <circle cx="100" cy="100" r="70" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="90" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-[11px] font-medium text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Naskah Muktabar & Terverifikasi Ilmiah</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-snug">
            Selamat datang di Al-Maktabah Al-Islamiyyah
          </h1>
          <p className="font-arabic text-xl sm:text-2xl text-emerald-200/95 leading-relaxed" dir="rtl">
            مَنْصَّةُ الْمَكْتَبَةِ الإِسْلَامِيَّةِ الشَّامِلَةِ لِأَهْلِ السُّنَّةِ وَالْجَمَاعَةِ
          </p>

          <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-sans max-w-2xl">
            Perpustakaan digital referensi Islam Ahlusunah wal Jama'ah berlandaskan Al-Qur'an, Sunnah Rasulullah ﷺ yang shahih, pemahaman generasi salafush shalih, serta penelaahan ulama muktabar.
          </p>

          {/* Quick Search Input */}
          <div className="pt-2">
            <button
              onClick={onOpenSearch}
              className="w-full max-w-xl flex items-center justify-between px-4 py-3 bg-white text-stone-700 rounded-xl shadow-lg border border-amber-200/60 hover:bg-stone-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition" />
                <span className="text-xs sm:text-sm text-stone-500">
                  Cari kitab, surah, nomor hadis, perawi, atau tema ilmiah...
                </span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md">
                Buka Pencarian
              </span>
            </button>
          </div>

          {/* Quick Access Action Chips */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onOpenBook('mushaf-al-quran')}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/40 text-amber-200 transition"
            >
              Al-Qur'anul Karim
            </button>
            <button
              onClick={() => onOpenBook('arbain-an-nawawiyyah')}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/40 text-amber-200 transition"
            >
              Arba'in An-Nawawiyyah
            </button>
            <button
              onClick={() => onOpenBook('al-ushul-ats-tsalatsah')}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/40 text-amber-200 transition"
            >
              Al-Ushul Ats-Tsalatsah
            </button>
            <button
              onClick={() => onOpenBook('fiqih-empat-mazhab')}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/40 text-amber-200 transition"
            >
              Fikih 4 Mazhab
            </button>
            <button
              onClick={() => onNavigateTab('dalil')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 transition font-medium"
            >
              Telusuri Dalil Tematik
            </button>
          </div>
        </div>
      </section>

      {/* Kutipan Hadits Pilihan Hari Ini */}
      <section className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Kutipan Pilihan & Takhrij
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {featuredQuote.grade}
          </span>
        </div>

        <div className="space-y-4">
          <p className="font-arabic text-xl sm:text-2xl text-stone-900 leading-relaxed text-right" dir="rtl">
            {featuredQuote.arabic}
          </p>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed italic">
            "{featuredQuote.indonesian}"
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 border-t border-stone-100">
            <span><strong>Sumber:</strong> {featuredQuote.source}</span>
            <span>·</span>
            <span><strong>Perawi:</strong> {featuredQuote.rawi}</span>
            <span>·</span>
            <span><strong>Kitab:</strong> {featuredQuote.kitab}</span>
          </div>
        </div>
      </section>

      {/* Terakhir Dibaca (Resume Reading Card) */}
      {latestBook && latestRead && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-xl border border-amber-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Lanjutkan Membaca</span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
              {latestBook.titleId}
            </h3>
            <p className="text-xs text-stone-600">
              Bab: <span className="font-medium text-amber-950">{latestRead.lastChapterTitle}</span>
            </p>
          </div>
          <button
            onClick={() => onOpenBook(latestBook.id, latestRead.lastChapterId)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <span>Buka Bacaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Kategori Utama Perpustakaan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              Kategori Ilmu Keislaman
            </h2>
            <p className="text-xs text-stone-500">
              Penataan sistematis cabang ilmu syariah dari sumber-sumber muktabar
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Lihat Semua Kitab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onOpenCategory(cat.id)}
                className="group relative text-left bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-600/60 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-200 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-arabic text-sm text-stone-400 group-hover:text-emerald-800 transition" dir="rtl">
                      {cat.titleAr}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-emerald-900 transition">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-medium">
                  <span>Jelajahi Kitab</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Koleksi Kitab Pilihan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              Koleksi Kitab Rujukan
            </h2>
            <p className="text-xs text-stone-500">
              Naskah pilihan dengan teks berharakat dan terjemahan ilmiah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-700/50 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {book.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    {book.authorDeathYear}
                  </span>
                </div>

                <div>
                  <h4 className="font-arabic text-lg text-emerald-950 font-semibold leading-relaxed" dir="rtl">
                    {book.titleAr}
                  </h4>
                  <h3 className="font-serif font-bold text-base text-stone-900 mt-1">
                    {book.titleId}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Karya: <span className="font-medium text-stone-800">{book.author}</span>
                  </p>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  {book.chaptersCount} Bab Pokok
                </span>
                <button
                  onClick={() => onOpenBook(book.id)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold rounded-lg shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca Kitab</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Belajar & Pembelajaran Interaktif Banner */}
      <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
              Program Belajar Bertingkat
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Belajar Islam Sistematis dari Tingkat Pemula hingga Lanjutan
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Ikuti modul tersusun dengan dalil shahih, kartu hafalan musthalah syar'i, kuis evaluasi pemahaman, serta pelacakan target belajar harian Anda.
          </p>

          <div className="pt-1 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Target Harian: {preferences.dailyGoalMinutes} Menit</span>
            </div>
            <span>·</span>
            <span className="text-stone-400">
              {preferences.completedLessons.length} Materi Diselesaikan
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('learn')}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Buka Modul Belajar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
