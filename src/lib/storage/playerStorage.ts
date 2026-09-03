import { CaseRecord, PlayerProfile, PlayerStats } from '../../types';

const STORAGE_KEY = 'detective_diary_player_profile_v2';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  chaptersCompleted: 0,
  correctAccusations: 0,
  wrongAccusations: 0,
  deductionsDone: 0,
  cluesFound: 0,
  interviewsDone: 0,
  achievementsUnlocked: 0,
  replays: 0,
  puzzlesSolved: 0,
  newspaperPuzzlesSolved: 0
};

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  id: 'det_local_user_1',
  username: 'المحقق كمال',
  avatar: '🕵️‍♂️',
  equippedTitle: 'مفتش مستجد',
  coins: 100,
  stats: { ...INITIAL_PLAYER_STATS },
  achievements: [],
  questsClaimed: [],
  ownedShopItems: ['avatar_classic_fedora', 'title_rookie_investigator'],
  caseRecords: {},
  solvedPuzzles: [],
  solvedNewspaperPuzzles: [],
  settings: {
    soundEnabled: true,
    soundVolume: 80,
    textSpeed: 'normal'
  },
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString()
};

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PLAYER_PROFILE };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePlayerProfile(DEFAULT_PLAYER_PROFILE);
      return { ...DEFAULT_PLAYER_PROFILE };
    }
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    return {
      ...DEFAULT_PLAYER_PROFILE,
      ...parsed,
      stats: {
        ...INITIAL_PLAYER_STATS,
        ...(parsed.stats || {})
      },
      settings: {
        ...DEFAULT_PLAYER_PROFILE.settings,
        ...(parsed.settings || {})
      },
      caseRecords: parsed.caseRecords || {},
      achievements: parsed.achievements || [],
      questsClaimed: parsed.questsClaimed || [],
      ownedShopItems: parsed.ownedShopItems || DEFAULT_PLAYER_PROFILE.ownedShopItems,
      solvedPuzzles: parsed.solvedPuzzles || [],
      solvedNewspaperPuzzles: parsed.solvedNewspaperPuzzles || []
    };
  } catch {
    return { ...DEFAULT_PLAYER_PROFILE };
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.lastActiveAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function resetPlayerProgress(): PlayerProfile {
  const fresh: PlayerProfile = {
    ...DEFAULT_PLAYER_PROFILE,
    id: 'det_user_' + Date.now(),
    createdAt: new Date().toISOString()
  };
  savePlayerProfile(fresh);
  return fresh;
}
