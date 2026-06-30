import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: string;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  const navigate = useNavigate();

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

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">{icon}</div>
        <h1 className="text-2xl font-bold text-gold mb-2 text-center">{title}</h1>
        <p className="text-gray-400 text-center mb-8">{description}</p>
        
        <div className="bg-black/60 border border-gold/30 rounded-xl p-6 text-center max-w-sm">
          <div className="text-4xl mb-4">🚧</div>
          <h2 className="text-lg font-bold text-gold mb-2">قريباً</h2>
          <p className="text-sm text-gray-400">
            هذه اللعبة قيد التطوير وستكون متاحة قريباً
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-4 pb-6">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
