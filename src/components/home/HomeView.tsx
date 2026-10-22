import React from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  Flame,
  CheckCircle2,
  FileText,
  Compass,
  User,
  BookA,
  Printer,
  ChevronRight
} from 'lucide-react';
import { Book, ReadingProgress, UserPreferences } from '../../types';
import { CURRICULUM_BRANCHES } from '../../data/curriculum';

interface HomeViewProps {
  books: Book[];
  readingHistory: ReadingProgress[];
  preferences: UserPreferences;
  onOpenBook: (bookId: string, chapterId?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenCategory: (category: string) => void;
  onOpenAbout: () => void;
  onOpenGlossary: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  readingHistory,
  preferences,
  onOpenBook,
  onNavigateTab,
  onOpenSearch,
  onOpenCategory,
  onOpenAbout,
  onOpenGlossary,
}) => {
  const latestRead = readingHistory[0];
  const latestBook = latestRead ? books.find((b) => b.id === latestRead.bookId) : null;

  const featuredQuote = {
    arabic: 'مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الْجَنَّةِ',
    indonesian: 'Barangsiapa menempuh suatu jalan untuk mencari ilmu (syar\'i), niscaya Allah mudahkan baginya dengannya jalan menuju surga.',
    source: 'Shahih Muslim no. 2699',
    rawi: 'Abu Hurairah radhiyallahu \'anhu',
    grade: 'Shahih (Muttafaqun \'Alaih)',
    kitab: 'Kitabudz Dzikr wad Du\'a wat Tawbah wal Istighfar',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#033B2B] to-[#02241B] text-amber-50 p-6 sm:p-10 shadow-2xl border border-emerald-700/60">
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
            <span>المَوْسُوعَةُ الإِسْلَامِيَّةُ الشَّامِلَةُ · Ensiklopedia Kaffah & Akademi Syar'i</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-snug">
            Al-Maktabah Al-Islamiyyah
          </h1>
          <p className="font-arabic text-xl sm:text-2xl text-emerald-200/95 leading-relaxed" dir="rtl">
            مَنْصَّةُ العُلُومِ الشَّرْعِيَّةِ وَالمَكْتَبَةِ الإِسْلَامِيَّةِ لِأَهْلِ السُّنَّةِ وَالجَمَاعَةِ
          </p>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans max-w-2xl">
            Pusat rujukan Islam komprehensif yang menghimpun <strong>450 pokok pembahasan dalam 9 cabang ilmu</strong>, ensiklopedia syariat kaffah 12 pilar, perpustakaan manuskrip berharakat, dan asisten AI penyusun naskah khutbah bermutu tinggi.
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
                  Cari kitab, surah, nomor hadis, perawi, atau 450 topik kurikulum...
                </span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md">
                Pencarian Ilmiah
              </span>
            </button>
          </div>

          {/* Core Feature Access Buttons */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('khutbah')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold shadow-md hover:from-amber-300 hover:to-amber-400 transition active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Khutbah Studio AI</span>
            </button>
            <button
              onClick={() => onNavigateTab('academy')}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-amber-200 font-semibold transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Akademi 450 Topik</span>
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-amber-200 font-semibold transition flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Ensiklopedia Kaffah</span>
            </button>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-700/40 text-amber-100 font-medium transition"
            >
              Koleksi Kitab
            </button>
            <button
              onClick={onOpenGlossary}
              className="px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-700/40 text-amber-100 font-medium transition flex items-center gap-1"
            >
              <BookA className="w-3.5 h-3.5 text-amber-300" />
              <span>Kamus Istilah</span>
            </button>
          </div>
        </div>
      </section>

      {/* SPECIAL FEATURE BANNER: Khutbah Studio AI */}
      <section className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-emerald-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
              Fitur Baru: Khutbah Studio AI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Susun Naskah Khutbah Jumat Dua Khutbah & Tausiyah Ilmiah
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Dilengkapi teks Arab berharakat, terjemahan, wasiat takwa, verifikasi takhrij dalil, format siap cetak/PDF, dan pengingat amanah ilmiah bagi para khatib dan dai.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('khutbah')}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <span>Buka Studio Khutbah</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* AKADEMI 9 CABANG ILMU (450 POKOK PEMBAHASAN) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              Kurikulum 9 Cabang Ilmu (450 Pokok Pembahasan)
            </h2>
            <p className="text-xs text-stone-500">
              Setiap cabang memuat tepat 50 pokok pembahasan lengkap dengan dalil, rujukan kitab, dan kuis.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('academy')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Buka Seluruh Kurikulum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_BRANCHES.map((b) => (
            <div
              key={b.id}
              onClick={() => onNavigateTab('academy')}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-700/60 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    50 Topik
                  </span>
                  <span className="font-arabic text-sm text-stone-400 group-hover:text-emerald-800 transition" dir="rtl">
                    {b.nameAr}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-emerald-900">
                  {b.name}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Pelajari 50 Topik</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kutipan Hadits Pilihan Hari Ini */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
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
        <section className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <span>Buka Bacaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Koleksi Kitab Klasik Pilihan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              Perpustakaan Kitab Rujukan Digital
            </h2>
            <p className="text-xs text-stone-500">
              Mushaf Al-Qur'an, Hadits Kutubus Sittah, Fikih 4 Mazhab, dan Risalah Aqidah.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Buka Katalog Kitab
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-700/50 hover:shadow-md transition flex flex-col justify-between"
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
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold rounded-lg shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka Kitab</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section XIV: Identitas Pembuat Resmi Footer */}
      <footer className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs text-xs text-stone-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h4 className="font-serif font-bold text-base text-stone-900">
              Al-Maktabah Al-Islamiyyah
            </h4>
            <p className="text-xs text-stone-500">
              المَوْسُوعَةُ الإِسْلَامِيَّةُ الشَّامِلَةُ وَأَكَادِيمِيَّةُ العُلُومِ الشَّرْعِيَّةِ
            </p>
          </div>
          <button
            onClick={onOpenAbout}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition self-start sm:self-auto"
          >
            Tentang Pengembang & Aplikasi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px] block">
              Identitas Pembuat (Developer Identity):
            </span>
            <p><strong>Nama Lengkap Pengembang:</strong> Jundi Abdul Syahid, S.Pd.</p>
            <p><strong>Identitas Kreator:</strong> Orang Dalam Genetik Jawa</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
              Visi Platform:
            </span>
            <p className="text-stone-600">
              Perpustakaan digital dan platform pembelajaran Islam yang dikembangkan untuk memudahkan penelusuran kitab, dalil, dan khazanah keilmuan Islam berlandaskan Al-Qur'an dan As-Sunnah.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-stone-400">
          © 2026 Al-Maktabah Al-Islamiyyah. Seluruh kutipan Al-Qur'an dan hadits dijaga keasliannya berlandaskan amanah ilmiah.
        </div>
      </footer>
    </div>
  );
};
