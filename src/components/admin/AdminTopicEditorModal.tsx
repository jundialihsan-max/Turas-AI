import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Eye, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { CMSTopic, ContentStatus, CMSCategory } from '../../types/cms';

interface AdminTopicEditorModalProps {
  topic: CMSTopic | null;
  categories: CMSCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: Partial<CMSTopic> & { id: string }, summary?: string) => Promise<void>;
  onTriggerAI: (topicTitle: string, categoryName: string, content: any) => void;
}

export const AdminTopicEditorModal: React.FC<AdminTopicEditorModalProps> = ({
  topic,
  categories,
  isOpen,
  onClose,
  onSave,
  onTriggerAI,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CMSTopic>>({
    id: topic?.id || `topic_${Date.now()}`,
    categoryId: topic?.categoryId || (categories[0]?.id as any) || 'aqidah',
    categoryName: topic?.categoryName || categories[0]?.name || 'Aqidah',
    categoryNameAr: topic?.categoryNameAr || categories[0]?.nameAr || 'العقيدة',
    number: topic?.number || 1,
    title: topic?.title || '',
    titleAr: topic?.titleAr || '',
    objective: topic?.objective || '',
    linguisticDef: topic?.linguisticDef || '',
    syariDef: topic?.syariDef || '',
    systematicExplanation: topic?.systematicExplanation || [''],
    quranDalil: topic?.quranDalil || { arabic: '', translation: '', surahRef: '' },
    hadithDalil: topic?.hadithDalil || { arabic: '', translation: '', source: '', grade: 'Shahih', scholar: '' },
    ulamaExplanation: topic?.ulamaExplanation || { scholar: '', bookRef: '', notes: '' },
    legalDetailsAndModernApp: topic?.legalDetailsAndModernApp || [''],
    ikhtilafNotes: topic?.ikhtilafNotes || '',
    conclusion: topic?.conclusion || '',
    furtherReading: topic?.furtherReading || [''],
    quiz: topic?.quiz || { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' },
    status: topic?.status || 'draft',
    isTemplateGenerated: false,
    isUniqueVerified: true,
  });

  useEffect(() => {
    if (topic) {
      setFormData({
        ...topic,
        systematicExplanation: topic.systematicExplanation?.length ? topic.systematicExplanation : [''],
        legalDetailsAndModernApp: topic.legalDetailsAndModernApp?.length ? topic.legalDetailsAndModernApp : [''],
        furtherReading: topic.furtherReading?.length ? topic.furtherReading : [''],
        quiz: topic.quiz || { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' },
      });
      setHasUnsavedChanges(false);
    }
  }, [topic]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleCategoryChange = (catId: string) => {
    const selected = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      categoryId: catId as any,
      categoryName: selected?.name || catId,
      categoryNameAr: selected?.nameAr || '',
    }));
    setHasUnsavedChanges(true);
  };

  // Helper for dynamic arrays
  const updateArrayItem = (field: 'systematicExplanation' | 'legalDetailsAndModernApp' | 'furtherReading', index: number, val: string) => {
    const arr = [...(formData[field] || [])];
    arr[index] = val;
    updateField(field, arr);
  };

  const addArrayItem = (field: 'systematicExplanation' | 'legalDetailsAndModernApp' | 'furtherReading') => {
    const arr = [...(formData[field] || []), ''];
    updateField(field, arr);
  };

  const removeArrayItem = (field: 'systematicExplanation' | 'legalDetailsAndModernApp' | 'furtherReading', index: number) => {
    const arr = (formData[field] || []).filter((_, i) => i !== index);
    updateField(field, arr.length ? arr : ['']);
  };

  const handleSave = async (targetStatus?: ContentStatus) => {
    setIsSaving(true);
    try {
      const payload: Partial<CMSTopic> & { id: string } = {
        ...formData,
        id: formData.id!,
        status: targetStatus || formData.status || 'draft',
        updatedAt: new Date().toISOString(),
      };
      await onSave(payload, `Perubahan materi: ${formData.title}`);
      setHasUnsavedChanges(false);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 2500);
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col max-h-[94vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-amber-50 flex items-center justify-between border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-amber-100">
                  {topic ? `Edit Materi: ${topic.title}` : '+ Tambah Pokok Pembahasan Baru'}
                </h2>
                {hasUnsavedChanges && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold animate-pulse">
                    Ada Perubahan Belum Disimpan
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">
                Penyusunan naskah komprehensif 12 bagian berstandar Ahlusunah wal Jama'ah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerAI(formData.title || '', formData.categoryName || '', formData)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              title="Gunakan Asisten AI untuk Melengkapi Draf Ilmiah"
            >
              <Sparkles className="w-4 h-4 text-emerald-900" />
              <span className="hidden sm:inline">Bantuan AI</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-amber-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header (Editor vs Live Preview) */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'editor'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Formulir Editor 12 Bagian
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau (Live Preview)</span>
            </button>
          </div>

          {saveSuccessNotice && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5" /> Perubahan berhasil disimpan!
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'editor' ? (
            <div className="space-y-6">
              {/* Section A: Meta & Klasifikasi */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  A. Informasi Pokok & Klasifikasi
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Kategori Cabang Ilmu
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.nameAr})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nomor / Urutan Topik
                    </label>
                    <input
                      type="number"
                      value={formData.number || 1}
                      onChange={(e) => updateField('number', parseInt(e.target.value, 10) || 1)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Status Publikasi
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateField('status', e.target.value as ContentStatus)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-semibold text-emerald-950"
                    >
                      <option value="published">Terbit (Published - Lengkap & Sahih)</option>
                      <option value="draft">Draf (Penyusunan Pribadi)</option>
                      <option value="needs_review">Perlu Ditinjau / Dicek Ulang</option>
                      <option value="in_progress">Dalam Penyusunan (Jujur Transparan)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Judul Pembahasan (Bahasa Indonesia) *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-stone-300 bg-white font-serif font-bold text-stone-900"
                      placeholder="Contoh: Pengertian Aqidah dan Urgensinya"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1 text-right" dir="rtl">
                      Judul Teks Arab Berharakat (العنوان بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.titleAr}
                      onChange={(e) => updateField('titleAr', e.target.value)}
                      className="w-full text-sm sm:text-base p-2.5 rounded-lg border border-stone-300 bg-white font-arabic text-right text-emerald-950 font-bold"
                      placeholder="مَفْهُومُ العَقِيدَةِ وَأَهَمِّيَّتُهَا"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    1. Tujuan Pembelajaran (Learning Objective)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.objective}
                    onChange={(e) => updateField('objective', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    placeholder="Contoh: Memahami makna aqidah secara etimologi dan terminologi syar'i..."
                  />
                </div>
              </div>

              {/* Section B: Definisi Bahasa & Syar'i */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-800 block">
                    2. Definisi Bahasa (Etimologi)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.linguisticDef}
                    onChange={(e) => updateField('linguisticDef', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    placeholder="Berasal dari kata 'al-'aqd' yang bermakna ikatan kuat..."
                  />
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-800 block">
                    3. Definisi Syar'i (Terminologi)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.syariDef}
                    onChange={(e) => updateField('syariDef', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                    placeholder="Keimanan yang pasti kepada Allah dan rukun-rukun iman..."
                  />
                </div>
              </div>

              {/* Section C: Penjelasan Sistematis (Multi Paragraf) */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    4. Isi Penjelasan Sistematis & Komprehensif
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('systematicExplanation')}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Paragraf
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(formData.systematicExplanation || []).map((par, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[11px] font-mono text-stone-400 pt-2 shrink-0">
                        P{idx + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={par}
                        onChange={(e) => updateArrayItem('systematicExplanation', idx, e.target.value)}
                        className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 bg-white leading-relaxed"
                        placeholder={`Tulis uraian paragraf ke-${idx + 1}...`}
                      />
                      {(formData.systematicExplanation || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('systematicExplanation', idx)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 shrink-0"
                          title="Hapus Paragraf"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section D: Dalil Al-Qur'an (RTL & Harakat) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                    5. Dalil Al-Qur'anul Karim (Teks Arab Berharakat)
                  </label>
                  <input
                    type="text"
                    value={formData.quranDalil?.surahRef || ''}
                    onChange={(e) =>
                      updateField('quranDalil', { ...formData.quranDalil, surahRef: e.target.value })
                    }
                    className="text-xs p-1.5 rounded-lg border border-emerald-300 bg-white font-mono w-44"
                    placeholder="Contoh: QS. Muhammad: 19"
                  />
                </div>

                <div>
                  <textarea
                    dir="rtl"
                    rows={2}
                    value={formData.quranDalil?.arabic || ''}
                    onChange={(e) =>
                      updateField('quranDalil', { ...formData.quranDalil, arabic: e.target.value })
                    }
                    className="w-full text-base sm:text-xl p-3 rounded-lg border border-emerald-300 bg-white font-arabic text-right leading-loose text-stone-900"
                    placeholder="فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                    Terjemahan Ayat:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.quranDalil?.translation || ''}
                    onChange={(e) =>
                      updateField('quranDalil', { ...formData.quranDalil, translation: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 bg-white"
                    placeholder="Maka ketahuilah bahwa tidak ada sesembahan yang berhak disembah selain Allah..."
                  />
                </div>
              </div>

              {/* Section E: Hadits & Takhrij */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                    6. Hadits Nabawi & Status Takhrij
                  </label>

                  <div className="flex items-center gap-2">
                    <select
                      value={formData.hadithDalil?.grade || 'Shahih'}
                      onChange={(e) =>
                        updateField('hadithDalil', { ...formData.hadithDalil, grade: e.target.value })
                      }
                      className="text-xs p-1 rounded-md border border-amber-300 bg-white font-semibold text-emerald-900"
                    >
                      <option value="Shahih">Shahih</option>
                      <option value="Hasan">Hasan</option>
                      <option value="Dhaif">Dhaif</option>
                      <option value="Mutawatir">Mutawatir</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={formData.hadithDalil?.source || ''}
                    onChange={(e) =>
                      updateField('hadithDalil', { ...formData.hadithDalil, source: e.target.value })
                    }
                    className="p-2 rounded-lg border border-amber-300 bg-white"
                    placeholder="Sumber Kitab & No (Contoh: Shahih Muslim no. 26)"
                  />
                  <input
                    type="text"
                    value={formData.hadithDalil?.scholar || ''}
                    onChange={(e) =>
                      updateField('hadithDalil', { ...formData.hadithDalil, scholar: e.target.value })
                    }
                    className="p-2 rounded-lg border border-amber-300 bg-white"
                    placeholder="Ulama Pentakhrij / Penilai (Contoh: Imam Muslim)"
                  />
                </div>

                <div>
                  <textarea
                    dir="rtl"
                    rows={2}
                    value={formData.hadithDalil?.arabic || ''}
                    onChange={(e) =>
                      updateField('hadithDalil', { ...formData.hadithDalil, arabic: e.target.value })
                    }
                    className="w-full text-base sm:text-xl p-3 rounded-lg border border-amber-300 bg-white font-arabic text-right leading-loose text-stone-900"
                    placeholder="مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                    Terjemahan Hadits:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.hadithDalil?.translation || ''}
                    onChange={(e) =>
                      updateField('hadithDalil', { ...formData.hadithDalil, translation: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white"
                    placeholder="Barangsiapa mati dalam keadaan ia mengetahui bahwa tiada sesembahan yang berhak disembah selain Allah..."
                  />
                </div>
              </div>

              {/* Section F: Penjelasan Ulama */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <label className="text-xs font-bold text-stone-800 block">
                  7. Penjelasan & Syarah Ulama Muktabar
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={formData.ulamaExplanation?.scholar || ''}
                    onChange={(e) =>
                      updateField('ulamaExplanation', { ...formData.ulamaExplanation, scholar: e.target.value })
                    }
                    className="p-2 rounded-lg border border-stone-300 bg-white"
                    placeholder="Nama Ulama (Contoh: Ibnu Taimiyyah / Al-Imam An-Nawawi)"
                  />
                  <input
                    type="text"
                    value={formData.ulamaExplanation?.bookRef || ''}
                    onChange={(e) =>
                      updateField('ulamaExplanation', { ...formData.ulamaExplanation, bookRef: e.target.value })
                    }
                    className="p-2 rounded-lg border border-stone-300 bg-white"
                    placeholder="Kitab Rujukan (Contoh: Majmu' Al-Fatawa jilid 7)"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.ulamaExplanation?.notes || ''}
                  onChange={(e) =>
                    updateField('ulamaExplanation', { ...formData.ulamaExplanation, notes: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  placeholder="Kutipan penjelasan ulama mengenai bab ini..."
                />
              </div>

              {/* Section G: Rincian Hukum, Khilaf, Kesimpulan */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      8. Rincian Hukum & Penerapan Modern
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('legalDetailsAndModernApp')}
                      className="text-xs text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Poin
                    </button>
                  </div>
                  {(formData.legalDetailsAndModernApp || []).map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => updateArrayItem('legalDetailsAndModernApp', idx, e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg border border-stone-300 bg-white"
                        placeholder="Poin penerapan dalam kehidupan kontemporer..."
                      />
                      {(formData.legalDetailsAndModernApp || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('legalDetailsAndModernApp', idx)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <label className="text-xs font-bold text-purple-950 block">
                      9. Catatan Khilafiyah & Adab Perbedaan Pendapat
                    </label>
                    <textarea
                      rows={3}
                      value={formData.ikhtilafNotes || ''}
                      onChange={(e) => updateField('ikhtilafNotes', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-purple-300 bg-white"
                      placeholder="Paparan adab dalam menyikapi khilaf yang mu'tabar..."
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <label className="text-xs font-bold text-emerald-950 block">
                      10. Kesimpulan Ilmiah Pokok
                    </label>
                    <textarea
                      rows={3}
                      value={formData.conclusion || ''}
                      onChange={(e) => updateField('conclusion', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 bg-white font-medium"
                      placeholder="Kesimpulan ringkas yang menjadi kaidah..."
                    />
                  </div>
                </div>

                {/* Section H: Referensi Lanjutan & Kuis */}
                <div className="p-4 rounded-xl bg-stone-900 text-stone-100 space-y-3">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    12. Kuis Evaluasi Pemahaman
                  </label>
                  <input
                    type="text"
                    value={formData.quiz?.question || ''}
                    onChange={(e) =>
                      updateField('quiz', { ...formData.quiz, question: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg bg-stone-800 border border-stone-700 text-white"
                    placeholder="Pertanyaan kuis..."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(formData.quiz?.options || ['', '', '', '']).map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="quizCorrectOption"
                          checked={formData.quiz?.correctIndex === oIdx}
                          onChange={() => updateField('quiz', { ...formData.quiz, correctIndex: oIdx })}
                          className="accent-amber-400 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(formData.quiz?.options || [])];
                            newOpts[oIdx] = e.target.value;
                            updateField('quiz', { ...formData.quiz, options: newOpts });
                          }}
                          className="flex-1 p-1.5 rounded bg-stone-800 border border-stone-700 text-white text-xs"
                          placeholder={`Opsi ${String.fromCharCode(65 + oIdx)} ${formData.quiz?.correctIndex === oIdx ? '(Benar)' : ''}`}
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={formData.quiz?.explanation || ''}
                    onChange={(e) =>
                      updateField('quiz', { ...formData.quiz, explanation: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-300"
                    placeholder="Penjelasan mengapa opsi tersebut benar..."
                  />
                </div>
              </div>
            </div>
          ) : (
            /* LIVE PREVIEW TAB */
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-6">
              <div className="text-center space-y-2 border-b border-stone-200 pb-4">
                <span className="text-[11px] font-mono uppercase bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                  {formData.categoryName} · Pokok Ke-{formData.number}
                </span>
                <h1 className="font-serif font-bold text-2xl text-stone-900">{formData.title || 'Judul Materi'}</h1>
                <p className="font-arabic text-2xl text-emerald-950 font-bold" dir="rtl">{formData.titleAr || 'العنوان بالعربية'}</p>
              </div>

              {formData.status === 'in_progress' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Status Transparan:</strong> Materi ini sedang disusun. Konten lengkap belum tersedia.</span>
                </div>
              )}

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs">
                <strong className="text-amber-950 block mb-1">1. Tujuan Pembelajaran:</strong>
                <p className="text-stone-700">{formData.objective}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <strong className="block mb-1 text-stone-800">2. Definisi Bahasa:</strong>
                  <p className="text-stone-600">{formData.linguisticDef}</p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <strong className="block mb-1 text-stone-800">3. Definisi Syar'i:</strong>
                  <p className="text-stone-600">{formData.syariDef}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-stone-800">
                <strong className="block text-stone-900">4. Penjelasan Sistematis:</strong>
                {(formData.systematicExplanation || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {formData.quranDalil?.arabic && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-950">5. Dalil Al-Qur'an ({formData.quranDalil.surahRef}):</span>
                  <p className="font-arabic text-xl text-right leading-loose" dir="rtl">{formData.quranDalil.arabic}</p>
                  <p className="text-xs italic text-stone-700">"{formData.quranDalil.translation}"</p>
                </div>
              )}

              {formData.hadithDalil?.arabic && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">6. Hadits Nabawi:</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                      {formData.hadithDalil.grade}
                    </span>
                  </div>
                  <p className="font-arabic text-xl text-right leading-loose" dir="rtl">{formData.hadithDalil.arabic}</p>
                  <p className="text-xs italic text-stone-700">"{formData.hadithDalil.translation}"</p>
                  <p className="text-[10px] text-stone-500">Sumber: {formData.hadithDalil.source} · Penilai: {formData.hadithDalil.scholar}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
          >
            Batalkan
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('draft')}
              className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
            >
              Simpan sebagai Draf
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('published')}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Simpan & Terbitkan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
