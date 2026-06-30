import { useState, useEffect, useCallback, useRef } from 'react';
import type { Challenge, ChallengePlayer, RemitItem } from '@/types';
import type { GameResult } from '@/hooks/useGame';

interface UseFactorOptions {
  challenge: Challenge;
  timePerRound?: number;
  onGameComplete?: (result: GameResult) => void;
}

export function useFactor({ challenge, timePerRound = 30, onGameComplete }: UseFactorOptions) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing');
  const [selectedTraitId, setSelectedTraitId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allPlayers: ChallengePlayer[] = challenge.players;
  const traits: RemitItem[] = challenge.remit.flat();

  const currentPlayer = allPlayers[currentPlayerIndex];
  const currentPlayerName = currentPlayer ? `${currentPlayer.g} ${currentPlayer.f}`.trim() : '';

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
      setSelectedTraitId(null);
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

  const submitTrait = useCallback((traitId: number) => {
    if (gameStatus !== 'playing' || !currentPlayer || showFeedback) return;
    const correctTraitId = currentPlayer.v[0];
    const isCorrect = traitId === correctTraitId;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      const streakBonus = correctCount >= 2 ? 50 : 0;
      setScore((prev) => prev + 100 + timeBonus + streakBonus);
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextPlayer(), 1500);
  }, [gameStatus, currentPlayer, timeLeft, correctCount, showFeedback, goToNextPlayer]);

  const handleSkip = useCallback(() => {
    if (gameStatus !== 'playing' || !currentPlayer) return;
    setSkippedCount((prev) => prev + 1);
    setShowFeedback('wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextPlayer(), 1000);
  }, [gameStatus, currentPlayer, goToNextPlayer]);

  const selectTrait = useCallback((traitId: number) => {
    if (showFeedback) return;
    setSelectedTraitId(traitId);
  }, [showFeedback]);

  const confirmSelection = useCallback(() => {
    if (selectedTraitId !== null) submitTrait(selectedTraitId);
  }, [selectedTraitId, submitTrait]);

  const progress = {
    current: currentPlayerIndex + 1,
    total: allPlayers.length,
    percentage: ((currentPlayerIndex + 1) / allPlayers.length) * 100,
  };

  return {
    currentPlayer, currentPlayerName, score, timeLeft, gameStatus,
    selectedTraitId, showFeedback, progress, traits,
    selectTrait, confirmSelection, skip: handleSkip, timePerRound,
  };
}
