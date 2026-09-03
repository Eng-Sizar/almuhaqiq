import React from 'react';
import { Clock3, ShieldCheck, Sparkles } from 'lucide-react';

interface GameTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const GameTermsModal: React.FC<GameTermsModalProps> = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#05080e]/90 p-4 backdrop-blur-md animate-in fade-in duration-300" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="game-terms-title">
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-amber-200/25 bg-[#101925] shadow-[0_28px_90px_rgba(0,0,0,0.65)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.24),transparent_70%)]" />
        <div className="relative p-6 sm:p-8">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-200/35 bg-[#1a2027] shadow-[0_0_32px_rgba(197,160,89,0.16)]">
            <ShieldCheck className="h-8 w-8 text-amber-200" />
          </div>

          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5 text-[10px] font-extrabold tracking-[0.2em] text-cyan-200/80">
              <Sparkles className="h-3.5 w-3.5" />
              أهلاً بك في المحقق
            </div>
            <h2 id="game-terms-title" className="font-serif-ar text-2xl font-black text-white">شروط اللعب</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              بالمتابعة، توافق على الاستمتاع بتجربة التحقيق واحترام قواعد اللعب ومحتواه.
            </p>
          </div>

          <div className="my-6 flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-right">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
              <Clock3 className="h-4 w-4" />
            </div>
            <p className="text-sm leading-6 text-slate-200">
              تُضاف <strong className="text-cyan-200">3 قصص جديدة للتحقيق</strong> كل يوم في الساعة <strong className="text-amber-200">7:00 مساءً بتوقيت القاهرة</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onAccept}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[#c5a059] to-[#e4c47e] px-5 py-3.5 text-sm font-extrabold text-[#17110a] shadow-[0_12px_28px_rgba(197,160,89,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(197,160,89,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[footerSheen_4s_ease-in-out_infinite]" />
            <ShieldCheck className="relative h-4 w-4" />
            <span className="relative">أوافق وأبدأ التحقيق</span>
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-500">يُحفظ اختيارك على هذا الجهاز فقط.</p>
        </div>
      </div>
    </div>
  );
};
