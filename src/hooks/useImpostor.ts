import { useState, useCallback, useRef } from 'react';
import type { Challenge, ChallengePlayer } from '@/types';
import type { GameResult } from '@/hooks/useGame';

interface UseImpostorOptions {
  challenge: Challenge;
  onGameComplete?: (result: GameResult) => void;
}

export function useImpostor({ challenge, onGameComplete }: UseImpostorOptions) {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  const impostorConfig = challenge.impostorConfig!;
  const allPlayers: ChallengePlayer[] = challenge.players;

  const categoryName = challenge.remit.flat().find((c) => c.id === impostorConfig.categoryId)?.displayName || '';
  const impostorPlayer = allPlayers.find((p) => p.id === impostorConfig.impostorPlayerId);
  const categoryImage = `/categories/${categoryName.toLowerCase().replace(/\s+/g, '_')}.png`;

  const getPlayerImage = (f: string, g: string) => {
    return `/players/${g.toUpperCase()}-${f.toUpperCase()}.png`;
  };

  const handleSelectPlayer = useCallback((playerId: number) => {
    if (showFeedback) return;
    setSelectedPlayerId(playerId);
  }, [showFeedback]);

  const handleConfirm = useCallback(() => {
    if (gameStatus !== 'playing' || selectedPlayerId === null || showFeedback) return;

    const isCorrect = selectedPlayerId === impostorConfig.impostorPlayerId;
    setAttempts((prev) => prev + 1);

    if (isCorrect) {
      setScore(500);
      setShowFeedback('correct');
    } else {
      setScore(Math.max(0, score - 50));
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setGameStatus('completed');
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameComplete?.({
        score: isCorrect ? 500 : 0,
        correct: isCorrect ? 1 : 0,
        wrong: isCorrect ? 0 : 1,
        skipped: 0,
        timeTaken,
        totalPlayers: allPlayers.length,
      });
    }, 1500);
  }, [gameStatus, selectedPlayerId, showFeedback, impostorConfig.impostorPlayerId, score, allPlayers.length, onGameComplete]);

  const handleReplay = useCallback(() => {
    setScore(0);
    setAttempts(0);
    setGameStatus('playing');
    setSelectedPlayerId(null);
    setShowFeedback(null);
    startTimeRef.current = Date.now();
  }, []);

  return {
    allPlayers, impostorPlayer, categoryName, categoryImage,
    selectedPlayerId, showFeedback, gameStatus, score, attempts,
    getPlayerImage, handleSelectPlayer, handleConfirm, handleReplay,
  };
}
