import React, { useState } from 'react';
import { 
  Layers, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  FolderPlus
} from 'lucide-react';
import { CMSCategory } from '../../types/cms';

interface AdminCategoriesTabProps {
  categories: CMSCategory[];
  onSaveCategory: (cat: CMSCategory) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<CMSCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const [form, setForm] = useState<CMSCategory>({
    id: '',
    name: '',
    nameAr: '',
    subtitle: '',
    description: '',
    topicsCount: 0,
    color: 'from-emerald-800 to-teal-950',
    isCustom: true,
  });

  const handleOpenAdd = () => {
    setForm({
      id: 'kategori_' + Date.now().toString(36),
      name: '',
      nameAr: '',
      subtitle: '',
      description: '',
      topicsCount: 0,
      color: 'from-emerald-800 to-teal-950',
      isCustom: true,
    });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CMSCategory) => {
    setForm({ ...cat });
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      await onSaveCategory(form);
      setIsModalOpen(false);
      setFeedbackNotice({ text: `Kategori "${form.name}" berhasil disimpan.` });
      setTimeout(() => setFeedbackNotice(null), 3000);
    } catch (err: any) {
      setFeedbackNotice({ text: err.message || 'Gagal menyimpan kategori', error: true });
    }
  };

  const handleDelete = async (cat: CMSCategory) => {
    if (!window.confirm(`Hapus kategori "${cat.name}"?`)) return;

    const res = await onDeleteCategory(cat.id);
    setFeedbackNotice({ text: res.message, error: !res.success });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            Kelola Kategori & Cabang Ilmu
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tambah cabang ilmu kustom secara dinamis tanpa batasan kaku 50 topik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center gap-2 shadow-xs"
        >
          <FolderPlus className="w-4 h-4 text-amber-300" />
          <span>+ Tambah Kategori Baru</span>
        </button>
      </div>

      {feedbackNotice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            feedbackNotice.error
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {feedbackNotice.error ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{feedbackNotice.text}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-bold border border-emerald-200">
                  {cat.topicsCount} Topik Terdaftar
                </span>
                {cat.isCustom ? (
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Kustom
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-mono">Utama</span>
                )}
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">{cat.name}</h4>
                <p className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
                  {cat.nameAr}
                </p>
                <p className="text-xs text-stone-600 italic mt-1 line-clamp-1">{cat.subtitle}</p>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-400">ID: {cat.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                {cat.isCustom && (
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in">
            <h3 className="font-serif font-bold text-base text-stone-900">
              {editingCategory ? `Edit Kategori: ${editingCategory.name}` : '+ Tambah Kategori Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Nama Kategori Cabang Ilmu *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Qawaid Fiqhiyyah"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1 text-right" dir="rtl">
                  Nama Teks Arab Berharakat (الاسم بالعربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  placeholder="القَوَاعِدُ الفِقْهِيَّةُ"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-arabic text-right font-bold text-emerald-950"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Subjudul Ringkas</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Kaidah-Kaidah Fikih Kubra dan Furu'"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Uraian mengenai ruang lingkup pembelajaran kategori ini..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold shadow-xs"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
