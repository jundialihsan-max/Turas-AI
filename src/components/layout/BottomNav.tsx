import React from 'react';
import { Home, GraduationCap, Layers, Sparkles, User, Library } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hideOnReader?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  hideOnReader = false,
}) => {
  if (hideOnReader) {
    return null;
  }

  const navItems = [
    { id: 'home', label: 'Beranda', labelAr: 'الرئيسية', icon: Home },
    { id: 'academy', label: 'Akademi', labelAr: 'الأكاديمية', icon: GraduationCap },
    { id: 'encyclopedia', label: 'Ensiklopedia', labelAr: 'الموسوعة', icon: Layers },
    { id: 'khutbah', label: 'Khutbah AI', labelAr: 'الخطب', icon: Sparkles, highlight: true },
    { id: 'profile', label: 'Perpustakaan', labelAr: 'المكتبة', icon: Library },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#064E3B] text-amber-100 border-t border-[#043327] shadow-[0_-4px_12px_rgba(0,0,0,0.15)] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition relative ${
                isActive
                  ? 'text-amber-300 font-semibold'
                  : item.highlight
                  ? 'text-amber-400/90 hover:text-amber-200'
                  : 'text-emerald-200/70 hover:text-amber-100'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-sm" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] tracking-tight truncate max-w-full px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
