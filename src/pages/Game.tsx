import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGame, type GameResult } from '@/hooks/useGame';
import { fetchLatestChallenge } from '@/api/challenges';
import type { Challenge } from '@/types';

const menuItems = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/game', label: 'Game', labelAr: 'اللعبة' },
  { path: '/rooms', label: 'Rooms', labelAr: 'الغرف' },
  { path: '/leaderboard', label: 'Leaderboard', labelAr: 'المتصدرين' },
  { path: '/profile', label: 'Profile', labelAr: 'الملف الشخصي' },
  { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' },
];

function GamePlay({ challenge }: { challenge: Challenge }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  const {
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
    selectCategory,
    confirmSelection,
    skip,
    timePerRound,
    categories,
  } = useGame({
    challenge,
    timePerRound: 30,
    onGameComplete: (r) => setResult(r),
  });

  const handlePlayAgain = () => navigate(0);
  const handleGoHome = () => navigate('/');

  // Get category image from remit
  const getCategoryImage = (item: { id: number; name: string; displayName: string }) => {
    // Try to find image from categories array or use placeholder
    return `/categories/${item.name.toLowerCase().replace(/\s+/g, '_')}.png`;
  };

  // Get player image
  const getPlayerImage = (f: string, g: string) => {
    return `/players/${g.toUpperCase()}-${f.toUpperCase()}.png`;
  };

  if (gameStatus === 'completed' && result) {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-6">
        <div className="bg-black/60 rounded-2xl p-8 w-full max-w-sm text-center space-y-6">
          <div className="text-4xl">🏆</div>
          <h2 className="text-2xl font-bold text-gold">انتهت اللعبة!</h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green">{result.correct}</div>
              <div className="text-xs text-gray-400">صحيح</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red">{result.wrong}</div>
              <div className="text-xs text-gray-400">خطأ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{result.skipped}</div>
              <div className="text-xs text-gray-400">متخطى</div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="text-3xl font-bold text-gold">{result.score}</div>
            <div className="text-sm text-gray-400">نقطة</div>
          </div>

          <div className="text-sm text-gray-400">
            {result.timeTaken} ثانية • {result.totalPlayers} لاعب
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePlayAgain}
              className="flex-1 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition-colors"
            >
              العب مرة أخرى
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 py-3 border border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors"
            >
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col">
      {/* Header */}
      <header className="relative w-full flex justify-center items-center gap-0.5 flex-shrink-0 bg-[url('/header/header-bg.png')] bg-cover bg-center">
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-left.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {/* Timer */}
            <div className="relative">
              <svg className="w-16 h-16" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke={timeLeft > 10 ? '#c9a84c' : '#e74c3c'}
                  strokeWidth="4"
                  strokeDasharray={`${(timeLeft / timePerRound) * 176} 176`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${timeLeft > 10 ? 'text-gold' : 'text-red'}`}>
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>
        </div>
        <img
          src="/header/header-center.png"
          alt="FIFA World Cup 2026"
          className="h-[min(18vw,80px)] flex-[1.2] object-contain"
        />
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-right.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgb(92 85 56 / 80%)', borderRadius: '3.40282e38px' }}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />
          <nav className="absolute right-2 top-[min(34vw,150px)] mt-1 w-56 bg-bg-dark border border-gold/30 rounded-lg shadow-xl z-50 overflow-hidden">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-right transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gold/20 text-gold'
                    : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
                }`}
              >
                <span className="block text-sm">{item.labelAr}</span>
                <span className="block text-xs text-gray-500">{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-black/30">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>{progress.current} / {progress.total}</span>
          <span className="text-gold font-bold">{score} نقطة</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gold h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Category Grid (3x3) */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {hints.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selectedCategoryId === cell.item?.id;
              const isAssigned = cell.assigned;
              const isCorrectAssigned = isAssigned && cell.correctCount > 0;

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => cell.item && selectCategory(cell.item.id)}
                  disabled={isAssigned || !!showFeedback}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${isSelected ? 'border-gold scale-105 shadow-lg shadow-gold/30' : 'border-transparent'}
                    ${isCorrectAssigned ? 'border-green bg-green/20' : ''}
                    ${isAssigned && !isCorrectAssigned ? 'border-red/50 opacity-50' : ''}
                    ${!isAssigned && !showFeedback ? 'hover:border-gold/50 active:scale-95' : ''}
                  `}
                >
                  {cell.item && (
                    <>
                      <img
                        src={getCategoryImage(cell.item)}
                        alt={cell.item.displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/categories/default.png`;
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                        <div className="text-[8px] text-white text-center leading-tight truncate">
                          {cell.item.displayName}
                        </div>
                      </div>
                      {isCorrectAssigned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green/30">
                          <span className="text-2xl">✓</span>
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Player Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {currentPlayer && (
          <div className="text-center">
            {/* Player Image */}
            <div className={`
              w-32 h-32 mx-auto rounded-full overflow-hidden border-4 mb-3 transition-all
              ${showFeedback === 'correct' ? 'border-green shadow-lg shadow-green/30' : ''}
              ${showFeedback === 'wrong' ? 'border-red shadow-lg shadow-red/30' : ''}
              ${!showFeedback ? 'border-gold/50' : ''}
            `}>
              <img
                src={currentPlayer.image || getPlayerImage(currentPlayer.f, currentPlayer.g)}
                alt={currentPlayerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/players/default.png`;
                }}
              />
            </div>

            {/* Player Name */}
            <h3 className="text-xl font-bold text-white mb-1">{currentPlayerName}</h3>
            <p className="text-sm text-gray-400">{currentPlayer.p}</p>

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-3 text-lg font-bold ${showFeedback === 'correct' ? 'text-green' : 'text-red'}`}>
                {showFeedback === 'correct' ? '✓ صحيح!' : '✗ خطأ!'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pb-6">
        {showFeedback ? (
          <div className="text-center text-gray-400 text-sm">جاري التحميل...</div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={skip}
              className="flex-1 py-3 border border-gray-600 text-gray-400 font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
             تخطي
            </button>
            <button
              onClick={confirmSelection}
              disabled={selectedCategoryId === null}
              className={`
                flex-1 py-3 font-bold rounded-lg transition-colors
                ${selectedCategoryId !== null
                  ? 'bg-gold text-black hover:bg-gold/90'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              تأكيد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Game() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestChallenge();
        setChallenge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, []);

  const handleGoHome = () => navigate('/');

  if (loading) {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center">
        <div className="text-white text-lg mb-4">جاري تحميل التحدي...</div>
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-8">
        <div className="text-red text-lg mb-4 text-center">
          {error || 'لا يوجد تحدي متاح'}
        </div>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-gold text-bg-dark font-bold rounded-lg hover:bg-gold/90 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return <GamePlay challenge={challenge} />;
}
