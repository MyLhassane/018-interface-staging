# El Phenomeno - FIFA World Cup 2026

A modern web game where players guess football players through visual hints. Supports single-player and multiplayer room modes.

## Features

- Wordle-style player guessing game
- Real-time multiplayer rooms
- Google Sign-In authentication
- Offline-first architecture
- Mobile-first responsive design

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- Firebase RTDB
- React Router DOM

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.local` file:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route components
├── types/          # TypeScript types
├── lib/            # Utilities and services
├── hooks/          # Custom React hooks
├── contexts/       # React contexts
└── router.tsx      # Route configuration
```

## License

Private - Zero Seventeen
