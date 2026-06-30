import type { Challenge } from "@/types";

const REPO_OWNER = "MyLhassane";
const REPO = import.meta.env.VITE_CHALLENGES_REPO || "fifa2026-challenges";
const BASE_URL_OLD = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO}/main/challenges`;
const BASE_URL_GAME = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO}/main/elphenomeno/challenges`;

// === Legacy: flat challenges (old system, no gameType) ===

interface ChallengeIndex {
  version: number;
  updatedAt: string;
  challenges: number[];
}

let cachedIndex: ChallengeIndex | null = null;
let cachedChallenges: Map<number, Challenge> = new Map();

export async function fetchChallengeIndex(): Promise<ChallengeIndex> {
  if (cachedIndex) return cachedIndex;
  try {
    const response = await fetch(`${BASE_URL_OLD}/index.json`);
    if (!response.ok) throw new Error(`Failed to fetch index: ${response.status}`);
    const data: ChallengeIndex = await response.json();
    cachedIndex = data;
    return data;
  } catch (error) {
    console.error("Error fetching challenge index:", error);
    throw error;
  }
}

export async function fetchChallenge(gameNumber: number): Promise<Challenge | null> {
  if (cachedChallenges.has(gameNumber)) {
    return cachedChallenges.get(gameNumber)!;
  }
  try {
    const response = await fetch(`${BASE_URL_OLD}/${gameNumber}.json`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch challenge ${gameNumber}: ${response.status}`);
    }
    const data: Challenge = await response.json();
    cachedChallenges.set(gameNumber, data);
    return data;
  } catch (error) {
    console.error(`Error fetching challenge ${gameNumber}:`, error);
    throw error;
  }
}

export async function fetchLatestLegacyChallenge(): Promise<Challenge | null> {
  try {
    const index = await fetchChallengeIndex();
    if (index.challenges.length === 0) return null;
    const latestNumber = Math.max(...index.challenges);
    return await fetchChallenge(latestNumber);
  } catch (error) {
    console.error("Error fetching latest challenge:", error);
    throw error;
  }
}

// === Game-specific: elphenomeno/challenges/{gameType}/ ===

interface GameIndex {
  version: number;
  updatedAt: string;
  challenges: number[];
}

export async function fetchGameIndex(gameType: string): Promise<GameIndex | null> {
  try {
    const response = await fetch(`${BASE_URL_GAME}/${gameType}/index.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchGameChallenge(gameType: string, gameNumber: number): Promise<Challenge | null> {
  try {
    const response = await fetch(`${BASE_URL_GAME}/${gameType}/${gameNumber}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchLatestChallenge(gameType?: string): Promise<Challenge | null> {
  if (!gameType) {
    return fetchLatestLegacyChallenge();
  }
  try {
    const index = await fetchGameIndex(gameType);
    if (!index || index.challenges.length === 0) return null;
    const latestNumber = Math.max(...index.challenges);
    return await fetchGameChallenge(gameType, latestNumber);
  } catch (error) {
    console.error(`Error fetching latest ${gameType} challenge:`, error);
    return null;
  }
}

export async function fetchAllChallenges(): Promise<Challenge[]> {
  try {
    const index = await fetchChallengeIndex();
    const challenges: Challenge[] = [];
    for (const gameNumber of index.challenges) {
      const challenge = await fetchChallenge(gameNumber);
      if (challenge) challenges.push(challenge);
    }
    return challenges.sort((a, b) => b.gameNumber - a.gameNumber);
  } catch (error) {
    console.error("Error fetching all challenges:", error);
    throw error;
  }
}

export function clearCache(): void {
  cachedIndex = null;
  cachedChallenges.clear();
}

export function getAvailableGameNumbers(): number[] {
  return cachedIndex?.challenges ?? [];
}
