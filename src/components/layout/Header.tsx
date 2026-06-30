import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Home', labelAr: 'الرئيسية' },
  { path: '/game', label: 'Game', labelAr: 'اللعبة' },
  { path: '/rooms', label: 'Rooms', labelAr: 'الغرف' },
  { path: '/leaderboard', label: 'Leaderboard', labelAr: 'المتصدرين' },
  { path: '/profile', label: 'Profile', labelAr: 'الملف الشخصي' },
  { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="relative w-full bg-bg-dark/80 backdrop-blur-sm border-b border-gold/20 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gold">El Phenomeno</span>
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <nav className="absolute right-0 top-full mt-1 w-56 bg-bg-dark border border-gold/30 rounded-lg shadow-xl z-50 overflow-hidden">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-right transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gold/20 text-gold'
                    : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
                }`}
              >
                <span className="block text-sm">{item.labelAr}</span>
                <span className="block text-xs text-gray-500">{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
