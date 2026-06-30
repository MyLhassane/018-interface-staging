interface GameResultProps {
  correct: boolean;
  playerName: string;
  attempts: number;
  points: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function GameResult({
  correct,
  playerName,
  attempts,
  points,
  onPlayAgain,
  onGoHome,
}: GameResultProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gold/20 to-bg-dark border border-gold/30 rounded-xl p-6 max-w-sm w-full text-center">
        {/* Result Icon */}
        <div className="text-6xl mb-4">
          {correct ? '🎉' : '😔'}
        </div>

        {/* Result Text */}
        <h2 className="text-2xl font-bold text-gold mb-2">
          {correct ? 'أحسنت!' : 'حظاً سعيداً'}
        </h2>
        
        <p className="text-gray-300 mb-4">
          {correct ? 'إجابتك صحيحة' : 'الإجابة كانت'}
        </p>

        {/* Player Name */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-xl font-bold text-white">{playerName}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">{attempts}</p>
            <p className="text-xs text-gray-400"> Attempts</p>
          </div>
          {correct && (
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+{points}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            الرئيسية
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 px-4 py-3 bg-gold hover:bg-gold-dark text-bg-dark rounded-lg transition-colors font-bold"
          >
            العب مرة أخرى
          </button>
        </div>
      </div>
    </div>
  );
}
