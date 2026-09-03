import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Coins, 
  Check, 
  Sparkles, 
  Crown, 
  Award, 
  AlertCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_SHOP_ITEMS } from '../../data/shop';
import { PlayerProfile, ShopItem } from '../../types';
import { audioManager } from '../../lib/audio/audioManager';

interface ShopScreenProps {
  player: PlayerProfile;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (item: ShopItem) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  player,
  onBuyItem,
  onEquipItem
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'avatar' | 'title'>('all');
  const [confirmModalItem, setConfirmModalItem] = useState<ShopItem | null>(null);

  const filteredItems = ALL_SHOP_ITEMS.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const getRarityBadge = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">أسطوري</span>;
      case 'epic':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">ملحمي</span>;
      case 'rare':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">نادر</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">شائع</span>;
    }
  };

  const handleConfirmPurchase = () => {
    if (!confirmModalItem) return;
    if (player.coins < confirmModalItem.price) {
      audioManager.playFailure();
      return;
    }

    audioManager.playCoin();
    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch {}

    onBuyItem(confirmModalItem);
    setConfirmModalItem(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 select-text" dir="rtl">
      {/* Top Banner */}
      <div className="bg-[#131923] p-5 sm:p-6 rounded-2xl border border-[#232f41] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            متجر المعدات والأوسمة الجنائية
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f2ede4]">
            اقتناء الهويات الرمزية والألقاب الشرفية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-ar mt-1">
            استبدل عملاتك الجنائية بمظاهر المحقق الكلاسيكية والرموز الحصرية.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#0e141c] px-4 py-2.5 rounded-xl border border-amber-500/30 shadow-sm">
          <Coins className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400">رصيد العملات</div>
            <div className="text-base font-extrabold text-amber-300">{player.coins} عملة</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#212c3c] gap-2">
        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('all');
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          كافة المعروضات
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('avatar');
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'avatar'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          الشخصيات الرمزية
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            setActiveTab('title');
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'title'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#161f2c]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          الألقاب الفخرية
        </button>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isOwned = player.ownedShopItems?.includes(item.id);
          const isEquipped = item.type === 'avatar'
            ? player.avatar === item.value
            : player.equippedTitle === item.value;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isEquipped
                  ? 'bg-[#192434] border-[#c5a059] ring-2 ring-[#c5a059]/40 shadow-lg'
                  : isOwned
                  ? 'bg-[#141b25] border-[#253346]'
                  : 'bg-[#111720] border-[#1e2837] hover:border-[#33445e]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0e141c] border border-[#232f41] flex items-center justify-center text-3xl shadow-inner">
                    {item.type === 'avatar' ? (
                      item.value
                    ) : (
                      <Crown className="w-7 h-7 text-[#c5a059]" />
                    )}
                  </div>
                  {getRarityBadge(item.rarity)}
                </div>

                <h3 className="text-base font-bold text-slate-100">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-serif-ar mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-4 border-t border-[#1d2737] flex items-center justify-between gap-2">
                {isEquipped ? (
                  <div className="w-full py-2 rounded-xl bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>مجهز حالياً</span>
                  </div>
                ) : isOwned ? (
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      onEquipItem(item);
                    }}
                    className="w-full py-2 rounded-xl bg-[#1e2a3c] hover:bg-[#28384f] text-slate-100 border border-[#3b4e6b] text-xs font-bold transition-colors"
                  >
                    تجهيز الآن
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setConfirmModalItem(item);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Coins className="w-4 h-4" />
                    <span>شراء ({item.price} عملة)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#131924] border border-[#2b394d] rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0e141c] border border-amber-500/40 mx-auto flex items-center justify-center text-4xl shadow-md">
              {confirmModalItem.type === 'avatar' ? confirmModalItem.value : '👑'}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                تأكيد شراء: {confirmModalItem.name}
              </h3>
              <p className="text-xs text-slate-400 font-serif-ar mt-1">
                {confirmModalItem.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0e141c] border border-[#232f41] flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">سعر القطعة:</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {confirmModalItem.price} عملة
              </span>
            </div>

            {player.coins < confirmModalItem.price && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-bold flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>رصيد العملات غير كافٍ! أكمل قضايا أو مهام لكسب المزيد.</span>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModalItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1b2331] hover:bg-[#253042] text-slate-300 text-xs font-bold transition-colors"
              >
                إلغاء
              </button>

              <button
                disabled={player.coins < confirmModalItem.price}
                onClick={handleConfirmPurchase}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs transition-colors shadow-md"
              >
                تأكيد الشراء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
