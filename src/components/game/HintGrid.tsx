import HintCircle from './HintCircle';

interface Hint {
  image?: string;
  categoryName?: string;
  revealed: boolean;
}

interface HintGridProps {
  hints: Hint[][];
  onHintClick?: (row: number, col: number) => void;
}

const rowColors: ('pink' | 'blue' | 'green')[] = ['pink', 'blue', 'green'];

export default function HintGrid({ hints, onHintClick }: HintGridProps) {
  return (
    <div className="flex flex-col gap-[min(0.7vw,14px)] w-full mb-[30px]">
      {hints.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((hint, colIndex) => (
            <div
              key={colIndex}
              className={colIndex === 1 ? '-mx-[calc(min(29vw,125px)*0.1)] z-10' : ''}
            >
              <HintCircle
                image={hint.image}
                categoryName={hint.categoryName}
                revealed={hint.revealed}
                rowColor={rowColors[rowIndex]}
                onClick={() => onHintClick?.(rowIndex, colIndex)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
