interface HintCircleProps {
  image?: string;
  categoryName?: string;
  revealed?: boolean;
  rowColor: 'pink' | 'blue' | 'green';
  onClick?: () => void;
}

const rowColors = {
  pink: 'rgb(236, 22, 98)',
  blue: 'rgb(134, 181, 189)',
  green: 'rgb(101, 198, 123)',
};

export default function HintCircle({
  image,
  categoryName,
  revealed = false,
  rowColor,
  onClick,
}: HintCircleProps) {
  const strokeColor = rowColors[rowColor];

  return (
    <div className="flex flex-col items-center">
      {/* Circle container */}
      <div
        className="relative w-[min(29vw,125px)] h-[min(29vw,125px)] rounded-full flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        {/* SVG dashed border */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray="16 7"
            strokeLinecap="butt"
          />
        </svg>

        {/* Inner circle */}
        <div className="relative z-10 w-[85%] h-[85%] rounded-full flex items-center justify-center overflow-hidden">
          {revealed && image ? (
            <div
              className="w-full h-full flex items-center justify-center p-[8%]"
              style={{
                backgroundColor: '#f6c44780',
                borderRadius: '3.40282e38px',
              }}
            >
              <img
                src={image}
                alt={categoryName || ''}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-transparent rounded-full" />
          )}
        </div>
      </div>

      {/* Category name below circle */}
      {revealed && categoryName && (
        <span
          className="mt-1 text-center text-[clamp(6px,1.8vw,9px)] font-semibold uppercase leading-tight tracking-wide drop-shadow-md px-1 max-w-[min(29vw,125px)]"
          style={{
            backgroundColor: '#f6c44780',
            borderRadius: '3.40282e38px',
            padding: '2px 6px',
            color: '#1f1f31a3',
            fontSize: '8px',
          }}
        >
          {categoryName}
        </span>
      )}
    </div>
  );
}
