import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Compass, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  FileText 
} from 'lucide-react';
import { Book, DalilItem } from '../../types';
import { removeHarakat } from '../../utils/arabic';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  dalils: DalilItem[];
  onOpenBook: (bookId: string, chapterId?: string) => void;
  onOpenDalilTab: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  books,
  dalils,
  onOpenBook,
  onOpenDalilTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = removeHarakat(query.trim().toLowerCase());

  // Search Results grouping
  const matchedBooks: Book[] = [];
  const matchedSections: { book: Book; chapterId: string; chapterTitle: string; sectionId: string; ar: string; idText: string; ref: string }[] = [];
  const matchedDalils: DalilItem[] = [];

  if (cleanQuery.length >= 2) {
    // 1. Search in Books metadata
    books.forEach((b) => {
      const matchTitle = b.titleId.toLowerCase().includes(cleanQuery);
      const matchAr = removeHarakat(b.titleAr.toLowerCase()).includes(cleanQuery);
      const matchAuthor = b.author.toLowerCase().includes(cleanQuery);
      const matchCategory = b.categoryLabel.toLowerCase().includes(cleanQuery);

      if (matchTitle || matchAr || matchAuthor || matchCategory) {
        matchedBooks.push(b);
      }

      // 2. Search inside book chapters and sections
      b.chapters.forEach((ch) => {
        ch.sections.forEach((s) => {
          const matchSecAr = removeHarakat(s.contentAr.toLowerCase()).includes(cleanQuery);
          const matchSecId = s.contentId.toLowerCase().includes(cleanQuery);
          const matchTakhrij = s.takhrij?.referenceNumber.toLowerCase().includes(cleanQuery) ||
            s.takhrij?.rawi?.toLowerCase().includes(cleanQuery);
          const matchTafsir = s.tafsirReference?.toLowerCase().includes(cleanQuery);

          if (matchSecAr || matchSecId || matchTakhrij || matchTafsir) {
            matchedSections.push({
              book: b,
              chapterId: ch.id,
              chapterTitle: ch.titleId,
              sectionId: s.id,
              ar: s.contentAr,
              idText: s.contentId,
              ref: s.takhrij?.referenceNumber || `${b.titleId} - ${ch.titleId}`,
            });
          }
        });
      });
    });

    // 3. Search in thematic dalils
    dalils.forEach((d) => {
      const matchDalilAr = removeHarakat(d.arabic.toLowerCase()).includes(cleanQuery);
      const matchDalilId = d.indonesian.toLowerCase().includes(cleanQuery);
      const matchRef = d.numberOrRef.toLowerCase().includes(cleanQuery);
      const matchTheme = d.theme.toLowerCase().includes(cleanQuery);
      const matchRawi = d.rawi?.toLowerCase().includes(cleanQuery);

      if (matchDalilAr || matchDalilId || matchRef || matchTheme || matchRawi) {
        matchedDalils.push(d);
      }
    });
  }

  const totalResults = matchedBooks.length + matchedSections.length + matchedDalils.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-20 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-emerald-800 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci Arab/Indonesia, nomor hadis, surah, pengarang..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 focus:outline-hidden placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300"
          >
            Tutup (Esc)
          </button>
        </div>

        {/* Quick Search Hints */}
        {cleanQuery.length < 2 && (
          <div className="p-6 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-700">Pencarian Referensi Ilmiah</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Pencarian mendukung lafaz Arab berharakat maupun tanpa harakat, nama perawi (Umar bin Khattab, Abu Hurairah), tema syar'i (Tauhid, Wudhu, Shalat, Niat), atau nomor hadits.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs">
              {['Niat', 'Tauhid', 'Al-Fatihah', 'Wudhu', 'Bid\'ah', 'Bukhari', 'Umar'].map((sug) => (
                <button
                  key={sug}
                  onClick={() => setQuery(sug)}
                  className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {cleanQuery.length >= 2 && (
          <div className="p-4 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Hasil Ditemukan: {totalResults} rujukan</span>
              <span className="text-[11px] font-mono">Pencarian Normalisasi Arab Aktif</span>
            </div>

            {/* 1. Matched Books */}
            {matchedBooks.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                  Kitab & Naskah ({matchedBooks.length})
                </span>
                <div className="space-y-1.5">
                  {matchedBooks.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onClose();
                        onOpenBook(b.id);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-500 transition flex items-center justify-between gap-3 group"
                    >
                      <div>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-950">
                          {b.titleId}
                        </h5>
                        <p className="text-xs text-stone-500">
                          Penulis: {b.author} ({b.authorDeathYear}) · {b.categoryLabel}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Matched Sections / Hadiths / Verses inside Books */}
            {matchedSections.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                  Teks Hadits / Ayat dalam Kitab ({matchedSections.length})
                </span>
                <div className="space-y-2">
                  {matchedSections.slice(0, 10).map((sec, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onClose();
                        onOpenBook(sec.book.id, sec.chapterId);
                      }}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 transition cursor-pointer space-y-2 hover:bg-stone-50/80"
                    >
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-semibold text-emerald-800">
                          {sec.book.titleId} · {sec.chapterTitle}
                        </span>
                        <span className="font-mono text-stone-400">{sec.ref}</span>
                      </div>
                      <p className="font-arabic text-sm text-stone-900 text-right leading-relaxed" dir="rtl">
                        {sec.ar.slice(0, 160)}...
                      </p>
                      <p className="text-xs text-stone-700 italic line-clamp-2">
                        "{sec.idText}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Matched Thematic Dalils */}
            {matchedDalils.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                  Direktori Dalil Tematik ({matchedDalils.length})
                </span>
                <div className="space-y-2">
                  {matchedDalils.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onClose();
                        onOpenDalilTab();
                      }}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-purple-600 transition cursor-pointer space-y-1.5 hover:bg-purple-50/30"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-purple-900">Tema: {d.theme}</span>
                        <span className="text-stone-500">{d.sourceBook}</span>
                      </div>
                      <p className="font-arabic text-sm text-stone-900 text-right" dir="rtl">
                        {d.arabic.slice(0, 140)}...
                      </p>
                      <p className="text-xs text-stone-700 italic line-clamp-2">
                        "{d.indonesian}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs text-stone-600">
                  Tidak ditemukan naskah atau dalil yang cocok dengan "{query}".
                </p>
                <p className="text-[11px] text-stone-400">
                  Pastikan ejaan kata atau coba dengan kata kunci dasar (contoh: "shalat", "tauhid", "sedekah").
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
