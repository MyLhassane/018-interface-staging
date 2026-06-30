# AGENTS.md - El Phenomeno Interface (STAGING)

## ⚠️ CRITICAL RULES

### Human in the Loop
- **NEVER push to GitHub without explicit user request**
- **NEVER deploy to Vercel without explicit user request**
- **The user is the final decision maker - always wait for approval**

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

### In Progress
- 🔄 Testing Phenomenon Connections with real data
- 🔄 Verifying game data from challenges-staging repo

### Pending
- ⏳ Implement remaining 4 games (Factor, Decode R9, Impostor, Grid)
- ⏳ Home page styling
- ⏳ Streak tracking
- ⏳ Share functionality

## Important Notes

### This is STAGING
- This version is for testing only
- Partners do NOT see this
- Safe to experiment and break things

### Game Logic (Phenomenon Connections)
- Players are presented with a 3x3 grid of categories
- Must identify which player connects to which category
- Uses `v: number[]` from player data as answer key
- Timer: 30 seconds per player
- Scoring: +100 correct, +10/sec speed bonus, +50 streak, -25 wrong

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
