import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  VolumeX, 
  Zap, 
  RotateCcw, 
  AlertTriangle, 
  Info,
  Music,
  ShieldCheck
} from 'lucide-react';
import { PlayerProfile } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdateSettings: (newSettings: PlayerProfile['settings']) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdateSettings,
  onResetProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const nextState = !player.settings.soundEnabled;
    audioManager.setEnabled(nextState);
    onUpdateSettings({
      ...player.settings,
      soundEnabled: nextState
    });
    if (nextState) audioManager.playClick();
  };

  const handleToggleAmbientMusic = () => {
    const isPlaying = audioManager.toggleMusic();
    setIsMusicPlaying(isPlaying);
  };

  const handleChangeSpeed = (speed: 'slow' | 'normal' | 'fast' | 'instant') => {
    audioManager.playClick();
    onUpdateSettings({
      ...player.settings,
      textSpeed: speed
    });
  };

  const handleConfirmReset = () => {
    audioManager.playFailure();
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-[#121822] border border-[#263447] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#212c3c] flex items-center justify-between bg-[#151d28]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8b1e24]/30 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f2ede4]">
                إعدادات اللعبة والنظام
              </h2>
              <p className="text-xs text-slate-400 font-serif-ar">
                تفضيلات الصوت، سرعة النص، وإدارة الحفظ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#192230] hover:bg-[#253245] text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Audio Controls */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              المؤثرات الصوتية والموسيقى التصويرية
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151d27] border border-[#222d3e]">
              <div className="flex items-center gap-3">
                {player.settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <div className="text-sm font-bold text-slate-200">الأصوات والمؤثرات الجنائية</div>
                  <div className="text-xs text-slate-400 font-serif-ar">نقرات الآلة الكاتبة، كشف الأدلة، واحتفالات النصر</div>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  player.settings.soundEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {player.settings.soundEnabled ? 'مفعل' : 'مكتوم'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151d27] border border-[#222d3e]">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-sm font-bold text-slate-200">الموسيقى المحيطية (Noir Synth)</div>
                  <div className="text-xs text-slate-400 font-serif-ar">ألحان نوار سينمائية ديناميكية تتفاعل مع أجواء القضية</div>
                </div>
              </div>

              <button
                onClick={handleToggleAmbientMusic}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isMusicPlaying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isMusicPlaying ? 'تعمل الآن ♫' : 'تشغيل الموسيقى'}
              </button>
            </div>
          </div>

          {/* Text Speed */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              سرعة ظهور حوارات وسطور التحقيق
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'slow', label: 'هادئ بطيء' },
                { id: 'normal', label: 'طبيعي معتدل' },
                { id: 'fast', label: 'سريع' },
                { id: 'instant', label: 'فوري ومباشر' }
              ].map(sp => {
                const isSelected = player.settings.textSpeed === sp.id;
                return (
                  <button
                    key={sp.id}
                    onClick={() => handleChangeSpeed(sp.id as typeof player.settings.textSpeed)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-[#8b1e24] border-red-500 text-white shadow-sm'
                        : 'bg-[#151d27] border-[#222d3e] text-slate-300 hover:bg-[#1c2736]'
                    }`}
                  >
                    {sp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="pt-4 border-t border-[#202b3a] space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              إعادة تعيين التقدم والملفات
            </h3>

            {showResetConfirm ? (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600 space-y-3">
                <p className="text-xs text-rose-200 font-serif-ar leading-relaxed">
                  هل أنت متأكد تماماً من محو كل القضايا المحلولة، والأدلة، والإنجازات والبدء من الصفر كمتدرب مستجد؟ هذا الإجراء لا يمكن الرجوع عنه!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                  >
                    نعم، امسح كل السجلات
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-[#141b25] text-slate-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-[#19202a] hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط تقدم المحقق بالكامل</span>
              </button>
            )}
          </div>

          {/* About / Credits */}
          <div className="p-3.5 rounded-xl bg-[#0f141c] border border-[#1f2939] text-xs text-slate-400 font-serif-ar space-y-1">
            <div className="font-bold text-slate-300">يوميات محقق • الإصدار 2.0 المستقر</div>
            <div>لعبة غموض وتحقيقات جنائية باللغة العربية • تم بناؤها باستخدام React, TypeScript & Tailwind CSS.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
