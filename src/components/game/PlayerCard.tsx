interface PlayerCardProps {
  image?: string;
  playerName?: string;
  revealed?: boolean;
}

export default function PlayerCard({ image, playerName, revealed = false }: PlayerCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[min(28vw,120px)] h-[min(28vw,120px)] rounded-full overflow-hidden bg-white/90">
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.8), rgba(201,168,76,0.1))',
          }}
        />
        {/* Inner white background */}
        <div className="absolute inset-[3px] rounded-full bg-white/90" />
        {/* Image */}
        {revealed && image ? (
          <img
            src={image}
            alt={playerName || ''}
            className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover"
          />
        ) : (
          <div className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gray-200" />
        )}
      </div>
    </div>
  );
}
