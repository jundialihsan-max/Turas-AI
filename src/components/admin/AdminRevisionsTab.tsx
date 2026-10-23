import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  Eye, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { TopicRevision, CMSTopic } from '../../types/cms';

interface AdminRevisionsTabProps {
  revisions: TopicRevision[];
  allTopics: CMSTopic[];
  onRollback: (revisionId: string) => Promise<{ success: boolean; message: string }>;
  onRefresh: () => void;
}

export const AdminRevisionsTab: React.FC<AdminRevisionsTabProps> = ({
  revisions,
  allTopics,
  onRollback,
  onRefresh,
}) => {
  const [selectedRevision, setSelectedRevision] = useState<TopicRevision | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRollback = async (revId: string) => {
    if (!window.confirm('Pulihkan materi ke versi snapshot ini? Tindakan ini akan menyimpan versi baru pemulihan.')) {
      return;
    }
    setIsRollingBack(true);
    try {
      const res = await onRollback(revId);
      setNotice(res.message);
      setSelectedRevision(null);
      setTimeout(() => setNotice(null), 3500);
    } finally {
      setIsRollingBack(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-800" />
            Riwayat Perubahan & Audit Trail (Version History)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap pembaruan naskah dicatat lengkap dengan snapshot untuk audit ilmiah dan pemulihan instan.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Ulang Log</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Revision List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100">
        {revisions.map((rev) => {
          return (
            <div
              key={rev.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Versi {rev.version}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {rev.topicTitle}
                  </h4>
                </div>

                <p className="text-xs text-stone-600 italic">
                  "{rev.changeSummary}"
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-500" />
                    <strong>{rev.editorName}</strong> ({rev.editorEmail})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    {new Date(rev.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedRevision(rev)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Snapshot</span>
                </button>

                <button
                  disabled={isRollingBack}
                  onClick={() => handleRollback(rev.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pulihkan Versi Ini</span>
                </button>
              </div>
            </div>
          );
        })}

        {revisions.length === 0 && (
          <div className="py-16 text-center text-stone-400 space-y-2">
            <History className="w-8 h-8 mx-auto text-stone-300" />
            <p className="text-xs">Belum ada riwayat revisi tercatat.</p>
          </div>
        )}
      </div>

      {/* Snapshot Preview Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  Snapshot Versi {selectedRevision.version}
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                  {selectedRevision.topicTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRevision(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <strong>Tujuan Pembelajaran:</strong>
                <p className="text-stone-700">{selectedRevision.snapshot.objective}</p>
              </div>

              <div className="space-y-1">
                <strong>Uraian Penjelasan:</strong>
                <div className="space-y-1.5 text-stone-700">
                  {selectedRevision.snapshot.systematicExplanation?.map((p, i) => (
                    <p key={i} className="p-2 bg-stone-50 rounded-lg border border-stone-200">{p}</p>
                  ))}
                </div>
              </div>

              {selectedRevision.snapshot.quranDalil?.arabic && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <strong>Dalil Al-Qur'an ({selectedRevision.snapshot.quranDalil.surahRef}):</strong>
                  <p className="font-arabic text-base text-right" dir="rtl">{selectedRevision.snapshot.quranDalil.arabic}</p>
                  <p className="italic text-stone-600">"{selectedRevision.snapshot.quranDalil.translation}"</p>
                </div>
              )}

              {selectedRevision.snapshot.hadithDalil?.arabic && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <strong>Hadits Nabawi ({selectedRevision.snapshot.hadithDalil.source}):</strong>
                  <p className="font-arabic text-base text-right" dir="rtl">{selectedRevision.snapshot.hadithDalil.arabic}</p>
                  <p className="italic text-stone-600">"{selectedRevision.snapshot.hadithDalil.translation}"</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRevision(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs"
              >
                Tutup Pratinjau
              </button>
              <button
                onClick={() => handleRollback(selectedRevision.id)}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>Pulihkan ke Versi Ini Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
