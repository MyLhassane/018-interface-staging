// Member Tiers
export type MemberTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'exceptional';

// User Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  tier: MemberTier;
  points: number;
  level: number;
  createdAt: number;
  lastLoginAt: number;
  stats: UserStats;
  achievements: string[];
  settings: UserSettings;
}

export interface UserStats {
  gamesPlayed: number;
  gamesCompleted: number;
  correctGuesses: number;
  incorrectGuesses: number;
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number;
  averageTimePerGuess: number;
}

export interface UserSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  soundEffects: boolean;
  hapticFeedback: boolean;
}

// Game Types
export interface GameState {
  userId: string;
  challengeId: number;
  startedAt: number;
  guesses: Guess[];
  hintsRevealed: number[];
  timer: TimerState;
  status: 'playing' | 'completed' | 'abandoned';
}

export interface Guess {
  playerId: number;
  playerName: string;
  timestamp: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface TimerState {
  timeElapsed: number;
  isRunning: boolean;
  timePerGuess: number;
}

// Challenge Types
export interface Challenge {
  gameNumber: number;
  remit: RemitItem[][];
  players: ChallengePlayer[];
  publishedAt: string | null;
}

export interface RemitItem {
  id: number;
  name: string;
  type: number;
  displayName: string;
}

export interface ChallengePlayer {
  id: number;
  f: string;
  g: string;
  v: number[];
  p: string;
  image?: string;
}

// Player Types
export interface Player {
  id: number;
  f: string;
  g: string;
  positions: string[];
  categoryLinks: Record<string, number[]>;
  challengeCount: number;
  difficulty?: string;
  image?: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  hostId: string;
  hostName: string;
  status: 'waiting' | 'playing' | 'completed';
  maxPlayers: number;
  currentPlayers: Record<string, RoomPlayer>;
  gameState: RoomGameState;
  settings: RoomSettings;
  chat: Record<string, ChatMessage>;
}

export interface RoomPlayer {
  uid: string;
  displayName: string;
  photoURL: string | null;
  joinedAt: number;
  isReady: boolean;
}

export interface RoomGameState {
  challengeId: number;
  currentTurn: string;
  hintsRevealed: number[];
  guesses: Record<string, Guess[]>;
  result?: RoomResult;
}

export interface RoomSettings {
  timePerGuess: number;
  maxHints: number;
  allowSpectators: boolean;
}

export interface RoomResult {
  winner: string;
  scores: Record<string, number>;
}

export interface ChatMessage {
  uid: string;
  displayName: string;
  message: string;
  timestamp: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: 'game' | 'streak' | 'social' | 'special';
  requirement: AchievementRequirement;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementRequirement {
  type: 'games_played' | 'games_completed' | 'streak' | 'points' | 'speed' | 'accuracy';
  value: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string | null;
  totalPoints: number;
  level: number;
  tier: MemberTier;
  gamesPlayed: number;
  rank: number;
  lastUpdated: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
