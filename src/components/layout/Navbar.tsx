import React from 'react';
import { ArrowLeft, BookOpen, Search, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface NavbarProps {
  currentTab: string;
  hasActiveReader: boolean;
  activeBookTitle?: string;
  onBack: () => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasActiveReader,
  activeBookTitle,
  onBack,
  onOpenSearch,
  onNavigateTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#064E3B] text-amber-50 border-b border-[#043327] shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {hasActiveReader ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-amber-300 transition active:scale-95 text-xs font-semibold"
              title="Kembali ke Halaman Sebelumnya"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 shadow-inner group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-amber-100 truncate">
                    Al-Maktabah
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 hidden sm:inline">
                    · Ahlusunah
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-arabic truncate" dir="rtl">
                  المَكْتَبَةُ الإِسْلَامِيَّةُ الشَّامِلَةُ
                </p>
              </div>
            </button>
          )}

          {hasActiveReader && activeBookTitle && (
            <div className="min-w-0 border-l border-emerald-700/60 pl-3 hidden sm:block">
              <p className="text-xs text-amber-200/80">Sedang Membaca:</p>
              <p className="text-xs font-semibold text-white truncate max-w-xs md:max-w-md">
                {activeBookTitle}
              </p>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-amber-100 text-xs font-medium border border-emerald-700/50 transition"
            title="Cari Kitab, Hadits, Ayat, Ulama (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pencarian Ilmiah</span>
            <kbd className="hidden md:inline text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">
              /
            </kbd>
          </button>

          {/* Quick Bookmarks shortcut */}
          <button
            onClick={() => onNavigateTab('profile')}
            className="p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-amber-200 transition"
            title="Penanda & Catatan Saya"
          >
            <BookmarkCheck className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact={true} />
        </div>
      </div>
    </header>
  );
};
