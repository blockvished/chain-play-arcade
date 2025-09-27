import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { GameEvent } from "@/lib/contracts/GameHubABI"

export interface GameEventTournament {
  id: string
  active: boolean
  eventName: string
  startTime: Date
  endTime: Date
  eventId: number
  referencedGameId: string
  durationMinutes: number
  minStakeAmt: string
  pooledAmt: string
  scoresFinalized: boolean
  playersCount: number
  winnersCount: number
  joined?: boolean
}

export interface Tournament {
  id: string
  name: string
  gameType: string
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
  gameEvents: GameEventTournament[]
  activeTournament: Tournament | null
  leaderboard: Player[]
  userStats: Player | null
  isLoading: boolean
  error: string | null
  setTournaments: (tournaments: Tournament[]) => void
  setGameEvents: (events: GameEventTournament[]) => void
  setActiveTournament: (tournament: Tournament | null) => void
  setLeaderboard: (leaderboard: Player[]) => void
  setUserStats: (stats: Player | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  joinTournament: (tournamentId: string) => void
  updateJoinedStatus: (tournamentId: string, joined: boolean) => void
  updateScore: (tournamentId: string, score: number) => void
  getAllGames: () => (Tournament | GameEventTournament)[]
}

interface UIStore {
  sidebarOpen: boolean
  currentPage: string
  gameInProgress: boolean
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
  setGameInProgress: (inProgress: boolean) => void
}

export const useTournamentStore = create<TournamentStore>()(
  devtools(
    (set, get) => ({
      tournaments: [],
      gameEvents: [],
      activeTournament: null,
      leaderboard: [],
      userStats: null,
      isLoading: false,
      error: null,
      setTournaments: (tournaments) => set({ tournaments }),
      setGameEvents: (events) => set({ gameEvents: events }),
      setActiveTournament: (tournament) => set({ activeTournament: tournament }),
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      setUserStats: (stats) => set({ userStats: stats }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      joinTournament: (tournamentId) => {
        const { tournaments, gameEvents } = get()
        const allGames = [...tournaments, ...gameEvents]
        const tournament = allGames.find((t) => t.id === tournamentId)
        if (tournament && (!('maxPlayers' in tournament) || ('currentPlayers' in tournament ? tournament.currentPlayers : 0) < tournament.maxPlayers)) {
          if ('playersCount' in tournament) {
            const updatedEvents = gameEvents.map((t) =>
              t.id === tournamentId ? { ...t, playersCount: t.playersCount + 1, joined: true } : t,
            )
            set({ gameEvents: updatedEvents })
          } else {
            const updatedTournaments = tournaments.map((t) =>
              t.id === tournamentId ? { ...t, currentPlayers: t.currentPlayers + 1 } : t,
            )
            set({ tournaments: updatedTournaments })
          }
        }
      },
      updateJoinedStatus: (tournamentId, joined) => {
        const { tournaments, gameEvents } = get()
        const allGames = [...tournaments, ...gameEvents]
        const tournament = allGames.find((t) => t.id === tournamentId)
        if (tournament && 'playersCount' in tournament) {
          const updatedEvents = gameEvents.map((t) =>
            t.id === tournamentId ? { ...t, joined } : t,
          )
          set({ gameEvents: updatedEvents })
        }
      },
      updateScore: (tournamentId, score) => {
        console.log(`Updating score for tournament ${tournamentId}: ${score}`)
      },
      getAllGames: () => {
        const { tournaments, gameEvents } = get()
        return [...tournaments, ...gameEvents]
      },
    }),
    { name: "tournament-store" },
  ),
)

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
