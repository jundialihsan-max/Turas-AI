import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Eye, 
  ShieldAlert, 
  Layers,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { CMSTopic, CMSCategory, ContentStatus } from '../../types/cms';

interface AdminTopicsTabProps {
  topics: CMSTopic[];
  categories: CMSCategory[];
  onOpenEdit: (topic: CMSTopic) => void;
  onOpenNew: () => void;
  onDeleteTopic: (id: string, title: string) => void;
  onBatchDelete: (ids: string[]) => void;
  initialFilter?: string;
}

export const AdminTopicsTab: React.FC<AdminTopicsTabProps> = ({
  topics,
  categories,
  onOpenEdit,
  onOpenNew,
  onDeleteTopic,
  onBatchDelete,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter || 'all');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<{ id: string; title: string } | null>(null);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

  const filteredTopics = topics.filter((t) => {
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.titleAr.includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        (t.systematicExplanation || []).some((p) => p.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedTopicIds.length === filteredTopics.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(filteredTopics.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Terbit & Sahih
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            Draf
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3 h-3" /> Perlu Dicek
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            Dalam Penyusunan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, judul Arab, kata kunci syarah, atau dalil..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
            />
          </div>

          {/* New Topic Button */}
          <button
            onClick={onOpenNew}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>+ Tambah Materi Baru</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
          >
            <option value="all">Semua Kategori Cabang ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-medium"
          >
            <option value="all">Semua Status Konten</option>
            <option value="published">Hanya yang Terbit (Lengkap)</option>
            <option value="in_progress">Dalam Penyusunan</option>
            <option value="draft">Draf Pribadi</option>
            <option value="needs_review">Perlu Ditinjau</option>
          </select>

          {/* Batch Delete Trigger if selected */}
          {selectedTopicIds.length > 0 && (
            <button
              onClick={() => setShowBatchConfirm(true)}
              className="ml-auto px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition animate-fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus {selectedTopicIds.length} Terpilih</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Batch Select All */}
      <div className="flex items-center justify-between px-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-emerald-900"
          >
            {selectedTopicIds.length > 0 && selectedTopicIds.length === filteredTopics.length ? (
              <CheckSquare className="w-4 h-4 text-emerald-800" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
            <span>Pilih Semua ({filteredTopics.length} Materi)</span>
          </button>
        </div>
        <span className="font-mono text-stone-500">
          Menampilkan {filteredTopics.length} dari {topics.length} topik
        </span>
      </div>

      {/* Topics Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold">
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">Judul Pembahasan & Teks Arab</th>
                <th className="p-3 w-40">Kategori & Urutan</th>
                <th className="p-3 w-36">Status Konten</th>
                <th className="p-3 w-28 text-center">Dalil</th>
                <th className="p-3 w-24 text-center">Versi</th>
                <th className="p-3 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTopics.map((t) => {
                const isSelected = selectedTopicIds.includes(t.id);
                const hasQuran = Boolean(t.quranDalil?.arabic);
                const hasHadith = Boolean(t.hadithDalil?.arabic);

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-amber-50/40 transition ${
                      isSelected ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleSelectOne(t.id)}
                        className="text-stone-400 hover:text-emerald-800"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-800" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-3">
                      <div className="font-serif font-bold text-stone-900 hover:text-emerald-900 cursor-pointer" onClick={() => onOpenEdit(t)}>
                        {t.title}
                      </div>
                      <div className="font-arabic text-sm text-emerald-950 font-semibold" dir="rtl">
                        {t.titleAr}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {t.objective}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-stone-800 block">{t.categoryName}</span>
                      <span className="text-[11px] font-mono text-emerald-800 font-bold">
                        Pokok #{t.number}
                      </span>
                    </td>

                    <td className="p-3">{getStatusBadge(t.status)}</td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          title={hasQuran ? `Al-Qur'an: ${t.quranDalil.surahRef}` : 'Belum ada dalil Quran'}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            hasQuran ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-300'
                          }`}
                        >
                          Q
                        </span>
                        <span
                          title={hasHadith ? `Hadits: ${t.hadithDalil.source}` : 'Belum ada hadits'}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            hasHadith ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-300'
                          }`}
                        >
                          H
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center font-mono text-stone-500 text-[11px]">
                      v{t.version || 1}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenEdit(t)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold transition"
                          title="Edit Seluruh Isi Materi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId({ id: t.id, title: t.title })}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden divide-y divide-stone-100">
          {filteredTopics.map((t) => {
            const isSelected = selectedTopicIds.includes(t.id);
            return (
              <div key={t.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSelectOne(t.id)}
                      className="text-stone-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-800" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className="text-[10px] font-mono uppercase bg-stone-100 px-2 py-0.5 rounded font-bold text-stone-700">
                      {t.categoryName} #{t.number}
                    </span>
                  </div>
                  <div>{getStatusBadge(t.status)}</div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">{t.title}</h4>
                  <p className="font-arabic text-base text-emerald-950 font-semibold" dir="rtl">{t.titleAr}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400">Versi {t.version || 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEdit(t)}
                      className="px-3 py-1 bg-emerald-800 text-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId({ id: t.id, title: t.title })}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <div className="py-16 text-center text-stone-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
            <p className="text-xs">Tidak ada materi yang sesuai dengan filter pencarian.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Single Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Konfirmasi Penghapusan Materi
              </h3>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <p>
                Apakah Anda yakin ingin menghapus materi:
              </p>
              <p className="font-serif font-bold text-sm text-stone-900 bg-stone-100 p-2.5 rounded-xl border border-stone-200">
                "{confirmDeleteId.title}"
              </p>
              <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <strong>Catatan Aman:</strong> Materi ini akan dipindahkan ke Tempat Sampah dan dapat Anda pulihkan kapan saja.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  onDeleteTopic(confirmDeleteId.id, confirmDeleteId.title);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm"
              >
                Hapus ke Tempat Sampah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Batch Delete */}
      {showBatchConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Hapus {selectedTopicIds.length} Materi Sekaligus?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Seluruh <strong>{selectedTopicIds.length} materi</strong> yang dipilih akan dipindahkan ke Tempat Sampah. Anda tetap dapat memulihkannya kembali dari menu Tempat Sampah sewaktu-waktu.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowBatchConfirm(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  onBatchDelete(selectedTopicIds);
                  setSelectedTopicIds([]);
                  setShowBatchConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Ya, Pindahkan ke Tempat Sampah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
