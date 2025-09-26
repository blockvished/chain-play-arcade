import type { Tournament, Player } from "./store"

export const dummyTournaments: Tournament[] = [
  {
    id: "1",
    name: "Tic-Tac-Toe Championship",
    gameType: "tic-tac-toe",
    entryFee: "0.01",
    prizePool: "0.5",
    duration: 6,
    maxPlayers: 100,
    currentPlayers: 67,
    status: "active",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    rules: "Best of 3 games against AI. Higher difficulty = more points.",
    difficulty: "medium",
  },
  {
    id: "2",
    name: "Simon Says Speed Run",
    gameType: "simon-says",
    entryFee: "0.005",
    prizePool: "0.25",
    duration: 24,
    maxPlayers: 200,
    currentPlayers: 143,
    status: "active",
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
    rules: "Complete as many sequences as possible. Speed and accuracy matter.",
    difficulty: "hard",
  },
  {
    id: "3",
    name: "Memory Master",
    gameType: "memory-match",
    entryFee: "0.02",
    prizePool: "1.2",
    duration: 6,
    maxPlayers: 50,
    currentPlayers: 12,
    status: "upcoming",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    rules: "Match pairs in minimum moves. Bonus points for speed.",
    difficulty: "easy",
  },
  {
    id: "4",
    name: "Number Guessing Elite",
    gameType: "number-guess",
    entryFee: "0.015",
    prizePool: "0.8",
    duration: 12,
    maxPlayers: 75,
    currentPlayers: 75,
    status: "ended",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    endTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    rules: "Guess the number in minimum attempts. Strategic thinking required.",
    difficulty: "medium",
  },
]

export const dummyLeaderboard: Player[] = [
  {
    address: "0x1234...5678",
    username: "GameMaster",
    score: 2450,
    rank: 1,
    gamesPlayed: 23,
    totalWinnings: "0.85",
  },
  {
    address: "0x2345...6789",
    username: "AISlayer",
    score: 2380,
    rank: 2,
    gamesPlayed: 19,
    totalWinnings: "0.72",
  },
  {
    address: "0x3456...7890",
    username: "ChainChamp",
    score: 2290,
    rank: 3,
    gamesPlayed: 31,
    totalWinnings: "0.68",
  },
  {
    address: "0x4567...8901",
    username: "CryptoGamer",
    score: 2180,
    rank: 4,
    gamesPlayed: 15,
    totalWinnings: "0.54",
  },
  {
    address: "0x5678...9012",
    username: "BlockBuster",
    score: 2050,
    rank: 5,
    gamesPlayed: 27,
    totalWinnings: "0.43",
  },
]
