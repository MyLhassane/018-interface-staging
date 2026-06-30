interface TimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
}

export default function Timer({ timeLeft, totalTime, isRunning }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;
  
  return (
    <div className="flex items-center justify-center">
      <div className={`relative w-12 h-12 rounded-full ${!isRunning ? 'opacity-50' : ''}`} style={{ backgroundColor: 'rgb(92 85 56 / 80%)', borderRadius: '3.40282e38px' }}>
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-500"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage} ${100 - percentage}`}
            className={isLow ? 'text-red-500' : 'text-green-500'}
            strokeLinecap="round"
          />
        </svg>
        {/* Time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${isLow ? 'text-red-500' : 'text-green-600'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}
