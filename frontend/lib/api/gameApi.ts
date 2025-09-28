// Game API service for handling game moves and AI responses
import { GameMoveRequest, GameMoveResponse, GameInitRequest, GameInitResponse } from "./types"

const API_BASE_URL = "https://chain-play-arcade.onrender.com"

class GameApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Initialize a new game session
   */
  async initializeGame(gameId: string, gameType: string, tournamentId?: string): Promise<GameInitResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/games/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          gameType,
          tournamentId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to initialize game:", error)
      return {
        success: false,
        gameId,
        error: error instanceof Error ? error.message : "Failed to initialize game",
      }
    }
  }

  /**
   * Send player move and get AI response
   */
  async makeMove(gameId: string, row: number, col: number): Promise<GameMoveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tictac/play?gameId=${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          row,
          col,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to make move:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to make move",
      }
    }
  }

  /**
   * Get game status
   */
  async getGameStatus(gameId: string): Promise<GameMoveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/games/status/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to get game status:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get game status",
      }
    }
  }

  /**
   * End game session
   */
  async endGame(gameId: string, finalScore: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/games/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          finalScore,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to end game:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to end game",
      }
    }
  }
}

// Export singleton instance
export const gameApiService = new GameApiService()

// Export utility functions for converting between board representations
export const boardUtils = {
  /**
   * Convert 1D array index to 2D coordinates (row, col)
   */
  indexToCoords(index: number, cols: number = 4): { row: number; col: number } {
    return {
      row: Math.floor(index / cols),
      col: index % cols,
    }
  },

  /**
   * Convert 2D coordinates to 1D array index
   */
  coordsToIndex(row: number, col: number, cols: number = 4): number {
    return row * cols + col
  },

  /**
   * Convert 2D board array to 1D array for UI display
   */
  board2DTo1D(board2D: string[][]): ("X" | "O" | null)[] {
    const board1D: ("X" | "O" | null)[] = []
    for (let row = 0; row < board2D.length; row++) {
      for (let col = 0; col < board2D[row].length; col++) {
        const cell = board2D[row][col]
        board1D.push(cell === "X" ? "X" : cell === "O" ? "O" : null)
      }
    }
    return board1D
  },

  /**
   * Convert 1D array to 2D board array
   */
  board1DTo2D(board1D: ("X" | "O" | null)[], rows: number = 4, cols: number = 4): string[][] {
    const board2D: string[][] = []
    for (let row = 0; row < rows; row++) {
      const rowArray: string[] = []
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const cell = board1D[index]
        rowArray.push(cell === "X" ? "X" : cell === "O" ? "O" : "")
      }
      board2D.push(rowArray)
    }
    return board2D
  },
}
