import React from 'react';
import { 
  Play, 
  FolderOpen, 
  ChevronLeft
} from 'lucide-react';
import { Chapter } from '../../types';
import { ALL_CHAPTERS } from '../../data/chapters';
import { audioManager } from '../../lib/audio/audioManager';

interface MainMenuProps {
  currentChapter: Chapter;
  onNavigate: (screen: string) => void;
  onContinueGame: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  currentChapter,
  onNavigate,
  onContinueGame,
  onSelectChapter
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-9 space-y-7 sm:space-y-9 select-text" dir="rtl">
      
      {/* Main hero */}
      <section className="noir-surface noir-grid relative rounded-[1.75rem] overflow-hidden p-5 sm:p-9 md:p-11 shadow-2xl text-center flex flex-col items-center">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full md:grid md:grid-cols-[0.7fr_1.3fr] md:items-center md:gap-8 lg:gap-12">
        <div className="flex flex-col items-center md:py-4">
        {/* The Detective Logo */}
        <div className="relative mb-4 sm:mb-5 group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="absolute -inset-3 rounded-full border border-amber-400/20 animate-pulse" />
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-b from-amber-300 via-[#8b1e24] to-amber-600 shadow-[0_10px_35px_rgba(0,0,0,0.8)] relative">
            <img 
              src="/logo.png" 
              alt="المحقق - Detective Logo" 
              className="w-full h-full object-cover rounded-full shadow-inner"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        </div>

        <div className="flex flex-col items-center md:items-start md:text-right">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f5f0e6] font-serif-ar tracking-tight leading-tight mb-2">
          لعبة المحقق
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-300 font-serif-ar max-w-lg leading-relaxed mb-5 sm:mb-6">
          عالم التحري والغموض بأسلوب بسيط ومباشر؛ عاين مسرح الجريمة، استجوب المشتبه بهم، واجمع الأدلة لإدانة القاتل الحقيقي.
        </p>

        {/* Direct Main Play Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full max-w-md md:max-w-xl mt-4 sm:mt-5">
          <button
            onClick={() => {
              audioManager.playClick();
              onContinueGame();
            }}
            className="relative isolate flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-amber-100/70 bg-gradient-to-br from-[#f4d184] via-[#d19a43] to-[#9c6229] px-6 text-sm font-black text-[#16100a] shadow-[0_12px_28px_rgba(141,88,27,0.30)] transition duration-200 before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[42%] before:rounded-t-[0.7rem] before:bg-gradient-to-b before:from-white/35 before:to-transparent hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(201,145,67,0.36)] active:translate-y-0 sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>ابدأ التحقيق الآن</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onNavigate('chapters');
            }}
            className="relative flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-600 bg-gradient-to-br from-[#293a50] to-[#111a27] px-6 text-xs font-bold text-slate-100 shadow-[inset_0_1px_rgba(255,255,255,0.08),0_10px_22px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/60 hover:from-[#344962] hover:to-[#172231] hover:text-amber-100 active:translate-y-0 sm:w-auto sm:text-sm"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>اختيار قضية</span>
          </button>
        </div>
        </div>
        </div>
      </section>

      {/* Simplified Cases Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-sm sm:text-base font-extrabold text-[#c5a059] flex items-center gap-2">
            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>قضايا التحقيق المتاحة:</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-400">اختر أي قضية للبدء فوراً</span>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ALL_CHAPTERS.map((ch) => {
            const isCurrent = ch.id === currentChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  audioManager.playClick();
                  onSelectChapter(ch.id);
                }}
                aria-label={`ابدأ القضية: ${ch.title}`}
                className={`case-card p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-right shadow-md flex flex-col justify-between min-h-[168px] touch-manipulation hover:-translate-y-0.5 active:translate-y-0 ${
                  isCurrent 
                    ? 'bg-[#182333] border-amber-400/80 shadow-[0_0_20px_rgba(197,160,89,0.15)] ring-1 ring-amber-400/40' 
                    : 'bg-[#121822] border-[#222e40] hover:border-amber-400/50 hover:bg-[#16202c]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-[#0b0f14] text-amber-400 border border-amber-400/30">
                      القضية 0{ch.number}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">متاحة</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1">
                    {ch.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-serif-ar mt-1 line-clamp-2 leading-relaxed">
                    {ch.description || ch.subtitle}
                  </p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#1e2a3c] flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>{isCurrent ? 'متابعة القضية' : 'ابدأ القضية'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
