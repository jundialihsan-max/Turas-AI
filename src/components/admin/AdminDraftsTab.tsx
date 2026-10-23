import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  Edit3, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { CMSTopic } from '../../types/cms';

interface AdminDraftsTabProps {
  topics: CMSTopic[];
  onOpenEdit: (topic: CMSTopic) => void;
  onPublishTopic: (topic: CMSTopic) => Promise<void>;
}

export const AdminDraftsTab: React.FC<AdminDraftsTabProps> = ({
  topics,
  onOpenEdit,
  onPublishTopic,
}) => {
  const draftsAndPending = topics.filter(
    (t) => t.status === 'draft' || t.status === 'needs_review' || t.status === 'in_progress'
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" />
            Draf & Antrean Peninjauan Naskah ({draftsAndPending.length})
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar materi yang masih dalam proses penyusunan atau memerlukan review dalil sebelum dipublikasikan.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {draftsAndPending.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-600/40 transition"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    t.status === 'draft'
                      ? 'bg-stone-100 text-stone-700'
                      : t.status === 'needs_review'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {t.status === 'draft'
                    ? 'Draf'
                    : t.status === 'needs_review'
                    ? 'Perlu Ditinjau'
                    : 'Dalam Penyusunan'}
                </span>

                <span className="text-[11px] font-mono text-emerald-800 font-bold">
                  {t.categoryName} #{t.number}
                </span>

                <h4 className="font-serif font-bold text-sm text-stone-900">
                  {t.title}
                </h4>
              </div>

              <p className="text-xs text-stone-600 line-clamp-1 italic">
                {t.objective || 'Tujuan pembelajaran belum diisi...'}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Terakhir diperbarui: {new Date(t.updatedAt).toLocaleDateString('id-ID')}
                </span>
                <span>·</span>
                <span>Editor: {t.lastEditor}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenEdit(t)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Lengkapi di Editor</span>
              </button>

              <button
                onClick={() => onPublishTopic(t)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Terbitkan Langsung</span>
              </button>
            </div>
          </div>
        ))}

        {draftsAndPending.length === 0 && (
          <div className="py-16 text-center text-stone-400 space-y-2 bg-white rounded-2xl border border-stone-200 p-6">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <p className="text-xs font-semibold text-stone-700">
              Semua materi telah diterbitkan dalam status terverifikasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
