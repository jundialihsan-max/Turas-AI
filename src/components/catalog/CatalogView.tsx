import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle, 
  Info, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookMarked
} from 'lucide-react';
import { Book, BookCategory } from '../../types';

interface CatalogViewProps {
  books: Book[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenBook: (bookId: string, chapterId?: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  books,
  selectedCategory,
  onSelectCategory,
  onOpenBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  const categoryFilters: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua Bidang' },
    { id: 'quran', label: 'Al-Qur\'an & Tafsir' },
    { id: 'hadits', label: 'Hadits & Ulumul Hadits' },
    { id: 'akidah', label: 'Akidah Ahlusunah' },
    { id: 'fikih', label: 'Fikih 4 Mazhab' },
    { id: 'sirah', label: 'Sirah & Sejarah' },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      book.titleId.toLowerCase().includes(query) ||
      book.titleAr.includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Catalog Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Katalog Perpustakaan Kitab Islam
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Himpunan kitab muktabar Ahlusunah wal Jama'ah lengkap dengan metadata naskah dan status verifikasi.
            </p>
          </div>

          {/* Search bar inside catalog */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul kitab / ulama..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categoryFilters.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition active:scale-95 ${
                  isActive
                    ? 'bg-emerald-900 text-amber-200 shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:border-emerald-700/60 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="p-5 space-y-3.5">
              {/* Top metadata tags */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {book.categoryLabel}
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {book.authorDeathYear}
                </span>
              </div>

              {/* Arabic & Indonesian Title */}
              <div>
                <h3 className="font-arabic text-xl font-bold text-emerald-950 leading-relaxed text-right" dir="rtl">
                  {book.titleAr}
                </h3>
                <h2 className="font-serif font-bold text-base text-stone-900 mt-1">
                  {book.titleId}
                </h2>
              </div>

              {/* Author & Verification */}
              <div className="text-xs text-stone-600 space-y-1">
                <p>
                  <strong className="text-stone-800">Penulis:</strong> {book.author}
                </p>
                <p className="text-[11px] text-stone-500">
                  <strong>Edisi:</strong> {book.publisherEdition}
                </p>
              </div>

              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {book.description}
              </p>

              {/* Verification status label */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{book.completionStatus}</span>
                </div>
                <button
                  onClick={() => setSelectedBookForDetails(book)}
                  className="text-stone-500 hover:text-stone-800 font-medium underline flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>Metadata</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
                {book.chapters.length} Bab Pokok
              </span>
              <button
                onClick={() => onOpenBook(book.id)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold rounded-lg shadow-xs transition active:scale-95 flex items-center gap-2"
              >
                <span>Buka Bacaan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-semibold text-stone-700">Kitab Tidak Ditemukan</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Tidak ada kitab yang sesuai dengan kata kunci pencarian atau kategori yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Metadata Detail Modal */}
      {selectedBookForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Metadata & Tahqiq Kitab
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                  {selectedBookForDetails.titleId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
                <p>
                  <strong>Judul Asli (Arab):</strong>{' '}
                  <span className="font-arabic text-sm text-emerald-950 font-bold" dir="rtl">
                    {selectedBookForDetails.titleAr}
                  </span>
                </p>
                <p><strong>Pengarang / Mu\'allif:</strong> {selectedBookForDetails.author}</p>
                <p><strong>Tahun Wafat:</strong> {selectedBookForDetails.authorDeathYear}</p>
                <p><strong>Disiplin Ilmu:</strong> {selectedBookForDetails.categoryLabel}</p>
                <p><strong>Bahasa:</strong> {selectedBookForDetails.language}</p>
                <p><strong>Sumber Naskah / Manuskrip:</strong> {selectedBookForDetails.manuscriptSource}</p>
                <p><strong>Edisi / Penerbit:</strong> {selectedBookForDetails.publisherEdition}</p>
                <p><strong>Status Kelengkapan:</strong> {selectedBookForDetails.completionStatus}</p>
                <p><strong>Diverifikasi Oleh:</strong> {selectedBookForDetails.verifiedBy}</p>
                <p><strong>Tanggal Verifikasi:</strong> {selectedBookForDetails.verifiedDate}</p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-800 mb-1">Daftar Bab Tersedia:</h4>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  {selectedBookForDetails.chapters.map((ch) => (
                    <li key={ch.id}>
                      {ch.titleId} <span className="font-arabic text-stone-700">({ch.titleAr})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
                <strong>Prinsip Amanah Ilmiah:</strong> Seluruh naskah yang dimuat adalah naskah asli muktabar yang telah melalui pengecekan sanad dan tahqiq para ulama. Kami tidak memuat teks karangan bebas atau hasil generasi AI sebagai naskah asli kitab.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const bId = selectedBookForDetails.id;
                  setSelectedBookForDetails(null);
                  onOpenBook(bId);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold shadow-xs"
              >
                Buka Kitab Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
