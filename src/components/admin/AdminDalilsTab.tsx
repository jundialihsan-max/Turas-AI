import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  Link, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { SharedDalil, CMSTopic } from '../../types/cms';

interface AdminDalilsTabProps {
  dalils: SharedDalil[];
  allTopics: CMSTopic[];
  onSaveDalil: (dalil: Partial<SharedDalil>) => Promise<void>;
  onDeleteDalil: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminDalilsTab: React.FC<AdminDalilsTabProps> = ({
  dalils,
  allTopics,
  onSaveDalil,
  onDeleteDalil,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quran' | 'hadits'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDalil, setEditingDalil] = useState<SharedDalil | null>(null);

  const [form, setForm] = useState<Partial<SharedDalil>>({
    id: '',
    type: 'hadits',
    arabic: '',
    translation: '',
    surahRef: '',
    source: '',
    grade: 'Shahih',
    scholar: '',
    rawi: '',
    takhrijNotes: '',
    linkedTopicIds: [],
  });

  const filtered = dalils.filter((d) => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        d.arabic.includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        (d.source && d.source.toLowerCase().includes(q)) ||
        (d.scholar && d.scholar.toLowerCase().includes(q)) ||
        (d.surahRef && d.surahRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setForm({
      id: 'dalil_' + Date.now().toString(36),
      type: 'hadits',
      arabic: '',
      translation: '',
      surahRef: '',
      source: '',
      grade: 'Shahih',
      scholar: '',
      rawi: '',
      takhrijNotes: '',
      linkedTopicIds: [],
    });
    setEditingDalil(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (d: SharedDalil) => {
    setForm({ ...d });
    setEditingDalil(d);
    setIsEditorOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.arabic?.trim() || !form.translation?.trim()) return;

    await onSaveDalil(form);
    setIsEditorOpen(false);
  };

  const toggleLinkTopic = (topicId: string) => {
    const list = [...(form.linkedTopicIds || [])];
    const exists = list.includes(topicId);
    setForm({
      ...form,
      linkedTopicIds: exists ? list.filter((id) => id !== topicId) : [...list, topicId],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            Perpustakaan Dalil Terpusat (Shared Dalil Repository)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Satu hadits atau ayat dapat dihubungkan ke banyak topik pembelajaran secara konsisten.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center gap-2 shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>+ Tambah Dalil Baru</span>
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
            placeholder="Cari teks Arab, terjemahan, nama kitab, nomor, atau perawi..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'all' ? 'bg-emerald-900 text-amber-200' : 'text-stone-600'
            }`}
          >
            Semua ({dalils.length})
          </button>
          <button
            onClick={() => setFilterType('quran')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'quran' ? 'bg-emerald-900 text-amber-200' : 'text-stone-600'
            }`}
          >
            Al-Qur'an
          </button>
          <button
            onClick={() => setFilterType('hadits')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'hadits' ? 'bg-emerald-900 text-amber-200' : 'text-stone-600'
            }`}
          >
            Hadits Nabawi
          </button>
        </div>
      </div>

      {/* Dalils List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    d.type === 'quran'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {d.type === 'quran' ? 'Al-Qur\'anul Karim' : `Hadits (${d.grade || 'Shahih'})`}
                </span>

                <span className="text-[11px] font-mono text-stone-500">
                  {d.type === 'quran' ? d.surahRef : d.source}
                </span>
              </div>

              <p className="font-arabic text-lg text-emerald-950 font-bold leading-loose text-right" dir="rtl">
                {d.arabic}
              </p>

              <p className="text-xs text-stone-700 italic border-t border-stone-100 pt-2">
                "{d.translation}"
              </p>

              {d.scholar && (
                <div className="text-[11px] text-stone-500">
                  <span>Pentakhrij: <strong>{d.scholar}</strong></span>
                  {d.rawi && <span> · Perawi: {d.rawi}</span>}
                </div>
              )}

              {/* Linked Topics Badges */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Terhubung ke {d.linkedTopicIds?.length || 0} Materi:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(d.linkedTopicIds || []).map((tId) => {
                    const top = allTopics.find((t) => t.id === tId);
                    return (
                      <span
                        key={tId}
                        className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200"
                      >
                        {top?.title || tId}
                      </span>
                    );
                  })}
                  {(!d.linkedTopicIds || d.linkedTopicIds.length === 0) && (
                    <span className="text-[10px] text-stone-400 italic">Belum ditautkan</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-400">{d.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(d)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => onDeleteDalil(d.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-600"
                  title="Hapus Dalil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dalil Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[92vh] overflow-y-auto animate-fade-in">
            <h3 className="font-serif font-bold text-base text-stone-900">
              {editingDalil ? 'Edit Entri Dalil' : '+ Tambah Dalil Baru ke Database Bersama'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Jenis Dalil</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="hadits">Hadits Nabawi</option>
                    <option value="quran">Ayat Al-Qur'anul Karim</option>
                  </select>
                </div>

                {form.type === 'hadits' ? (
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Derajat Keshahihan (Takhrij)
                    </label>
                    <select
                      value={form.grade || 'Shahih'}
                      onChange={(e) => setForm({ ...form, grade: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="Shahih">Shahih</option>
                      <option value="Hasan">Hasan</option>
                      <option value="Dhaif">Dhaif</option>
                      <option value="Mutawatir">Mutawatir</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Rujukan Surah & Ayat
                    </label>
                    <input
                      type="text"
                      value={form.surahRef || ''}
                      onChange={(e) => setForm({ ...form, surahRef: e.target.value })}
                      placeholder="Contoh: QS. Al-Baqarah: 183"
                      className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1 text-right" dir="rtl">
                  Teks Arab Berharakat Lengkap (النص العربي بالشكل) *
                </label>
                <textarea
                  required
                  dir="rtl"
                  rows={3}
                  value={form.arabic || ''}
                  onChange={(e) => setForm({ ...form, arabic: e.target.value })}
                  placeholder="أدخل النص العربي مع الحركات..."
                  className="w-full p-3 rounded-lg border border-stone-300 text-base font-arabic text-right leading-loose text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Terjemahan Lengkap *</label>
                <textarea
                  required
                  rows={2}
                  value={form.translation || ''}
                  onChange={(e) => setForm({ ...form, translation: e.target.value })}
                  placeholder="Terjemahan bahasa Indonesia..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              {form.type === 'hadits' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Kitab Sumber & Nomor Hadits
                    </label>
                    <input
                      type="text"
                      value={form.source || ''}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      placeholder="Shahih Al-Bukhari no. 1"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Ulama Pentakhrij / Penilai
                    </label>
                    <input
                      type="text"
                      value={form.scholar || ''}
                      onChange={(e) => setForm({ ...form, scholar: e.target.value })}
                      placeholder="Al-Albani / Ibnu Hajar"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Multi-link to Topics */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="font-semibold text-stone-800 block">
                  Tautkan Dalil Ini ke Topik Pembahasan:
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5">
                  {allTopics.slice(0, 30).map((t) => {
                    const isLinked = (form.linkedTopicIds || []).includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleLinkTopic(t.id)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                          isLinked ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white hover:bg-stone-100'
                        }`}
                      >
                        <span>{t.title} ({t.categoryName})</span>
                        {isLinked && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-semibold"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-amber-100 font-bold shadow-xs"
                >
                  Simpan Dalil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
