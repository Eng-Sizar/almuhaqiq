import React, { useState } from 'react';
import { 
  CheckSquare, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Clock, 
  Calendar, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_QUESTS } from '../../data/quests';
import { PlayerProfile, Quest } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface QuestsScreenProps {
  player: PlayerProfile;
  onClaimQuestReward: (questId: string, coinsReward: number) => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({
  player,
  onClaimQuestReward
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'career'>('daily');

  const filteredQuests = ALL_QUESTS.filter(q => activeTab === 'daily' ? q.target <= 3 : q.target > 3);

  const getQuestCurrentProgress = (quest: Quest): number => {
    return (player.stats[quest.stat] as number) || 0;
  };

  const handleClaim = (quest: Quest) => {
    audioManager.playCoin();
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {}
    onClaimQuestReward(quest.id, quest.reward);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Header */}
      <div className="bg-[#131923] p-5 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            مهام وأوامر التحقيق الرسمية
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
            سجل المهام اليومية والمسيرة الجنائية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            أكمل المهام المكلف بها لجمع العملات الذهبية وشراء المعدات والأوسمة الرفيعة.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0e141c] px-4 py-2 rounded-xl border border-[#253245]">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400">الرصيد المتاح</div>
            <div className="text-sm font-bold text-amber-300">{player.coins} عملة</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#212c3c] gap-2">
        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('daily');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'daily'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>مهام التحقيق اليومية</span>
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('career');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'career'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>مهام المسيرة الكبرى</span>
        </button>
      </div>

      {/* Quests List */}
      <div className="space-y-3.5">
        {filteredQuests.map((quest) => {
          const current = getQuestCurrentProgress(quest);
          const isCompleted = current >= quest.target;
          const isClaimed = player.questsClaimed?.includes(quest.id);
          const percent = Math.min(100, Math.round((current / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isClaimed
                  ? 'bg-[#10151f]/60 border-slate-800 opacity-60'
                  : isCompleted
                  ? 'bg-[#18261e] border-emerald-500/50 shadow-md'
                  : 'bg-[#141b25] border-[#222e40]'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isClaimed
                    ? 'bg-slate-800 text-slate-500'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#192230] text-[#c5a059] border border-[#2b394d]'
                }`}>
                  {isClaimed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isCompleted ? (
                    <Sparkles className="w-6 h-6" />
                  ) : (
                    <CheckSquare className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                      {quest.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#0e141c] text-amber-300 border border-[#253245]">
                      +{quest.reward} عملة
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-serif-ar mt-0.5">
                    {quest.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 bg-[#0b0f15] h-2 rounded-full overflow-hidden border border-[#1e2837]">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500' : 'bg-[#c5a059]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      {current} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full sm:w-auto">
                {isClaimed ? (
                  <div className="text-center py-2 px-4 rounded-lg bg-[#0e141b] text-slate-500 text-xs font-bold border border-slate-800">
                    تم الاستلام ✓
                  </div>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaim(quest)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs sm:text-sm transition-all shadow-md animate-bounce"
                  >
                    استلام المكافأة (+{quest.reward})
                  </button>
                ) : (
                  <div className="text-center py-2 px-4 rounded-lg bg-[#0e141b] text-slate-500 text-xs font-semibold border border-slate-800">
                    قيد التنفيذ ({percent}%)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
