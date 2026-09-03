import { Quest } from '../types';

export const QUESTS: Quest[] = [
  {
    id: 'quest_first_clue',
    icon: 'Search',
    title: 'فحص مسرح الجريمة',
    description: 'اعثر على 3 أدلة من خلال فحص الغرف والأغراض المشبوهة.',
    stat: 'cluesFound',
    target: 3,
    reward: 25,
    claimed: false
  },
  {
    id: 'quest_interrogate_suspects',
    icon: 'MessageSquare',
    title: 'مواجهة الأقوال',
    description: 'استجوب 3 مشتبه بهم مختلفين ودون ملاحظاتك في دفتر التحقيق.',
    stat: 'interviewsDone',
    target: 3,
    reward: 35,
    claimed: false
  },
  {
    id: 'quest_first_deduction',
    icon: 'Lightbulb',
    title: 'ربط الخيوط المنطقية',
    description: 'أكمل استنتاجين منطقيين في لوحة الاستنتاجات.',
    stat: 'deductionsDone',
    target: 2,
    reward: 40,
    claimed: false
  },
  {
    id: 'quest_first_accusation',
    icon: 'CheckSquare',
    title: 'إدانة حاسمة',
    description: 'وجه اتهاماً صحيحاً واحداً واكشف هوية الجاني الحقيقي.',
    stat: 'correctAccusations',
    target: 1,
    reward: 50,
    claimed: false
  },
  {
    id: 'quest_puzzle_solver',
    icon: 'Lock',
    title: 'فك الرموز المشفرة',
    description: 'حل لغزاً جنائياً واحداً من ألغاز القضايا أو الخزائن.',
    stat: 'puzzlesSolved',
    target: 1,
    reward: 30,
    claimed: false
  },
  {
    id: 'quest_newspaper_reader',
    icon: 'Newspaper',
    title: 'برقية الشرطة السرية',
    description: 'حل شفرة صحيفة الشرطة اليومية لاكتشاف الرسالة المسربة.',
    stat: 'newspaperPuzzlesSolved',
    target: 1,
    reward: 30,
    claimed: false
  },
  {
    id: 'quest_veteran_clues',
    icon: 'ScanLine',
    title: 'خبير البصمات والأثر',
    description: 'اجمع 8 أدلة عبر مختلف مسارح التحقيق.',
    stat: 'cluesFound',
    target: 8,
    reward: 60,
    claimed: false
  },
  {
    id: 'quest_complete_cases',
    icon: 'Briefcase',
    title: 'إغلاق ملفات العدالة',
    description: 'أنهِ حل قضيتين جنائيتين بنجاح.',
    stat: 'chaptersCompleted',
    target: 2,
    reward: 80,
    claimed: false
  }
];

export const ALL_QUESTS = QUESTS;
