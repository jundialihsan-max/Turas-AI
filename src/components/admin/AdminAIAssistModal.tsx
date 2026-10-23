import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  FileCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { cmsClient } from '../../utils/cmsClient';

interface AdminAIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  categoryName: string;
  currentContent: any;
  onApplyToEditor: (generatedData: any) => void;
}

export const AdminAIAssistModal: React.FC<AdminAIAssistModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  categoryName,
  currentContent,
  onApplyToEditor,
}) => {
  if (!isOpen) return null;

  const [selectedAction, setSelectedAction] = useState<
    'draft_topic' | 'expand_explanation' | 'simplify_language' | 'check_consistency' | 'generate_quiz'
  >('draft_topic');

  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const actions = [
    {
      id: 'draft_topic',
      title: 'Buat Draf Lengkap 12 Bagian',
      desc: 'Menyusun draf komprehensif berharakat dari sumber muktabar',
      icon: BookOpen,
    },
    {
      id: 'expand_explanation',
      title: 'Kembangkan Uraian Penjelasan',
      desc: 'Memperdalam narasi ilmiah agar sistematis dan kaya faedah',
      icon: Layers,
    },
    {
      id: 'check_consistency',
      title: 'Periksa Kesesuaian & Deteksi Klise',
      desc: 'Mengevaluasi relevansi dalil terhadap bab dan menemukan pengulangan',
      icon: ShieldCheck,
    },
    {
      id: 'generate_quiz',
      title: 'Susun Kuis Evaluasi Pemahaman',
      desc: 'Menghasilkan 1 soal pilihan ganda berbobot dengan pembahasan',
      icon: HelpCircle,
    },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await cmsClient.requestAIAssist(
        selectedAction,
        topicTitle || 'Materi Syar\'i',
        categoryName,
        currentContent
      );
      if (res.success) {
        setResultData(res.data);
      } else {
        setErrorMsg('Gagal memproses permintaan asisten AI');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!resultData) return;

    if (selectedAction === 'draft_topic') {
      onApplyToEditor(resultData);
    } else if (selectedAction === 'expand_explanation' && resultData.expandedParagraphs) {
      onApplyToEditor({ systematicExplanation: resultData.expandedParagraphs });
    } else if (selectedAction === 'generate_quiz' && resultData.question) {
      onApplyToEditor({ quiz: resultData });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-amber-50 flex items-center justify-between border-b border-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-emerald-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-100">
                Asisten AI Manajemen Konten Islam
              </h3>
              <p className="text-xs text-emerald-200">
                Bantuan penyusunan draf berbasis dalil Al-Qur'an dan Sunnah (Amanah Ilmiah)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-stone-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Topic Context */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">
                Target Materi:
              </span>
              <span className="font-serif font-bold text-sm text-stone-900">
                {topicTitle || '(Belum diberi judul)'}
              </span>
              <span className="text-stone-500 ml-2">({categoryName})</span>
            </div>
          </div>

          {/* Action Selector */}
          <div className="space-y-2">
            <label className="font-bold text-stone-800 block">
              Pilih Jenis Bantuan AI:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {actions.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedAction === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setSelectedAction(act.id as any);
                      setResultData(null);
                    }}
                    className={`p-3 rounded-xl text-left border transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <div>
                      <div className="font-bold text-xs">{act.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{act.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          {!resultData && (
            <div className="text-center pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs shadow-md transition flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Menyusun Naskah Ilmiah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Mulai Proses Asisten AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Review Preview */}
          {resultData && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Hasil Draf Asisten AI Siap Ditinjau
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                  Status: Draf Editor
                </span>
              </div>

              {resultData.titleAr && (
                <div>
                  <span className="font-bold text-stone-700 block text-[11px]">Judul Arab Berharakat:</span>
                  <p className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">{resultData.titleAr}</p>
                </div>
              )}

              {resultData.objective && (
                <div>
                  <span className="font-bold text-stone-700 block text-[11px]">Tujuan Pembelajaran:</span>
                  <p className="text-stone-700">{resultData.objective}</p>
                </div>
              )}

              {resultData.quranDalil?.arabic && (
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900 block text-[10px]">Dalil Al-Qur'an ({resultData.quranDalil.surahRef}):</span>
                  <p className="font-arabic text-base text-right leading-loose" dir="rtl">{resultData.quranDalil.arabic}</p>
                  <p className="italic text-[11px] text-stone-600 mt-1">"{resultData.quranDalil.translation}"</p>
                </div>
              )}

              {resultData.critique && (
                <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                  <strong className="block text-stone-800">Evaluasi Kesesuaian:</strong>
                  <p className="text-stone-700">{resultData.critique}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs"
          >
            Tutup
          </button>

          {resultData && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <span>Masukkan ke Formulir Editor</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
