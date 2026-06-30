import { Link } from 'react-router-dom';

const games = [
  {
    id: 'connections',
    title: 'Phenomenon Connections',
    titleAr: 'ارتباطات الفينومينو',
    description: 'Connect players to their categories',
    descriptionAr: 'اربط اللاعبين بالفئات الصحيحة',
    path: '/game/connections',
    icon: '🔗',
  },
  {
    id: 'factor',
    title: 'The Phenomenon Factor',
    titleAr: 'عامل الفينومينو',
    description: 'Discover what makes each player special',
    descriptionAr: 'اكتشف ما يجعل كل لاعب مميزاً',
    path: '/game/factor',
    icon: '⭐',
  },
  {
    id: 'decode',
    title: 'Decode the R9',
    titleAr: 'فك شفرة R9',
    description: 'Decode clues to identify the mystery player',
    descriptionAr: 'فك التلميحيات لتحديد اللاعب الغامض',
    path: '/game/decode',
    icon: '🔐',
  },
  {
    id: 'impostor',
    title: 'Impostor: World Cup',
    titleAr: 'المحتال: كأس العالم',
    description: 'Find the fake player in each category',
    descriptionAr: 'اعثر على اللاعب المزيف في كل فئة',
    path: '/game/impostor',
    icon: '🎭',
  },
  {
    id: 'grid',
    title: 'Grid Challenge',
    titleAr: 'تحدي الشبكة',
    description: 'Complete the football grid puzzle',
    descriptionAr: 'أكمل اللغز الشبكي لكرة القدم',
    path: '/game/grid',
    icon: '📊',
  },
];

export default function Home() {
  return (
    <div className="relative w-full max-w-[480px] h-[100dvh] mx-auto overflow-hidden bg-[url('/bg.png')] bg-cover bg-center flex flex-col">
      {/* Header */}
      <header className="relative w-full flex justify-center items-center gap-0.5 flex-shrink-0 bg-[url('/header/header-bg.png')] bg-cover bg-center">
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-left.png" alt="" className="w-full h-full object-cover" />
        </div>
        <img
          src="/header/header-center.png"
          alt="FIFA World Cup 2026"
          className="h-[min(18vw,80px)] flex-[1.2] object-contain"
        />
        <div className="relative h-[min(34vw,150px)] flex-1">
          <img src="/header/header-right.png" alt="" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Game Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gold mb-4 text-center">اختر لعبتك</h2>
        <div className="grid gap-3 max-w-md mx-auto">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className="block bg-black/60 border border-gold/30 rounded-xl p-4 hover:bg-gold/10 hover:border-gold/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{game.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gold">{game.titleAr}</h3>
                  <p className="text-sm text-gray-400">{game.descriptionAr}</p>
                </div>
                <div className="text-gold/60">←</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
