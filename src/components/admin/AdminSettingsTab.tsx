import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Download, 
  Upload, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';
import { adminAuth } from '../../utils/adminAuth';
import { cmsClient } from '../../utils/cmsClient';

interface AdminSettingsTabProps {
  onRefreshData: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ onRefreshData }) => {
  const [currentUser, setCurrentUser] = useState(adminAuth.getCurrentUser());
  const [backupMsg, setBackupMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleRoleToggle = (role: 'admin' | 'viewer') => {
    const updated = adminAuth.switchRole(role);
    setCurrentUser(updated);
    onRefreshData();
  };

  const handleExportJson = async () => {
    try {
      const data = await cmsClient.exportBackup();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `al_maktabah_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupMsg({ text: 'Cadangan data CMS berhasil diunduh.' });
      setTimeout(() => setBackupMsg(null), 3500);
    } catch (e: any) {
      setBackupMsg({ text: 'Gagal mengunduh cadangan: ' + e.message, error: true });
    }
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await cmsClient.importBackup(parsed);
      if (res.success) {
        setBackupMsg({ text: res.message });
        onRefreshData();
      } else {
        setBackupMsg({ text: 'Format cadangan tidak valid', error: true });
      }
    } catch (err: any) {
      setBackupMsg({ text: 'Gagal memulihkan cadangan: ' + err.message, error: true });
    }
    setTimeout(() => setBackupMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Identity Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold shadow-sm">
            <User className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-stone-900">
                {currentUser.name}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {currentUser.role === 'admin' ? 'Pemilik & Administrator Utama' : 'Mode Pengunjung'}
              </span>
            </div>
            <p className="text-xs text-stone-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
          <div className="flex items-center justify-between">
            <span><strong>Identitas Kreator:</strong> Orang Dalam Genetik Jawa</span>
            <span className="text-emerald-800 font-semibold">Ahlusunah wal Jama'ah</span>
          </div>
          <div className="flex items-center justify-between">
            <span><strong>Hak Akses:</strong> Full CRUD Materi, Kategori, Kitab, Dalil, Revisi</span>
            <span className="font-mono text-stone-500">Node/Express Server</span>
          </div>
        </div>

        {/* Role Switcher (Verify regular user cannot edit) */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <Eye className="w-4 h-4 text-amber-800" />
            <span>Simulasi Uji Akses Pengguna:</span>
          </div>
          <p className="text-xs text-stone-600">
            Gunakan tombol ini untuk menguji aplikasi dari sudut pandang penuntut ilmu biasa (read-only) atau kembali ke mode Administrator pemilik:
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleRoleToggle('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-800 text-amber-100 shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mode Administrator (Aktif)</span>
            </button>
            <button
              onClick={() => handleRoleToggle('viewer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentUser.role === 'viewer'
                  ? 'bg-emerald-800 text-amber-100 shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mode Tamu / Pengunjung Biasa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Restore Management */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-800" />
          Pencadangan & Pemulihan Basis Data CMS (JSON Backup)
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Unduh seluruh data 450+ topik materi, kategori, perpustakaan dalil, riwayat revisi, dan naskah kitab dalam satu berkas terenkapsulasi JSON untuk arsip atau transfer ke server lain.
        </p>

        {backupMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              backupMsg.error
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            }`}
          >
            {backupMsg.error ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{backupMsg.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Unduh Cadangan JSON Server</span>
          </button>

          <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition">
            <Upload className="w-4 h-4 text-amber-700" />
            <span>Pulihkan dari Berkas JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
