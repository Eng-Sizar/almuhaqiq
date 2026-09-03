import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Search, 
  Clock, 
  Coins, 
  FolderGit2,
  BarChart3,
  Edit2
} from 'lucide-react';
import { PlayerProfile, CaseRecord } from '../../types';
import { calculatePlayerXp, getCurrentRank, getNextRank } from '../../data/ranks';
import { ALL_ACHIEVEMENTS } from '../../data/achievements';
import { audioManager } from '../../lib/audio/audioManager';

interface ProfileScreenProps {
  player: PlayerProfile;
  onUpdateUsername: (newUsername: string) => void;
  onOpenShop: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  player,
  onUpdateUsername,
  onOpenShop
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(player.username);
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'cases'>('stats');

  const playerXp = calculatePlayerXp(player.stats);
  const currentRank = getCurrentRank(playerXp);
  const nextRank = getNextRank(playerXp);

  const xpProgress = nextRank 
    ? Math.min(100, Math.round(((playerXp - currentRank.minXp) / Math.max(1, nextRank.minXp - currentRank.minXp)) * 100))
    : 100;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim().length >= 2) {
      audioManager.playClick();
      onUpdateUsername(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const statCards = [
    { label: 'القضايا المكتملة', value: player.stats.chaptersCompleted, icon: FolderGit2, color: 'text-amber-400' },
    { label: 'اتهامات صائبة', value: player.stats.correctAccusations, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'أدلة مكتشفة', value: player.stats.cluesFound, icon: Search, color: 'text-sky-400' },
    { label: 'استنتاجات منجزة', value: player.stats.deductionsDone, icon: Sparkles, color: 'text-purple-400' },
    { label: 'جلسات استجواب', value: player.stats.interviewsDone, icon: Clock, color: 'text-indigo-400' },
    { label: 'ألغاز محلولة', value: (player.stats.puzzlesSolved || 0) + (player.stats.newspaperPuzzlesSolved || 0), icon: Trophy, color: 'text-rose-400' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Profile Header Dossier */}
      <div className="bg-gradient-to-r from-[#182333] via-[#141b25] to-[#182333] p-6 sm:p-8 rounded-2xl border-2 border-[#c5a059]/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          {/* Avatar frame */}
          <div 
            onClick={onOpenShop}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e141c] border-2 border-amber-500/50 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0 cursor-pointer hover:border-amber-400 transition-colors group relative"
            title="انقر لتغيير الهوية الرمزية في المتجر"
          >
            {player.avatar}
            <span className="absolute bottom-1 right-1 text-[9px] bg-[#8b1e24] text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              تغيير
            </span>
          </div>

          <div className="flex-1 text-center sm:text-right space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-[#0e141c] border border-amber-400 text-sm text-slate-100 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 text-xs text-slate-400"
                  >
                    إلغاء
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
                    المحقق {player.username}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-slate-400 hover:text-amber-300"
                    title="تعديل الاسم"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="text-xs bg-[#c5a059]/20 text-[#c5a059] px-2.5 py-0.5 rounded-full font-bold border border-[#c5a059]/40">
                {player.equippedTitle}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-serif-ar">
              عضو شرفي في نقابة محققي المدينة الجنائية • مُنضم منذ {new Date(player.createdAt).toLocaleDateString('ar-EG')}
            </p>

            {/* Rank & XP Bar */}
            <div className="pt-2 space-y-2 max-w-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {currentRank.name}
                </span>
                <span className="text-slate-400 font-mono">
                  {playerXp} XP {nextRank && `/ ${nextRank.minXp} XP`}
                </span>
              </div>

              <div className="h-3 bg-[#0d1219] rounded-full overflow-hidden border border-[#232f41] p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-[#c5a059] rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>

              {nextRank && (
                <div className="text-[11px] text-slate-400 font-serif-ar">
                  متبقي {nextRank.minXp - playerXp} نقطة خبرة للترقية إلى: <strong className="text-slate-200">{nextRank.name}</strong>
                </div>
              )}
            </div>

            <p className="pt-3 mt-3 border-t border-[#253245]/60 text-xs leading-relaxed text-slate-400">
              يتم حفظ تقدم التحقيقات والإعدادات محلياً على هذا الجهاز.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for Stats, Achievements, Case History */}
      <div className="flex border-b border-[#212c3c] gap-2">
        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('stats');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'stats'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>الإحصائيات الجنائية</span>
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('achievements');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'achievements'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>الأوسمة والإنجازات ({player.achievements?.length || 0})</span>
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('cases');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'cases'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>سجل القضايا المفتوحة</span>
        </button>
      </div>

      {/* Tab 1: Stats Grid */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statCards.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-[#141b25] p-4 sm:p-5 rounded-2xl border border-[#232f41] shadow-sm flex items-center gap-3.5"
              >
                <div className={`p-3 rounded-xl bg-[#0e141c] border border-[#232f41] ${st.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-100 font-mono">
                    {st.value}
                  </div>
                  <div className="text-xs text-slate-400 font-serif-ar mt-0.5">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Achievements Showcase */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = player.achievements?.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-[#151f2c] border-[#c5a059]/60 shadow-md'
                    : 'bg-[#10151f]/60 border-[#1f2939] opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/20 border border-amber-400/50' : 'bg-slate-800'
                }`}>
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100 truncate">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-300 bg-[#0e141c] px-2 py-0.5 rounded border border-[#253245]">
                      +{ach.rewardXpBonus} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-serif-ar mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="mt-2 text-[10px] font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تم إنجاز الوسام بنجاح
                      </span>
                    ) : (
                      <span className="text-slate-500">قيد الانتظار</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Case Records */}
      {activeTab === 'cases' && (
        <div className="space-y-3">
          {Object.keys(player.caseRecords || {}).length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-serif-ar bg-[#131923] rounded-2xl border border-[#232f41]">
              لم تكمل أي قضية بعد. ابدأ بفتح ملف القضية الأولى من سجل القضايا!
            </div>
          ) : (
            (Object.entries(player.caseRecords) as [string, CaseRecord][]).map(([caseId, record]) => (
              <div
                key={caseId}
                className="bg-[#141b25] p-4 rounded-xl border border-[#232f41] flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="text-[10px] bg-[#8b1e24] text-white px-2 py-0.5 rounded font-bold">
                    {caseId.toUpperCase()}
                  </span>
                  <div className="text-sm font-bold text-slate-200 mt-1">
                    {record.completed ? 'القضية منتهية ومغلقة' : 'قيد التحقيق الميداني'}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 font-mono">
                  <span>التقييم: <strong className="text-amber-300">{record.rating}</strong></span>
                  <span>الأدلة: {record.cluesFound}</span>
                  <span>الاستجواب: {record.interviewsConducted}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
