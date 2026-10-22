import React from 'react';
import { Home, Library, Compass, GraduationCap, User } from 'lucide-react';

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
    { id: 'catalog', label: 'Kitab', labelAr: 'الكتب', icon: Library },
    { id: 'dalil', label: 'Dalil', labelAr: 'الأدلة', icon: Compass },
    { id: 'learn', label: 'Belajar', labelAr: 'التعلم', icon: GraduationCap },
    { id: 'profile', label: 'Profil', labelAr: 'الملف', icon: User },
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
                isActive ? 'text-amber-300 font-semibold' : 'text-emerald-200/70 hover:text-amber-100'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-full shadow-sm" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
