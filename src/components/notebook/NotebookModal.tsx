import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Clock, 
  Lightbulb, 
  Share2, 
  Lock, 
  Check, 
  Plus, 
  Trash2, 
  AlertCircle,
  FileQuestion,
  HelpCircle,
  Pin
} from 'lucide-react';
import { Chapter, PersonalTheoryLink } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  foundClueIds: string[];
  completedDeductionIds: string[];
  interrogatedSuspectIds: string[];
  unlockedTimelineIds: string[];
  personalTheories: PersonalTheoryLink[];
  onAddPersonalTheory: (suspectId: string, clueId: string, note: string) => void;
  onRemovePersonalTheory: (linkId: string) => void;
  onCompleteDeduction: (deductionId: string) => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  chapter,
  foundClueIds,
  completedDeductionIds,
  interrogatedSuspectIds,
  unlockedTimelineIds,
  personalTheories,
  onAddPersonalTheory,
  onRemovePersonalTheory,
  onCompleteDeduction
}) => {
  const [activeTab, setActiveTab] = useState<'suspects' | 'clues' | 'timeline' | 'deductions' | 'board'>('board');
  
  // Deduction builder state
  const [selectedClueA, setSelectedClueA] = useState<string | null>(null);
  const [selectedClueB, setSelectedClueB] = useState<string | null>(null);
  const [deductionFeedback, setDeductionFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // Investigation Board theory linker state
  const [boardSelectedClue, setBoardSelectedClue] = useState<string | null>(null);
  const [boardSelectedSuspect, setBoardSelectedSuspect] = useState<string | null>(null);
  const [theoryNoteInput, setTheoryNoteInput] = useState<string>('');

  if (!isOpen) return null;

  // Deduction Builder Check
  const handleTestDeduction = () => {
    if (!selectedClueA || !selectedClueB) return;
    if (selectedClueA === selectedClueB) {
      setDeductionFeedback({ text: 'يرجى اختيار دليلين مختلفين للربط المنطقي!', isSuccess: false });
      return;
    }

    // Check if matches any deduction in the chapter
    const match = chapter.deductions.find(d => 
      (d.requiredClueIds[0] === selectedClueA && d.requiredClueIds[1] === selectedClueB) ||
      (d.requiredClueIds[0] === selectedClueB && d.requiredClueIds[1] === selectedClueA)
    );

    if (match) {
      audioManager.playSuccess();
      onCompleteDeduction(match.id);
      setDeductionFeedback({ 
        text: `استنتاج صائب: ${match.conclusion}`, 
        isSuccess: true 
      });
      setSelectedClueA(null);
      setSelectedClueB(null);
    } else {
      audioManager.playFailure();
      setDeductionFeedback({ 
        text: 'لم يظهر أي رابط جوهري مباشر بين هذين الدليلين حتى الآن. ابحث عن خيوط أخرى.', 
        isSuccess: false 
      });
    }
  };

  // Create personal theory link on board
  const handleCreateTheoryLink = () => {
    if (!boardSelectedClue || !boardSelectedSuspect) return;
    audioManager.playClick();
    onAddPersonalTheory(
      boardSelectedSuspect, 
      boardSelectedClue, 
      theoryNoteInput || 'رابط شبهة جنائية مقترح'
    );
    setBoardSelectedClue(null);
    setBoardSelectedSuspect(null);
    setTheoryNoteInput('');
  };

  const tabs = [
    { id: 'board', label: 'لوحة التحقيق التفاعلية', icon: Share2 },
    { id: 'suspects', label: 'ملفات المشتبه بهم', icon: Users },
    { id: 'clues', label: 'سجل الأدلة المكتشفة', icon: Search },
    { id: 'timeline', label: 'الخط الزمني للأحداث', icon: Clock },
    { id: 'deductions', label: 'بناء الاستنتاجات', icon: Lightbulb }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[92vh] bg-[#10151e] border-2 border-[#c5a059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        dir="rtl"
      >
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#243042] bg-[#141b26] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8b1e24]/30 border border-[#c5a059]/50 flex items-center justify-center text-xl text-[#c5a059]">
              📋
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#f2ede4] flex items-center gap-2">
                <span>دفتر التحقيق الجنائي</span>
                <span className="text-xs font-normal text-[#c5a059] bg-[#c5a059]/15 px-2 py-0.5 rounded border border-[#c5a059]/30">
                  {chapter.title}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-serif-ar">
                وثائق سرية • ملاحظات المحقق الشخصية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#192230] hover:bg-[#253347] text-slate-300 hover:text-white transition-colors"
            title="إغلاق الدفتر"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#212c3c] bg-[#0c1017] px-3 gap-1 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioManager.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#c5a059] text-[#c5a059] bg-[#17202c]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121822]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'clues' && (
                  <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded-full">
                    {foundClueIds.length}
                  </span>
                )}
                {tab.id === 'deductions' && (
                  <span className="text-[10px] bg-slate-800 text-sky-300 px-1.5 py-0.2 rounded-full">
                    {completedDeductionIds.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f141d]">
          {/* TAB 1: Visual Investigation Board */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              <div className="bg-[#151c27] p-4 rounded-xl border border-[#233043] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#c5a059] flex items-center gap-1.5">
                    <Pin className="w-4 h-4 text-rose-500" />
                    لوحة التحقيق الجنائية (خيوط الشك الشخصية)
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    اربط الأدلة بالمشتبه بهم لتسجيل فرضياتك بحرية؛ لا تكشف هذه الروابط نتائج القضية تلقائياً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#101620] border border-[#2b3a4e] text-slate-300">
                    الروابط المنشأة: {personalTheories.length}
                  </span>
                </div>
              </div>

              {/* Theory Linker Control Bar */}
              <div className="bg-[#161f2c] p-4 rounded-xl border border-[#2a384d] space-y-3">
                <div className="text-xs font-bold text-slate-300">
                  إنشاء رابط جديد بين دليل ومشتبه به:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Select Clue */}
                  <select
                    value={boardSelectedClue || ''}
                    onChange={(e) => setBoardSelectedClue(e.target.value || null)}
                    className="p-2.5 rounded-lg bg-[#0e141c] border border-[#2b394c] text-xs text-slate-100 focus:border-[#c5a059] outline-none"
                  >
                    <option value="">-- اختر الدليل المكتشف --</option>
                    {chapter.clues.filter(c => foundClueIds.includes(c.id)).map(c => (
                      <option key={c.id} value={c.id}>
                        🔍 {c.title}
                      </option>
                    ))}
                  </select>

                  {/* Select Suspect */}
                  <select
                    value={boardSelectedSuspect || ''}
                    onChange={(e) => setBoardSelectedSuspect(e.target.value || null)}
                    className="p-2.5 rounded-lg bg-[#0e141c] border border-[#2b394c] text-xs text-slate-100 focus:border-[#c5a059] outline-none"
                  >
                    <option value="">-- اختر المشتبه به --</option>
                    {chapter.suspects.map(s => (
                      <option key={s.id} value={s.id}>
                        👤 {s.name} ({s.role})
                      </option>
                    ))}
                  </select>

                  {/* Note & Link Button */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ملاحظة الربط (مثلاً: تواجد بالموقع)"
                      value={theoryNoteInput}
                      onChange={(e) => setTheoryNoteInput(e.target.value)}
                      className="flex-1 p-2.5 rounded-lg bg-[#0e141c] border border-[#2b394c] text-xs text-slate-100 placeholder-slate-500 focus:border-[#c5a059] outline-none"
                    />
                    <button
                      disabled={!boardSelectedClue || !boardSelectedSuspect}
                      onClick={handleCreateTheoryLink}
                      className="px-4 py-2.5 rounded-lg bg-[#8b1e24] hover:bg-[#a6252c] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ربط</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Corkboard Visual Presentation */}
              <div className="corkboard-texture p-6 rounded-2xl border-4 border-[#2b1f14] min-h-[380px] shadow-inner relative overflow-hidden">
                {personalTheories.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-amber-200/50">
                    <Pin className="w-12 h-12 text-red-500/40 mb-2" />
                    <p className="text-sm font-semibold">لوحة التحقيق خالية من الروابط حالياً</p>
                    <p className="text-xs text-slate-400 mt-1">
                      اختر دليلاً ومشتبهاً به أعلاه وثبّت خيط التحقيق الأول بالدبابيس الحمراء.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalTheories.map(link => {
                      const clue = chapter.clues.find(c => c.id === link.clueId);
                      const suspect = chapter.suspects.find(s => s.id === link.suspectId);
                      return (
                        <div 
                          key={link.id}
                          className="bg-[#141b24]/95 p-4 rounded-xl border-2 border-dashed border-[#8b1e24] shadow-xl relative group flex items-start justify-between gap-3"
                        >
                          {/* Red Pin SVG */}
                          <div className="absolute -top-2.5 right-4 w-5 h-5 rounded-full bg-red-600 border-2 border-amber-200 shadow-md flex items-center justify-center text-[10px] text-white">
                            📍
                          </div>

                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                              <span>{suspect?.name || 'مشتبه به'}</span>
                              <span className="text-red-400">⚡ متصل بـ</span>
                              <span>{clue?.title || 'دليل'}</span>
                            </div>

                            <p className="text-xs text-slate-300 font-serif-ar bg-[#0d121a] p-2.5 rounded-lg border border-[#1e2735]">
                              "{link.note}"
                            </p>
                          </div>

                          <button
                            onClick={() => onRemovePersonalTheory(link.id)}
                            className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-colors shrink-0"
                            title="حذف هذا الرابط من اللوحة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Suspects Dossier */}
          {activeTab === 'suspects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.suspects.map(suspect => {
                const isInterrogated = interrogatedSuspectIds.includes(suspect.id);
                return (
                  <div 
                    key={suspect.id}
                    className="bg-[#141b25] p-5 rounded-xl border border-[#232f41] relative overflow-hidden shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-[#1c2635] border border-[#2d3d54] flex items-center justify-center text-3xl shadow-sm">
                            {suspect.avatar}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#f2ede4]">
                              {suspect.name}
                            </h3>
                            <p className="text-xs text-[#c5a059] font-serif-ar font-medium">
                              {suspect.role}
                            </p>
                          </div>
                        </div>

                        {/* Interrogation Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          isInterrogated
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        }`}>
                          {isInterrogated ? '✓ تم الاستجواب' : 'قيد الانتظار'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="bg-[#0e131b] p-2.5 rounded-lg border border-[#1d2634]">
                          <span className="font-bold text-slate-300 block mb-0.5">الملف الشخصي:</span>
                          <span className="text-slate-400">{suspect.bio}</span>
                        </div>

                        <div className="bg-[#0e131b] p-2.5 rounded-lg border border-[#1d2634]">
                          <span className="font-bold text-amber-300 block mb-0.5">حجة الغياب (الادعاء):</span>
                          <span className="text-slate-300">{suspect.alibi}</span>
                        </div>

                        <div className="bg-[#0e131b] p-2.5 rounded-lg border border-[#1d2634]">
                          <span className="font-bold text-rose-300 block mb-0.5">الشبهة أو الدافع المحتمل:</span>
                          <span className="text-slate-300">{suspect.motive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Suspicion Level Meter */}
                    <div className="mt-4 pt-3 border-t border-[#1f2937] flex items-center justify-between text-xs">
                      <span className="text-slate-400">مؤشر الشبهة الجنائية:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <span
                            key={lvl}
                            className={`w-3 h-3 rounded-full ${
                              lvl <= suspect.suspicionLevel
                                ? 'bg-red-500 shadow-sm'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Clues Log */}
          {activeTab === 'clues' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>الأدلة التي تم رفعها من مسرح الجريمة ({foundClueIds.length} من {chapter.clues.length}):</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.clues.map(clue => {
                  const isFound = foundClueIds.includes(clue.id);
                  return (
                    <div 
                      key={clue.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isFound
                          ? 'bg-[#141b25] border-amber-500/50 shadow-md'
                          : 'bg-[#0f141c]/60 border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isFound
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isFound ? <Search className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-100">
                              {isFound ? clue.title : 'دليل لم يُكتشف بعد'}
                            </h4>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">
                              {clue.category}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {isFound ? clue.description : 'عليك فحص أرجاء مسرح الجريمة والاستجواب للوصول إليه.'}
                          </p>

                          {isFound && clue.detail && (
                            <div className="mt-2.5 p-2 rounded bg-[#0d1219] border border-[#1e2736] text-[11px] text-amber-200/90 font-serif-ar">
                              💡 {clue.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-xs text-slate-400">
                تسلسل الأحداث الزمني وفق إفادات الشهود والفحص الجنائي:
              </div>

              <div className="relative border-r-2 border-[#2b394d] pr-6 space-y-6">
                {chapter.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-[#c5a059] border-2 border-[#0f141d] shadow-md group-hover:scale-125 transition-transform" />

                    <div className="bg-[#141b25] p-3.5 rounded-xl border border-[#232f41] shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#c5a059] font-mono">
                          ⏰ {event.time}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif-ar">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Deduction Builder */}
          {activeTab === 'deductions' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#151c27] p-4 rounded-xl border border-[#243144]">
                <h3 className="text-sm font-bold text-[#c5a059] mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  مختبر الاستنتاجات الجنائية (Deduction Builder)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اختر دليلين متطابقين من قائمتك وحاول دمجهما لكشف استنتاج منطقي يقربك من هوية الجاني الحقيقي.
                </p>
              </div>

              {/* Pair Selection Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Clue A Picker */}
                <div className="bg-[#121822] p-4 rounded-xl border border-[#232f40]">
                  <span className="text-xs font-bold text-amber-300 block mb-2">الدليل الأول:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {chapter.clues.filter(c => foundClueIds.includes(c.id)).map(clue => (
                      <button
                        key={clue.id}
                        onClick={() => setSelectedClueA(clue.id)}
                        className={`w-full text-right p-2 rounded-lg border text-xs transition-colors ${
                          selectedClueA === clue.id
                            ? 'bg-[#8b1e24]/40 border-amber-400 text-amber-200'
                            : 'bg-[#18212e] border-[#253245] text-slate-300 hover:bg-[#1f2b3b]'
                        }`}
                      >
                        {clue.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clue B Picker */}
                <div className="bg-[#121822] p-4 rounded-xl border border-[#232f40]">
                  <span className="text-xs font-bold text-sky-300 block mb-2">الدليل الثاني:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {chapter.clues.filter(c => foundClueIds.includes(c.id)).map(clue => (
                      <button
                        key={clue.id}
                        onClick={() => setSelectedClueB(clue.id)}
                        className={`w-full text-right p-2 rounded-lg border text-xs transition-colors ${
                          selectedClueB === clue.id
                            ? 'bg-[#8b1e24]/40 border-sky-400 text-sky-200'
                            : 'bg-[#18212e] border-[#253245] text-slate-300 hover:bg-[#1f2b3b]'
                        }`}
                      >
                        {clue.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  disabled={!selectedClueA || !selectedClueB}
                  onClick={handleTestDeduction}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfba6e] hover:from-[#d6b169] hover:to-[#ebc87e] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-md"
                >
                  اختبار الرابط المنطقي والدمج
                </button>
              </div>

              {/* Feedback Alert */}
              {deductionFeedback && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  deductionFeedback.isSuccess
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                }`}>
                  {deductionFeedback.text}
                </div>
              )}

              {/* Unlocked Deductions List */}
              <div className="mt-6 pt-4 border-t border-[#232e3f]">
                <h4 className="text-xs font-bold text-slate-300 mb-3">
                  الاستنتاجات المحققة حتى الآن ({completedDeductionIds.length}):
                </h4>

                <div className="space-y-3">
                  {chapter.deductions.map(deduction => {
                    const isDone = completedDeductionIds.includes(deduction.id);
                    return (
                      <div 
                        key={deduction.id}
                        className={`p-3.5 rounded-xl border text-xs ${
                          isDone
                            ? 'bg-[#141d28] border-emerald-500/40 text-slate-200 shadow-sm'
                            : 'bg-[#0f141b]/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-1">
                          {isDone ? <Check className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4" />}
                          <span>{deduction.title}</span>
                        </div>
                        <p className="font-serif-ar text-slate-300 leading-relaxed">
                          {isDone ? deduction.conclusion : 'قم بالربط بين دليلين رئيسيين للوصول إلى هذا الاستنتاج.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
