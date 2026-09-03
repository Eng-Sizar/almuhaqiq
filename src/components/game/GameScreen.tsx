import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, GameNode, Choice, GameMessage, PlayerProfile } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface GameScreenProps {
  chapter: Chapter;
  player?: PlayerProfile;
  onClueDiscovered: (clueId: string) => void;
  onDeductionCompleted: (deductionId: string) => void;
  onInterviewConducted: (suspectId: string) => void;
  onCaseSolved: (
    chapterId: string, 
    isCorrect: boolean, 
    cluesCount: number, 
    totalClues: number, 
    interviewsCount: number, 
    totalInterviews: number
  ) => void;
  onOpenNotebook: () => void;
  onReturnToChapters: () => void;
  onDeductCoins?: (amount: number) => boolean;
  onNavigateScreen?: (screen: string) => void;
  onToggleSound?: () => void;
  soundEnabled?: boolean;
  foundClueIds: string[];
  completedDeductions: string[];
  interrogatedSuspectIds: string[];
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
}

export const GameScreen: React.FC<GameScreenProps> = ({
  chapter,
  player,
  onClueDiscovered,
  onDeductionCompleted,
  onCaseSolved,
  onOpenNotebook,
  onReturnToChapters,
  onDeductCoins,
  onToggleSound,
  soundEnabled = true,
  foundClueIds,
  completedDeductions = [],
  interrogatedSuspectIds,
  textSpeed
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(chapter.startNodeId);
  const [messagesHistory, setMessagesHistory] = useState<GameMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [recommendedChoiceId, setRecommendedChoiceId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [newClueToast, setNewClueToast] = useState<{ title: string; desc: string } | null>(null);
  const [screenShock, setScreenShock] = useState<boolean>(false);
  const [instinctModal, setInstinctModal] = useState<{
    type: 'clue' | 'deduction' | 'advice';
    title: string;
    category?: string;
    description: string;
    detail?: string;
    note?: string;
    cluesCombined?: [string, string];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentNode: GameNode = chapter.nodes[currentNodeId] || chapter.nodes[chapter.startNodeId];

  // Auto scroll to bottom of stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesHistory, isTyping, hintMessage]);

  // Load node
  useEffect(() => {
    if (!currentNode) return;

    if (currentNode.effects?.addClue) {
      handleTriggerClue(currentNode.effects.addClue);
    }

    if (currentNode.phase === 1) audioManager.setMusicIntensity('calm');
    else if (currentNode.phase === 2) audioManager.setMusicIntensity('tense');
    else if (currentNode.phase >= 3) audioManager.setMusicIntensity('climax');

    const nodeMessages: GameMessage[] = currentNode.messages.map((m, idx) => ({
      ...m,
      id: `${currentNode.id}_${idx}_${Date.now()}`
    }));

    if (textSpeed === 'instant') {
      setMessagesHistory(prev => [...prev, ...nodeMessages]);
      setIsTyping(false);
      checkEnding(currentNode);
    } else {
      let currentIdx = 0;
      setIsTyping(true);
      const intervalMs = textSpeed === 'slow' ? 900 : textSpeed === 'fast' ? 250 : 500;

      const timer = setInterval(() => {
        if (currentIdx < nodeMessages.length) {
          const nextMsg = nodeMessages[currentIdx];
          setMessagesHistory(prev => [...prev, nextMsg]);

          if (nextMsg.type === 'clue' && nextMsg.clueId) {
            handleTriggerClue(nextMsg.clueId);
          } else {
            audioManager.playClick();
          }

          currentIdx++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          checkEnding(currentNode);
        }
      }, intervalMs);

      return () => clearInterval(timer);
    }
  }, [currentNodeId, chapter.id]);

  const handleTriggerClue = (clueId: string) => {
    onClueDiscovered(clueId);
    const clueObj = chapter.clues.find(c => c.id === clueId);
    if (clueObj) {
      setNewClueToast({ title: clueObj.title, desc: clueObj.description });
      audioManager.playClueDiscovered();
      setTimeout(() => setNewClueToast(null), 4500);
    }
  };

  const checkEnding = (node: GameNode) => {
    if (node.isEnding) {
      const isWin = !!node.isCorrectEnding;
      if (isWin) {
        audioManager.playChapterComplete();
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } else {
        audioManager.playFailure();
      }

      onCaseSolved(
        chapter.id,
        isWin,
        foundClueIds.length,
        chapter.clues.length,
        interrogatedSuspectIds.length,
        chapter.suspects.length
      );
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    audioManager.playClick();
    if (choice.effects?.addClue) {
      handleTriggerClue(choice.effects.addClue);
    }
    setRecommendedChoiceId(null);
    setHintMessage(null);
    setCurrentNodeId(choice.nextNodeId);
  };

  const handleRestart = () => {
    audioManager.playClick();
    setMessagesHistory([]);
    setCurrentNodeId(chapter.startNodeId);
    setRecommendedChoiceId(null);
    setHintMessage(null);
  };

  // Hint button (10 coins)
  const handleRequestHint = () => {
    audioManager.playClick();
    const currentCoins = player?.coins ?? 120;
    if (currentCoins < 10) {
      setHintMessage('⚠️ لا تملك نقوداً كافية (تحتاج 10 عملات). يمكنك حل ألغاز أخرى لكسب العملات!');
      return;
    }

    if (onDeductCoins) {
      const ok = onDeductCoins(10);
      if (!ok) {
        setHintMessage('⚠️ لا تملك نقوداً كافية.');
        return;
      }
    }

    audioManager.playCoin();

    // Contextual Hint
    const undiscoveredClues = chapter.clues.filter(c => !foundClueIds.includes(c.id));
    if (undiscoveredClues.length > 0) {
      const nextClue = undiscoveredClues[0];
      setHintMessage(`💡 تلميح المحقق: ابحث عن "${nextClue.title}" — ${nextClue.description}`);
      return;
    }

    if (currentNode.choices && currentNode.choices.length > 0) {
      const bestChoice = currentNode.choices[0];
      setRecommendedChoiceId(bestChoice.id);
      setHintMessage(`💡 نصيحة للتحقيق: الخيار الأفضل الآن هو "${bestChoice.text}".`);
      return;
    }

    setHintMessage('💡 ركز على مطابقة إفادات الشهود مع الأدلة المتوفرة في دفتر التحقيق.');
  };

  // Detective's Instinct Hint System (15 coins): Reveals 1 undiscovered clue or simplifies a deduction puzzle
  const handleDetectiveInstinct = () => {
    audioManager.playClick();
    const currentCoins = player?.coins ?? 0;
    const INSTINCT_COST = 15;

    if (currentCoins < INSTINCT_COST) {
      audioManager.playFailure();
      setHintMessage(`⚠️ رصيدك غير كافٍ! تتطلب "غريزة المحقق" 15 عملة ذهبية (لديك ${currentCoins} عملة). يمكنك حل ألغاز أخرى أو إتمام المهام لكسب العملات.`);
      return;
    }

    if (onDeductCoins) {
      const ok = onDeductCoins(INSTINCT_COST);
      if (!ok) {
        audioManager.playFailure();
        setHintMessage('⚠️ تعذر خصم العملات، يرجى التحقق من رصيدك.');
        return;
      }
    }

    audioManager.playCoin();
    setScreenShock(true);
    setTimeout(() => setScreenShock(false), 800);

    // 1. Check for undiscovered clues in this chapter
    const undiscoveredClues = chapter.clues.filter(c => !foundClueIds.includes(c.id));
    // 2. Check for uncompleted deductions in this chapter
    const uncompletedDeductions = (chapter.deductions || []).filter(d => !completedDeductions.includes(d.id));

    if (undiscoveredClues.length > 0) {
      // Reveal an undiscovered clue
      const clueToReveal = undiscoveredClues[0];
      onClueDiscovered(clueToReveal.id);
      audioManager.playClueDiscovered();

      // Check if this newly found clue satisfies any pending deduction puzzle
      const relatedDeduction = chapter.deductions?.find(d => 
        d.requiredClueIds.includes(clueToReveal.id) && !completedDeductions.includes(d.id)
      );

      setInstinctModal({
        type: 'clue',
        title: clueToReveal.title,
        category: clueToReveal.category,
        description: clueToReveal.description,
        detail: clueToReveal.detail,
        note: relatedDeduction 
          ? `💡 هذا الدليل يرتبط باستنتاج: "${relatedDeduction.title}" في لوحة الاستنتاجات!`
          : 'تم تدوين هذا الدليل وحفظه مباشرة في دفتر أدلتك الجنائية.',
      });

      setHintMessage(`🧠 غريزة المحقق (-15 عملة): قادتك حواسك الجنائية لكشف دليل جديد: "${clueToReveal.title}"!`);
    } else if (uncompletedDeductions.length > 0) {
      // Simplify a deduction puzzle
      const deductionToSolve = uncompletedDeductions[0];
      if (onDeductionCompleted) {
        onDeductionCompleted(deductionToSolve.id);
      }
      audioManager.playAchievement();

      const clue1 = chapter.clues.find(c => c.id === deductionToSolve.requiredClueIds[0])?.title || 'الدليل الأول';
      const clue2 = chapter.clues.find(c => c.id === deductionToSolve.requiredClueIds[1])?.title || 'الدليل الثاني';

      setInstinctModal({
        type: 'deduction',
        title: deductionToSolve.title,
        description: deductionToSolve.conclusion,
        detail: `الربط الجنائي بين: [${clue1}] 🔗 [${clue2}]`,
        note: 'تم تبسيط وحل هذا الاستنتاج الجنائي بنجاح وتوثيقه في لوحة الاستنتاجات.',
        cluesCombined: [clue1, clue2]
      });

      setHintMessage(`🧠 غريزة المحقق (-15 عملة): تم تبسيط وحل الاستنتاج "${deductionToSolve.title}" بربط [${clue1}] مع [${clue2}]!`);
    } else {
      // All clues and deductions already uncovered
      audioManager.playSuccess();
      const culprit = chapter.suspects.find(s => s.isCulprit);
      const bestChoice = currentNode.choices?.[0];
      if (bestChoice) {
        setRecommendedChoiceId(bestChoice.id);
      }

      setInstinctModal({
        type: 'advice',
        title: 'البصيرة الاستنتاجية الكاملة',
        description: culprit 
          ? `لقد تم كشف كافة الأدلة وحل جميع الاستنتاجات! بوصلتك تدين المشتبه به "${culprit.name}" (${culprit.role}) — الدافع: ${culprit.motive}.`
          : 'كافة الأدلة والاستنتاجات مكتملة في هذه القضية! توجه الآن إلى لوحة الاتهام أو اختر مسارك بدقة.',
        note: bestChoice ? `الخيار الأنسب في الحوار الحالي: "${bestChoice.text}"` : undefined
      });

      setHintMessage('🧠 غريزة المحقق: تم استكمال جميع الأدلة والاستنتاجات بنجاح في هذه القضية!');
    }
  };

  const cluesFoundCount = foundClueIds.length;
  const totalClues = chapter.clues.length;

  return (
    <div className={`w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-2.5 sm:gap-3.5 select-text min-h-[100dvh] justify-between transition-transform duration-300 ${screenShock ? 'animate-noir-shock' : ''}`} dir="rtl">
      
      {/* Top Header Console Bar */}
      <header className="relative flex shrink-0 items-center justify-between gap-2 overflow-hidden rounded-[1.1rem] border border-slate-700/60 bg-gradient-to-l from-[#0d141e] via-[#19222f] to-[#0d141e] p-2 shadow-[0_14px_32px_rgba(0,0,0,0.24),inset_0_1px_rgba(255,255,255,0.055)] before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-l before:from-transparent before:via-amber-200/40 before:to-transparent sm:px-4 sm:py-3">
        
        {/* Left (RTL): Back Button + Case Info */}
        <div className="relative z-10 flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audioManager.playClick();
              onReturnToChapters();
            }}
            className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-slate-600 bg-slate-900/60 px-2 text-xs font-bold text-slate-200 shadow-[inset_0_1px_rgba(255,255,255,0.06)] transition duration-200 hover:border-amber-300/60 hover:bg-slate-800 hover:text-amber-100 sm:px-2.5"
            title="الرجوع لقائمة القضايا"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">القضايا</span>
          </button>

          {/* Logo & Case Title */}
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src="/logo.png" 
              alt="شعار المحقق" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/60 shadow-sm object-cover shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold leading-none">
                قضية 0{chapter.number}
              </span>
              <h2 className="hidden min-[421px]:block text-xs sm:text-sm font-extrabold text-slate-100 font-serif-ar leading-tight truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[240px] md:max-w-md">
                {chapter.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Investigation tools grouped into a single console */}
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex min-h-10 items-stretch overflow-hidden rounded-xl border border-amber-300/30 bg-black/25 shadow-[inset_0_1px_rgba(255,255,255,0.04),0_8px_20px_rgba(0,0,0,0.14)]" aria-label="أدوات التحقيق">
          {/* Detective's Instinct Button (Top bar trigger) */}
          <button
            onClick={handleDetectiveInstinct}
            disabled={isTyping}
            id="topbar-instinct-btn"
            className="inline-flex items-center gap-1.5 px-2.5 text-xs font-extrabold text-amber-200 transition duration-200 hover:bg-amber-300/10 hover:text-amber-100 disabled:opacity-45 max-[420px]:px-2"
            title="غريزة المحقق (15 عملة): كشف دليل خفي أو تبسيط استنتاج منطقي"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">غريزة المحقق</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-amber-300/30 bg-amber-400/15 px-1 text-[10px] font-black text-amber-100 max-[420px]:hidden">15</span>
          </button>

          <span className="my-2 w-px bg-gradient-to-b from-transparent via-amber-200/35 to-transparent" />

          {/* Coins */}
          <div className="inline-flex items-center gap-1 px-2.5 text-xs font-extrabold text-amber-200 max-[420px]:px-2" title="الرصيد المتاح">
            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span>{player?.coins ?? 120}</span>
          </div>

          <span className="my-2 w-px bg-gradient-to-b from-transparent via-amber-200/35 to-transparent" />

          {/* Notebook button */}
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenNotebook();
            }}
            className="inline-flex items-center gap-1 rounded-none bg-gradient-to-bl from-[#8c242b] to-[#4b131b] px-2.5 text-xs font-bold text-amber-100 transition duration-200 hover:from-[#a92d35] hover:to-[#681a24] max-[420px]:px-2"
            title="فتح دفتر الأدلة"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span className="hidden sm:inline">دفتر الأدلة</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-amber-300 px-1 text-[10px] font-black leading-none text-[#43120f]">
              {cluesFoundCount}/{totalClues}
            </span>
          </button>
          </div>

          {/* Sound Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-900/60 text-slate-300 shadow-[inset_0_1px_rgba(255,255,255,0.06)] transition duration-200 hover:-translate-y-px hover:border-amber-300/60 hover:bg-slate-800 hover:text-amber-100 max-[420px]:h-9 max-[420px]:w-9"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
            </button>
          )}
        </div>
      </header>

      {/* Clue Discovered Notification Banner */}
      {newClueToast && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-gradient-to-r from-[#2c2013] via-[#1f170e] to-[#121822] border border-amber-400/70 p-2.5 sm:p-3 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl shrink-0">🔍</span>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1 flex-wrap">
                <span>تم العثور على دليل:</span>
                <span className="text-white underline">{newClueToast.title}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{newClueToast.desc}</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenNotebook();
            }}
            className="w-full sm:w-auto px-3 py-1 rounded-lg bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors shrink-0 text-center"
          >
            عرض في الدفتر
          </button>
        </div>
      )}

      {/* Main Narrative Chat Card */}
      <main className="flex-1 bg-[#0f141c] border border-[#1e2736] rounded-2xl p-3 sm:p-5 md:p-6 flex flex-col justify-between shadow-xl min-h-[360px]">
        
        {/* Messages Stream with responsive dynamic viewport height */}
        <div className="overflow-y-auto space-y-3 pr-1 h-[48vh] sm:h-[54vh] md:h-[58vh] max-h-[600px]">
          {messagesHistory.map((msg, idx) => (
            <div key={msg.id || idx} className="animate-in fade-in duration-200">
              {/* Narrator */}
              {msg.type === 'narrator' && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#141b24] border border-[#222d3b] text-slate-200 text-xs sm:text-sm font-serif-ar leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-1 text-[10px] sm:text-[11px]">
                    📜 الرواية والأحداث:
                  </span>
                  {msg.text}
                </div>
              )}

              {/* Suspect / Character */}
              {msg.type === 'character' && (
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1c2636] border border-[#2e3e57] flex items-center justify-center text-lg sm:text-xl shrink-0 shadow">
                    {msg.senderAvatar || '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 mb-0.5 block">
                      {msg.sender}
                    </span>
                    <div className="p-2.5 sm:p-3 rounded-2xl rounded-tr-none bg-[#16202c] border border-[#263547] text-slate-100 text-xs sm:text-sm leading-relaxed shadow-sm break-words">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}

              {/* Player */}
              {msg.type === 'player' && (
                <div className="flex items-start gap-2.5 sm:gap-3 flex-row-reverse">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8b1e24]/60 border border-amber-400/40 flex items-center justify-center text-lg sm:text-xl shrink-0">
                    🕵️‍♂️
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 mb-0.5 block">
                      أنت (المحقق)
                    </span>
                    <div className="p-2.5 sm:p-3 rounded-2xl rounded-tl-none bg-[#202b3a] border border-[#33445c] text-white text-xs sm:text-sm leading-relaxed text-right break-words">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}

              {/* Clue message */}
              {msg.type === 'clue' && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-200 text-xs sm:text-sm flex items-center gap-2">
                  <span className="text-lg sm:text-xl shrink-0">🔍</span>
                  <div className="flex-1 break-words">{msg.text}</div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono py-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>المحقق يدون أقوال الشاهد...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Hint banner if requested */}
        {hintMessage && (
          <div className="mt-2.5 p-2 sm:p-2.5 rounded-xl bg-[#1e1b15] border border-amber-400/60 text-amber-200 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="break-words">{hintMessage}</span>
            </div>
            <button
              onClick={() => setHintMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-1 font-bold shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Choices Section */}
        <div className="mt-3 pt-3 border-t border-[#1f2a3a] shrink-0">
          {!currentNode.isEnding ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <HelpCircle className="w-3.5 h-3.5" />
                  اختر السؤال أو الخطوة التالية:
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Detective's Instinct Hint System (15 Coins) */}
                  <button
                    onClick={handleDetectiveInstinct}
                    disabled={isTyping}
                    id="detective-instinct-btn"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600/40 via-amber-500/30 to-amber-700/40 hover:from-amber-600/60 hover:to-amber-700/60 text-amber-200 border border-amber-400/70 text-[10px] sm:text-[11px] font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                    title="غريزة المحقق: استهلاك 15 عملة لكشف دليل غير مكتشف أو تبسيط استنتاج منطقي"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>غريزة المحقق (15 🪙)</span>
                  </button>

                  {/* Standard Hint Button (10 Coins) */}
                  <button
                    onClick={handleRequestHint}
                    disabled={isTyping}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1c2430] hover:bg-[#253245] text-slate-300 hover:text-amber-300 border border-[#2d3e56] text-[10px] sm:text-[11px] font-bold transition-all disabled:opacity-50"
                    title="استهلاك 10 عملات لكشف تلميح توجيهي"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">تلميح (10 عملات)</span>
                  </button>
                </div>
              </div>

              {/* Choice Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-0.5">
                {currentNode.choices && currentNode.choices.length > 0 ? (
                  currentNode.choices.map((choice) => {
                    const isRecommended = choice.id === recommendedChoiceId;
                    return (
                      <button
                        key={choice.id}
                        disabled={isTyping}
                        onClick={() => handleChoiceSelect(choice)}
                        className={`w-full text-right p-2.5 sm:p-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between group disabled:opacity-50 min-h-[44px] touch-manipulation ${
                          isRecommended
                            ? 'bg-[#2b2010] text-amber-200 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-[#151d27] hover:bg-[#1d2938] text-slate-100 hover:text-amber-300 border border-[#253344] hover:border-amber-400/50'
                        }`}
                      >
                        <span className="leading-relaxed">{choice.text}</span>
                        <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-2">
                          ←
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <button
                    onClick={onReturnToChapters}
                    className="w-full p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm text-center transition-colors min-h-[44px]"
                  >
                    العودة لسجل القضايا
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Ending Card */
            <div className="p-3 sm:p-4 rounded-xl bg-[#141c28] border border-amber-400/40 text-center space-y-2.5">
              {currentNode.isCorrectEnding ? (
                <div className="space-y-1">
                  <div className="text-2xl">🏆</div>
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-300">
                    أحسنت يا حضرة المحقق! تم حل القضية بنجاح.
                  </h3>
                  <p className="text-xs text-slate-300">
                    كشفت الجاني وقدمت الأدلة الحاسمة للعدالة.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl">❌</div>
                  <h3 className="text-sm sm:text-base font-extrabold text-rose-400">
                    للأسف، لم تكن النتيجة صحيحة أو أفلت الجاني.
                  </h3>
                  <p className="text-xs text-slate-300">
                    أعد مراجعة الأدلة وأقوال الشهود وحاول مرة أخرى!
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e293a] hover:bg-[#2a3a50] text-slate-200 border border-[#374963] text-xs font-bold transition-colors min-h-[40px]"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>إعادة المحاولة من البداية</span>
                </button>

                <button
                  onClick={onReturnToChapters}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-colors min-h-[40px] text-center"
                >
                  اختيار قضية أخرى
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Discovered Clues Quick Bar (Fully Responsive) */}
      <footer className="bg-[#101620] border border-[#1e2736] rounded-xl p-2 sm:px-3 sm:py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto overflow-hidden">
          <span className="text-amber-400 font-bold shrink-0 text-[11px] sm:text-xs">
            الأدلة المكتشفة ({cluesFoundCount}):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
            {chapter.clues.map((clue) => {
              const isFound = foundClueIds.includes(clue.id);
              return (
                <span
                  key={clue.id}
                  onClick={() => {
                    if (isFound) onOpenNotebook();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border transition-colors shrink-0 ${
                    isFound
                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 cursor-pointer hover:bg-amber-900/50'
                      : 'bg-[#151c27] text-slate-500 border-[#222e3f]'
                  }`}
                  title={isFound ? clue.title : 'دليل لم يُكتشف بعد'}
                >
                  {isFound ? '✓ ' + clue.title : '🔒 غير مكتشف'}
                </span>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onOpenNotebook();
          }}
          className="text-amber-400 hover:underline font-bold text-[11px] shrink-0 self-end sm:self-auto"
        >
          فتح الدفتر الكامل ←
        </button>
      </footer>

      {/* Detective's Instinct Revelation Modal */}
      {instinctModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none" 
          dir="rtl"
          onClick={() => setInstinctModal(null)}
        >
          <div 
            className="relative w-full max-w-md bg-gradient-to-b from-[#1c160c] via-[#141a24] to-[#0d121b] border-2 border-amber-400/80 rounded-2xl p-4 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.35)] space-y-3.5 sm:space-y-4 select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg border border-amber-300/60 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-950 fill-amber-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-amber-200 font-serif-ar leading-tight">
                      غريزة المحقق الفطرية
                    </h3>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      -15 🪙
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-amber-300/80">
                    Detective's Instinct — بصيرة جنائية فورية
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInstinctModal(null)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#202b3a] hover:bg-[#2c3b50] text-slate-300 hover:text-white flex items-center justify-center border border-[#33465e] transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Card */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#0e131b] border border-amber-500/40 space-y-2.5 shadow-inner">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {instinctModal.type === 'clue' && '🔍 تم كشف دليل جديد'}
                  {instinctModal.type === 'deduction' && '💡 تم حل وتبسيط استنتاج منطقي'}
                  {instinctModal.type === 'advice' && '🎯 توجيه جنائي حاسم'}
                </span>

                {instinctModal.category && (
                  <span className="text-[10px] text-slate-400 bg-[#16202c] px-2 py-0.5 rounded border border-[#27374c]">
                    تصنيف: {instinctModal.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="text-sm sm:text-base font-black text-amber-100 font-serif-ar leading-snug">
                {instinctModal.title}
              </h4>

              {/* Combined Clues banner if deduction */}
              {instinctModal.cluesCombined && (
                <div className="p-2 rounded-lg bg-[#182332] border border-[#2a3c54] text-[11px] text-amber-200 flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 font-bold">الربط المنطقي:</span>
                  <span className="bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded text-amber-300 font-semibold">
                    {instinctModal.cluesCombined[0]}
                  </span>
                  <span className="text-amber-400 font-bold">🔗</span>
                  <span className="bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded text-amber-300 font-semibold">
                    {instinctModal.cluesCombined[1]}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {instinctModal.description}
              </p>

              {/* Detail info if clue */}
              {instinctModal.detail && (
                <div className="p-2 rounded-lg bg-[#131b26] border border-[#233042] text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-0.5 text-[10px]">
                    تفاصيل المعاينة الفنية:
                  </span>
                  {instinctModal.detail}
                </div>
              )}

              {/* Note */}
              {instinctModal.note && (
                <p className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{instinctModal.note}</span>
                </p>
              )}
            </div>

            {/* Balance & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>رصيدك المتبقي:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  {player?.coins ?? 0} عملة
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setInstinctModal(null);
                    onOpenNotebook();
                  }}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#8b1e24] to-[#601419] hover:from-[#a0232a] hover:to-[#73191f] text-amber-100 border border-amber-400/40 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>معاينة في الدفتر</span>
                </button>

                <button
                  onClick={() => setInstinctModal(null)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-colors text-center"
                >
                  متابعة التحقيق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
