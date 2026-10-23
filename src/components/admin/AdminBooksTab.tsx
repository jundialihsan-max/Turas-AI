import React, { useState } from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Book } from '../../types';

interface AdminBooksTabProps {
  books: Book[];
  onOpenBook: (bookId: string) => void;
  onSaveBook: (book: Book) => Promise<void>;
  onDeleteBook: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminBooksTab: React.FC<AdminBooksTabProps> = ({
  books,
  onOpenBook,
  onSaveBook,
  onDeleteBook,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [form, setForm] = useState<Partial<Book>>({
    id: '',
    titleId: '',
    titleAr: '',
    author: '',
    authorDeathYear: 'w. Abad Klasik',
    category: 'hadits',
    categoryLabel: 'Hadits',
    language: 'Arab & Indonesia',
    manuscriptSource: 'Naskah Turats Muktabar',
    publisherEdition: 'Tahqiq Ilmiah',
    completionStatus: 'Lengkap',
    verifiedDate: new Date().toISOString().split('T')[0],
    verifiedBy: 'Jundi Abdul Syahid, S.Pd.',
    description: '',
    chaptersCount: 1,
    audioAvailable: false,
    chapters: [],
  });

  const filtered = books.filter((b) => {
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        b.titleId.toLowerCase().includes(q) ||
        b.titleAr.includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setForm({
      id: 'book_' + Date.now().toString(36),
      titleId: '',
      titleAr: '',
      author: '',
      authorDeathYear: 'w. Abad Klasik',
      category: 'hadits',
      categoryLabel: 'Hadits',
      language: 'Arab & Indonesia',
      manuscriptSource: 'Naskah Turats Muktabar',
      publisherEdition: 'Tahqiq Ilmiah',
      completionStatus: 'Lengkap',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Jundi Abdul Syahid, S.Pd.',
      description: '',
      chaptersCount: 1,
      audioAvailable: false,
      chapters: [
        {
          id: 'chap_1',
          number: 1,
          titleId: 'Bab Pertama',
          titleAr: 'الباب الأول',
          sections: [
            {
              id: 'sec_1',
              number: 1,
              titleId: 'Fasal Pokok',
              titleAr: 'الفصل الأول',
              classification: 'hadits',
              contentAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              contentId: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
            },
          ],
        },
      ],
    });
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Book) => {
    setForm({ ...b });
    setEditingBook(b);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleId?.trim()) return;

    await onSaveBook(form as Book);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            Kelola Perpustakaan Kitab Digital Turats
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar kitab induk, bab, fasal, dan naskah manuskrip yang tersedia untuk pembaca.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center gap-2 shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>+ Tambah Kitab Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul kitab, pengarang, atau judul Arab..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs p-2 rounded-xl border border-stone-300 bg-white"
        >
          <option value="all">Semua Kategori Kitab</option>
          <option value="quran">Al-Qur'an & Tafsir</option>
          <option value="hadits">Kutubus Sittah & Hadits</option>
          <option value="aqidah">Aqidah Salaf</option>
          <option value="fikih">Fikih Mazhab</option>
          <option value="sirah">Sirah Nabawiyyah</option>
        </select>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] uppercase bg-stone-100 px-2 py-0.5 rounded font-bold text-stone-700">
                  {b.category}
                </span>
                <span className="text-[11px] font-mono text-emerald-800 font-bold">
                  {b.chapters?.length || 0} Bab
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">{b.titleId}</h4>
                <p className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
                  {b.titleAr}
                </p>
                <p className="text-xs text-stone-600 mt-1">Oleh: {b.author}</p>
              </div>

              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {b.description}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-emerald-900 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{b.completionStatus || 'Kitab Muktabar'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onOpenBook(b.id)}
                className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
              >
                <span>Buka Reader</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => onDeleteBook(b.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-600"
                  title="Hapus Kitab"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h3 className="font-serif font-bold text-base text-stone-900">
              {editingBook ? `Edit Kitab: ${editingBook.titleId}` : '+ Tambah Kitab Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Judul Kitab (Indonesia) *</label>
                  <input
                    type="text"
                    required
                    value={form.titleId || ''}
                    onChange={(e) => setForm({ ...form, titleId: e.target.value })}
                    placeholder="Shahih Al-Bukhari"
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1 text-right" dir="rtl">
                    Judul Arab Berharakat *
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    required
                    value={form.titleAr || ''}
                    onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                    placeholder="صَحِيحُ البُخَارِيِّ"
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-arabic text-right font-bold text-emerald-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Pengarang (Penulis / Mualif)</label>
                  <input
                    type="text"
                    value={form.author || ''}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Al-Imam Muhammad bin Ismail Al-Bukhari"
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    <option value="hadits">Hadits</option>
                    <option value="quran">Al-Qur'an & Tafsir</option>
                    <option value="aqidah">Aqidah</option>
                    <option value="fikih">Fikih</option>
                    <option value="sirah">Sirah</option>
                    <option value="akhlak">Akhlak & Tazkiyah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deskripsi Ringkas Kitab</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Uraian mengenai metodologi kitab..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-semibold"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-amber-100 font-bold shadow-xs"
                >
                  Simpan Kitab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
