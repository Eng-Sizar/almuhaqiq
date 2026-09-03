import React from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Flame, 
  Coins,
  ShieldCheck
} from 'lucide-react';
import { ALL_EVENTS } from '../../data/events';
import { DetectiveEvent, PlayerProfile } from '../../types';

interface EventsScreenProps {
  player: PlayerProfile;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ player }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Header */}
      <div className="bg-[#131923] p-5 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            الأحداث والبطولات الجنائية الخاصة
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
            المواسم الخاصة ومنافسات كبار المحققين
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            شارك في الفعاليات محدودة الوقت لتحقيق مكافآت مضاعفة وأوسمة استثنائية.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-5">
        {ALL_EVENTS.map((event) => {
          const isActive = event.status === 'active';
          return (
            <div
              key={event.id}
              className={`rounded-2xl border overflow-hidden shadow-lg transition-all ${
                isActive
                  ? 'bg-[#151e2b] border-[#c5a059]/60 ring-2 ring-[#c5a059]/20'
                  : 'bg-[#10151f]/80 border-[#202b3c] opacity-80'
              }`}
            >
              {/* Event Header Banner */}
              <div className="p-5 sm:p-6 border-b border-[#212e40] bg-gradient-to-r from-[#182333] via-[#151d29] to-[#182333] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#8b1e24]/30 border border-[#c5a059]/40 flex items-center justify-center text-amber-400 shadow-sm">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#f2ede4]">
                        {event.title}
                      </h3>
                      {isActive ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          الحدث نشط حالياً
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          قادم قريباً
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono bg-[#0d1219] px-3 py-1.5 rounded-xl border border-[#243144] text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>الوقت المتبقي: {event.timeRemaining}</span>
                </div>
              </div>

              {/* Event Description & Objectives */}
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 font-serif-ar leading-relaxed">
                  {event.description}
                </p>

                {/* Objectives */}
                <div className="bg-[#0e141c] p-4 rounded-xl border border-[#232f41] space-y-2.5">
                  <span className="text-xs font-bold text-[#c5a059] block">
                    أهداف ومهام الحدث:
                  </span>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{event.objective}</span>
                    </div>
                    <span className="font-mono text-amber-300 font-bold">
                      {event.progress} / {event.target}
                    </span>
                  </div>
                </div>

                {/* Reward Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-[#121a24] border border-amber-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-amber-200 font-semibold">
                      المكافأة الحصرية: {event.rewardTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{event.rewardCoins} عملة</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
