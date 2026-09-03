export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  equippedTitle: string;
  rankTitle: string;
  rankIcon: string;
  xp: number;
  coins: number;
  casesSolved: number;
  updatedAt: string;
}

// Global in-memory leaderboard used as a fallback during local development.
const globalForStore = globalThis as unknown as {
  leaderboardStore?: LeaderboardEntry[];
};

export const leaderboardStore: LeaderboardEntry[] = globalForStore.leaderboardStore || [
  {
    id: 'lead_seed_1',
    username: 'أسطورة النوار',
    avatar: '🦅',
    equippedTitle: 'صانع العدالة الأسطوري',
    rankTitle: 'أسطورة التحقيقات',
    rankIcon: 'Flame',
    xp: 8450,
    coins: 680,
    casesSolved: 3,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'lead_seed_2',
    username: 'شيرلوك النيل',
    avatar: '🧐',
    equippedTitle: 'كاسر شوكة الدهاء',
    rankTitle: 'عمدة التحقيقات',
    rankIcon: 'Star',
    xp: 5920,
    coins: 520,
    casesSolved: 3,
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'lead_seed_3',
    username: 'عين الصقر الجنائية',
    avatar: '🕵️‍♂️',
    equippedTitle: 'متعقب الظلال',
    rankTitle: 'كبير المحققين',
    rankIcon: 'Crown',
    xp: 3950,
    coins: 340,
    casesSolved: 2,
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'lead_seed_4',
    username: 'فارس المخطوطات',
    avatar: '👩‍🔬',
    equippedTitle: 'عين الليل الساهرة',
    rankTitle: 'صائد الحقيقة',
    rankIcon: 'Crosshair',
    xp: 2680,
    coins: 290,
    casesSolved: 2,
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'lead_seed_5',
    username: 'مفتش الضباب',
    avatar: '🧥',
    equippedTitle: 'مفتش مستجد',
    rankTitle: 'محقق خبير',
    rankIcon: 'Award',
    xp: 1740,
    coins: 180,
    casesSolved: 1,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

if (!globalForStore.leaderboardStore) {
  globalForStore.leaderboardStore = leaderboardStore;
}
