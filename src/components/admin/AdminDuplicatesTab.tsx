import React, { useState } from 'react';
import { 
  CopyCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { DuplicateReportItem, CMSTopic } from '../../types/cms';

interface AdminDuplicatesTabProps {
  reports: DuplicateReportItem[];
  allTopics: CMSTopic[];
  onOpenEdit: (topic: CMSTopic) => void;
  onResolve: (topicId: string, action: 'mark_unique' | 'convert_draft' | 'delete') => Promise<void>;
  onRefresh: () => void;
}

export const AdminDuplicatesTab: React.FC<AdminDuplicatesTabProps> = ({
  reports,
  allTopics,
  onOpenEdit,
  onResolve,
  onRefresh,
}) => {
  const [comparingItem, setComparingItem] = useState<{
    target: CMSTopic;
    base: CMSTopic;
    report: DuplicateReportItem;
  } | null>(null);

  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleOpenDiff = (report: DuplicateReportItem) => {
    const target = allTopics.find((t) => t.id === report.topicId);
    const base = allTopics.find((t) => t.id === report.comparedToId);
    if (target && base) {
      setComparingItem({ target, base, report });
    }
  };

  const handleAction = async (topicId: string, action: 'mark_unique' | 'convert_draft' | 'delete') => {
    setResolvingId(topicId);
    try {
      await onResolve(topicId, action);
      if (comparingItem && comparingItem.target.id === topicId) {
        setComparingItem(null);
      }
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview notice */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <CopyCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Pemeriksaan Duplikasi & Integritas Isi Materi
              </h3>
              <p className="text-xs text-stone-500">
                Audit otomatis mendeteksi templat penjelasan berulang, kalimat klise, dan dalil identik tanpa uraian kontekstual.
              </p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pindai Ulang</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Kaidah Syar'i:</strong> Dalil Al-Qur'an dan Sunnah yang sama dapat relevan dalam berbagai topik. Yang diperiksa di sini adalah <em>apakah uraian penjelasan dan konteksnya benar-benar mandiri</em> atau sekadar salinan berulang dari templat umum. Jika materi belum disusun secara mandiri, ubah status menjadi <strong>"Dalam Penyusunan"</strong> atau lengkapi menggunakan tombol <strong>Edit Mandiri</strong>.
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800">
            Daftar Materi Terindikasi Pengulangan ({reports.length} Ditemukan)
          </span>
          <span className="text-[11px] font-mono text-stone-500">
            Algoritma: Jaccard N-Gram & Template Pattern Matcher
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-700 font-semibold">
                <th className="p-3">Judul Materi & Kategori</th>
                <th className="p-3 w-28 text-center">Tingkat Kemiripan</th>
                <th className="p-3">Materi Pembanding</th>
                <th className="p-3">Bagian yang Terindikasi Sama</th>
                <th className="p-3 text-right w-64">Tindakan Penyelesaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reports.map((r, idx) => {
                const targetTopic = allTopics.find((t) => t.id === r.topicId);

                return (
                  <tr key={idx} className="hover:bg-stone-50/80 transition">
                    <td className="p-3">
                      <div className="font-serif font-bold text-stone-900">{r.title}</div>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                        {r.categoryName}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full font-mono font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-300">
                        {r.similarityScore}% Sama
                      </span>
                      {r.isTemplateCopy && (
                        <span className="block text-[9px] text-rose-600 font-semibold mt-0.5">
                          Templat Loop
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="font-serif font-bold text-stone-800">{r.comparedToTitle}</div>
                      <span className="text-[11px] text-stone-500">{r.comparedToCategory}</span>
                    </td>

                    <td className="p-3">
                      <p className="text-[11px] text-stone-600 italic line-clamp-2">
                        "{r.flaggedTextSnippet}"
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {r.reasons.map((rs, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded"
                          >
                            {rs}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {/* Perbandingan Diff */}
                        <button
                          onClick={() => handleOpenDiff(r)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold flex items-center gap-1 transition"
                          title="Lihat Perbandingan Berdampingan"
                        >
                          <Eye className="w-3 h-3 text-stone-600" />
                          <span>Perbandingan</span>
                        </button>

                        {/* Edit Mandiri */}
                        {targetTopic && (
                          <button
                            onClick={() => onOpenEdit(targetTopic)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-[11px] font-semibold flex items-center gap-1 transition"
                            title="Tulis Naskah Mandiri Otentik"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Mandiri</span>
                          </button>
                        )}

                        {/* Tandai Dalam Penyusunan */}
                        <button
                          disabled={resolvingId === r.topicId}
                          onClick={() => handleAction(r.topicId, 'convert_draft')}
                          className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-semibold transition"
                          title="Ubah status materi menjadi Dalam Penyusunan"
                        >
                          Dalam Penyusunan
                        </button>

                        {/* Tandai Unik */}
                        <button
                          disabled={resolvingId === r.topicId}
                          onClick={() => handleAction(r.topicId, 'mark_unique')}
                          className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] transition"
                          title="Tandai materi ini sudah unik dan bukan duplikat"
                        >
                          Bukan Duplikat
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div className="py-16 text-center text-stone-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">
              Alhamdulillah! Tidak terdeteksi materi duplikat atau templat berulang.
            </p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Seluruh materi kurikulum memiliki identitas, penjelasan, dan dalil yang terverifikasi mandiri.
            </p>
          </div>
        )}
      </div>

      {/* Side-by-Side Diff Modal */}
      {comparingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-4 bg-emerald-900 text-amber-50 flex items-center justify-between border-b border-emerald-950">
              <div className="flex items-center gap-2">
                <CopyCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-amber-100">
                  Perbandingan Berdampingan: Deteksi Pengulangan
                </h3>
              </div>
              <button
                onClick={() => setComparingItem(null)}
                className="text-stone-300 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left Column: Target Material */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
                <span className="text-[10px] font-mono uppercase bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">
                  Materi Terindikasi #{comparingItem.target.number}
                </span>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  {comparingItem.target.title}
                </h4>
                <p className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
                  {comparingItem.target.titleAr}
                </p>

                <div className="border-t border-rose-200 pt-2 space-y-1">
                  <strong>Penjelasan:</strong>
                  <div className="space-y-1 text-stone-700">
                    {comparingItem.target.systematicExplanation?.map((p, i) => (
                      <p key={i} className="bg-white/80 p-1.5 rounded border border-rose-100">{p}</p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-rose-200 pt-2 space-y-1">
                  <strong>Dalil Hadits:</strong>
                  <p className="font-arabic text-sm text-right" dir="rtl">{comparingItem.target.hadithDalil?.arabic}</p>
                  <p className="italic text-[11px] text-stone-600">{comparingItem.target.hadithDalil?.translation}</p>
                </div>
              </div>

              {/* Right Column: Base Material */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-[10px] font-mono uppercase bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded">
                  Materi Pembanding #{comparingItem.base.number}
                </span>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  {comparingItem.base.title}
                </h4>
                <p className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
                  {comparingItem.base.titleAr}
                </p>

                <div className="border-t border-stone-200 pt-2 space-y-1">
                  <strong>Penjelasan:</strong>
                  <div className="space-y-1 text-stone-700">
                    {comparingItem.base.systematicExplanation?.map((p, i) => (
                      <p key={i} className="bg-white/80 p-1.5 rounded border border-stone-200">{p}</p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-2 space-y-1">
                  <strong>Dalil Hadits:</strong>
                  <p className="font-arabic text-sm text-right" dir="rtl">{comparingItem.base.hadithDalil?.arabic}</p>
                  <p className="italic text-[11px] text-stone-600">{comparingItem.base.hadithDalil?.translation}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Pilih tindakan penyelesaian untuk materi ini.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenEdit(comparingItem.target);
                    setComparingItem(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-amber-100 text-xs font-semibold"
                >
                  Edit Sekarang
                </button>
                <button
                  onClick={() => handleAction(comparingItem.target.id, 'convert_draft')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-bold"
                >
                  Ubah ke "Dalam Penyusunan"
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
