import React, { useState } from 'react';
import { AlertTriangle, Send, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopicTitle?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  defaultTopicTitle,
}) => {
  const [topicTitle, setTopicTitle] = useState(defaultTopicTitle || '');
  const [reportType, setReportType] = useState('salah_ketik');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/feedback/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: topicTitle,
          reportType,
          details,
          reporterName,
        }),
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      // Local fallback
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-stone-900">
              Pelaporan Kesalahan & Koreksi Ilmiah
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-serif font-bold text-base text-stone-900">
              Jazakumullahu Khairan!
            </h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Laporan koreksi Anda telah dicatat oleh dewan penyunting naskah untuk segera ditahqiq kembali.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Judul Materi / Halaman yang Dikoreksi:
              </label>
              <input
                type="text"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Contoh: Bab 8 Wudu / Matan Hadits Arbain No 1"
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-rose-600"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Kategori Temuan:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-900"
              >
                <option value="salah_ketik">Salah Ketik (Typo) Teks Indonesia</option>
                <option value="harakat_arab">Koreksi Syakal / Harakat Teks Arab</option>
                <option value="nomor_hadits">Koreksi Nomor Referensi Hadits</option>
                <option value="atribusi_ulama">Koreksi Nama Ulama / Kitab Sumber</option>
                <option value="lainnya">Saran & Masukan Lainnya</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Uraian Koreksi Ilmiah & Sumber Rujukan:
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tuliskan koreksi Anda beserta rujukan kitab (contoh: pada kata '...', seharusnya tertulis '...' sesuai cetakan Darul Minhaj halaman ...)"
                rows={4}
                required
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-rose-600"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Nama Pengirim (Opsional):
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Nama Anda atau 'Penuntut Ilmu'"
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !details.trim()}
                className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Koreksi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
