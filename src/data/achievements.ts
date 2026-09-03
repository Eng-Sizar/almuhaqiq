import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_case',
    title: 'أول خيط في العتمة',
    description: 'أكملت بنجاح إغلاق أول ملف تحقيق جنائي.',
    icon: 'FolderCheck',
    rewardCoins: 50,
    rewardXpBonus: 50,
    conditionType: 'chaptersCompleted',
    threshold: 1
  },
  {
    id: 'hawk_eye',
    title: 'عين الصقر',
    description: 'عثرت على 5 أدلة مادية أو وثائقية في مسارح الجريمة.',
    icon: 'Eye',
    rewardCoins: 35,
    rewardXpBonus: 40,
    conditionType: 'cluesFound',
    threshold: 5
  },
  {
    id: 'master_sleuth',
    title: 'جامع الأدلة الأسطوري',
    description: 'اكتشفت 12 دليلاً جنائياً بدقة متناهية دون إغفال أي أثر.',
    icon: 'Search',
    rewardCoins: 75,
    rewardXpBonus: 70,
    conditionType: 'cluesFound',
    threshold: 12
  },
  {
    id: 'interrogator',
    title: 'محاصر الأكاذيب',
    description: 'أجريت 4 استجوابات مفصلة مع المشتبه بهم وسجلت أقوالهم.',
    icon: 'MessageSquareText',
    rewardCoins: 40,
    rewardXpBonus: 45,
    conditionType: 'interviewsDone',
    threshold: 4
  },
  {
    id: 'sharp_deduction',
    title: 'عقل متقد',
    description: 'أنجزت 3 استنتاجات منطقية في دفتر التحقيق.',
    icon: 'Lightbulb',
    rewardCoins: 50,
    rewardXpBonus: 50,
    conditionType: 'deductionsDone',
    threshold: 3
  },
  {
    id: 'logic_master',
    title: 'منطق حديدي',
    description: 'أنجزت 6 استنتاجات مركبة كشفت بها زيف ادعاءات الجناة.',
    icon: 'GitMerge',
    rewardCoins: 80,
    rewardXpBonus: 75,
    conditionType: 'deductionsDone',
    threshold: 6
  },
  {
    id: 'true_justice',
    title: 'ضربة معلم',
    description: 'وجهت اتهاماً صائباً كشف المجرم الحقيقي دون أي خطأ.',
    icon: 'CheckCircle2',
    rewardCoins: 60,
    rewardXpBonus: 60,
    conditionType: 'correctAccusations',
    threshold: 1
  },
  {
    id: 'master_inquisitor',
    title: 'صائد الجناة المتمرس',
    description: 'نجحت في إدانة الجناة الحقيقيين في 3 قضايا منفصلة.',
    icon: 'Crosshair',
    rewardCoins: 120,
    rewardXpBonus: 100,
    conditionType: 'correctAccusations',
    threshold: 3
  },
  {
    id: 'codebreaker',
    title: 'مفكك الألغاز المشفرة',
    description: 'تمكنت من فك شفرة لغزين جنائيين من غرفة الأدلة.',
    icon: 'KeyRound',
    rewardCoins: 45,
    rewardXpBonus: 50,
    conditionType: 'puzzlesSolved',
    threshold: 2
  },
  {
    id: 'press_detective',
    title: 'صديق الصحافة البوليسية',
    description: 'حللت الشفرة الجنائية السرية لصحيفة الشرطة اليومية.',
    icon: 'Newspaper',
    rewardCoins: 40,
    rewardXpBonus: 35,
    conditionType: 'newspaperPuzzlesSolved',
    threshold: 1
  },
  {
    id: 'case_closer',
    title: 'إغلاق القضايا الشامل',
    description: 'أتممت حل جميع قضايا الموسم الأول من يوميات محقق.',
    icon: 'Trophy',
    rewardCoins: 150,
    rewardXpBonus: 120,
    conditionType: 'chaptersCompleted',
    threshold: 3
  },
  {
    id: 'relentless',
    title: 'إصرار لا يلين',
    description: 'أعدت فتح ملف قضية سابقة لتحقيق تقييم قياسي أعلى.',
    icon: 'RotateCcw',
    rewardCoins: 30,
    rewardXpBonus: 30,
    conditionType: 'replays',
    threshold: 1
  }
];

export const ALL_ACHIEVEMENTS = ACHIEVEMENTS;
