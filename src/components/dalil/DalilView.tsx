import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  BookOpen, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Info,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { DalilItem, ContentClassification } from '../../types';
import { copyWithAttribution, removeHarakat } from '../../utils/arabic';

interface DalilViewProps {
  dalils: DalilItem[];
}

export const DalilView: React.FC<DalilViewProps> = ({ dalils }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique themes
  const themes = Array.from(new Set(dalils.map((d) => d.theme)));

  const filteredDalils = dalils.filter((item) => {
    const matchesTheme = selectedTheme === 'all' || item.theme === selectedTheme;
    const matchesClassification =
      selectedClassification === 'all' || item.classification === selectedClassification;

    const query = searchKeyword.trim().toLowerCase();
    if (!query) return matchesTheme && matchesClassification;

    const cleanAr = removeHarakat(item.arabic.toLowerCase());
    const cleanQ = removeHarakat(query);

    const matchesSearch =
      cleanAr.includes(cleanQ) ||
      item.indonesian.toLowerCase().includes(query) ||
      item.sourceBook.toLowerCase().includes(query) ||
      item.numberOrRef.toLowerCase().includes(query) ||
      (item.rawi && item.rawi.toLowerCase().includes(query)) ||
      (item.explanation && item.explanation.toLowerCase().includes(query));

    return matchesTheme && matchesClassification && matchesSearch;
  });

  const handleCopy = async (item: DalilItem) => {
    const sourceString = `${item.sourceBook} (${item.numberOrRef})`;
    const success = await copyWithAttribution(item.arabic, item.indonesian, sourceString);
    if (success) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const getClassificationBadge = (classification: ContentClassification) => {
    switch (classification) {
      case 'quran':
        return {
          label: 'Ayat Al-Qur\'an',
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        };
      case 'hadits':
        return {
          label: 'Hadits Nabi ﷺ',
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
        };
      case 'atsar':
        return {
          label: 'Atsar Sahabat / Salaf',
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
        };
      case 'perbedaan_mazhab':
        return {
          label: 'Fikih 4 Mazhab',
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
        };
      case 'penjelasan_ulama':
        return {
          label: 'Penjelasan Ulama',
          bg: 'bg-stone-100 text-stone-900 border-stone-300',
        };
      default:
        return {
          label: 'Dalil Referensi',
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
        };
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-800 text-amber-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Direktori Dalil & Referensi Ilmiah
            </h1>
            <p className="text-xs text-stone-600">
              Telusuri dalil terverifikasi berdasarkan tema syar'i dengan pemisahan tegas antara Al-Qur'an, Hadits, Atsar, dan Mazhab.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Cari kata kunci dalil, nomor hadis, surah, nama sahabat, atau teks Arab..."
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-700 focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1">Filter Kategori:</span>
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'quran', label: 'Al-Qur\'an' },
            { id: 'hadits', label: 'Hadits' },
            { id: 'atsar', label: 'Atsar Sahabat' },
            { id: 'perbedaan_mazhab', label: '4 Mazhab' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassification(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedClassification === c.id
                  ? 'bg-emerald-900 text-amber-200 font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Themes Pill Selector */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition ${
              selectedTheme === 'all'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Tema
          </button>
          {themes.map((th) => (
            <button
              key={th}
              onClick={() => setSelectedTheme(th)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                selectedTheme === th
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* Dalil Items List */}
      <div className="space-y-5">
        {filteredDalils.map((item) => {
          const badge = getClassificationBadge(item.classification);
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:border-emerald-600/50 transition space-y-4"
            >
              {/* Header: Theme and classification */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs font-semibold text-emerald-900">
                    Tema: {item.theme}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
                  title="Salin Dalil Beserta Rujukan"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin Dalil'}</span>
                </button>
              </div>

              {/* Arabic Matan */}
              <div className="arabic-text font-arabic text-xl sm:text-2xl text-stone-950 font-medium leading-loose text-right" dir="rtl">
                {item.arabic}
              </div>

              {/* Indonesian Meaning */}
              <div className="text-stone-800 text-xs sm:text-sm leading-relaxed border-t border-stone-100 pt-3">
                "{item.indonesian}"
              </div>

              {/* Takhrij Card if Hadith */}
              {item.takhrijGrade && (
                <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      Status Keshahihan Riwayat:
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px]">
                      {item.takhrijGrade}
                    </span>
                  </div>
                  {item.rawi && <p><strong>Perawi:</strong> {item.rawi}</p>}
                  {item.takhrijScholar && <p><strong>Penilaian Ulama:</strong> {item.takhrijScholar}</p>}
                </div>
              )}

              {/* Mazhab Comparison if available */}
              {item.mazhabViews && (
                <div className="rounded-xl bg-purple-50/80 border border-purple-200 p-4 text-xs text-purple-950 space-y-2">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-700" />
                    Penjelasan Komparatif Empat Mazhab Fikih:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-800 pt-1">
                    {item.mazhabViews.hanafi && (
                      <div className="p-2.5 rounded-lg bg-white border border-purple-100">
                        <strong className="text-purple-900">Mazhab Hanafi:</strong> {item.mazhabViews.hanafi}
                      </div>
                    )}
                    {item.mazhabViews.maliki && (
                      <div className="p-2.5 rounded-lg bg-white border border-purple-100">
                        <strong className="text-purple-900">Mazhab Maliki:</strong> {item.mazhabViews.maliki}
                      </div>
                    )}
                    {item.mazhabViews.syafii && (
                      <div className="p-2.5 rounded-lg bg-white border border-purple-100">
                        <strong className="text-purple-900">Mazhab Syafi'i:</strong> {item.mazhabViews.syafii}
                      </div>
                    )}
                    {item.mazhabViews.hanbali && (
                      <div className="p-2.5 rounded-lg bg-white border border-purple-100">
                        <strong className="text-purple-900">Mazhab Hanbali:</strong> {item.mazhabViews.hanbali}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Explanatory notes */}
              {item.explanation && (
                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200/80 leading-relaxed">
                  <strong className="text-stone-800">Faidah Ilmiah:</strong> {item.explanation}
                </div>
              )}

              {/* Reference footer */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>
                  <strong>Kitab Rujukan:</strong> {item.sourceBook}
                </span>
                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[11px] text-stone-700">
                  {item.numberOrRef}
                </span>
              </div>
            </div>
          );
        })}

        {filteredDalils.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
            <Compass className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-semibold text-stone-700">Dalil Tidak Ditemukan</h3>
            <p className="text-xs text-stone-500">
              Tidak ada dalil yang sesuai dengan kata kunci atau filter yang Anda pilih.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
