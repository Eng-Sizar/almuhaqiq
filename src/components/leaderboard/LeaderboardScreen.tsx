import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCw, 
  Medal, 
  Award, 
  Search, 
  Flame, 
  Crown, 
  CheckCircle2,
  Coins
} from 'lucide-react';
import { PlayerProfile } from '../../types';
import { calculatePlayerXp, getCurrentRank } from '../../data/ranks';
import { audioManager } from '../../lib/audio/audioManager';
import { fetchFirestoreLeaderboard, syncPlayerToFirestoreLeaderboard } from '../../lib/firebase';

interface LeaderboardPlayer {
  id: string;
  username: string;
  avatar: string;
  equippedTitle: string;
  rankTitle: string;
  rankIcon: string;
  xp: number;
  coins: number;
  casesSolved: number;
  updatedAt: string;
}

interface LeaderboardScreenProps {
  player: PlayerProfile;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ player }) => {
  const [playersList, setPlayersList] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const playerXp = calculatePlayerXp(player.stats);
  const playerRank = getCurrentRank(playerXp);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // First attempt to load real-time Firestore leaderboard
      const firestoreEntries = await fetchFirestoreLeaderboard();
      if (firestoreEntries && firestoreEntries.length > 0) {
        setPlayersList(firestoreEntries);
        setIsLoading(false);
        return;
      }

      // Fallback to server API
      const res = await fetch('/api/leaderboard?limit=30');
      const data = await res.json();
      if (data.success && Array.isArray(data.players)) {
        setPlayersList(data.players);
      }
    } catch {
      setErrorMsg('تعذر تحميل بيانات لوحة الصدارة من الخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncMyScore = async () => {
    setIsSyncing(true);
    try {
      audioManager.playClick();
      // Sync to Firebase Firestore directly
      await syncPlayerToFirestoreLeaderboard(player);

      // Also sync to server API
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: player.username,
          avatar: player.avatar,
          equippedTitle: player.equippedTitle,
          rankTitle: playerRank.name,
          rankIcon: playerRank.iconName,
          xp: playerXp,
          coins: player.coins,
          casesSolved: player.stats.chaptersCompleted
        })
      });
      await fetchLeaderboard();
    } catch {
      // Graceful fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankMedal = (index: number) => {
    if (index === 0) return <span className="text-xl">🥇</span>;
    if (index === 1) return <span className="text-xl">🥈</span>;
    if (index === 2) return <span className="text-xl">🥉</span>;
    return <span className="text-xs font-mono font-bold text-slate-400">#{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Top Header */}
      <div className="bg-[#131923] p-5 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            لوحة صدارة مفتشي ومحققي المدينة
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
            ترتيب كبار المحققين وأصحاب الخبرة
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            يتم تحديث المراتب دورياً بناءً على مجموع نقاط الخبرة وحل القضايا الجنائية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncMyScore}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8b1e24] hover:bg-[#a6252c] disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Flame className="w-4 h-4" />
            <span>{isSyncing ? 'جاري التحديث...' : 'تحديث ترتيبي الآن'}</span>
          </button>

          <button
            onClick={fetchLeaderboard}
            className="p-2 rounded-xl bg-[#18212d] hover:bg-[#232f40] text-slate-300 border border-[#2b394d] transition-colors"
            title="تحديث البيانات"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Player Ranking Highlight Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#1c2738] via-[#141b26] to-[#1c2738] border-2 border-[#c5a059]/50 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0e141c] border border-amber-500/40 flex items-center justify-center text-3xl shadow-sm">
            {player.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-100">
                {player.username} (أنت)
              </span>
              <span className="text-[10px] bg-[#c5a059]/20 text-[#c5a059] px-2 py-0.5 rounded font-bold border border-[#c5a059]/40">
                {player.equippedTitle}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-serif-ar mt-0.5 flex items-center gap-2">
              <span>الرتبة: {playerRank.name}</span>
              <span>•</span>
              <span>قضايا منجزة: {player.stats.chaptersCompleted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">الخبرة الإجمالية</span>
            <span className="text-amber-300 font-bold text-base">{playerXp} XP</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">العملات</span>
            <span className="text-emerald-400 font-bold text-base">{player.coins}</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-[#131923] rounded-2xl border border-[#222e40] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#202b3a] bg-[#161e2a] flex items-center justify-between text-xs font-bold text-slate-400">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">الترتيب</span>
            <span>المحقق / اللقب</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">القضايا</span>
            <span className="w-20 text-left">نقاط الخبرة</span>
          </div>
        </div>

        {isLoading && playersList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            جاري فحص السجلات الجنائية وجلب الترتيب...
          </div>
        ) : (
          <div className="divide-y divide-[#1c2737]">
            {playersList.map((entry, idx) => {
              const isMe = entry.username.toLowerCase() === player.username.toLowerCase();
              return (
                <div
                  key={entry.id || idx}
                  className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                    isMe
                      ? 'bg-[#1a2536] text-amber-200'
                      : 'hover:bg-[#16202c] text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {getRankMedal(idx)}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-[#0e141c] border border-[#233044] flex items-center justify-center text-xl shrink-0">
                      {entry.avatar}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isMe ? 'text-[#c5a059]' : 'text-slate-100'}`}>
                          {entry.username}
                        </span>
                        {isMe && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                            أنت
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-serif-ar truncate block">
                        {entry.equippedTitle} • {entry.rankTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-xs font-mono">
                    <span className="hidden sm:inline text-slate-400">
                      {entry.casesSolved} قضية
                    </span>
                    <span className="w-20 text-left font-bold text-amber-300 text-sm">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
