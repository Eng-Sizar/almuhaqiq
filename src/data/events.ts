import { DetectiveEvent } from '../types';

export const EVENTS: DetectiveEvent[] = [
  {
    id: 'event_noir_night',
    title: 'أسبوع الأرشيف الأسود (الحدث النشط)',
    description: 'أعادت قيادة الشرطة فتح ملفات الجرائم الغامضة غير المحلولة في الحي القديم. اجمع الأدلة وحل الألغاز لتحصل على مكافآت مضاعفة.',
    status: 'active',
    timeRemaining: '3 أيام و 14 ساعة',
    rewardCoins: 120,
    rewardTitle: 'مفكك خيوط الظلام',
    objective: 'اجمع 6 أدلة واكشف متورطاً في أي من القضايا.',
    progress: 4,
    target: 6
  },
  {
    id: 'event_cipher_championship',
    title: 'تحدي محللي الشفرات السري (قادم قريباً)',
    description: 'بطولة خاصة لفك رسائل الجناة المشفرة وكتابات الغرف المحكمة الإغلاق. استعد لاختبار ذكائك التحليلي.',
    status: 'upcoming',
    timeRemaining: 'يبدأ خلال 5 أيام',
    rewardCoins: 200,
    rewardTitle: 'سيد الشفرات الجنائية',
    objective: 'حل 3 ألغاز تشفير متتالية بدون استخدام أي تلميحات.',
    progress: 0,
    target: 3
  },
  {
    id: 'event_gold_bounty',
    title: 'مكافأة ضبط اللصوص الكبرى',
    description: 'أودعت خزينة البلدية مكافآت ضخمة لمن ينجز جميع استنتاجات لوحة التحقيق في وقت قياسي.',
    status: 'upcoming',
    timeRemaining: 'يبدأ خلال 12 يوماً',
    rewardCoins: 350,
    rewardTitle: 'صائد المكافآت المحترف',
    objective: 'أكمل 4 استنتاجات دقيقة في دفتر التحقيق.',
    progress: 0,
    target: 4
  }
];

export const ALL_EVENTS = EVENTS;
