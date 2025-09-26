import { create } from "zustand"
import { devtools } from "zustand/middleware"

// Tournament types
export interface Tournament {
  id: string
  name: string
  gameType: "tic-tac-toe" | "simon-says" | "memory-match" | "number-guess"
  entryFee: string
  prizePool: string
  duration: number // in hours
  maxPlayers: number
  currentPlayers: number
  status: "upcoming" | "active" | "ended"
  startTime: Date
  endTime: Date
  rules: string
  difficulty: "easy" | "medium" | "hard"
}

export interface Player {
  address: string
  username?: string
  score: number
  rank: number
  gamesPlayed: number
  totalWinnings: string
}

export interface GameSession {
  tournamentId: string
  playerId: string
  gameType: string
  score: number
  completed: boolean
  timestamp: Date
}

// Store interfaces
interface TournamentStore {
  tournaments: Tournament[]
  activeTournament: Tournament | null
  leaderboard: Player[]
  userStats: Player | null
  setTournaments: (tournaments: Tournament[]) => void
  setActiveTournament: (tournament: Tournament | null) => void
  setLeaderboard: (leaderboard: Player[]) => void
  setUserStats: (stats: Player | null) => void
  joinTournament: (tournamentId: string) => void
  updateScore: (tournamentId: string, score: number) => void
}

interface UIStore {
  sidebarOpen: boolean
  currentPage: string
  gameInProgress: boolean
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
  setGameInProgress: (inProgress: boolean) => void
}

// Tournament store
export const useTournamentStore = create<TournamentStore>()(
  devtools(
    (set, get) => ({
      tournaments: [],
      activeTournament: null,
      leaderboard: [],
      userStats: null,
      setTournaments: (tournaments) => set({ tournaments }),
      setActiveTournament: (tournament) => set({ activeTournament: tournament }),
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      setUserStats: (stats) => set({ userStats: stats }),
      joinTournament: (tournamentId) => {
        const tournaments = get().tournaments
        const tournament = tournaments.find((t) => t.id === tournamentId)
        if (tournament && tournament.currentPlayers < tournament.maxPlayers) {
          const updatedTournaments = tournaments.map((t) =>
            t.id === tournamentId ? { ...t, currentPlayers: t.currentPlayers + 1 } : t,
          )
          set({ tournaments: updatedTournaments })
        }
      },
      updateScore: (tournamentId, score) => {
        // Update leaderboard logic would go here
        console.log(`Updating score for tournament ${tournamentId}: ${score}`)
      },
    }),
    { name: "tournament-store" },
  ),
)

// UI store
export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      currentPage: "dashboard",
      gameInProgress: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setGameInProgress: (inProgress) => set({ gameInProgress: inProgress }),
    }),
    { name: "ui-store" },
  ),
)

// Admin wallet address
export const ADMIN_WALLET = "0x3fAF296E25FBD26776c7E414BF2995B21324b0F0"
