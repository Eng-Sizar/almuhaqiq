import React from 'react';
import { Instagram, MessageCircle, Send, Sparkles } from 'lucide-react';

const socialLinks = [
  { label: 'واتساب', href: 'https://wa.me/201031916497', icon: MessageCircle, color: 'hover:border-emerald-300/70 hover:bg-emerald-300/10 hover:text-emerald-200' },
  { label: 'تيليجرام', href: 'https://t.me/I_X_X_T', icon: Send, color: 'hover:border-sky-300/70 hover:bg-sky-300/10 hover:text-sky-200' },
  { label: 'إنستغرام', href: 'https://www.instagram.com/i_x_x_t', icon: Instagram, color: 'hover:border-pink-300/70 hover:bg-pink-300/10 hover:text-pink-200' },
];

export const AppFooter: React.FC = () => (
  <footer className="relative mt-10 overflow-hidden border-t border-amber-200/[0.08] bg-[#05080e] px-4 py-10 sm:mt-14 sm:px-6 sm:py-14" dir="rtl">
    <div className="footer-aurora pointer-events-none absolute inset-0 opacity-70" />
    <div className="footer-orb pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="footer-orb-delayed pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-amber-400/[0.09] blur-3xl" />

    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b111b]/85 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.04] bg-[linear-gradient(130deg,rgba(18,29,43,0.92),rgba(8,13,21,0.96)_55%,rgba(22,18,14,0.92))] px-5 py-8 sm:px-10 sm:py-10">
        <div className="footer-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute left-5 top-5 hidden h-16 w-16 rounded-full border border-cyan-200/[0.08] sm:block" />
        <div className="absolute bottom-5 right-6 hidden h-2 w-2 rounded-full bg-amber-300/70 shadow-[0_0_16px_rgba(252,211,77,0.8)] sm:block" />

        <div className="relative flex flex-col items-center gap-7 text-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <div className="relative grid h-[5.25rem] w-[5.25rem] place-items-center">
              <div className="absolute inset-0 rounded-[1.75rem] border border-cyan-200/30 animate-[spin_12s_linear_infinite] [border-top-color-amber-200]" />
              <div className="absolute inset-2 rounded-[1.25rem] border border-dashed border-white/20 animate-[spin_8s_linear_infinite_reverse]" />
              <div className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-[1.1rem] border border-amber-200/30 bg-[#09131f] shadow-[0_0_26px_rgba(34,211,238,0.18)]">
                <img src="/logo.png" alt="شعار لعبة المحقق" className="h-12 w-12 rounded-[0.85rem] object-cover" />
              </div>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/70" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#0b111b] bg-cyan-300" />
              </span>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-extrabold tracking-[0.22em] text-amber-200/80 sm:justify-start">
                <Sparkles className="h-3.5 w-3.5" />
                عَالَمُ الأَلْغَاز
              </div>
              <h2 className="font-serif-ar text-3xl font-black tracking-tight text-white sm:text-4xl">المحقق</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">كل دليل يقودك خطوةً أقرب إلى الحقيقة.</p>
            </div>
          </div>

          <div className="h-px w-full max-w-md bg-gradient-to-l from-transparent via-amber-200/25 to-transparent" />

          <nav className="flex items-center justify-center gap-3" aria-label="روابط التواصل الاجتماعي">
            {socialLinks.map(({ label, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={`group relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${color}`}
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="pointer-events-none absolute -bottom-8 scale-90 whitespace-nowrap rounded-md border border-white/10 bg-[#07101b] px-2 py-1 text-[10px] font-bold text-slate-300 opacity-0 transition group-hover:bottom-[-2.35rem] group-hover:scale-100 group-hover:opacity-100">{label}</span>
              </a>
            ))}
          </nav>

          <div
            dir="ltr"
            className="footer-developer-link relative flex flex-wrap items-center justify-center gap-x-2 gap-y-2 overflow-hidden rounded-xl border border-white/[0.06] bg-slate-700/35 px-3 py-2.5 font-['Cairo'] text-center text-sm font-bold tracking-tight text-slate-100 sm:px-5 sm:text-base"
          >
            <span className="footer-link-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="relative whitespace-nowrap text-[#a6d76f]">&lt; Developed By &gt;</span>
            <a
              href="https://www.nesr.site"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-md bg-slate-700 px-3 py-1 text-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-[0_7px_18px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6d76f]"
            >
              Hamza Hesham
            </a>
            <span className="relative whitespace-nowrap text-[#a6d76f]">&lt; All Copy Rights Reserved @2026 &gt;</span>
          </div>
        </div>

        <div className="relative mt-8 flex items-center justify-center border-t border-white/[0.06] pt-4 text-[10px] font-medium tracking-wide text-slate-500">
          <span className="text-amber-200/60">صُمّم للبحث عن الحقيقة</span>
        </div>
      </div>
    </div>
  </footer>
);
