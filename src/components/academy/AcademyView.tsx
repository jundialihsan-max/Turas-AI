import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  Flame,
  FileCheck,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { 
  CURRICULUM_BRANCHES, 
  TOPICS_BY_CATEGORY, 
  ALL_450_TOPICS,
  CurriculumBranchId, 
  CurriculumTopic 
} from '../../data/curriculum';
import { UserPreferences } from '../../types';
import { storage } from '../../utils/storage';
import { cmsClient } from '../../utils/cmsClient';
import { adminAuth } from '../../utils/adminAuth';
import { CMSTopic, CMSCategory } from '../../types/cms';

interface AcademyViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  initialBranchId?: string;
  onOpenAdminTopic?: (topicId: string) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  preferences,
  onUpdatePreferences,
  initialBranchId,
  onOpenAdminTopic,
}) => {
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [allTopics, setAllTopics] = useState<CMSTopic[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string>(
    initialBranchId || 'aqidah'
  );
  const [selectedTopic, setSelectedTopic] = useState<CMSTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quiz state within topic
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const [cats, tops] = await Promise.all([
        cmsClient.getCategories(),
        cmsClient.getAllTopics(),
      ]);
      setCategories(cats);
      setAllTopics(tops);
    };
    load();
    const unsub = cmsClient.subscribe(load);
    return unsub;
  }, []);

  const activeBranch = categories.find((b) => b.id === activeBranchId) || categories[0] || CURRICULUM_BRANCHES[0];
  const branchTopics = allTopics.filter((t) => t.categoryId === activeBranchId);

  const filteredTopics = branchTopics.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.title.toLowerCase().includes(q) ||
      t.titleAr.includes(q) ||
      t.syariDef.toLowerCase().includes(q) ||
      t.objective.toLowerCase().includes(q)
    );
  });

  const handleOpenTopic = (topic: CMSTopic) => {
    setSelectedTopic(topic);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkCompleted = () => {
    if (!selectedTopic) return;
    const updated = storage.markLessonComplete(selectedTopic.id);
    onUpdatePreferences(updated);
  };

  const isCurrentTopicCompleted = selectedTopic
    ? preferences.completedLessons.includes(selectedTopic.id)
    : false;

  return (
    <div className="space-y-6 pb-20">
      {/* Academy Top Header */}
      {!selectedTopic && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-900 text-amber-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Akademi Ilmu Syar'i (450 Pokok Pembahasan)
                </h1>
                <p className="text-xs text-stone-600">
                  Kurikulum komprehensif 9 cabang ilmu keislaman berlandaskan dalil shahih dan manhaj salaf.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-stone-800">
                {preferences.completedLessons.length} / 450 Topik Selesai
              </span>
            </div>
          </div>

          {/* Dynamic Branches Horizontal Tab Selector */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((b) => {
              const isActive = b.id === activeBranchId;
              const count = allTopics.filter((t) => t.categoryId === b.id).length;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBranchId(b.id);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-900 text-amber-200 shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Branch View (50 topics) */}
      {!selectedTopic ? (
        <div className="space-y-6">
          {/* Active Branch Description Card */}
          <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-amber-50 rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
                Cabang: {activeBranch.name}
              </span>
              <span className="font-arabic text-lg text-emerald-200" dir="rtl">
                {activeBranch.nameAr}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {activeBranch.subtitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
              {activeBranch.description}
            </p>

            {/* Search within branch */}
            <div className="pt-3">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari dari 50 pokok bahasan ${activeBranch.name}...`}
                  className="w-full pl-9 pr-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 50 Topics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTopics.map((topic) => {
              const isCompleted = preferences.completedLessons.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => handleOpenTopic(topic)}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-900 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                      {topic.number}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate group-hover:text-emerald-900">
                          {topic.title}
                        </h4>
                        {isCompleted && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {topic.objective}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TOPIC DEEP DIVE (All 12 Required Sections) */
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-lg space-y-8 animate-fade-in">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar 50 Pokok</span>
            </button>

            <div className="flex items-center gap-2">
              {adminAuth.isAdmin() && onOpenAdminTopic && (
                <button
                  onClick={() => onOpenAdminTopic(selectedTopic.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  title="Edit Seluruh Bagian Materi Ini di CMS"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-900" />
                  <span>Edit di CMS</span>
                </button>
              )}

              <span className="text-[11px] font-mono uppercase bg-emerald-50 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                {selectedTopic.categoryName} · #{selectedTopic.number}
              </span>
              <button
                onClick={handleMarkCompleted}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isCurrentTopicCompleted
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-amber-100 shadow-xs'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isCurrentTopicCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
              </button>
            </div>
          </div>

          {/* 1. Judul Pembahasan */}
          <div className="text-center space-y-2 border-b border-stone-100 pb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-800">
              Pokok Pembahasan Ke-{selectedTopic.number}
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              {selectedTopic.title}
            </h1>
            <p className="font-arabic text-2xl text-emerald-950 font-bold" dir="rtl">
              {selectedTopic.titleAr}
            </p>
          </div>

          {/* Notice: Transparent in_progress alert */}
          {selectedTopic.status === 'in_progress' && (
            <div className="rounded-2xl bg-amber-50/90 border border-amber-300 p-6 sm:p-8 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-700 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-amber-950">Materi ini sedang disusun</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                Konten lengkap belum tersedia atau sedang dalam proses verifikasi rujukan kitab muktabar Ahlusunah wal Jama'ah. Pengelola berkomitmen menjaga amanah ilmiah dan tidak menampilkan kutipan sebelum terverifikasi.
              </p>
              {adminAuth.isAdmin() && onOpenAdminTopic && (
                <button
                  onClick={() => onOpenAdminTopic(selectedTopic.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs shadow-xs transition"
                >
                  Lengkapi Naskah Materi Ini di Panel CMS
                </button>
              )}
            </div>
          )}

          {/* 2. Tujuan Pembelajaran */}
          <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-950 block">1. Tujuan Pembelajaran:</span>
            <p className="text-stone-700 leading-relaxed">{selectedTopic.objective}</p>
          </div>

          {/* 3. Definisi Bahasa & Syar'i */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-900 block">2. Definisi Bahasa (Etimologi):</span>
              <p className="text-stone-700 leading-relaxed">{selectedTopic.linguisticDef}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-900 block">3. Definisi Syar'i (Terminologi):</span>
              <p className="text-stone-700 leading-relaxed">{selectedTopic.syariDef}</p>
            </div>
          </div>

          {/* 4. Penjelasan Sistematis */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-stone-900">
              4. Penjelasan Sistematis & Komprehensif
            </h3>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-stone-800">
              {selectedTopic.systematicExplanation.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* 5. Dalil Al-Qur'an */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                5. Dalil Al-Qur'anul Karim:
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-900">
                {selectedTopic.quranDalil.surahRef}
              </span>
            </div>
            <p className="font-arabic text-xl sm:text-2xl text-stone-950 leading-loose text-right" dir="rtl">
              {selectedTopic.quranDalil.arabic}
            </p>
            <p className="text-xs sm:text-sm text-stone-800 italic border-t border-emerald-200/60 pt-2">
              "{selectedTopic.quranDalil.translation}"
            </p>
          </div>

          {/* 6. Hadis yang Relevan & Takhrij */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                6. Hadits Nabawi & Status Takhrij:
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300">
                {selectedTopic.hadithDalil.grade}
              </span>
            </div>
            <p className="font-arabic text-xl sm:text-2xl text-stone-950 leading-loose text-right" dir="rtl">
              {selectedTopic.hadithDalil.arabic}
            </p>
            <p className="text-xs sm:text-sm text-stone-800 italic border-t border-amber-200/60 pt-2">
              "{selectedTopic.hadithDalil.translation}"
            </p>
            <div className="text-[11px] text-stone-500 pt-1 flex items-center gap-3">
              <span>Sumber: {selectedTopic.hadithDalil.source}</span>
              <span>·</span>
              <span>Penilai: {selectedTopic.hadithDalil.scholar}</span>
            </div>
          </div>

          {/* 7. Penjelasan Ulama & Referensi Kitab */}
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-1.5 text-xs sm:text-sm">
            <span className="font-bold text-stone-900 block">
              7. Penjelasan Ulama ({selectedTopic.ulamaExplanation.scholar} — {selectedTopic.ulamaExplanation.bookRef}):
            </span>
            <p className="text-stone-700 leading-relaxed italic">
              "{selectedTopic.ulamaExplanation.notes}"
            </p>
          </div>

          {/* 8. Rincian Hukum & Penerapan Kehidupan */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
              8. Rincian Hukum dan Penerapan dalam Kehidupan Modern
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-stone-700">
              {selectedTopic.legalDetailsAndModernApp.map((app, idx) => (
                <li key={idx}>{app}</li>
              ))}
            </ul>
          </div>

          {/* 9. Perbedaan Pendapat Ulama (Khilaf) */}
          {selectedTopic.ikhtilafNotes && (
            <div className="rounded-xl bg-purple-50/70 border border-purple-200 p-4 space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-purple-950 block">9. Catatan Khilafiyah & Adab Perbedaan:</span>
              <p className="text-stone-700 leading-relaxed">{selectedTopic.ikhtilafNotes}</p>
            </div>
          )}

          {/* 10. Kesimpulan */}
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4 space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-emerald-950 block">10. Kesimpulan Ilmiah:</span>
            <p className="text-stone-800 leading-relaxed font-medium">{selectedTopic.conclusion}</p>
          </div>

          {/* 11. Referensi Bacaan Lanjutan */}
          <div className="text-xs text-stone-500 border-t border-stone-200 pt-3 flex flex-wrap gap-2">
            <strong className="text-stone-700">11. Referensi Lanjutan:</strong>
            {selectedTopic.furtherReading.map((b, idx) => (
              <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded">
                • {b}
              </span>
            ))}
          </div>

          {/* 12. Kuis Evaluasi Interaktif */}
          <div className="rounded-2xl bg-stone-900 text-stone-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                12. Kuis Evaluasi Pemahaman
              </span>
              {isQuizSubmitted && (
                <span className="text-xs font-semibold text-emerald-400">Jawaban Diperiksa</span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-semibold text-white">
              {selectedTopic.quiz.question}
            </h4>

            <div className="space-y-2">
              {selectedTopic.quiz.options.map((opt, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                const isCorrect = optIdx === selectedTopic.quiz.correctIndex;
                let btnStyle = 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700';

                if (isQuizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-800 text-white border-emerald-500 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-900 text-white border-rose-500';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-amber-500 text-stone-950 font-bold border-amber-400';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!isQuizSubmitted) setSelectedQuizOption(optIdx);
                    }}
                    disabled={isQuizSubmitted}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isQuizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-300" />}
                  </button>
                );
              })}
            </div>

            {isQuizSubmitted && (
              <div className="p-3.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-300 space-y-1">
                <strong className="text-amber-400">Keterangan:</strong>
                <p>{selectedTopic.quiz.explanation}</p>
              </div>
            )}

            {!isQuizSubmitted && (
              <button
                onClick={() => setIsQuizSubmitted(true)}
                disabled={selectedQuizOption === null}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold text-xs shadow-xs disabled:opacity-40"
              >
                Periksa Jawaban Kuis
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
