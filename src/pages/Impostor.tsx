import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useImpostor } from '@/hooks/useImpostor';
import { fetchLatestChallenge } from '@/api/challenges';
import type { Challenge } from '@/types';

const menuItems = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/game/impostor', label: 'Impostor', labelAr: 'المحتال' },
  { path: '/rooms', label: 'Rooms', labelAr: 'الغرف' },
  { path: '/leaderboard', label: 'Leaderboard', labelAr: 'المتصدرين' },
  { path: '/profile', label: 'Profile', labelAr: 'الملف الشخصي' },
  { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' },
];

function ImpostorPlay({ challenge }: { challenge: Challenge }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    allPlayers, impostorPlayer, categoryName, categoryImage,
    selectedPlayerId, showFeedback, gameStatus, score, attempts,
    getPlayerImage, handleSelectPlayer, handleConfirm, handleReplay,
  } = useImpostor({ challenge, onGameComplete: () => {} });

  const handleGoHome = () => navigate('/');

  if (gameStatus === 'completed') {
    return (
      <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col items-center justify-center px-6">
        <div className="bg-black/60 rounded-2xl p-8 w-full max-w-sm text-center space-y-6">
          <div className="text-4xl">{showFeedback === 'correct' ? '🎉' : '😔'}</div>
          <h2 className="text-2xl font-bold text-gold">
            {showFeedback === 'correct' ? 'أحسنت! وجدت المحتال!' : 'خطأ! هذا ليس المحتال'}
          </h2>
          {impostorPlayer && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red">
                <img src={getPlayerImage(impostorPlayer.f, impostorPlayer.g)} alt={`${impostorPlayer.g} ${impostorPlayer.f}`}
                  className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="text-lg font-bold text-red">{impostorPlayer.g} {impostorPlayer.f}</div>
              <div className="text-sm text-gray-400">كان المحتال!</div>
            </div>
          )}
          <div className="border-t border-gray-700 pt-4">
            <div className="text-3xl font-bold text-gold">{score}</div>
            <div className="text-sm text-gray-400">نقطة • {attempts} محاولة</div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReplay} className="flex-1 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition-colors">أعد المحاولة</button>
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

      <div className="px-4 py-3 bg-black/30">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>اعثر على المحتال</span>
          <span className="text-gold font-bold">{score} نقطة</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 overflow-y-auto">
        {/* Category */}
        <div className="text-center mb-4">
          <div className="text-xs text-gray-400 mb-2">الفئة</div>
          <div className="inline-flex items-center gap-2 bg-black/40 border border-gold/30 rounded-lg px-4 py-2">
            <img src={categoryImage} alt={categoryName} className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-lg font-bold text-gold">{categoryName}</span>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mb-4">أي من هؤلاء اللاعبين لا ينتمي لهذه الفئة؟</div>

        {/* Players */}
        <div className="space-y-3">
          {allPlayers.map((player) => {
            const isSelected = selectedPlayerId === player.id;
            return (
              <button key={player.id} onClick={() => handleSelectPlayer(player.id)}
                disabled={!!showFeedback}
                className={`w-full flex items-center gap-3 bg-black/40 border-2 rounded-xl p-3 transition-all ${
                  isSelected ? 'border-red bg-red/10 scale-[1.02]' : 'border-gray-700 hover:border-gold/50'
                }`}>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0">
                  <img src={getPlayerImage(player.f, player.g)} alt={`${player.g} ${player.f}`}
                    className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 text-right">
                  <div className="text-base font-bold text-white">{player.g} {player.f}</div>
                  <div className="text-xs text-gray-400">{player.p}</div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-red flex items-center justify-center">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`mt-4 text-center text-lg font-bold ${showFeedback === 'correct' ? 'text-green' : 'text-red'}`}>
            {showFeedback === 'correct' ? '✓ صحيح! هذا هو المحتال!' : '✗ خطأ! هذا ليس المحتال'}
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        <button onClick={handleConfirm} disabled={selectedPlayerId === null || !!showFeedback}
          className={`w-full py-3 font-bold rounded-lg transition-colors ${
            selectedPlayerId !== null && !showFeedback
              ? 'bg-red text-white hover:bg-red/90'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}>
          {showFeedback ? 'جاري...' : 'هذا هو المحتال!'}
        </button>
      </div>
    </div>
  );
}

export default function Impostor() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestChallenge('impostor');
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

  return <ImpostorPlay challenge={challenge} />;
}
