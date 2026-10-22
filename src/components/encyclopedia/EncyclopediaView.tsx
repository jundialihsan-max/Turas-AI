import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink, 
  Check, 
  Copy, 
  Share2,
  GitBranch,
  Info
} from 'lucide-react';
import { EncyclopediaEntry, ENCYCLOPEDIA_ENTRIES } from '../../data/encyclopediaData';
import { copyWithAttribution } from '../../utils/arabic';

interface EncyclopediaViewProps {
  onOpenBook: (bookId: string, chapterId?: string) => void;
  onOpenCurriculumTopic: (branchId: string, topicId?: string) => void;
}

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({
  onOpenBook,
  onOpenCurriculumTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEntry, setActiveEntry] = useState<EncyclopediaEntry | null>(ENCYCLOPEDIA_ENTRIES[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Seluruh Bidang (Kaffah)' },
    { id: 'aqidah_hati', label: 'Aqidah & Hati' },
    { id: 'ekonomi', label: 'Ekonomi & Keuangan' },
    { id: 'teknologi_modern', label: 'Teknologi & AI' },
    { id: 'keluarga', label: 'Keluarga & Pernikahan' },
    { id: 'makanan_gaya_hidup', label: 'Pangan & Gaya Hidup' },
  ];

  const filteredEntries = ENCYCLOPEDIA_ENTRIES.filter((entry) => {
    const matchCat = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchStat = selectedStatus === 'all' || entry.statusHukum === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      entry.question.toLowerCase().includes(q) ||
      (entry.questionAr && entry.questionAr.includes(q)) ||
      entry.ulamaExplanation.toLowerCase().includes(q) ||
      entry.modernContext.toLowerCase().includes(q);

    return matchCat && matchStat && matchQ;
  });

  const handleCopyEntry = async (entry: EncyclopediaEntry) => {
    const text = `« ${entry.question} »\n\nDalil: ${entry.quranDalil.arabic} (${entry.quranDalil.surahRef})\n\nHadis: ${entry.hadithDalil.source} [${entry.hadithDalil.grade}]: "${entry.hadithDalil.translation}"\n\n[Dikutip dari Ensiklopedia Syariat Islam Kaffah - Al-Maktabah Al-Islamiyyah]`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-900">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Ensiklopedia Syariat Islam Secara Kaffah
              </h1>
              <p className="text-xs text-stone-600">
                Pusat rujukan syariat 12 pilar kehidupan yang menghubungkan dalil nash, perbandingan 4 mazhab, dan konteks modern.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari permasalahan syariah..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-purple-900 text-amber-200 shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Filter status hukum */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="font-semibold text-stone-500 mr-1">Status Hukum:</span>
          {['all', 'Disepakati (Ijma\')', 'Masalah Ijtihadiyyah (Khilaf Mu\'tabar)'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                selectedStatus === st
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Encyclopedia Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Problem List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-900">
            Daftar Masalah Syariat ({filteredEntries.length})
          </h3>
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredEntries.map((item) => {
              const isSelected = activeEntry?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveEntry(item)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition space-y-2 ${
                    isSelected
                      ? 'bg-purple-900 text-white border-purple-950 shadow-md ring-2 ring-purple-600/30'
                      : 'bg-white border-stone-200 hover:border-purple-400 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-purple-800 text-amber-300'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isSelected ? 'text-amber-200' : 'text-emerald-700'
                      }`}
                    >
                      {item.statusHukum}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug">
                    {item.question}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Investigation & Thematic Knowledge Graph */}
        <div className="lg:col-span-2">
          {activeEntry ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
              {/* Question Header */}
              <div className="space-y-2 pb-4 border-b border-stone-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {activeEntry.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {activeEntry.statusHukum}
                    </span>
                    <button
                      onClick={() => handleCopyEntry(activeEntry)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs"
                      title="Salin Rujukan Masalah"
                    >
                      {copiedId === activeEntry.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                  {activeEntry.question}
                </h2>
                {activeEntry.questionAr && (
                  <p className="font-arabic text-lg text-purple-950 text-right leading-relaxed" dir="rtl">
                    {activeEntry.questionAr}
                  </p>
                )}
              </div>

              {/* Thematic Knowledge Graph Link Node */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50/50 border border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-700" />
                  <span className="font-semibold text-purple-950">Peta Keterhubungan Ilmu:</span>
                  <span className="text-stone-700">Tersambung ke Kurikulum Cabang:</span>
                  <strong className="text-purple-900 uppercase font-mono">{activeEntry.connectedBranch}</strong>
                </div>
                <button
                  onClick={() => onOpenCurriculumTopic(activeEntry.connectedBranch)}
                  className="px-3 py-1 bg-purple-900 text-amber-200 rounded-lg font-semibold text-[11px] hover:bg-purple-950 transition flex items-center gap-1"
                >
                  <span>Buka Kurikulum Terkait</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Dalil Al-Qur'an Card */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    Dalil Al-Qur'anul Karim:
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-900">
                    {activeEntry.quranDalil.surahRef}
                  </span>
                </div>
                <p className="font-arabic text-xl text-stone-950 leading-loose text-right" dir="rtl">
                  {activeEntry.quranDalil.arabic}
                </p>
                <p className="text-xs sm:text-sm text-stone-800 italic border-t border-emerald-200/60 pt-2">
                  "{activeEntry.quranDalil.translation}"
                </p>
              </div>

              {/* Hadits Shahih Card */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Hadits Nabawi & Takhrij:
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300">
                    {activeEntry.hadithDalil.grade}
                  </span>
                </div>
                <p className="font-arabic text-xl text-stone-950 leading-loose text-right" dir="rtl">
                  {activeEntry.hadithDalil.arabic}
                </p>
                <p className="text-xs sm:text-sm text-stone-800 italic border-t border-amber-200/60 pt-2">
                  "{activeEntry.hadithDalil.translation}"
                </p>
                <div className="text-[11px] text-stone-500 pt-1 flex items-center gap-3">
                  <span>Sumber: {activeEntry.hadithDalil.source}</span>
                  <span>·</span>
                  <span>Perawi: {activeEntry.hadithDalil.rawi}</span>
                </div>
              </div>

              {/* Penjelasan 4 Mazhab Fikih */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-600" />
                  Pandangan Empat Mazhab Muktabar:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeEntry.mazhabViews.hanafi && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block mb-1">Mazhab Hanafi:</strong>
                      <p className="text-stone-700 leading-relaxed">{activeEntry.mazhabViews.hanafi}</p>
                    </div>
                  )}
                  {activeEntry.mazhabViews.maliki && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block mb-1">Mazhab Maliki:</strong>
                      <p className="text-stone-700 leading-relaxed">{activeEntry.mazhabViews.maliki}</p>
                    </div>
                  )}
                  {activeEntry.mazhabViews.syafii && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block mb-1">Mazhab Syafi'i:</strong>
                      <p className="text-stone-700 leading-relaxed">{activeEntry.mazhabViews.syafii}</p>
                    </div>
                  )}
                  {activeEntry.mazhabViews.hanbali && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block mb-1">Mazhab Hanbali:</strong>
                      <p className="text-stone-700 leading-relaxed">{activeEntry.mazhabViews.hanbali}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Konteks Penerapan Modern */}
              <div className="rounded-xl bg-purple-50/60 border border-purple-200 p-4 text-xs space-y-1">
                <strong className="text-purple-950 font-bold">Konteks Penerapan di Era Modern:</strong>
                <p className="text-stone-700 leading-relaxed">{activeEntry.modernContext}</p>
              </div>

              {/* Rujukan & Pustaka */}
              <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-3 flex flex-wrap gap-2">
                <strong>Daftar Rujukan:</strong>
                {activeEntry.sources.map((s, idx) => (
                  <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
              <Compass className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">Pilih salah satu masalah syariat di samping untuk membuka telaah lengkap.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
