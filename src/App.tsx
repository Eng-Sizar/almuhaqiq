'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { GameHeader } from './components/layout/GameHeader';
import { NavigationModal } from './components/layout/NavigationModal';
import { MainMenu } from './components/menu/MainMenu';
import { GameScreen } from './components/game/GameScreen';
import { NotebookModal } from './components/notebook/NotebookModal';
import { ChaptersScreen } from './components/chapters/ChaptersScreen';
import { NewspaperScreen } from './components/newspaper/NewspaperScreen';
import { PuzzlesScreen } from './components/puzzles/PuzzlesScreen';
import { QuestsScreen } from './components/quests/QuestsScreen';
import { ShopScreen } from './components/shop/ShopScreen';
import { EventsScreen } from './components/events/EventsScreen';
import { LeaderboardScreen } from './components/leaderboard/LeaderboardScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SettingsModal } from './components/settings/SettingsModal';
import { AppFooter } from './components/layout/AppFooter';
import { GameTermsModal } from './components/layout/GameTermsModal';

import { 
  PlayerProfile, 
  PersonalTheoryLink, 
  CaseRecord, 
  ShopItem, 
  Chapter 
} from './types';
import { 
  DEFAULT_PLAYER_PROFILE,
  loadPlayerProfile, 
  savePlayerProfile, 
  resetPlayerProgress 
} from './lib/storage/playerStorage';
import { ALL_CHAPTERS, getChapterById } from './data/chapters';
import { audioManager } from './lib/audio/audioManager';
import { ALL_ACHIEVEMENTS } from './data/achievements';

const GAME_TERMS_ACCEPTANCE_KEY = 'detective-game-terms-accepted-v1';

