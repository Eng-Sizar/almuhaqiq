import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  {
    id: 'avatar_classic_fedora',
    name: 'المحقق الكلاسيكي (قبعة الفيدورا)',
    type: 'avatar',
    rarity: 'common',
    price: 0,
    value: '🕵️‍♂️',
    description: 'المظهر التأسيسي لكل باحث عن الحقيقة في أزقة المدينة المظلمة.',
    owned: true,
    equipped: true
  },
  {
    id: 'avatar_pipe_detective',
    name: 'محقق لندن ذو الغليون',
    type: 'avatar',
    rarity: 'common',
    price: 50,
    value: '🧐',
    description: 'مستوحى من الطراز الفيكتوري والتحليل البارد المستند للملاحظة الدقيقة.',
    owned: false,
    equipped: false
  },
  {
    id: 'avatar_forensic_specialist',
    name: 'خبيرة الأدلة الجنائية',
    type: 'avatar',
    rarity: 'rare',
    price: 110,
    value: '👩‍🔬',
    description: 'تعتمد على المجهر وبقع الدم والتحليل الكيميائي لانتزاع الحقيقة.',
    owned: false,
    equipped: false
  },
  {
    id: 'avatar_noir_trenchcoat',
    name: 'شبح المطر (معطف النوار)',
    type: 'avatar',
    rarity: 'rare',
    price: 160,
    value: '🧥',
    description: 'ينتظر تحت مصابيح الشوارع الخافتة؛ قليل الكلام وكثير الملاحظة.',
    owned: false,
    equipped: false
  },
  {
    id: 'avatar_masked_infiltrator',
    name: 'المحقق المتخفي',
    type: 'avatar',
    rarity: 'epic',
    price: 260,
    value: '🎭',
    description: 'يخترق الأوساط السرية والتجمعات المغلقة بهويات متعددة.',
    owned: false,
    equipped: false
  },
  {
    id: 'avatar_golden_hawk',
    name: 'الصقر الذهبي للشرطة',
    type: 'avatar',
    rarity: 'legendary',
    price: 450,
    value: '🦅',
    description: 'شارة الشرف العليا الممنوحة فقط للأساطير الذين فككوا أعقد المؤامرات.',
    owned: false,
    equipped: false
  },

  // Titles
  {
    id: 'title_rookie_investigator',
    name: 'مفتش مستجد',
    type: 'title',
    rarity: 'common',
    price: 0,
    value: 'مفتش مستجد',
    description: 'اللقب الرسمي المعتمد في بداية الخدمة.',
    owned: true,
    equipped: true
  },
  {
    id: 'title_night_owl',
    name: 'عين الليل الساهرة',
    type: 'title',
    rarity: 'rare',
    price: 70,
    value: 'عين الليل الساهرة',
    description: 'لا تنام حينما تكون هناك جريمة عالقة بلا حل.',
    owned: false,
    equipped: false
  },
  {
    id: 'title_shadow_tracker',
    name: 'متعقب الظلال',
    type: 'title',
    rarity: 'rare',
    price: 120,
    value: 'متعقب الظلال',
    description: 'قادر على رصد أدق الأقدام حتى بعد جفاف الأمطار.',
    owned: false,
    equipped: false
  },
  {
    id: 'title_mastermind_breaker',
    name: 'كاسر شوكة الدهاء',
    type: 'title',
    rarity: 'epic',
    price: 220,
    value: 'كاسر شوكة الدهاء',
    description: 'لقب يُطلق على من فكك خطط أذكى المخططين الجنائيين.',
    owned: false,
    equipped: false
  },
  {
    id: 'title_living_legend',
    name: 'صانع العدالة الأسطوري',
    type: 'title',
    rarity: 'legendary',
    price: 480,
    value: 'صانع العدالة الأسطوري',
    description: 'حين يُذكر هذا اللقب في المحكمة، تصمت كل حجج الباطل.',
    owned: false,
    equipped: false
  }
];

export const ALL_SHOP_ITEMS = SHOP_ITEMS;

export const RARITY_CONFIG = {
  common: {
    label: 'شائع',
    textColor: 'text-slate-300',
    borderColor: 'border-slate-600',
    bgColor: 'bg-slate-800/40',
    badgeColor: 'bg-slate-700 text-slate-200'
  },
  rare: {
    label: 'نادر',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    bgColor: 'bg-blue-950/30',
    badgeColor: 'bg-blue-900/60 text-blue-300'
  },
  epic: {
    label: 'ملحمي',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-950/30',
    badgeColor: 'bg-purple-900/60 text-purple-300'
  },
  legendary: {
    label: 'أسطوري',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/70',
    bgColor: 'bg-amber-950/30',
    badgeColor: 'bg-amber-900/70 text-amber-200'
  }
};
