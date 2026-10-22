import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed in standalone mode, show clean subtle status or nothing
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>Terpasang di Perangkat</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition active:scale-95"
          title="Pasang Aplikasi di Android / Komputer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-950" />
          <span>Pasang App</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-sm transition active:scale-95"
      >
        <Smartphone className="w-4 h-4 text-emerald-950" />
        <span>Pasang di Android</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg border border-emerald-300/60 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Pasang di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-stone-200 text-stone-900">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-base font-semibold text-emerald-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  Pasang di iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-stone-600">
                1. Buka peramban <strong>Safari</strong>.<br />
                2. Ketuk ikon <strong>Bagikan (Share)</strong> di bilah bawah peramban.<br />
                3. Gulir ke bawah dan pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.<br />
                4. Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-stone-100 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-200"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct browser install prompt information button
  return (
    <button
      onClick={() => {
        alert(
          "Untuk memasang di Android: Buka menu Chrome (titik tiga di kanan atas) lalu pilih 'Instal aplikasi' atau 'Tambahkan ke Layar Utama'."
        );
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-amber-100/80 hover:bg-amber-100 rounded-lg border border-amber-300/80 transition"
      title="Pasang di Android"
    >
      <Download className="w-3.5 h-3.5 text-emerald-800" />
      <span>Pasang PWA</span>
    </button>
  );
};
