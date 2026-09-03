import React from 'react';
import { 
  X, 
  FolderOpen, 
  BookOpen, 
  Play, 
  Home
} from 'lucide-react';
import { PlayerProfile } from '../../types';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: string) => void;
  activeScreen: string;
  player: PlayerProfile;
  hasActiveGame: boolean;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
  activeScreen
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'menu',
      label: 'الرئيسية',
      icon: Home,
      color: 'text-sky-400',
      description: 'واجهة اللعبة والشعار والملف الشخصي'
    },
    {
      id: 'game',
      label: 'متابعة التحقيق الجاري',
      icon: Play,
      color: 'text-amber-400',
      description: 'العودة لمسرح الجريمة واستجواب المشتبه بهم'
    },
    {
      id: 'chapters',
      label: 'سجل القضايا الجنائية',
      icon: FolderOpen,
      color: 'text-amber-300',
      description: 'قضايا قصر البارون، الياقوتة، وقطار منتصف الليل'
    },
    {
      id: 'notebook',
      label: 'دفتر الأدلة والاستنتاجات',
      icon: BookOpen,
      color: 'text-rose-400',
      description: 'مراجعة الأدلة وربط الخيوط لإدانة الجاني'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-[#101722] border border-[#26374d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e2c3d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="المحقق" 
              className="w-7 h-7 rounded-full border border-amber-400"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-sm font-bold text-slate-100">
              قائمة التنقل السريع
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScreen(item.id);
                  onClose();
                }}
                className={`w-full text-right p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-[#1a2637] border-amber-400/80 text-white shadow-sm'
                    : 'bg-[#141d29] border-[#202e3f] hover:bg-[#1a2637] text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg bg-[#0e141d] border border-[#233144] ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
