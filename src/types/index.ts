export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RankInfo {
  id: string;
  name: string;
  minXp: number;
  iconName: string;
  color: string;
  description: string;
}

export interface PlayerStats {
  chaptersCompleted: number;
  correctAccusations: number;
  wrongAccusations: number;
  deductionsDone: number;
  cluesFound: number;
  interviewsDone: number;
  achievementsUnlocked: number;
  replays: number;
  puzzlesSolved: number;
  newspaperPuzzlesSolved: number;
}

export interface CaseRecord {
  chapterId: string;
  firstSolvedAt: string;
  bestClues: number;
  bestTotalClues: number;
  bestInterviews: number;
  bestTotalInterviews: number;
  bestAt: string;
  solvedCorrectly: boolean;
  completed?: boolean;
  rating?: string;
  cluesFound?: number;
  interviewsConducted?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  rewardXpBonus: number;
  unlockedAt?: string;
  conditionType: keyof PlayerStats | 'custom';
  threshold?: number;
}

export interface Quest {
  id: string;
  icon: string;
  title: string;
  description: string;
  stat: keyof PlayerStats;
  target: number;
  reward: number;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'avatar' | 'title';
  category?: 'avatar' | 'title';
  rarity: Rarity;
  price: number;
  value: string;
  description: string;
  owned: boolean;
  equipped: boolean;
}

export interface DetectiveEvent {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  timeRemaining: string;
  rewardCoins: number;
  rewardTitle: string;
  objective: string;
  progress: number;
  target: number;
}

export interface NewspaperIssue {
  id: string;
  issueNumber: number;
  dateString: string;
  headline: string;
  leadStory: string;
  sideStories: {
    title: string;
    summary: string;
  }[];
  crimeBulletin: string;
  cipherPuzzle: {
    id: string;
    title: string;
    question: string;
    ciphertext: string;
    hint: string;
    answer: string;
    rewardCoins: number;
    solved: boolean;
  };
}

export interface CasePuzzle {
  id: string;
  chapterId?: string;
  title: string;
  type: 'cipher' | 'anagram' | 'safe_code' | 'logic';
  prompt: string;
  challenge: string;
  hint: string;
  solution: string;
  rewardCoins: number;
  solved: boolean;
  wrongAttempts: number;
  unlocked: boolean;
}

export interface Clue {
  id: string;
  title: string;
  category: 'مادي' | 'وثيقة' | 'شهادة' | 'علمي';
  description: string;
  detail: string;
  foundAtNode?: string;
  relatedSuspectId?: string;
  iconName?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  alibi: string;
  motive: string;
  isCulprit: boolean;
  interrogated: boolean;
  suspicionLevel: number; // 1 to 5
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  relatedSuspectId?: string;
  order: number;
}

export interface Deduction {
  id: string;
  title: string;
  requiredClueIds: [string, string];
  conclusion: string;
  unlocked: boolean;
}

export type MessageType = 'narrator' | 'character' | 'player' | 'clue' | 'system';

export interface GameMessage {
  id: string;
  type: MessageType;
  sender?: string;
  senderAvatar?: string;
  text: string;
  clueId?: string;
  timestamp?: number;
}

export interface ChoiceCondition {
  requiredClues?: string[];
  requiredDeductions?: string[];
  minTrust?: number;
  visitedNodes?: string[];
}

export interface ChoiceEffects {
  addClue?: string;
  addDeduction?: string;
  unlockTimeline?: string[];
  modifyTrust?: number;
  phaseAdvance?: number;
  triggerAccusation?: boolean;
}

export interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  condition?: ChoiceCondition;
  effects?: ChoiceEffects;
}

export interface GameNode {
  id: string;
  phase: number;
  phaseName: string;
  messages: Omit<GameMessage, 'id'>[];
  choices?: Choice[];
  effects?: ChoiceEffects;
  isEnding?: boolean;
  isCorrectEnding?: boolean;
  endingVerdict?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  difficulty: 'سهل' | 'متوسط' | 'معقد' | 'أسطوري';
  suspects: Suspect[];
  clues: Clue[];
  timeline: TimelineEvent[];
  deductions: Deduction[];
  startNodeId: string;
  nodes: Record<string, GameNode>;
  requiredSolvedChapterId?: string;
}

export interface PersonalTheoryLink {
  id: string;
  suspectId: string;
  clueId: string;
  note: string;
  createdAt: string;
}

export interface GameState {
  chapterId: string;
  currentNodeId: string;
  score: number;
  historyMessages: GameMessage[];
  foundClueIds: string[];
  completedDeductionIds: string[];
  visitedInterviewSuspectIds: string[];
  unlockedTimelineIds: string[];
  trustScore: number;
  currentPhase: number;
  personalTheories: PersonalTheoryLink[];
  isCompleted: boolean;
  finalVerdict?: string;
  solvedCorrectly?: boolean;
}

export interface PlayerProfile {
  id: string;
  email?: string;
  username: string;
  passwordHash?: string;
  avatar: string;
  equippedTitle: string;
  coins: number;
  stats: PlayerStats;
  achievements: string[];
  questsClaimed: string[];
  ownedShopItems: string[];
  caseRecords: Record<string, CaseRecord>;
  solvedPuzzles: string[];
  solvedNewspaperPuzzles: string[];
  settings: {
    soundEnabled: boolean;
    soundVolume: number;
    textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  };
  createdAt: string;
  lastActiveAt: string;
}

export interface LeaderboardPlayer {
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
