# AGENTS.md - El Phenomeno Interface (STAGING)

## ⚠️ CRITICAL RULES

### Human in the Loop
- **NEVER push to GitHub without explicit user request**
- **NEVER deploy to Vercel without explicit user request**
- **The user is the final decision maker - always wait for approval**
- **We are in development mode - do NOT deploy unless told explicitly**

## Project Structure

### Production (Partners See This)
| Location | Path |
|----------|------|
| Local | `/Users/hassan/01_Workspaces/dev/active/017-fifa_world_cup_2026/elphenomeno` |
| GitHub | `MyLhassane/elphenomeno` |
| Vercel | `elphenomeno.vercel.app` |

### Staging (Testing Only) - THIS IS STAGING
| Location | Path |
|----------|------|
| Local | `/Users/hassan/01_Workspaces/dev/active/018-elphenomeno/elphenomeno-interface-staging` |
| GitHub | `MyLhassane/018-interface-staging` |
| Vercel | `elphenomeno-interface-staging.vercel.app` |

### Challenges Repos
| Environment | GitHub |
|-------------|--------|
| Production | `MyLhassane/fifa2026-challenges` |
| Staging | `MyLhassane/fifa2026-challenges-staging` |

## Tech Stack
- React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Firebase RTDB
- Deploy: Vercel (direct deploy, not GitHub integration)
- Firebase: `fifa-world-cup-2026-7d608`

## Current State (2026-06-30)

### Completed
- ✅ Fulfilled from production (game components, layout, routing)
- ✅ 5 Game Cards on Home page (Phenomenon Connections, Factor, Decode R9, Impostor, Grid)
- ✅ Game routing for 5 modes (`/game/connections`, `/game/factor`, etc.)
- ✅ Phenomenon Connections game logic (useGame hook rewritten)
- ✅ Category grid selection UI (3x3 grid)
- ✅ Timer and scoring system (100pts + speed bonus + streak)
- ✅ GitHub API integration for challenges (`src/api/challenges.ts`)
- ✅ Deployed to Vercel

### In Progress - Bug Fixes
- 🐛 **Same game in all 5 cards** - All cards link to same game
- 🐛 **Images don't show** - Player/category images not loading
- 🐛 **Image alt flickers** - Alt text appears/disappears quickly
- 🐛 **Design mismatch** - Blue gradient doesn't match original gold/dark theme

### Pending
- ⏳ Fix Home page colors to match original design (gold/dark)
- ⏳ Fix Game page to preserve original design
- ⏳ Implement remaining 4 games (Factor, Decode R9, Impostor, Grid)
- ⏳ Streak tracking
- ⏳ Share functionality

## Important Notes

### This is STAGING
- This version is for testing only
- Partners do NOT see this
- Safe to experiment and break things

## 5-Game Experiment Plan

### Game 1: Phenomenon Connections (Implemented ✅)
- **Mechanic:** 3x3 grid of categories, assign each player to correct category
- **Data:** Uses `v: number[]` from player data as answer key
- **Timer:** 30 seconds per player
- **Scoring:** +100 correct, +10/sec speed bonus, +50 streak, -25 wrong
- **Files:** `src/hooks/useGame.ts`, `src/pages/Game.tsx`, `src/pages/Home.tsx`

### Game 2: The Phenomenon Factor
- **Mechanic:** Discover hidden traits that make each player special
- **Traits:** Speed, Skill, Power, Vision, Clutch, Longevity, Trophy, Goal, Defender
- **Status:** ⏳ Pending

### Game 3: Decode the R9
- **Mechanic:** 9 progressive clues (hard→easy) to identify mystery player
- **Clues:** Position → Nationality → League → Era → Club tier → Club → Achievement → Nickname → Full reveal
- **Status:** ⏳ Pending

### Game 4: Impostor: World Cup Edition
- **Mechanic:** 6 players claim a category, 5 are real, 1 is impostor
- **Scoring:** Fewer taps = more points
- **Status:** ⏳ Pending

### Game 5: Grid Challenge
- **Mechanic:** Complete the football grid puzzle
- **Status:** ⏳ Pending

## Game Logic (Phenomenon Connections) - Details
- **Board:** 3x3 grid of category icons (remit items)
- **Player:** One player appears at a time with image and name
- **Task:** Assign each player to one of the 9 categories
- **Win:** Complete all assignments correctly
- **Shareable:** Emoji grid shows progress without spoilers

## Fixes Applied (2026-06-30)
- ✅ `types/index.ts`: Added `GameType`, `DecodeClue`, `ImpostorConfig`, `GridConfig`; extended `Challenge` with `gameType` and optional configs
- ✅ `api/challenges.ts`: `fetchLatestChallenge()` now fetches from new path `elphenomeno/challenges/{gameType}/` — iterates game-specific index, returns latest match. Legacy `challenges/` path still supported for `fetchLatestLegacyChallenge()`.
- ✅ `pages/Game.tsx`: Uses `gameType` prop (no longer `_gameType`) when calling `fetchLatestChallenge(gameType)`

## Deployment
```bash
git push origin main
vercel --prod --yes
# Live at: https://elphenomeno-interface-staging.vercel.app
```

## Resources
- **GitHub:** https://github.com/MyLhassane/018-interface-staging
- **Vercel:** https://elphenomeno-interface-staging.vercel.app
- **Firebase:** https://console.firebase.google.com/project/fifa-world-cup-2026-7d608
