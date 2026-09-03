import React from 'react';
import { Volume2, VolumeX, BookOpen, FolderOpen, Coins } from 'lucide-react';
import { PlayerProfile } from '../../types';

interface GameHeaderProps {
  player: PlayerProfile;
  currentScreen: string;
  onOpenScreen: (screen: string) => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onOpenNotebook?: () => void;
  notebookBadgeCount?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  player,
  currentScreen,
  onOpenScreen,
  onToggleSound,
  soundEnabled,
  onOpenNotebook,
  notebookBadgeCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f151f]/95 border-b border-[#212e40] backdrop-blur-md px-2.5 sm:px-6 py-2 shadow-lg transition-all" dir="rtl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Right side (RTL Start): Logo + Game Title & Creator */}
        <div 
          onClick={() => onOpenScreen('menu')}
          className="cursor-pointer flex items-center gap-2 sm:gap-3 select-none group shrink-0 min-w-0"
          title="الرئيسية"
        >
          <div className="relative shrink-0">
            <img 
              src="/logo.png" 
              alt="المحقق" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400/80 shadow-md group-hover:scale-105 transition-transform object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-[#f5f0e6] group-hover:text-[#c5a059] transition-colors font-serif-ar leading-none">
                المحقق
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-serif-ar leading-tight mt-0.5 truncate">
              لعبة التحقيق والجريمة
            </p>
          </div>
        </div>

        {/* Left side: Fully responsive action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Cases Button */}
          <button
            onClick={() => onOpenScreen('chapters')}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-bold shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition duration-200 hover:-translate-y-px sm:gap-1.5 sm:px-3 sm:text-sm ${
              currentScreen === 'chapters'
                ? 'border-amber-200 bg-gradient-to-br from-amber-300 to-[#c17d29] font-black text-[#1d1308] shadow-[0_6px_16px_rgba(193,125,41,0.25)]'
                : 'border-slate-700 bg-[#111b27]/90 text-slate-200 hover:border-amber-300/50 hover:bg-[#1c2939] hover:text-amber-100'
            }`}
            title="سجل القضايا"
          >
            <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="inline">القضايا</span>
          </button>

          {/* Notebook button */}
          {onOpenNotebook && (
            <button
              onClick={onOpenNotebook}
            className="relative flex items-center gap-1 rounded-lg border border-slate-700 bg-[#111b27]/90 px-2.5 py-2 text-xs font-bold text-amber-300 shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition duration-200 hover:-translate-y-px hover:border-amber-300/50 hover:bg-[#1c2939] sm:gap-1.5 sm:px-3 sm:text-sm"
              title="فتح دفتر التحقيق والأدلة"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden sm:inline">دفتر الأدلة</span>
              {notebookBadgeCount > 0 && (
                <span className="bg-[#8b1e24] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-red-400">
                  {notebookBadgeCount}
                </span>
              )}
            </button>
          )}

          {/* Coins Badge */}
          <div 
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-[#111b27]/90 px-2 py-2 text-amber-300 shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition duration-200 hover:-translate-y-px hover:border-amber-300/50 hover:bg-[#1c2939] sm:gap-1.5 sm:px-2.5"
            title="العملات المتاحة"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {player.coins}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`rounded-lg border p-2 shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition duration-200 hover:-translate-y-px ${
              soundEnabled
                ? 'border-emerald-500/40 bg-[#11251f] text-emerald-400 hover:bg-[#17342c]'
                : 'border-slate-700 bg-[#111b27] text-slate-500 hover:bg-[#1c2939]'
            }`}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
            aria-label="تبديل الصوت"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
