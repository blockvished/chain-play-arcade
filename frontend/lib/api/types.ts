// API Types for Game Integration

export interface GameMoveRequest {
  row: number
  col: number
}

export interface GameMoveResponse {
  success: boolean
  game?: {
    id: string
    board: string[][]
    status: "playing" | "won" | "lost" | "draw"
    winner: "X" | "O" | null
    gameStartTime: string
    gameEndTime?: string
    moveCount: number
    aiMove: {
      row: number
      col: number
    }
    message: string
    points: {
      totalPoints: number
      breakdown: {
        base: number
        speed: number
        efficiency: number
        time: number
      }
    }
    turnLog: Array<{
      human_choice: { row: number; col: number }
      ai_move: { row: number; col: number }
      deleting_cell: { row: number; col: number } | null
    }>
  }
  error?: string
}

export interface GameInitRequest {
  gameId: string
  gameType: string
  tournamentId?: string
}

export interface GameInitResponse {
  success: boolean
  gameId: string
  message?: string
  error?: string
}