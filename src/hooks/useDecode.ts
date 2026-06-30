import { useState, useEffect, useCallback, useRef } from 'react';
import type { Challenge, DecodeClue } from '@/types';
import type { GameResult } from '@/hooks/useGame';

interface UseDecodeOptions {
  challenge: Challenge;
  timePerClue?: number;
  onGameComplete?: (result: GameResult) => void;
}

const CLUE_LABELS: Record<string, string> = {
  position: 'المركز',
  nationality: 'الجنسية',
  league: 'الدوري',
  era: 'العصر',
  clubTier: 'مستوى النادي',
  specificClub: 'النادي',
  achievement: 'الإنجاز',
  nickname: 'اللقب',
  reveal: 'الكشف الكامل',
};

export function useDecode({ challenge, timePerClue = 60, onGameComplete }: UseDecodeOptions) {
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerClue);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing');
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [revealedClues, setRevealedClues] = useState<DecodeClue[]>([]);
  const [mysteryGuessed, setMysteryGuessed] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clues: DecodeClue[] = (challenge.decodeConfig || []).sort((a, b) => a.order - b.order);
  const mysteryPlayer = challenge.players[0];
  const mysteryPlayerName = mysteryPlayer ? `${mysteryPlayer.g} ${mysteryPlayer.f}`.trim() : '';

  const isLastClue = currentClueIndex >= clues.length - 1;
  const allRevealed = revealedClues.length >= clues.length;

  const goToNextClue = useCallback(() => {
    if (isLastClue || currentClueIndex >= clues.length - 1) {
      if (!allRevealed) {
        setRevealedClues((prev) => [...prev, clues[currentClueIndex]]);
      }
      // All clues done, wait for mystery player guess
      setIsTimerRunning(false);
    } else {
      setRevealedClues((prev) => [...prev, clues[currentClueIndex]]);
      setCurrentClueIndex((prev) => prev + 1);
      setTimeLeft(timePerClue);
      setInputValue('');
      setShowFeedback(null);
      setIsTimerRunning(true);
    }
  }, [clues, currentClueIndex, isLastClue, allRevealed, timePerClue]);

  const goToNextClueRef = useRef(goToNextClue);
  goToNextClueRef.current = goToNextClue;

  const currentClueRef = useRef(clues[currentClueIndex]);
  currentClueRef.current = clues[currentClueIndex];

  const gameStatusRef = useRef(gameStatus);
  gameStatusRef.current = gameStatus;

  useEffect(() => {
    if (!isTimerRunning || gameStatus !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (gameStatusRef.current === 'playing') {
            setSkippedCount((p) => p + 1);
            setShowFeedback('wrong');
            setIsTimerRunning(false);
            setTimeout(() => goToNextClueRef.current(), 1000);
          }
          return timePerClue;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, gameStatus, timePerClue]);

  const submitAnswer = useCallback((answer: string) => {
    if (gameStatus !== 'playing' || !currentClueRef.current || showFeedback) return;

    const trimmed = answer.trim().toLowerCase();
    const correctAnswer = currentClueRef.current.answer.trim().toLowerCase();
    const isCorrect = trimmed === correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextClueRef.current(), 1500);
  }, [gameStatus, showFeedback]);

  const handleSkip = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setSkippedCount((prev) => prev + 1);
    setShowFeedback('wrong');
    setIsTimerRunning(false);
    setTimeout(() => goToNextClueRef.current(), 1000);
  }, [gameStatus]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSubmitInput = useCallback(() => {
    if (inputValue.trim()) submitAnswer(inputValue.trim());
  }, [inputValue, submitAnswer]);

  // Reveal mystery player and end game
  const revealMysteryPlayer = useCallback(() => {
    setMysteryGuessed(true);
    setGameStatus('completed');
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onGameComplete?.({
      score, correct: correctCount, wrong: wrongCount,
      skipped: skippedCount, timeTaken, totalPlayers: 1,
    });
  }, [score, correctCount, wrongCount, skippedCount, onGameComplete]);

  const currentClue = clues[currentClueIndex];
  const clueLabel = currentClue ? (CLUE_LABELS[currentClue.category] || currentClue.category) : '';

  const progress = {
    current: currentClueIndex + 1,
    total: clues.length,
    percentage: ((currentClueIndex + 1) / clues.length) * 100,
  };

  return {
    currentClue, clueLabel, clueText: currentClue?.text || '',
    revealedClues, allRevealed, mysteryPlayer, mysteryPlayerName,
    mysteryGuessed, score, timeLeft, gameStatus, inputValue, showFeedback,
    progress, correctCount, wrongCount, skippedCount,
    handleInputChange, handleSubmitInput, skip: handleSkip,
    revealMysteryPlayer, timePerRound: timePerClue,
  };
}
