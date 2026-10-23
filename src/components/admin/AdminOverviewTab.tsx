import React from 'react';
import { 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  HelpCircle, 
  CopyCheck, 
  History, 
  Trash2, 
  Sparkles,
  PlusCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { CMSOverviewStats } from '../../types/cms';

interface AdminOverviewTabProps {
  stats: CMSOverviewStats | null;
  onNavigateTab: (tabId: string) => void;
  onOpenNewTopic: () => void;
  onScanDuplicates: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  stats,
  onNavigateTab,
  onOpenNewTopic,
  onScanDuplicates,
}) => {
  if (!stats) {
    return (
      <div className="p-12 text-center text-stone-500">
        <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Memuat data ringkasan CMS...</p>
      </div>
    );
  }

  const statCards = [
    {
      id: 'categories',
      label: 'Kategori Ilmu',
      value: stats.totalCategories,
      desc: '9 Cabang Utama & Kustom',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      actionTab: 'categories',
    },
    {
      id: 'topics',
      label: 'Total Topik Materi',
      value: stats.totalTopics,
      desc: 'Seluruh kurikulum aktif',
      icon: BookOpen,
      color: 'bg-stone-50 text-stone-800 border-stone-200',
      actionTab: 'topics',
    },
    {
      id: 'published',
      label: 'Materi Lengkap / Terbit',
      value: stats.totalPublished,
      desc: 'Naskah diverifikasi',
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      actionTab: 'topics',
      filter: 'published',
    },
    {
      id: 'in_progress',
      label: 'Dalam Penyusunan',
      value: stats.totalInProgress,
      desc: 'Transparan belum terisi',
      icon: FileText,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      actionTab: 'topics',
      filter: 'in_progress',
    },
    {
      id: 'drafts',
      label: 'Draf & Perlu Review',
      value: stats.totalDrafts + stats.totalNeedsReview,
      desc: 'Menunggu penerbitan',
      icon: AlertCircle,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      actionTab: 'drafts',
    },
    {
      id: 'duplicates',
      label: 'Terindikasi Duplikat',
      value: stats.totalDuplicateFlagged,
      desc: 'Pola teks/dalil sama',
      icon: CopyCheck,
      color: stats.totalDuplicateFlagged > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-stone-50 text-stone-600 border-stone-200',
      actionTab: 'duplicates',
      badge: stats.totalDuplicateFlagged > 0 ? 'Perlu Audit' : 'Aman',
    },
    {
      id: 'dalil',
      label: 'Perpustakaan Dalil',
      value: stats.totalSharedDalils,
      desc: 'Al-Qur\'an & Hadits bersama',
      icon: HelpCircle,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      actionTab: 'dalil',
    },
    {
      id: 'revisions',
      label: 'Riwayat Perubahan',
      value: stats.totalRevisions,
      desc: 'Log audit tersimpan',
      icon: History,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      actionTab: 'revisions',
    },
    {
      id: 'trash',
      label: 'Tempat Sampah',
      value: stats.totalInTrash,
      desc: 'Item dapat dipulihkan',
      icon: Trash2,
      color: 'bg-stone-50 text-stone-700 border-stone-200',
      actionTab: 'topics',
      filter: 'trash',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for Quality & Amanah Ilmiah */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-amber-50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200">
              Prinsip Integritas Konten Ilmiah Ahlusunah
            </h2>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
            Setiap materi yang belum memiliki naskah mandiri ditandai secara jujur sebagai <strong>"Dalam Penyusunan"</strong>. Hindari duplikasi templat, dan gunakan editor atau asisten AI untuk mengisi naskah berbasis dalil shahih.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewTopic}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tambah Materi Baru</span>
          </button>
          <button
            onClick={onScanDuplicates}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 font-semibold text-xs border border-emerald-700 transition flex items-center gap-1.5"
          >
            <CopyCheck className="w-4 h-4 text-amber-400" />
            <span>Audit Duplikasi</span>
          </button>
        </div>
      </div>

      {/* 9-Card Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab(card.actionTab)}
              className={`p-4 rounded-2xl border shadow-xs transition hover:shadow-md cursor-pointer flex flex-col justify-between ${card.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{card.label}</span>
                <Icon className="w-4 h-4 opacity-70" />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif">{card.value}</div>
                <div className="flex items-center justify-between text-[11px] opacity-80 mt-1">
                  <span>{card.desc}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Workflows / Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Alur Penyempurnaan Materi
          </h3>
          <ul className="text-xs text-stone-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>Buka menu <strong>"Pemeriksaan Duplikasi"</strong> untuk mendeteksi materi yang masih menggunakan templat pengulangan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>Gunakan tombol <strong>"Edit Mandiri"</strong> untuk mengisi naskah otentik dari kitab rujukan primer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>Manfaatkan <strong>"Asisten AI"</strong> untuk merumuskan draf 12 bagian berharakat, kemudian periksa kembali sebelum diterbitkan.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            Keamanan Data & Pemulihan
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Semua aksi penghapusan menggunakan <strong>Soft Delete</strong> ke Tempat Sampah dan setiap perubahan menyimpan snapshot revisi lengkap. Anda dapat membatalkan atau memulihkan versi materi kapan pun tanpa risiko kehilangan naskah.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('revisions')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>Lihat Riwayat Revisi</span>
            </button>
            <button
              onClick={() => onNavigateTab('settings')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cadangan JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
