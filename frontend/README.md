# ChainPlay Arcade
Fair on-chain mini‑games with staking, transaction bundling, and real-time leaderboards.

![ChainPlay Arcade Overview](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pcJQU2gh06acWgmn3tYOqJ85r8ZBH8.png)

## Overview
ChainPlay Arcade is a decentralized arcade where players stake, play, and compete in short AI-driven mini‑games. Tournaments run on timers (e.g., 6h/24h), accumulate a prize pool, and pay out automatically at event end. The current repository ships the full UI with wallet connection, routing, and state management wired up using dummy data so you can iterate quickly on gameplay and contracts.

- Player experience: connect wallet → browse tournaments → join with stake → play mini-games → track live leaderboard → claim rewards when event ends.
- Admin experience: configure tournaments (game, entry fee, duration, prize distribution), monitor status, and manage start/pause/end.

## Features
- Wallet Connect via WalletConnect (ConnectKit + wagmi)
- Player Dashboard with ongoing/upcoming tournaments
- Tournament Details with stake/join actions
- Game screens for AI mini‑games (Tic‑Tac‑Toe, Simon Says, Memory Match, Number Guess)
- Live Leaderboard UI
- Results view with payout visualization
- Admin-only routes: dashboard, create/configure, manage tournaments
- State management: Zustand (global UI/app state) + React Query (data fetching/cache)
- TypeScript + Next.js App Router + Tailwind CSS

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- wagmi + ConnectKit (WalletConnect)
- Zustand + @tanstack/react-query
- Shadcn UI primitives and Recharts where applicable

## Architecture (high level)
- Frontend: Next.js App Router pages for player/admin flows
- State: Zustand for local app/UI state, React Query for server-like data
- Contracts/Backend: Not included yet; dummy data simulates tournaments and leaderboards
- Future: Smart contracts for staking/payouts + per-game backends that validate results and submit final leaderboard on-chain

## Routing
- / – Home / Player Dashboard
- /tournaments – List of tournaments
- /tournaments/[id] – Tournament details
- /game/[gameType] – Game screen (e.g., tictactoe, simon, memory, number-guess)
- /leaderboard – Global leaderboard view
- /profile – Player profile
- /admin – Admin dashboard (restricted)
- /admin/tournaments – Manage tournaments
- /admin/tournaments/create – Create/configure tournament

Admin access is restricted to wallet address:
0x3fAF296E25FBD26776c7E414BF2995B21324b0F0

## Getting Started (Local)
Prerequisites:
- Node.js ≥ 18
- npm (or pnpm/yarn)
- A WalletConnect Project ID

1) Install dependencies
- npm install

2) Environment variables
Create a .env.local in the project root:
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

How to get the Project ID:
- Visit https://cloud.walletconnect.com
- Create/sign in → New Project → copy “Project ID”

3) Run the app
- npm run dev
- Open http://localhost:3000

4) Connect your wallet
- Click “Connect Wallet” (ConnectKit modal)
- Choose a wallet and approve

## Version Compatibility Note
ConnectKit@1.x currently declares peer support for React 17/18. If you see an npm ERESOLVE conflict with React 19:
- Recommended: use React 18 + Next 14 in this project for full compatibility.
- Temporary workaround: npm install --legacy-peer-deps (not recommended for long-term).

## State Management
- Zustand stores UI/app state (e.g., filters, selected tournament, game UI state)
- React Query fetches and caches data from placeholder endpoints/dummy data, making it easy to swap in contract/API calls later

## Theming and UI
- Light, modern look with clean cards and accessible contrast
- Tailwind CSS with semantic tokens and consistent spacing
- Components designed for progressive enhancement (mobile-first)

## Admin Access
- Admin routes check the connected wallet address
- Default admin: 0x3fAF296E25FBD26776c7E414BF2995B21324b0F0
- To change admin behavior, update the admin checker hook or config

## Roadmap
- Integrate smart contracts for staking and payouts
- Real-time leaderboard syncing from gameplay backends
- Sponsored prize pools, Chainlink VRF for randomness, zk‑proofs for proof‑of‑play
- Open API for community-built games

## Scripts
- npm run dev – Start local dev server
- npm run build – Build for production
- npm start – Start production server (after build)
- npm run lint – Lint code

## License
MIT – see LICENSE file if present.
