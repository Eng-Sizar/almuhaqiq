import React from 'react';
import { 
  FolderGit2, 
  MapPin, 
  CheckCircle2, 
  Play, 
  Award, 
  Search, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { ALL_CHAPTERS } from '../../data/chapters';
import { CaseRecord, PlayerProfile } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface ChaptersScreenProps {
  player: PlayerProfile;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export const ChaptersScreen: React.FC<ChaptersScreenProps> = ({
  player,
  activeChapterId,
  onSelectChapter
}) => {
  const isChapterUnlocked = (_chapterId: string, _requiredId?: string) => {
    return true; // Keep cases accessible
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 select-text" dir="rtl">
      
      {/* Top Header */}
      <div className="bg-[#131923] p-4 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            أرشيف القضايا الجنائية الكبرى
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-[#f2ede4]">
            سجل التحقيقات المغلقة والمفتوحة
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            اختر قضية للشروع في معاينة مسرح الجريمة، وجمع الأدلة، واستجواب المشتبه بهم.
          </p>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto justify-start sm:justify-end">
          <div className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-2 rounded-xl bg-[#0e141c] border border-[#253245] text-center">
            <div className="text-[10px] sm:text-xs text-slate-400">القضايا المنجزة</div>
            <div className="text-sm sm:text-base font-bold text-amber-400">
              {player.stats.chaptersCompleted} / {ALL_CHAPTERS.length}
            </div>
          </div>
          <div className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-2 rounded-xl bg-[#0e141c] border border-[#253245] text-center">
            <div className="text-[10px] sm:text-xs text-slate-400">أدلة مرفوعة</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400">
              {player.stats.cluesFound}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Cards Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {ALL_CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id, chapter.requiredSolvedChapterId);
          const record: CaseRecord | undefined = player.caseRecords[chapter.id];
          const isCompleted = record && record.completed;
          const isCurrent = activeChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition-all relative ${
                unlocked
                  ? isCurrent
                    ? 'bg-[#182332] border-[#c5a059] ring-2 ring-[#c5a059]/30'
                    : 'bg-[#131923] border-[#222e40] hover:border-[#384a66]'
                  : 'bg-[#0f141c] border-slate-800 opacity-60'
              }`}
            >
              {/* Folder Top Bar */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#8b1e24] text-red-100 border border-red-700">
                      قضية #{chapter.number}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {chapter.difficulty}
                    </span>
                  </div>

                  {/* Status Stamp / Badge */}
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-600/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      محلولة
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                      قيد التحقيق
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#f2ede4] font-serif-ar leading-snug">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-[#c5a059] font-medium mt-0.5">
                    {chapter.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-400 font-serif-ar leading-relaxed line-clamp-3">
                  {chapter.description}
                </p>

                <div className="pt-2 border-t border-[#1e2a3c] flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Search className="w-3 h-3 text-amber-400" />
                    {chapter.clues.length} أدلة
                  </span>
                  <span>•</span>
                  <span>{chapter.suspects.length} مشتبهين</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 sm:p-4 bg-[#0e131b] border-t border-[#1e2a3c]">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onSelectChapter(chapter.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 min-h-[44px] touch-manipulation ${
                    isCurrent
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-md'
                      : 'bg-[#1b2535] hover:bg-[#25344a] text-slate-200 hover:text-white border border-[#2d3e58]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCurrent ? 'متابعة هذه القضية' : 'بدء التحقيق في القضية'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
