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
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'factor',
    title: 'The Phenomenon Factor',
    titleAr: 'عامل الفينومينو',
    description: 'Discover what makes each player special',
    descriptionAr: 'اكتشف ما يجعل كل لاعب مميزاً',
    path: '/game/factor',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'decode',
    title: 'Decode the R9',
    titleAr: 'فك شفرة R9',
    description: 'Decode clues to identify the mystery player',
    descriptionAr: 'فك التلميحيات لتحديد اللاعب الغامض',
    path: '/game/decode',
    icon: '🔐',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'impostor',
    title: 'Impostor: World Cup',
    titleAr: 'المحتال: كأس العالم',
    description: 'Find the fake player in each category',
    descriptionAr: 'اعثر على اللاعب المزيف في كل فئة',
    path: '/game/impostor',
    icon: '🎭',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 'grid',
    title: 'Grid Challenge',
    titleAr: 'تحدي الشبكة',
    description: 'Complete the football grid puzzle',
    descriptionAr: 'أكمل اللغز الشبكي لكرة القدم',
    path: '/game/grid',
    icon: '📊',
    color: 'from-cyan-500 to-blue-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl font-bold text-gold mb-2">El Phenomeno</h1>
        <p className="text-xl text-gray-400">FIFA World Cup 2026</p>
      </div>

      {/* Game Cards */}
      <div className="px-4 pb-8">
        <h2 className="text-lg font-bold text-white mb-4 text-center">اختر لعبتك</h2>
        <div className="grid gap-4 max-w-md mx-auto">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className={`block bg-gradient-to-r ${game.color} rounded-xl p-4 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{game.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{game.titleAr}</h3>
                  <p className="text-sm text-white/80">{game.descriptionAr}</p>
                </div>
                <div className="text-white/60">←</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
