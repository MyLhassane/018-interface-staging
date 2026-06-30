import { useState, useRef, useEffect } from 'react';

interface Player {
  id: number;
  f: string;
  g: string;
}

interface GuessInputProps {
  players: Player[];
  onGuess: (playerId: number, playerName: string) => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export default function GuessInput({ players, onGuess, onSkip, disabled = false }: GuessInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = players.filter(
        (p) =>
          p.f.toLowerCase().includes(query.toLowerCase()) ||
          p.g.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, players]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (player: Player) => {
    const fullName = `${player.g} ${player.f}`.trim();
    onGuess(player.id, fullName);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-[min(80vw,360px)]">
      {/* Name bar matching reference design */}
      <div
        className="flex items-center justify-between gap-2 rounded-md"
        style={{
          border: '2px dashed #c9a84c',
          background: 'linear-gradient(180deg, #f5e6b8 0%, #e8d49a 100%)',
          padding: 'min(2.5vw, 12px) min(4vw, 16px)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="اكتب اسم اللاعب..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-[clamp(11px,3.5vw,15px)] font-bold tracking-wider uppercase text-[#333] placeholder-[#666] min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
          dir="rtl"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="text-[#666] hover:text-[#333] flex-shrink-0"
          >
            <svg className="w-[clamp(14px,4vw,18px)] h-[clamp(14px,4vw,18px)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : onSkip ? (
          <button
            onClick={onSkip}
            className="flex items-center gap-1 flex-shrink-0 text-[clamp(9px,2.5vw,11px)] font-semibold uppercase tracking-wider text-[#666] hover:text-[#333]"
          >
            SKIP
            <svg
              className="w-[clamp(14px,4vw,18px)] h-[clamp(14px,4vw,18px)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8l4 4-4 4" />
              <path d="M8 12h8" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gold/30 rounded-md shadow-lg z-50 overflow-hidden">
          {suggestions.map((player) => (
            <button
              key={player.id}
              onClick={() => handleSelect(player)}
              className="w-full px-4 py-3 text-right hover:bg-gold/10 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span className="block text-sm font-medium text-gray-800">{player.g} {player.f}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
