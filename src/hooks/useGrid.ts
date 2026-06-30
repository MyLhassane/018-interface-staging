import { useState, useEffect, useCallback, useRef } from 'react';
import type { Challenge, ChallengePlayer, RemitItem } from '@/types';
import type { GameResult } from '@/hooks/useGame';

interface UseGridOptions {
  challenge: Challenge;
  timePerRound?: number;
  onGameComplete?: (result: GameResult) => void;
}

interface CellAssignment {
  row: number;
  col: number;
  playerId: number;
}

export function useGrid({ challenge, timePerRound = 45, onGameComplete }: UseGridOptions) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [assignments, setAssignments] = useState<CellAssignment[]>([]);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gridConfig = challenge.gridConfig!;
  const allPlayers: ChallengePlayer[] = challenge.players;

  const currentPlayer = allPlayers[currentPlayerIndex];
  const currentPlayerName = currentPlayer ? `${currentPlayer.g} ${currentPlayer.f}`.trim() : '';

  const getCategoryName = (ids: number[]): string => {
    const allItems: RemitItem[] = challenge.remit.flat();
    return ids.map((id) => allItems.find((i) => i.id === id)?.displayName || String(id)).join(', ');
  };

  const rowLabels = gridConfig.rowCategories.map(getCategoryName);
  const colLabels = gridConfig.columnCategories.map(getCategoryName);

  const isCellAssigned = (row: number, col: number) =>
    assignments.some((a) => a.row === row && a.col === col);

  const getCellPlayer = (row: number, col: number) => {
    const playerId = gridConfig.cells[row]?.[col];
    return allPlayers.find((p) => p.id === playerId);
  };

  const getPlayerCorrectCell = (playerId: number): { row: number; col: number } | null => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (gridConfig.cells[r]?.[c] === playerId) return { row: r, col: c };
      }
    }
    return null;
  };

  const goToNextPlayer = useCallback(() => {
    if (currentPlayerIndex >= allPlayers.length - 1) {
      setGameStatus('completed');
      setIsTimerRunning(false);
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameComplete?.({
        score, correct: correctCount, wrong: wrongCount,
        skipped: skippedCount, timeTaken, totalPlayers: allPlayers.length,
      });
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
      setTimeLeft(timePerRound);
      setSelectedCell(null);
      setShowFeedback(null);
      setIsTimerRunning(true);
    }
  }, [currentPlayerIndex, allPlayers.length, score, correctCount, wrongCount, skippedCount, timePerRound, onGameComplete]);

  const goToNextPlayerRef = useRef(goToNextPlayer);
  goToNextPlayerRef.current = goToNextPlayer;

  const currentPlayerRef = useRef(currentPlayer);
  currentPlayerRef.current = currentPlayer;

  const gameStatusRef = useRef(gameStatus);
  gameStatusRef.current = gameStatus;

  useEffect(() => {
    if (!isTimerRunning || gameStatus !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const player = currentPlayerRef.current;
          if (player && gameStatusRef.current === 'playing') {
            setSkippedCount((p) => p + 1);
            setShowFeedback('wrong');
            setIsTimerRunning(false);
            setTimeout(() => goToNextPlayerRef.current(), 1000);
          }
          return timePerRound;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, gameStatus, timePerRound]);

  const selectCell = useCallback((row: number, col: number) => {
    if (showFeedback || isCellAssigned(row, col)) return;
    setSelectedCell({ row, col });
  }, [showFeedback]);

  const submitCell = useCallback(() => {
    if (gameStatus !== 'playing' || !currentPlayer || !selectedCell || showFeedback) return;

    const correctCell = getPlayerCorrectCell(currentPlayer.id);
    const isCorrect = correctCell?.row === selectedCell.row && correctCell?.col === selectedCell.col;

    setAssignments((prev) => [...prev, { ...selectedCell, playerId: currentPlayer.id }]);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      setScore((prev) => prev + 150 + timeBonus);
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextPlayer(), 1500);
  }, [gameStatus, currentPlayer, selectedCell, timeLeft, showFeedback, goToNextPlayer]);

  const handleSkip = useCallback(() => {
    if (gameStatus !== 'playing' || !currentPlayer) return;
    setSkippedCount((prev) => prev + 1);
    setShowFeedback('wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextPlayer(), 1000);
  }, [gameStatus, currentPlayer, goToNextPlayer]);

  const progress = {
    current: currentPlayerIndex + 1,
    total: allPlayers.length,
    percentage: ((currentPlayerIndex + 1) / allPlayers.length) * 100,
  };

  return {
    currentPlayer, currentPlayerName, score, timeLeft, gameStatus,
    selectedCell, showFeedback, progress, assignments,
    rowLabels, colLabels, getCellPlayer, isCellAssigned,
    selectCell, submitCell, skip: handleSkip, timePerRound,
  };
}
