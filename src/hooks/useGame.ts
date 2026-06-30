import { useState, useEffect, useCallback, useRef } from 'react';
import type { Challenge, RemitItem, ChallengePlayer } from '@/types';

interface UseGameOptions {
  challenge: Challenge;
  timePerRound?: number;
  onGameComplete?: (result: GameResult) => void;
}

export interface GameResult {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: number;
  totalPlayers: number;
}

interface CategoryAssignment {
  playerId: number;
  categoryId: number | null;
  isCorrect: boolean;
  isSkipped: boolean;
}

interface HintCell {
  item: RemitItem;
  assigned: boolean;
  correctCount: number;
}

export function useGame({ challenge, timePerRound = 30, onGameComplete }: UseGameOptions) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing');
  const [assignments, setAssignments] = useState<CategoryAssignment[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintsGrid, setHintsGrid] = useState<HintCell[]>([]);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Flatten remit grid to get all categories
  const categories: RemitItem[] = challenge.remit.flat();

  // Get all players from challenge
  const allPlayers: ChallengePlayer[] = challenge.players;

  // Current player
  const currentPlayer = allPlayers[currentPlayerIndex];
  const currentPlayerName = currentPlayer
    ? `${currentPlayer.g} ${currentPlayer.f}`.trim()
    : '';

  // Move to next player or end game (defined before timer so refs are stable)
  const goToNextPlayer = useCallback(() => {
    if (currentPlayerIndex >= allPlayers.length - 1) {
      setGameStatus('completed');
      setIsTimerRunning(false);
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const result: GameResult = {
        score,
        correct: correctCount,
        wrong: wrongCount,
        skipped: skippedCount,
        timeTaken,
        totalPlayers: allPlayers.length,
      };
      onGameComplete?.(result);
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
      setTimeLeft(timePerRound);
      setSelectedCategoryId(null);
      setShowFeedback(null);
    }
  }, [currentPlayerIndex, allPlayers.length, score, correctCount, wrongCount, skippedCount, timePerRound, onGameComplete]);

  const goToNextPlayerRef = useRef(goToNextPlayer);
  goToNextPlayerRef.current = goToNextPlayer;

  const allPlayersRef = useRef(allPlayers);
  allPlayersRef.current = allPlayers;

  const currentPlayerRef = useRef(currentPlayer);
  currentPlayerRef.current = currentPlayer;

  const gameStatusRef = useRef(gameStatus);
  gameStatusRef.current = gameStatus;

  const skippedCountRef = useRef(skippedCount);
  skippedCountRef.current = skippedCount;

  // Initialize hints grid
  useEffect(() => {
    const grid: HintCell[] = categories.map((item) => ({
      item,
      assigned: false,
      correctCount: 0,
    }));
    setHintsGrid(grid);
  }, [challenge]);

  // Timer - uses refs for skip to avoid stale closures
  useEffect(() => {
    if (!isTimerRunning || gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - skip this player via ref
          const player = currentPlayerRef.current;
          if (player && gameStatusRef.current === 'playing') {
            setAssignments((p) => [...p, {
              playerId: player.id,
              categoryId: null,
              isCorrect: false,
              isSkipped: true,
            }]);
            setSkippedCount((p) => p + 1);
            setShowFeedback('wrong');
            setIsTimerRunning(false);
            setTimeout(() => {
              goToNextPlayerRef.current();
            }, 1000);
          }
          return timePerRound;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, gameStatus, timePerRound]);

  // Submit category assignment
  const submitAssignment = useCallback(
    (categoryId: number) => {
      if (gameStatus !== 'playing' || !currentPlayer || showFeedback) return;

      const correctCategoryId = currentPlayer.v[0];
      const isCorrect = categoryId === correctCategoryId;

      // Record assignment
      const assignment: CategoryAssignment = {
        playerId: currentPlayer.id,
        categoryId,
        isCorrect,
        isSkipped: false,
      };
      setAssignments((prev) => [...prev, assignment]);

      // Update hints grid
      setHintsGrid((prev) =>
        prev.map((cell) =>
          cell.item.id === categoryId
            ? {
                ...cell,
                assigned: true,
                correctCount: isCorrect ? cell.correctCount + 1 : cell.correctCount,
              }
            : cell
        )
      );

      // Calculate points
      if (isCorrect) {
        const timeBonus = Math.floor(timeLeft * 10);
        const streakBonus = correctCount >= 2 ? 50 : 0;
        const points = 100 + timeBonus + streakBonus;
        setScore((prev) => prev + points);
        setCorrectCount((prev) => prev + 1);
      } else {
        setWrongCount((prev) => prev + 1);
      }

      setShowFeedback(isCorrect ? 'correct' : 'wrong');
      setIsTimerRunning(false);

      // Move to next after delay
      setTimeout(() => {
        goToNextPlayer();
      }, 1500);
    },
    [gameStatus, currentPlayer, timeLeft, correctCount, showFeedback, goToNextPlayer]
  );

  // Skip current player
  const handleSkip = useCallback(() => {
    if (gameStatus !== 'playing' || !currentPlayer) return;

    const assignment: CategoryAssignment = {
      playerId: currentPlayer.id,
      categoryId: null,
      isCorrect: false,
      isSkipped: true,
    };
    setAssignments((prev) => [...prev, assignment]);
    setSkippedCount((prev) => prev + 1);
    setShowFeedback('wrong');
    setIsTimerRunning(false);

    setTimeout(() => {
      goToNextPlayer();
    }, 1000);
  }, [gameStatus, currentPlayer, goToNextPlayer]);

  // Select category (visual selection before submit)
  const selectCategory = useCallback(
    (categoryId: number) => {
      if (showFeedback) return;
      setSelectedCategoryId(categoryId);
    },
    [showFeedback]
  );

  // Confirm selection
  const confirmSelection = useCallback(() => {
    if (selectedCategoryId !== null) {
      submitAssignment(selectedCategoryId);
    }
  }, [selectedCategoryId, submitAssignment]);

  // Build hints grid for display (3x3)
  const hints = Array.from({ length: 3 }, (_, rowIndex) =>
    Array.from({ length: 3 }, (_, colIndex) => {
      const cellIndex = rowIndex * 3 + colIndex;
      const cell = hintsGrid[cellIndex];
      return {
        item: cell?.item,
        assigned: cell?.assigned ?? false,
        correctCount: cell?.correctCount ?? 0,
      };
    })
  );

  // Progress
  const progress = {
    current: currentPlayerIndex + 1,
    total: allPlayers.length,
    percentage: ((currentPlayerIndex + 1) / allPlayers.length) * 100,
  };

  return {
    // State
    currentPlayer,
    currentPlayerName,
    score,
    correctCount,
    wrongCount,
    skippedCount,
    timeLeft,
    isTimerRunning,
    gameStatus,
    selectedCategoryId,
    showFeedback,
    hints,
    progress,
    assignments,

    // Actions
    selectCategory,
    confirmSelection,
    skip: handleSkip,

    // Constants
    timePerRound,
    categories,
  };
}
