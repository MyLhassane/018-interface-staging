import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDecode } from '@/hooks/useDecode';
import type { GameResult } from '@/hooks/useGame';
import { fetchLatestChallenge } from '@/api/challenges';
import type { Challenge } from '@/types';

const menuItems = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/game/decode', label: 'Decode', labelAr: 'فك شفرة R9' },
  { path: '/rooms', label: 'Rooms', labelAr: 'الغرف' },
  { path: '/leaderboard', label: 'Leaderboard', labelAr: 'المتصدرين' },
  { path: '/profile', label: 'Profile', labelAr: 'الملف الشخصي' },
  { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' },
];

function DecodePlay({ challenge }: { challenge: Challenge }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  const {
    currentClue, clueLabel, revealedClues, allRevealed,
    mysteryPlayer, mysteryPlayerName, mysteryGuessed,
    score, timeLeft, gameStatus, inputValue, showFeedback,
    progress, handleInputChange, handleSubmitInput, skip,
    revealMysteryPlayer, timePerRound,
  } = useDecode({ challenge, timePerClue: 60, onGameComplete: (r) => setResult(r) });

  const handlePlayAgain = () => navigate(0);
  const handleGoHome = () => navigate('/');

  const getPlayerImage = (f: string, g: string) => {
    return `/players/${g.toUpperCase()}-${f.toUpperCase()}.png`;
  };

  if (gameStatus === 'completed' && result) {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-6">
        <div className="bg-black/60 rounded-2xl p-8 w-full max-w-sm text-center space-y-6">
          <div className="text-4xl">🔐</div>
          <h2 className="text-2xl font-bold text-gold">اكتمل فك الشفرة!</h2>
          {mysteryPlayer && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold">
                <img src={getPlayerImage(mysteryPlayer.f, mysteryPlayer.g)} alt={mysteryPlayerName}
                  className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="text-xl font-bold text-white">{mysteryPlayerName}</div>
            </div>
          )}
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
          <span>تلميحة {progress.current} / {progress.total}</span>
          <span className="text-gold font-bold">{score} نقطة</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div className="bg-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 overflow-y-auto">
        {/* Revealed Clues */}
        {revealedClues.length > 0 && (
          <div className="mb-4 space-y-2">
            {revealedClues.map((clue, i) => (
              <div key={i} className="bg-black/40 border border-green/30 rounded-lg p-3 text-right">
                <div className="text-xs text-green mb-1">✓ التلميحة #{i + 1}</div>
                <div className="text-sm text-gray-300">{clue.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Current Clue */}
        {currentClue && !allRevealed && (
          <div className="bg-black/50 border border-gold/30 rounded-xl p-5 text-center mb-4">
            <div className="text-xs text-gold mb-2 uppercase tracking-wider">{clueLabel}</div>
            <div className="text-lg font-bold text-white mb-4">{currentClue.text}</div>

            <div className="flex gap-2">
              <input type="text" value={inputValue} onChange={(e) => handleInputChange(e.target.value)}
                placeholder="اكتب الإجابة..."
                disabled={!!showFeedback}
                className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white text-right outline-none focus:border-gold/50 transition"
                dir="rtl"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitInput(); }} />
              <button onClick={handleSubmitInput} disabled={!inputValue.trim() || !!showFeedback}
                className={`px-5 py-3 font-bold rounded-lg transition-colors ${inputValue.trim() && !showFeedback ? 'bg-gold text-black hover:bg-gold/90' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                تأكيد
              </button>
            </div>

            {showFeedback && (
              <div className={`mt-3 text-lg font-bold ${showFeedback === 'correct' ? 'text-green' : 'text-red'}`}>
                {showFeedback === 'correct' ? '✓ صحيح!' : `✗ خطأ! الإجابة: ${currentClue.answer}`}
              </div>
            )}
          </div>
        )}

        {/* All clues revealed - Guess mystery player */}
        {allRevealed && !mysteryGuessed && (
          <div className="bg-black/50 border border-gold/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-gold mb-3">جميع التلميحات ظهرت!</div>
            <div className="text-sm text-gray-400 mb-4">من هو اللاعب الغامض؟</div>
            <button onClick={revealMysteryPlayer}
              className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition-colors">
              اكتشف اللاعب الغامض
            </button>
          </div>
        )}

        {/* Mystery player revealed during gameplay */}
        {mysteryGuessed && mysteryPlayer && (
          <div className="bg-black/50 border border-gold/30 rounded-xl p-5 text-center">
            <div className="text-lg font-bold text-gold mb-3">اللاعب الغامض</div>
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gold mb-3">
              <img src={getPlayerImage(mysteryPlayer.f, mysteryPlayer.g)} alt={mysteryPlayerName}
                className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="text-xl font-bold text-white">{mysteryPlayerName}</div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        {!showFeedback && !allRevealed && !mysteryGuessed && (
          <div className="flex gap-3">
            <button onClick={skip} className="flex-1 py-3 border border-gray-600 text-gray-400 font-bold rounded-lg hover:bg-gray-800 transition-colors">تخطي التلميحة</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Decode() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestChallenge('decode');
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

  return <DecodePlay challenge={challenge} />;
}
