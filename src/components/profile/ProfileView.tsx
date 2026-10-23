import React, { useState } from 'react';
import { 
  User, 
  BookmarkCheck, 
  PenTool, 
  Clock, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  PlusCircle, 
  BookOpen,
  ArrowRight,
  Database,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Bookmark, UserNote, ReadingProgress, UserPreferences, Book, DalilItem } from '../../types';
import { storage } from '../../utils/storage';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface ProfileViewProps {
  preferences: UserPreferences;
  bookmarks: Bookmark[];
  notes: UserNote[];
  readingHistory: ReadingProgress[];
  onOpenBook: (bookId: string, chapterId?: string) => void;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onRefreshData: () => void;
  onAddNewCustomBook?: (book: Book) => void;
  onAddNewCustomDalil?: (dalil: DalilItem) => void;
  onOpenAbout: () => void;
  onOpenReportModal: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  preferences,
  bookmarks,
  notes,
  readingHistory,
  onOpenBook,
  onUpdatePreferences,
  onRefreshData,
  onAddNewCustomBook,
  onAddNewCustomDalil,
  onOpenAbout,
  onOpenReportModal,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'notes' | 'history' | 'admin' | 'creator'>('bookmarks');
  const [nameInput, setNameInput] = useState(preferences.userName);
  const [isEditingName, setIsEditingName] = useState(false);

  // New Custom Book Modal State for Admin Panel
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitleId, setNewBookTitleId] = useState('');
  const [newBookTitleAr, setNewBookTitleAr] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<string>('hadits');
  const [newBookDesc, setNewBookDesc] = useState('');
  const [newBookChapterTitle, setNewBookChapterTitle] = useState('');
  const [newBookTextAr, setNewBookTextAr] = useState('');
  const [newBookTextId, setNewBookTextId] = useState('');

  // Backup Export/Import states
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleSaveName = () => {
    onUpdatePreferences({ userName: nameInput.trim() || 'Penuntut Ilmu' });
    setIsEditingName(false);
  };

  const handleDeleteBookmark = (id: string) => {
    storage.removeBookmark(id);
    onRefreshData();
  };

  const handleDeleteNote = (id: string) => {
    storage.deleteNote(id);
    onRefreshData();
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `al_maktabah_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Cadangan data berhasil diunduh.');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importBackupJson(content);
      if (success) {
        onRefreshData();
        setBackupStatus('Data berhasil dipulihkan dari berkas cadangan.');
      } else {
        setBackupStatus('Gagal memulihkan: Berkas tidak sesuai format.');
      }
      setTimeout(() => setBackupStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleCreateCustomBook = () => {
    if (!newBookTitleId.trim() || !newBookTitleAr.trim() || !newBookAuthor.trim()) {
      alert('Mohon lengkapi judul dan nama penulis.');
      return;
    }

    const createdBook: Book = {
      id: 'custom_' + Date.now(),
      titleAr: newBookTitleAr.trim(),
      titleId: newBookTitleId.trim(),
      author: newBookAuthor.trim(),
      authorDeathYear: 'Verifikasi Tim Editorial',
      category: newBookCategory as any,
      categoryLabel: newBookCategory.toUpperCase(),
      language: 'Bahasa Arab & Terjemahan',
      manuscriptSource: 'Naskah Digital Terverifikasi',
      publisherEdition: 'Input Panel Administrasi',
      completionStatus: 'Seleksi Bab Pokok',
      verifiedDate: new Date().toISOString().slice(0, 10),
      verifiedBy: preferences.userName || 'Admin Peneliti',
      description: newBookDesc.trim() || 'Kitab rujukan ilmiah yang dihimpun melalui panel administrasi.',
      chaptersCount: 1,
      audioAvailable: false,
      chapters: [
        {
          id: 'chap_1',
          number: 1,
          titleAr: 'الْبَابُ الأَوَّلُ',
          titleId: newBookChapterTitle.trim() || 'Bab Pertama',
          sections: [
            {
              id: 'sec_1',
              number: 1,
              classification: 'penjelasan_ulama',
              contentAr: newBookTextAr.trim() || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              contentId: newBookTextId.trim() || 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
            },
          ],
        },
      ],
    };

    storage.saveCustomBook(createdBook);
    if (onAddNewCustomBook) onAddNewCustomBook(createdBook);
    setShowAddBookModal(false);
    onRefreshData();
    alert('Kitab baru berhasil ditambahkan ke database perpustakaan.');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-md">
              {preferences.userName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-white text-stone-900 text-sm font-semibold focus:outline-hidden"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-emerald-950 text-xs font-bold"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-bold text-white">
                    {preferences.userName}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-amber-300 hover:text-white underline"
                  >
                    Ubah
                  </button>
                </div>
              )}
              <p className="text-xs text-emerald-200/80">
                Penuntut Ilmu Syar'i · Al-Maktabah Al-Islamiyyah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Lapor Koreksi</span>
            </button>
            <PWAInstallButton />
          </div>
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/60 text-center">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
            <span className="text-lg font-bold text-amber-300 font-mono">
              {bookmarks.length}
            </span>
            <p className="text-[11px] text-emerald-200">Penanda Kitab</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
            <span className="text-lg font-bold text-amber-300 font-mono">
              {notes.length}
            </span>
            <p className="text-[11px] text-emerald-200">Catatan Pelajaran</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
            <span className="text-lg font-bold text-amber-300 font-mono">
              {readingHistory.length}
            </span>
            <p className="text-[11px] text-emerald-200">Kitab Dibaca</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
            <span className="text-lg font-bold text-amber-300 font-mono">
              {preferences.completedLessons.length}
            </span>
            <p className="text-[11px] text-emerald-200">Topik Selesai</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'bookmarks', label: 'Penanda (Bookmark)', count: bookmarks.length },
          { id: 'notes', label: 'Catatan Pribadi', count: notes.length },
          { id: 'history', label: 'Riwayat Bacaan', count: readingHistory.length },
          { id: 'creator', label: 'Identitas Pengembang', count: undefined },
          { id: 'admin', label: 'Panel Administrasi', count: undefined },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-emerald-900 text-amber-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Bookmarks */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-600/50 transition"
            >
              <div
                onClick={() => onOpenBook(bm.bookId, bm.chapterId)}
                className="space-y-1 cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-xs text-emerald-950 truncate">
                    {bm.bookTitleId} · {bm.chapterTitle}
                  </span>
                </div>
                <p className="text-xs text-stone-600 line-clamp-1 italic">
                  "{bm.textSnippet}"
                </p>
                <p className="text-[10px] text-stone-400">
                  Ditandai pada {new Date(bm.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onOpenBook(bm.bookId, bm.chapterId)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-lg text-xs font-semibold"
                >
                  Buka
                </button>
                <button
                  onClick={() => handleDeleteBookmark(bm.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                  title="Hapus Penanda"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {bookmarks.length === 0 && (
            <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
              <BookmarkCheck className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">Belum ada penanda halaman yang disimpan.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Notes */}
      {activeSubTab === 'notes' && (
        <div className="space-y-3">
          {notes.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 hover:border-emerald-600/50 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900">
                  {n.bookTitleId} · {n.chapterTitle}
                </span>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {n.quoteSnippet && (
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-600 italic">
                  "{n.quoteSnippet}"
                </div>
              )}

              <div className="text-xs sm:text-sm text-stone-900 leading-relaxed font-medium">
                {n.noteText}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Diperbarui: {new Date(n.updatedAt).toLocaleDateString('id-ID')}</span>
                <button
                  onClick={() => onOpenBook(n.bookId, n.chapterId)}
                  className="text-emerald-800 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Buka Bab Terkait</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
              <PenTool className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">Belum ada catatan pelajaran yang disimpan.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reading History */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          {readingHistory.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Progres: {item.progressPercent}%
                </span>
                <h4 className="font-semibold text-xs text-stone-900 truncate">
                  {item.bookTitle}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">
                  Terakhir pada bab: {item.lastChapterTitle}
                </p>
              </div>

              <button
                onClick={() => onOpenBook(item.bookId, item.lastChapterId)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-lg text-xs font-semibold shrink-0"
              >
                Lanjutkan
              </button>
            </div>
          ))}

          {readingHistory.length === 0 && (
            <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
              <Clock className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">Belum ada riwayat membaca yang tersimpan.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Creator Attribution Section (Section XIV) */}
      {activeSubTab === 'creator' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Identitas Pembuat Aplikasi (Section XIV)
              </h3>
              <p className="text-xs text-stone-500">
                Data resmi pengembang platform Al-Maktabah Al-Islamiyyah
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <p>
                <strong>Nama Aplikasi:</strong>{' '}
                <span className="font-serif font-bold text-stone-900">Al-Maktabah Al-Islamiyyah</span>
              </p>
              <p>
                <strong>Nama Lengkap Pengembang:</strong>{' '}
                <span className="font-semibold text-emerald-950">Jundi Abdul Syahid, S.Pd.</span>
              </p>
              <p>
                <strong>Identitas Kreator:</strong>{' '}
                <span className="font-semibold text-stone-800">Orang Dalam Genetik Jawa</span>
              </p>
            </div>

            <div className="border-t border-amber-200/60 pt-3 space-y-1">
              <strong>Deskripsi Platform:</strong>
              <p className="text-stone-700 leading-relaxed italic">
                "Perpustakaan digital dan platform pembelajaran Islam yang dikembangkan untuk memudahkan penelusuran kitab, dalil, dan khazanah keilmuan Islam."
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onOpenAbout}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span>Buka Modal Lengkap Tentang Aplikasi</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Sampaikan Koreksi Naskah</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Admin Panel & Data Management */}
      {activeSubTab === 'admin' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Panel Administrasi Konten & Verifikasi Naskah
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('admin')}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-900" />
                    <span>Buka Admin Dashboard CMS Lengkap</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Kitab</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Panel ini disediakan bagi pengelola perpustakaan untuk meninjau database rujukan, memastikan naskah memenuhi standar Ahlusunah wal Jama'ah, dan memelihara data referensi tanpa manipulasi teks asli.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800">Status Integritas Data</span>
                <p className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 450 Topik Terverifikasi
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800">Penyimpanan Aktif</span>
                <p className="text-stone-600">Lokal Browser + Cache PWA</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800">Khutbah Studio AI</span>
                <p className="text-emerald-700 font-semibold">Tersedia Full-Stack</p>
              </div>
            </div>
          </div>

          {/* Backup & Restore Management */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-800" />
              Pencadangan & Pemulihan Data (Backup & Restore)
            </h3>
            <p className="text-xs text-stone-600">
              Ekspor seluruh catatan, penanda, riwayat bacaan, dan kitab kustom Anda ke berkas JSON untuk dicadangkan atau dipindahkan ke perangkat lain.
            </p>

            {backupStatus && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                {backupStatus}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Unduh Cadangan JSON</span>
              </button>

              <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-amber-700" />
                <span>Pulihkan dari Berkas JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Tambah Kitab Terverifikasi Baru
              </h3>
              <button
                onClick={() => setShowAddBookModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Judul Indonesia:</label>
                <input
                  type="text"
                  value={newBookTitleId}
                  onChange={(e) => setNewBookTitleId(e.target.value)}
                  placeholder="Contoh: Kitab At-Tauhid"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Judul Arab:</label>
                <input
                  type="text"
                  value={newBookTitleAr}
                  onChange={(e) => setNewBookTitleAr(e.target.value)}
                  placeholder="Contoh: كِتَابُ التَّوْحِيدِ"
                  dir="rtl"
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs font-arabic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nama Penulis:</label>
                  <input
                    type="text"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="Nama Ulama / Penulis"
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kategori:</label>
                  <select
                    value={newBookCategory}
                    onChange={(e) => setNewBookCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    <option value="quran">Al-Qur'an & Tafsir</option>
                    <option value="hadits">Hadits & Ulumul Hadits</option>
                    <option value="akidah">Akidah Ahlusunah</option>
                    <option value="fikih">Fikih Empat Mazhab</option>
                    <option value="sirah">Sirah & Tarikh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deskripsi:</label>
                <textarea
                  value={newBookDesc}
                  onChange={(e) => setNewBookDesc(e.target.value)}
                  placeholder="Uraian ringkas isi kitab..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-800 block mb-2">Bab Pertama:</span>
                <input
                  type="text"
                  value={newBookChapterTitle}
                  onChange={(e) => setNewBookChapterTitle(e.target.value)}
                  placeholder="Judul Bab Pertama"
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs mb-2"
                />
                <textarea
                  value={newBookTextAr}
                  onChange={(e) => setNewBookTextAr(e.target.value)}
                  placeholder="Teks Arab asli berharakat..."
                  dir="rtl"
                  rows={3}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs font-arabic mb-2"
                />
                <textarea
                  value={newBookTextId}
                  onChange={(e) => setNewBookTextId(e.target.value)}
                  placeholder="Terjemahan resmi bahasa Indonesia..."
                  rows={2}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateCustomBook}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold shadow-xs"
              >
                Simpan ke Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