export default function App() {
  const [player, setPlayer] = useState<PlayerProfile>(DEFAULT_PLAYER_PROFILE);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<string>('menu');
  const [activeChapterId, setActiveChapterId] = useState<string>('case_1');

  // Initial client-side profile load from localStorage
  useEffect(() => {
    try {
      const saved = loadPlayerProfile();
      setPlayer(saved);
      setHasAcceptedTerms(localStorage.getItem(GAME_TERMS_ACCEPTANCE_KEY) === 'true');
    } catch (e) {
      console.error('Error loading local profile:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Investigation chapter state (preserved per session)
  const [foundCluesByChapter, setFoundCluesByChapter] = useState<Record<string, string[]>>({});
  const [completedDeductionsByChapter, setCompletedDeductionsByChapter] = useState<Record<string, string[]>>({});
  const [interrogatedSuspectsByChapter, setInterrogatedSuspectsByChapter] = useState<Record<string, string[]>>({});
  const [unlockedTimelineByChapter, setUnlockedTimelineByChapter] = useState<Record<string, string[]>>({});
  const [theoriesByChapter, setTheoriesByChapter] = useState<Record<string, PersonalTheoryLink[]>>({});

  // Modals
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // Keep progress on this device without requiring an account.
  useEffect(() => {
    if (!isInitialized) return;
    savePlayerProfile(player);
  }, [player, isInitialized]);

  // Audio setup on user interaction
  useEffect(() => {
    audioManager.setEnabled(player.settings.soundEnabled);
  }, [player.settings.soundEnabled]);

  // Active chapter lookup
  const activeChapter: Chapter = useMemo(() => {
    return getChapterById(activeChapterId) || ALL_CHAPTERS[0];
  }, [activeChapterId]);

  const activeFoundClues = foundCluesByChapter[activeChapter.id] || [];
  const activeCompletedDeductions = completedDeductionsByChapter[activeChapter.id] || [];
  const activeInterrogated = interrogatedSuspectsByChapter[activeChapter.id] || [];
  const activeTimeline = unlockedTimelineByChapter[activeChapter.id] || [];
  const activeTheories = theoriesByChapter[activeChapter.id] || [];

  // Achievement unlocker helper
  const triggerAchievement = (achievementId: string) => {
    if (player.achievements.includes(achievementId)) return;
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;

    audioManager.playAchievement();
    setPlayer(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievementId],
      stats: {
        ...prev.stats,
        achievementsUnlocked: prev.stats.achievementsUnlocked + 1
      }
    }));

    setAchievementToast(ach.title);
    setTimeout(() => {
      setAchievementToast(null);
    }, 4000);
  };

  // Clue Discovered
  const handleClueDiscovered = (clueId: string) => {
    if (activeFoundClues.includes(clueId)) return;

    setFoundCluesByChapter(prev => ({
      ...prev,
      [activeChapter.id]: [...(prev[activeChapter.id] || []), clueId]
    }));

    setPlayer(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        cluesFound: prev.stats.cluesFound + 1
      }
    }));

    triggerAchievement('ach_first_clue');
  };

  // Deduction Completed
  const handleDeductionCompleted = (deductionId: string) => {
    if (activeCompletedDeductions.includes(deductionId)) return;

    setCompletedDeductionsByChapter(prev => ({
      ...prev,
      [activeChapter.id]: [...(prev[activeChapter.id] || []), deductionId]
    }));

    setPlayer(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        deductionsDone: prev.stats.deductionsDone + 1
      }
    }));

    triggerAchievement('ach_first_deduction');
  };

  // Interview Conducted
  const handleInterviewConducted = (suspectId: string) => {
    if (activeInterrogated.includes(suspectId)) return;

    setInterrogatedSuspectsByChapter(prev => ({
      ...prev,
      [activeChapter.id]: [...(prev[activeChapter.id] || []), suspectId]
    }));

    setPlayer(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        interviewsDone: prev.stats.interviewsDone + 1
      }
    }));

    triggerAchievement('ach_first_interrogation');
  };

  // Case Solved / Ending Reached
  const handleCaseSolved = (
    chapterId: string, 
    isCorrect: boolean, 
    cluesCount: number, 
    totalClues: number,
    interviewsCount: number,
    totalInterviews: number
  ) => {
    const rating = isCorrect 
      ? cluesCount === totalClues ? 'ممتاز ★★★' : 'جيد جداً ★★'
      : 'ضعيف ★';

    const record: CaseRecord = {
      chapterId,
      firstSolvedAt: new Date().toISOString(),
      bestClues: cluesCount,
      bestTotalClues: totalClues,
      bestInterviews: interviewsCount,
      bestTotalInterviews: totalInterviews,
      bestAt: new Date().toISOString(),
      solvedCorrectly: isCorrect,
      completed: true,
      rating,
      cluesFound: cluesCount,
      interviewsConducted: interviewsCount
    };

    setPlayer(prev => {
      const updatedCaseRecords = {
        ...prev.caseRecords,
        [chapterId]: record
      };

      const newStats = {
        ...prev.stats,
        chaptersCompleted: prev.stats.chaptersCompleted + (isCorrect && !prev.caseRecords[chapterId]?.solvedCorrectly ? 1 : 0),
        correctAccusations: prev.stats.correctAccusations + (isCorrect ? 1 : 0),
        wrongAccusations: prev.stats.wrongAccusations + (!isCorrect ? 1 : 0),
        replays: prev.caseRecords[chapterId] ? prev.stats.replays + 1 : prev.stats.replays
      };

      return {
        ...prev,
        coins: prev.coins + (isCorrect ? 80 : 20),
        stats: newStats,
        caseRecords: updatedCaseRecords
      };
    });

    if (isCorrect) {
      triggerAchievement('ach_first_case');
    }
  };

  // Personal Theory Linker
  const handleAddPersonalTheory = (suspectId: string, clueId: string, note: string) => {
    const newTheory: PersonalTheoryLink = {
      id: 'theory_' + Date.now(),
      suspectId,
      clueId,
      note,
      createdAt: new Date().toISOString()
    };

    setTheoriesByChapter(prev => ({
      ...prev,
      [activeChapter.id]: [...(prev[activeChapter.id] || []), newTheory]
    }));
  };

  const handleRemovePersonalTheory = (linkId: string) => {
    setTheoriesByChapter(prev => ({
      ...prev,
      [activeChapter.id]: (prev[activeChapter.id] || []).filter(t => t.id !== linkId)
    }));
  };

  // Solve Newspaper Puzzle
  const handleSolveNewspaperPuzzle = (puzzleId: string, rewardCoins: number) => {
    if (player.solvedNewspaperPuzzles.includes(puzzleId)) return;

    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      solvedNewspaperPuzzles: [...prev.solvedNewspaperPuzzles, puzzleId],
      stats: {
        ...prev.stats,
        newspaperPuzzlesSolved: (prev.stats.newspaperPuzzlesSolved || 0) + 1
      }
    }));

    triggerAchievement('ach_newspaper_puzzle');
  };

  // Solve Lab Puzzle
  const handleSolvePuzzle = (puzzleId: string, coinsReward: number) => {
    if (player.solvedPuzzles.includes(puzzleId)) return;

    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + coinsReward,
      solvedPuzzles: [...prev.solvedPuzzles, puzzleId],
      stats: {
        ...prev.stats,
        puzzlesSolved: (prev.stats.puzzlesSolved || 0) + 1
      }
    }));

    triggerAchievement('ach_puzzle_solver');
  };

  // Claim Quest
  const handleClaimQuest = (questId: string, coinsReward: number) => {
    if (player.questsClaimed.includes(questId)) return;

    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + coinsReward,
      questsClaimed: [...prev.questsClaimed, questId]
    }));
  };

  // Buy Shop Item
  const handleBuyItem = (item: ShopItem) => {
    if (player.coins < item.price || player.ownedShopItems.includes(item.id)) return;

    setPlayer(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      ownedShopItems: [...prev.ownedShopItems, item.id]
    }));
  };

  // Equip Shop Item
  const handleEquipItem = (item: ShopItem) => {
    if (item.type === 'avatar') {
      setPlayer(prev => ({ ...prev, avatar: item.value }));
    } else if (item.type === 'title') {
      setPlayer(prev => ({ ...prev, equippedTitle: item.value }));
    }
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: PlayerProfile['settings']) => {
    setPlayer(prev => ({ ...prev, settings: newSettings }));
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextVal = !player.settings.soundEnabled;
    audioManager.setEnabled(nextVal);
    setPlayer(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: nextVal
      }
    }));
    if (nextVal) audioManager.playClick();
  };

  const handleAcceptGameTerms = () => {
    try {
      localStorage.setItem(GAME_TERMS_ACCEPTANCE_KEY, 'true');
    } catch (e) {
      console.error('Error saving game terms acceptance:', e);
    }
    setHasAcceptedTerms(true);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const fresh = resetPlayerProgress();
    setPlayer(fresh);
    setFoundCluesByChapter({});
    setCompletedDeductionsByChapter({});
    setInterrogatedSuspectsByChapter({});
    setUnlockedTimelineByChapter({});
    setTheoriesByChapter({});
    setCurrentScreen('menu');
  };

  // Start / Select Chapter
  const handleSelectChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setCurrentScreen('game');
  };

  // Deduct coins (e.g. for hint system)
  const handleDeductCoins = (amount: number): boolean => {
    if (player.coins < amount) return false;
    setPlayer(prev => {
      const updated = {
        ...prev,
        coins: Math.max(0, prev.coins - amount)
      };
      savePlayerProfile(updated);
      return updated;
    });
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0a0d13] text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-[#8b1e24] selection:text-white" dir="rtl">
      {/* Top Main Navigation Header (hidden during game for custom console) */}
      {currentScreen !== 'game' && (
        <GameHeader
          player={player}
          currentScreen={currentScreen}
          onOpenScreen={(screen) => {
            audioManager.playClick();
            setCurrentScreen(screen);
          }}
          onToggleSound={handleToggleSound}
          soundEnabled={player.settings.soundEnabled}
          onOpenNotebook={() => setIsNotebookOpen(true)}
          notebookBadgeCount={activeFoundClues.length}
        />
      )}

      {/* Floating Global Achievement Toast */}
      {achievementToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-gradient-to-r from-[#8b1e24] to-[#c5a059] p-3.5 rounded-2xl border-2 border-amber-300 shadow-2xl flex items-center gap-3 text-white">
          <div className="text-2xl">🏆</div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
              وسام إنجاز جديد مفتوح!
            </div>
            <div className="text-sm font-bold">
              {achievementToast}
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Body Router */}
      <main className="flex-1 overflow-x-hidden">
        {currentScreen === 'menu' && (
          <MainMenu
            currentChapter={activeChapter}
            onNavigate={(sc) => setCurrentScreen(sc)}
            onContinueGame={() => setCurrentScreen('game')}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            chapter={activeChapter}
            player={player}
            onClueDiscovered={handleClueDiscovered}
            onDeductionCompleted={handleDeductionCompleted}
            onInterviewConducted={handleInterviewConducted}
            onCaseSolved={handleCaseSolved}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            onReturnToChapters={() => setCurrentScreen('chapters')}
            onDeductCoins={handleDeductCoins}
            onNavigateScreen={(screen) => setCurrentScreen(screen)}
            onToggleSound={handleToggleSound}
            soundEnabled={player.settings.soundEnabled}
            foundClueIds={activeFoundClues}
            completedDeductions={activeCompletedDeductions}
            interrogatedSuspectIds={activeInterrogated}
            textSpeed={player.settings.textSpeed}
          />
        )}

        {currentScreen === 'chapters' && (
          <ChaptersScreen
            player={player}
            activeChapterId={activeChapter.id}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {currentScreen === 'newspaper' && (
          <NewspaperScreen
            player={player}
            onSolveNewspaperPuzzle={handleSolveNewspaperPuzzle}
          />
        )}

        {currentScreen === 'puzzles' && (
          <PuzzlesScreen
            player={player}
            onSolvePuzzle={handleSolvePuzzle}
          />
        )}

        {currentScreen === 'quests' && (
          <QuestsScreen
            player={player}
            onClaimQuestReward={handleClaimQuest}
          />
        )}

        {currentScreen === 'shop' && (
          <ShopScreen
            player={player}
            onBuyItem={handleBuyItem}
            onEquipItem={handleEquipItem}
          />
        )}

        {currentScreen === 'events' && (
          <EventsScreen
            player={player}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen
            player={player}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            player={player}
            onUpdateUsername={(newU) => setPlayer(p => ({ ...p, username: newU }))}
            onOpenShop={() => setCurrentScreen('shop')}
          />
        )}

      </main>

      {currentScreen !== 'game' && (
        <AppFooter />
      )}

      {/* Global Navigation Drawer Modal */}
      <NavigationModal
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelectScreen={(sc) => {
          if (sc === 'settings') {
            setIsSettingsOpen(true);
          } else if (sc === 'notebook') {
            setIsNotebookOpen(true);
          } else {
            setCurrentScreen(sc);
          }
        }}
        activeScreen={currentScreen}
        player={player}
        hasActiveGame={true}
      />

      {/* Investigation Notebook Modal */}
      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        chapter={activeChapter}
        foundClueIds={activeFoundClues}
        completedDeductionIds={activeCompletedDeductions}
        interrogatedSuspectIds={activeInterrogated}
        unlockedTimelineIds={activeTimeline}
        personalTheories={activeTheories}
        onAddPersonalTheory={handleAddPersonalTheory}
        onRemovePersonalTheory={handleRemovePersonalTheory}
        onCompleteDeduction={handleDeductionCompleted}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        player={player}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />

      <GameTermsModal
        isOpen={isInitialized && !hasAcceptedTerms}
        onAccept={handleAcceptGameTerms}
      />

    </div>
  );
}
