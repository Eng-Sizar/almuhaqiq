import { PlayerStats, RankInfo } from '../types';

export const RANKS: RankInfo[] = [
  {
    id: 'rank_1',
    name: 'متدرب مبتدئ',
    minXp: 0,
    iconName: 'GraduationCap',
    color: '#94a3b8',
    description: 'في أولى خطواتك بمكتب التحقيقات، ما زلت تتعلم قراءة مسرح الجريمة.'
  },
  {
    id: 'rank_2',
    name: 'محقق مساعد',
    minXp: 90,
    iconName: 'Search',
    color: '#60a5fa',
    description: 'تساعد كبار المحققين في استجواب الشهود وفرز الأدلة الجنائية الأولية.'
  },
  {
    id: 'rank_3',
    name: 'محقق واعد',
    minXp: 240,
    iconName: 'Compass',
    color: '#34d399',
    description: 'تظهر موهبة فطرية في ربط الخيوط المتناثرة وتفكيك الأكاذيب.'
  },
  {
    id: 'rank_4',
    name: 'محقق ماهر',
    minXp: 520,
    iconName: 'Briefcase',
    color: '#a78bfa',
    description: 'تتولى قضايا معقدة وتعتمد عليك الشرطة لفك ألغاز القضايا الشائكة.'
  },
  {
    id: 'rank_5',
    name: 'محقق محترف',
    minXp: 950,
    iconName: 'Shield',
    color: '#f59e0b',
    description: 'لا يفلت منك أدق التفاصيل، ولديك سجل حافل من الإدانات الدقيقة.'
  },
  {
    id: 'rank_6',
    name: 'محقق خبير',
    minXp: 1600,
    iconName: 'Award',
    color: '#fb923c',
    description: 'خبير في تحليل الأدلة الجنائية وأساليب الاستجواب النفسي المتطورة.'
  },
  {
    id: 'rank_7',
    name: 'صائد الحقيقة',
    minXp: 2500,
    iconName: 'Crosshair',
    color: '#f43f5e',
    description: 'اسمك يثير رعب الجناة؛ كل قضية تسند إليك يُسدل الستار عليها سريعاً.'
  },
  {
    id: 'rank_8',
    name: 'كبير المحققين',
    minXp: 3800,
    iconName: 'Crown',
    color: '#eab308',
    description: 'تقود أصعب ملفات الاغتيال والسرقات الكبرى بقرارات حاسمة ونافذة.'
  },
  {
    id: 'rank_9',
    name: 'عمدة التحقيقات',
    minXp: 5600,
    iconName: 'Star',
    color: '#c5a059',
    description: 'مرجع جنائي أسطوري لا يُشق له غبار في كواليس المدينة المظلمة.'
  },
  {
    id: 'rank_10',
    name: 'أسطورة التحقيقات',
    minXp: 8000,
    iconName: 'Flame',
    color: '#f59e0b',
    description: 'خلّد التاريخ اسمك كأعظم عقل جنائي عرفته محاضر الشرطة في كل العصور.'
  }
];

export function calculatePlayerXp(stats: PlayerStats): number {
  const xp = 
    stats.chaptersCompleted * 120 +
    stats.correctAccusations * 60 +
    stats.wrongAccusations * (-30) +
    stats.deductionsDone * 20 +
    stats.cluesFound * 6 +
    stats.interviewsDone * 10 +
    stats.achievementsUnlocked * 50 +
    stats.replays * 15 +
    (stats.puzzlesSolved || 0) * 25 +
    (stats.newspaperPuzzlesSolved || 0) * 15;

  return Math.max(0, xp);
}

export function getCurrentRank(xp: number): RankInfo {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) {
      current = rank;
    } else {
      break;
    }
  }
  return current;
}

export function getNextRank(xp: number): RankInfo | null {
  for (const rank of RANKS) {
    if (xp < rank.minXp) {
      return rank;
    }
  }
  return null; // Highest rank achieved
}

export function getRankProgress(xp: number): { currentRank: RankInfo; nextRank: RankInfo | null; percent: number; currentXpInLevel: number; neededXp: number } {
  const currentRank = getCurrentRank(xp);
  const nextRank = getNextRank(xp);

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      percent: 100,
      currentXpInLevel: xp - currentRank.minXp,
      neededXp: 0
    };
  }

  const range = nextRank.minXp - currentRank.minXp;
  const currentProgress = xp - currentRank.minXp;
  const percent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return {
    currentRank,
    nextRank,
    percent,
    currentXpInLevel: currentProgress,
    neededXp: nextRank.minXp - xp
  };
}
