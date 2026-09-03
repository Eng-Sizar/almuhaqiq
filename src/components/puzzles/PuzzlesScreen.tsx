import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Lightbulb, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Hash,
  Binary,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_PUZZLES } from '../../data/puzzles';
import { CasePuzzle, PlayerProfile } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface PuzzlesScreenProps {
  player: PlayerProfile;
  onSolvePuzzle: (puzzleId: string, coinsReward: number) => void;
}

export const PuzzlesScreen: React.FC<PuzzlesScreenProps> = ({
  player,
  onSolvePuzzle
}) => {
  const [activePuzzleId, setActivePuzzleId] = useState<string>(ALL_PUZZLES[0].id);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [wrongTries, setWrongTries] = useState<Record<string, number>>({});
  const [shakeError, setShakeError] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const currentPuzzle: CasePuzzle = ALL_PUZZLES.find(p => p.id === activePuzzleId) || ALL_PUZZLES[0];
  const isSolved = player.solvedPuzzles?.includes(currentPuzzle.id);
  const currentHintsCount = revealedHints[currentPuzzle.id] || 0;
  const currentWrongCount = wrongTries[currentPuzzle.id] || 0;

  const handleRevealHint = () => {
    audioManager.playClick();
    setRevealedHints(prev => ({
      ...prev,
      [currentPuzzle.id]: 1
    }));
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSolved) return;

    const clean = answerInput.trim().toLowerCase();
    const solution = currentPuzzle.solution.toLowerCase();
    const correct = clean === solution || clean.includes(solution) || solution.includes(clean);

    if (correct) {
      audioManager.playSuccess();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      setFeedback({ text: 'فتح القفل بنجاح! أحسنت فك الشفرة وحصلت على العملات.', success: true });
      onSolvePuzzle(currentPuzzle.id, currentPuzzle.rewardCoins);
      setAnswerInput('');
    } else {
      audioManager.playFailure();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      setWrongTries(prev => ({
        ...prev,
        [currentPuzzle.id]: (prev[currentPuzzle.id] || 0) + 1
      }));
      setFeedback({ text: 'الرمز أو الحل غير صحيح! تفحص المعطيات مجدداً.', success: false });
    }
  };

  const getTypeIcon = (type: CasePuzzle['type']) => {
    switch (type) {
      case 'safe_code': return <Hash className="w-4 h-4 text-amber-400" />;
      case 'cipher': return <Binary className="w-4 h-4 text-purple-400" />;
      case 'anagram': return <Shuffle className="w-4 h-4 text-sky-400" />;
      default: return <KeyRound className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Header */}
      <div className="bg-[#131923] p-5 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4" />
            المختبر الجنائي والشفرات
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
            غرفة أقفال الخزائن وفك الرسائل السرية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            أدوات جنائية، شفرات قيصر، وألغاز خزائن حديدية عُثر عليها في مسارح الجريمة.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0e141c] border border-[#253245] text-center">
          <div className="text-xs text-slate-400">الألغاز المحلولة</div>
          <div className="text-base font-bold text-emerald-400">
            {player.solvedPuzzles?.length || 0} / {ALL_PUZZLES.length}
          </div>
        </div>
      </div>

      {/* Grid: Puzzle selector tabs on left/right, and solver workbench */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Puzzles List */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 px-1">قائمة الأقفال والشفرات:</h3>
          {ALL_PUZZLES.map((pz) => {
            const pzSolved = player.solvedPuzzles?.includes(pz.id);
            const isActive = activePuzzleId === pz.id;
            return (
              <button
                key={pz.id}
                onClick={() => {
                  audioManager.playClick();
                  setActivePuzzleId(pz.id);
                  setFeedback(null);
                  setAnswerInput('');
                }}
                className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#1e2a3b] border-[#c5a059] text-[#c5a059] shadow-md'
                    : 'bg-[#141b25] border-[#222e40] text-slate-300 hover:bg-[#192230]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-[#0e141c] border border-[#253245]">
                    {getTypeIcon(pz.type)}
                  </div>
                  <div className="truncate">
                    <span className="block truncate">{pz.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      مكافأة: +{pz.rewardCoins} عملة
                    </span>
                  </div>
                </div>

                {pzSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Puzzle Active Solver Workbench */}
        <div className="md:col-span-2 bg-[#141b25] p-6 sm:p-8 rounded-2xl border border-[#232f41] shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#212c3c] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#8b1e24]/30 text-rose-300 border border-rose-500/30">
                  {currentPuzzle.type === 'safe_code' && 'قفل خزانة رقمي'}
                  {currentPuzzle.type === 'cipher' && 'شفرة استبدال قيصر'}
                  {currentPuzzle.type === 'anagram' && 'إعادة ترتيب الحروف'}
                  {currentPuzzle.type === 'logic' && 'استنتاج منطقي'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#f2ede4] mt-2">
                {currentPuzzle.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>+{currentPuzzle.rewardCoins} عملة</span>
            </div>
          </div>

          {/* Puzzle Clue Description Box */}
          <div className="bg-[#0e141c] p-4 sm:p-5 rounded-xl border border-[#253245] space-y-2">
            <span className="text-xs font-bold text-[#c5a059] block">معطيات الشفرة:</span>
            <p className="text-sm sm:text-base text-slate-200 font-serif-ar leading-relaxed">
              {currentPuzzle.prompt}
            </p>
            {currentPuzzle.challenge && (
              <div className="p-2.5 bg-[#141d29] rounded-lg border border-[#2b3a4f] text-amber-300 font-mono text-xs">
                التحدي: {currentPuzzle.challenge}
              </div>
            )}
          </div>

          {/* Hints Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">تلميحات المختبر المتاحة:</span>
              {currentHintsCount === 0 && (
                <button
                  type="button"
                  onClick={handleRevealHint}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>طلب تلميح مساعد</span>
                </button>
              )}
            </div>

            {currentHintsCount > 0 ? (
              <div className="space-y-1.5">
                <div className="p-3 rounded-lg bg-[#182332] border border-[#2a3a50] text-xs text-amber-200 font-serif-ar flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>تلميح المحقق: {currentPuzzle.hint}</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic">
                لم تطلب أي تلميح بعد. جرب إجهاد فكرك أولاً!
              </div>
            )}
          </div>

          {/* Wrong attempts counter */}
          {currentWrongCount > 0 && !isSolved && (
            <div className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>عدد المحاولات الخاطئة حتى الآن: {currentWrongCount}</span>
            </div>
          )}

          {/* Submission or Solved State */}
          {isSolved ? (
            <div className="p-5 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 text-emerald-200 flex items-center gap-3">
              <Unlock className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-sm sm:text-base block">تم فتح هذا القفل بنجاح!</span>
                <span className="text-xs text-emerald-300">
                  الإجابة المعتمدة مسجلة في ملف إنجازاتك الجنائية.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckAnswer} className={`space-y-3 ${shakeError ? 'animate-shake' : ''}`}>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="أدخل رمز الفتح أو الكلمة المشفرة..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="flex-1 p-3.5 rounded-xl bg-[#0f141d] border-2 border-[#2b3a4f] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b169] text-black font-extrabold text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>تأكيد الفتح</span>
                </button>
              </div>
            </form>
          )}

          {/* Feedback message */}
          {feedback && (
            <div className={`p-3.5 rounded-xl text-xs font-bold leading-relaxed ${
              feedback.success
                ? 'bg-emerald-900/60 border border-emerald-500/60 text-emerald-200'
                : 'bg-rose-900/60 border border-rose-500/60 text-rose-200'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
