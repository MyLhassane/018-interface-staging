import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGrid } from '@/hooks/useGrid';
import type { GameResult } from '@/hooks/useGame';
import { fetchLatestChallenge } from '@/api/challenges';
import type { Challenge } from '@/types';

const menuItems = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/game/grid', label: 'Grid', labelAr: 'تحدي الشبكة' },
  { path: '/rooms', label: 'Rooms', labelAr: 'الغرف' },
  { path: '/leaderboard', label: 'Leaderboard', labelAr: 'المتصدرين' },
  { path: '/profile', label: 'Profile', labelAr: 'الملف الشخصي' },
  { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' },
];

function GridPlay({ challenge }: { challenge: Challenge }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  const {
    currentPlayer, currentPlayerName, score, timeLeft, gameStatus,
    selectedCell, showFeedback, progress, rowLabels, colLabels,
    getCellPlayer, isCellAssigned, selectCell, submitCell, skip, timePerRound,
  } = useGrid({ challenge, timePerRound: 45, onGameComplete: (r) => setResult(r) });

  const handlePlayAgain = () => navigate(0);
  const handleGoHome = () => navigate('/');

  const getPlayerImage = (f: string, g: string) => {
    return `/players/${g.toUpperCase()}-${f.toUpperCase()}.png`;
  };

  if (gameStatus === 'completed' && result) {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-6">
        <div className="bg-black/60 rounded-2xl p-8 w-full max-w-sm text-center space-y-6">
          <div className="text-4xl">📊</div>
          <h2 className="text-2xl font-bold text-gold">اكتمل تحدي الشبكة!</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-2xl font-bold text-green">{result.correct}</div><div className="text-xs text-gray-400">صحيح</div></div>
            <div><div className="text-2xl font-bold text-red">{result.wrong}</div><div className="text-xs text-gray-400">خطأ</div></div>
            <div><div className="text-2xl font-bold text-gray-400">{result.skipped}</div><div className="text-xs text-gray-400">متخطى</div></div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <div className="text-3xl font-bold text-gold">{result.score}</div>
            <div className="text-sm text-gray-400">نقطة</div>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePlayAgain} className="flex-1 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition-colors">العب مرة أخرى</button>
            <button onClick={handleGoHome} className="flex-1 py-3 border border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors">الرئيسية</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col">
      <header className="relative w-full flex justify-center items-center gap-0.5 flex-shrink-0 bg-[url('/header/header-bg.png')] bg-cover bg-center">
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-left.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              <svg className="w-16 h-16" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke={timeLeft > 10 ? '#c9a84c' : '#e74c3c'} strokeWidth="4"
                  strokeDasharray={`${(timeLeft / timePerRound) * 176} 176`} strokeLinecap="round" transform="rotate(-90 32 32)"
                  className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${timeLeft > 10 ? 'text-gold' : 'text-red'}`}>{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>
        <img src="/header/header-center.png" alt="FIFA World Cup 2026" className="h-[min(18vw,80px)] flex-[1.2] object-contain" />
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-right.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors" style={{ backgroundColor: 'rgb(92 85 56 / 80%)', borderRadius: '3.40282e38px' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />
          <nav className="absolute right-2 top-[min(34vw,150px)] mt-1 w-56 bg-bg-dark border border-gold/30 rounded-lg shadow-xl z-50 overflow-hidden">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-right transition-colors ${location.pathname === item.path ? 'bg-gold/20 text-gold' : 'text-gray-300 hover:bg-gold/10 hover:text-gold'}`}>
                <span className="block text-sm">{item.labelAr}</span>
                <span className="block text-xs text-gray-500">{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}

      <div className="px-4 py-2 bg-black/30">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>{progress.current} / {progress.total}</span>
          <span className="text-gold font-bold">{score} نقطة</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div className="bg-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
        </div>
      </div>

      {currentPlayer && (
        <>
          <div className="flex-1 flex flex-col items-center px-4 py-2">
            {/* Current Player */}
            <div className="text-center mb-3">
              <div className={`w-20 h-20 mx-auto rounded-full overflow-hidden border-3 mb-2 transition-all ${showFeedback === 'correct' ? 'border-green shadow-lg shadow-green/30' : ''} ${showFeedback === 'wrong' ? 'border-red shadow-lg shadow-red/30' : ''} ${!showFeedback ? 'border-gold/50' : ''}`}>
                <img src={currentPlayer.image || getPlayerImage(currentPlayer.f, currentPlayer.g)} alt={currentPlayerName}
                  className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <h3 className="text-base font-bold text-white">{currentPlayerName}</h3>
            </div>

            <div className="text-sm text-gray-400 mb-2 text-center">اختر الموقع الصحيح في الشبكة</div>

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-1.5 w-full max-w-[320px]">
              {/* Column headers */}
              <div />
              {colLabels.map((label, ci) => (
                <div key={`ch-${ci}`} className="text-center text-[10px] text-gold font-semibold truncate px-1">{label}</div>
              ))}
              {/* Rows */}
              {[0, 1, 2].map((row) => (
                <>
                  <div key={`rl-${row}`} className="flex items-center text-[10px] text-gold font-semibold truncate">{rowLabels[row]}</div>
                  {[0, 1, 2].map((col) => {
                    const isSel = selectedCell?.row === row && selectedCell?.col === col;
                    const assigned = isCellAssigned(row, col);
                    const cellPlayer = getCellPlayer(row, col);
                    const isCorrectAssign = assigned && cellPlayer?.id === currentPlayer.id;
                    return (
                      <button key={`c-${row}-${col}`} onClick={() => selectCell(row, col)}
                        disabled={assigned || !!showFeedback}
                        className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center ${
                          isSel ? 'border-gold scale-105 shadow-lg shadow-gold/30 bg-gold/20' : ''
                        } ${isCorrectAssign ? 'border-green bg-green/20' : ''} ${
                          assigned && !isCorrectAssign ? 'border-red/50 bg-red/10' : ''
                        } ${!assigned && !showFeedback && !isSel ? 'border-gray-700 hover:border-gold/50 bg-black/30' : ''} ${
                          assigned ? 'opacity-60' : ''
                        }`}>
                        {cellPlayer && assigned && (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/30">
                              <img src={cellPlayer.image || getPlayerImage(cellPlayer.f, cellPlayer.g)} alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <span className="text-[8px] text-gray-400 mt-0.5 truncate max-w-[60px]">{cellPlayer.g}</span>
                          </div>
                        )}
                        {!assigned && isSel && (
                          <span className="text-gold text-lg font-bold">+</span>
                        )}
                      </button>
                    );
                  })}
                </>
              ))}
            </div>

            {showFeedback && (
              <div className={`mt-3 text-lg font-bold ${showFeedback === 'correct' ? 'text-green' : 'text-red'}`}>
                {showFeedback === 'correct' ? '✓ صحيح!' : '✗ خطأ!'}
              </div>
            )}
          </div>

          <div className="px-4 pb-6">
            {showFeedback ? (
              <div className="text-center text-gray-400 text-sm">جاري التحميل...</div>
            ) : (
              <div className="flex gap-3">
                <button onClick={skip} className="flex-1 py-3 border border-gray-600 text-gray-400 font-bold rounded-lg hover:bg-gray-800 transition-colors">تخطي</button>
                <button onClick={submitCell} disabled={selectedCell === null}
                  className={`flex-1 py-3 font-bold rounded-lg transition-colors ${selectedCell !== null ? 'bg-gold text-black hover:bg-gold/90' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>تأكيد الموقع</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Grid() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestChallenge('grid');
        setChallenge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <div className="text-red text-lg mb-4 text-center">{error || 'لا يوجد تحدي متاح'}</div>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gold text-bg-dark font-bold rounded-lg hover:bg-gold/90 transition-colors">العودة للرئيسية</button>
      </div>
    );
  }

  return <GridPlay challenge={challenge} />;
}
