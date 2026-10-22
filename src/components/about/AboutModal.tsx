import React from 'react';
import { ShieldCheck, User, Sparkles, BookOpen, X, Heart, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#064E3B] via-[#043327] to-[#0B1320] text-amber-50 p-6 sm:p-8 text-center space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 mx-auto flex items-center justify-center shadow-lg font-bold">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Al-Maktabah Al-Islamiyyah
          </h2>
          <p className="font-arabic text-lg text-emerald-200" dir="rtl">
            المَوْسُوعَةُ الإِسْلَامِيَّةُ الشَّامِلَةُ وَأَكَادِيمِيَّةُ العُلُومِ الشَّرْعِيَّةِ
          </p>
          <p className="text-xs text-emerald-100/80 font-mono">
            Ensiklopedia Islam Digital dan Akademi Ilmu Syar'i
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Deskripsi Aplikasi */}
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-sm text-stone-900">Tentang Platform:</h4>
            <p className="text-stone-600">
              Perpustakaan digital dan platform pembelajaran Islam yang dikembangkan untuk memudahkan penelusuran kitab, dalil, dan khazanah keilmuan Islam berlandaskan Al-Qur'an dan As-Sunnah menurut pemahaman Salafus Shalih dan penjelasan ulama muktabar.
            </p>
          </div>

          {/* Identitas Pembuat Resmi (Section XIV) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900">
              <User className="w-4 h-4 text-amber-700" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Identitas Pengembang:</h4>
            </div>
            <div className="space-y-1">
              <p>
                <strong>Nama Pengembang:</strong>{' '}
                <span className="font-semibold text-emerald-950">Jundi Abdul Syahid, S.Pd.</span>
              </p>
              <p>
                <strong>Identitas Kreator:</strong>{' '}
                <span className="font-semibold text-stone-800">Orang Dalam Genetik Jawa</span>
              </p>
            </div>
            <p className="text-[11px] text-stone-500 italic border-t border-amber-200/60 pt-2">
              Dikembangkan dengan dedikasi untuk melayani umat dalam mempermudah akses rujukan ilmu syar'i secara ilmiah, objektif, dan beradab.
            </p>
          </div>

          {/* Pilar Keilmuan & Fitur Unggulan */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-900">Fitur Utama Platform:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Kurikulum 9 Cabang Ilmu (450 Pokok)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Ensiklopedia Syariat Kaffah 12 Pilar</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Khutbah Studio AI (Dua Khutbah)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Pembaca Manuskrip Digital & Tilawah</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>Pencarian Normalisasi Teks Arab</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>PWA Siap Pasang di Android</span>
              </li>
            </ul>
          </div>

          {/* Amanah Ilmiah Notice */}
          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>
              Aplikasi ini berpegang teguh pada amanah ilmiah: tidak mengarang dalil, nomor hadis, atau atribusi ulama. Segala koreksi dapat disampaikan melalui fitur pelaporan kesalahan konten.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>© 2026 Al-Maktabah Al-Islamiyyah</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 text-amber-100 rounded-xl font-semibold hover:bg-emerald-900 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
