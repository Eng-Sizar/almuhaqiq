import React, { useState } from 'react';
import { 
  Newspaper, 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  Coins, 
  Search, 
  Calendar, 
  CloudSun, 
  Flame, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { NEWSPAPER_ISSUES } from '../../data/newspaper';
import { PlayerProfile } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface NewspaperScreenProps {
  player: PlayerProfile;
  onSolveNewspaperPuzzle: (puzzleId: string, rewardCoins: number) => void;
}

export const NewspaperScreen: React.FC<NewspaperScreenProps> = ({
  player,
  onSolveNewspaperPuzzle
}) => {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const currentIssue = NEWSPAPER_ISSUES[selectedIssueIndex] || NEWSPAPER_ISSUES[0];
  const puzzle = currentIssue.cipherPuzzle;
  const isPuzzleSolved = player.solvedNewspaperPuzzles?.includes(puzzle.id);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isPuzzleSolved) return;

    const cleanInput = userAnswer.trim().toLowerCase();
    const isCorrect = cleanInput.includes(puzzle.answer.toLowerCase()) || 
                      puzzle.answer.toLowerCase().includes(cleanInput);

    if (isCorrect) {
      audioManager.playSuccess();
      setFeedback({ text: 'إجابة عبقرية وصائبة! تم إضافة المكافأة إلى رصيدك.', success: true });
      onSolveNewspaperPuzzle(puzzle.id, puzzle.rewardCoins);
      setUserAnswer('');
    } else {
      audioManager.playFailure();
      setFeedback({ text: 'إجابة غير صحيحة! أعد قراءة اللغز واستعن بالتلميح إن أردت.', success: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Top Issue Selector Bar */}
      <div className="bg-[#141b25] p-3 rounded-xl border border-[#232f41] flex items-center justify-between gap-3 text-xs">
        <button
          disabled={selectedIssueIndex === 0}
          onClick={() => {
            audioManager.playClick();
            setSelectedIssueIndex(prev => Math.max(0, prev - 1));
            setFeedback(null);
            setShowHint(false);
          }}
          className="p-1.5 rounded-lg bg-[#1a2332] hover:bg-[#233044] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
          <span>العدد السابق</span>
        </button>

        <div className="text-center">
          <span className="text-[#c5a059] font-bold block">{currentIssue.headline}</span>
          <span className="text-[11px] text-slate-400">{currentIssue.dateString}</span>
        </div>

        <button
          disabled={selectedIssueIndex === NEWSPAPER_ISSUES.length - 1}
          onClick={() => {
            audioManager.playClick();
            setSelectedIssueIndex(prev => Math.min(NEWSPAPER_ISSUES.length - 1, prev + 1));
            setFeedback(null);
            setShowHint(false);
          }}
          className="p-1.5 rounded-lg bg-[#1a2332] hover:bg-[#233044] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span>العدد التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Vintage Newspaper Canvas */}
      <div className="newspaper-texture p-6 sm:p-10 rounded-2xl border-4 border-[#3e3425] shadow-2xl text-[#1a140d] space-y-6">
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-[#2b2218] pb-4 text-center space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#544331] uppercase border-b border-[#544331]/40 pb-1">
            <span>طبعة العاصمة المسائية</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {currentIssue.dateString}
            </span>
            <span>السعر: قرشان فضيان</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif-ar tracking-tight text-[#1e150d]">
            {currentIssue.headline}
          </h1>
          <p className="text-xs sm:text-sm font-serif-ar italic text-[#4a3928]">
            الصحيفة الرسمية للوقائع، التحريات، وسجلات حوادث المدينة
          </p>

          <div className="flex items-center justify-between text-xs text-[#544331] pt-1 border-t border-[#544331]/40">
            <span className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5" />
              الطقس: ضباب كثيف بعد الغروب، أمطار شتوية متقطعة
            </span>
            <span>العدد: رقم {currentIssue.id.replace('issue_', '')}</span>
          </div>
        </div>

        {/* Lead Headline & Main Article */}
        <div className="space-y-4">
          <div className="border-b-2 border-[#3d2f21] pb-3">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a110a] font-serif-ar leading-tight">
              {currentIssue.headline}
            </h2>
          </div>

          {/* Two Columns vintage text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 text-sm sm:text-base font-serif-ar leading-relaxed text-[#2c2217] space-y-3">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:float-right first-letter:ml-2">
                {currentIssue.leadStory}
              </p>
              <p>
                وتحذر دائرة الأمن العام جميع المواطنين من التستر على أي مشتبه به، وتدعو المحققين ومفتشي الشرطة لفحص كل الخيوط المادية دون استثناء.
              </p>
            </div>

            {/* Vintage Sidebar Ads / Mini Bulletin */}
            <div className="border-r-2 md:border-r-2 border-t-2 md:border-t-0 border-[#4a3a2a] pr-4 pt-4 md:pt-0 space-y-4 text-xs font-serif-ar">
              <div className="bg-[#dfd1b8] p-3 rounded border border-[#8a7258] shadow-sm">
                <span className="font-bold text-[#8b1e24] block mb-1">إعلان صيدلية العاصمة:</span>
                تعلن صيدلية النيل عن توفر محلول لومينول الألماني لفحص بقع الدماء في مسارح الجرائم بدقة متناهية.
              </div>

              <div className="bg-[#dfd1b8] p-3 rounded border border-[#8a7258] shadow-sm">
                <span className="font-bold text-[#344627] block mb-1">مكتب مفقودات السكك:</span>
                حقيبة جلدية سوداء عُثر عليها في محطة باب الحديد تحوي عدسات مكبرة وأوراقاً بالفرنسية.
              </div>
            </div>
          </div>
        </div>

        {/* Daily Newspaper Puzzle Section */}
        <div className="mt-8 pt-6 border-t-4 border-[#2b2218] bg-[#dfd0b6] p-5 sm:p-6 rounded-xl border border-[#7a644c] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8b1e24] text-white flex items-center justify-center font-bold">
                🧩
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1f150c] font-serif-ar">
                  شفرة وأحجية العدد اليومية: {puzzle.title}
                </h3>
                <span className="text-xs text-[#523e2b]">
                  لغز فكري لتدريب عقول مفتشي التحريات
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/30 border border-[#8a7258] text-xs font-bold text-[#3d2e1f]">
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              <span>+{puzzle.rewardCoins} قرش ذهبي</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#e7dcbf] border border-[#a89278] text-sm sm:text-base font-serif-ar text-[#2b1f13] leading-relaxed">
            "{puzzle.question}"
          </div>

          {/* Hint Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'إخفاء التلميح' : 'عرض تلميح مساعد'}</span>
            </button>
            {showHint && (
              <span className="text-xs text-[#5c442e] font-serif-ar bg-[#dfd2bc] px-2.5 py-1 rounded border border-[#b39d84]">
                💡 {puzzle.hint}
              </span>
            )}
          </div>

          {/* Puzzle Input Form or Solved Badge */}
          {isPuzzleSolved ? (
            <div className="p-4 rounded-xl bg-emerald-900/15 border-2 border-emerald-700 text-emerald-950 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-800 shrink-0" />
              <div>
                <span className="font-bold text-sm block">تم حل شفرة هذا العدد بنجاح!</span>
                <span className="text-xs text-emerald-900">
                  لقد حصلت على مكافأة العملات ووسام النباهة الصحفية.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitAnswer} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="اكتب إجابتك هنا..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-[#f0e7d1] border-2 border-[#8a7258] text-sm text-[#1f150c] placeholder-[#7d674f] focus:outline-none focus:border-[#8b1e24]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#8b1e24] hover:bg-[#a1232a] text-white font-bold text-sm transition-colors shadow-sm shrink-0"
              >
                تأكيد الحل ونيل المكافأة
              </button>
            </form>
          )}

          {/* Feedback alert */}
          {feedback && (
            <div className={`p-3 rounded-lg text-xs font-bold ${
              feedback.success ? 'bg-emerald-800 text-white' : 'bg-red-800 text-white'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
