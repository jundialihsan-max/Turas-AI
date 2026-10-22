import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 flex items-center justify-between gap-3 rounded-xl bg-stone-900/95 text-stone-100 border border-stone-700 px-4 py-2.5 shadow-2xl backdrop-blur-md max-w-md animate-fade-in">
      <div className="flex items-center gap-2.5">
        <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
          <WifiOff className="w-4 h-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-stone-200">Mode Luar Jaringan (Offline)</p>
          <p className="text-[11px] text-stone-400">Aplikasi membaca naskah & data dari memori perangkat.</p>
        </div>
      </div>
      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
    </div>
  );
};
