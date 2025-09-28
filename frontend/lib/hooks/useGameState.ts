"use client"

import { useState, useCallback, useEffect } from "react"
import { useGameApi, boardUtils } from "@/lib/hooks/useGameApi"

type Player = "X" | "O" | null
type Board = Player[]
type GameStatus = "playing" | "won" | "lost" | "draw"
type Move = { player: Player; index: number; moveNumber: number }

export interface GameState {
  board: Board
  isPlayerTurn: boolean
  gameStatus: GameStatus
  score: number
  gamesPlayed: number
  moveHistory: Move[]
  totalMoves: number
  gameId: string
  isOnline: boolean
  isInitialized: boolean
}

export interface GameActions {
  initializeGame: (tournamentId?: string) => Promise<void>
  makePlayerMove: (index: number) => Promise<void>
  resetGame: () => void
  endGame: (finalScore: number) => Promise<void>
}

export const useGameState = (
  onScoreUpdate: (score: number) => void,
  onGameEnd: (won: boolean) => void
): GameState & GameActions => {
  // Local game state
  const [board, setBoard] = useState<Board>(Array(16).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [totalMoves, setTotalMoves] = useState(0)
  const [gameId, setGameId] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // API integration
  const { 
    isLoading, 
    error, 
    isConnected, 
    initializeGame: apiInitializeGame, 
    makeMove: apiMakeMove, 
    endGame: apiEndGame 
  } = useGameApi()

  // Generate unique game ID
  const generateGameId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }, [])

  // Initialize game
  const initializeGame = useCallback(async (tournamentId?: string) => {
    const newGameId = generateGameId()
    setGameId(newGameId)
    
    try {
      const response = await apiInitializeGame(newGameId, "tic-tac-toe", tournamentId)
      if (response.success) {
        setIsInitialized(true)
        console.log("Game initialized successfully:", response.message)
      } else {
        console.error("Failed to initialize game:", response.error)
        // Fall back to offline mode
        setIsInitialized(true)
      }
    } catch (error) {
      console.error("Error initializing game:", error)
      // Fall back to offline mode
      setIsInitialized(true)
    }
  }, [apiInitializeGame, generateGameId])

  // Remove oldest move (for 5th move rule)
  const removeOldestMove = useCallback((
    currentBoard: Board, 
    currentHistory: Move[]
  ): { board: Board; history: Move[] } => {
    if (currentHistory.length === 0) return { board: currentBoard, history: currentHistory }
    
    const oldestMoveIndex = currentHistory.findIndex(move => 
      move.moveNumber === Math.min(...currentHistory.map(m => m.moveNumber))
    )
    
    if (oldestMoveIndex === -1) return { board: currentBoard, history: currentHistory }
    
    const oldestMove = currentHistory[oldestMoveIndex]
    const newBoard = [...currentBoard]
    newBoard[oldestMove.index] = null
    
    const newHistory = currentHistory.filter((_, index) => index !== oldestMoveIndex)
    
    return { board: newBoard, history: newHistory }
  }, [])

  // Make player move
  const makePlayerMove = useCallback(async (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== "playing") return

    const newMoveNumber = totalMoves + 1
    const newMove: Move = { player: "X", index, moveNumber: newMoveNumber }
    const newHistory = [...moveHistory, newMove]
    
    let newBoard = [...board]
    newBoard[index] = "X"
    
    // Check if this is the 5th move (or multiple of 5)
    if (newMoveNumber % 5 === 0) {
      const { board: boardAfterRemoval, history: historyAfterRemoval } = removeOldestMove(newBoard, newHistory)
      newBoard = boardAfterRemoval
      newHistory.splice(0, newHistory.length, ...historyAfterRemoval)
    }
    
    setBoard(newBoard)
    setMoveHistory(newHistory)
    setTotalMoves(newMoveNumber)
    setIsPlayerTurn(false)

    // Check for immediate win
    const winner = checkWinner(newBoard)
    if (winner === "X") {
      setGameStatus("won")
      const newScore = score + 100
      setScore(newScore)
      onScoreUpdate(newScore)
      onGameEnd(true)
      return
    }

    if (isBoardFull(newBoard)) {
      setGameStatus("draw")
      const newScore = score + 25
      setScore(newScore)
      onScoreUpdate(newScore)
      return
    }

    // If connected to API, send move and get AI response
    if (isConnected && isInitialized) {
      try {
        const { row, col } = boardUtils.indexToCoords(index)
        const moveData = {
          gameId,
          playerMove: { row, col, player: "X" as const },
          board: boardUtils.board1DTo2D(newBoard),
          moveNumber: newMoveNumber,
        }

        const response = await apiMakeMove(gameId, row, col)
        if (response.success && response.game?.aiMove) {
          // Apply AI move
          const aiIndex = boardUtils.coordsToIndex(response.game.aiMove.row, response.game.aiMove.col)
          const aiMove: Move = { player: "O", index: aiIndex, moveNumber: newMoveNumber + 1 }
          const aiHistory = [...newHistory, aiMove]
          
          let aiBoard = response.game?.board ? boardUtils.board2DTo1D(response.game.board) : newBoard
          aiBoard[aiIndex] = "O"
          
          // Check if AI move triggers 5th move removal
          if ((newMoveNumber + 1) % 5 === 0) {
            const { board: boardAfterRemoval, history: historyAfterRemoval } = removeOldestMove(aiBoard, aiHistory)
            aiBoard = boardAfterRemoval
            aiHistory.splice(0, aiHistory.length, ...historyAfterRemoval)
          }
          
          setBoard(aiBoard)
          setMoveHistory(aiHistory)
          setTotalMoves(newMoveNumber + 1)

          // Check for AI win
          const aiWinner = checkWinner(aiBoard)
          if (aiWinner === "O") {
            setGameStatus("lost")
            onGameEnd(false)
          } else if (isBoardFull(aiBoard)) {
            setGameStatus("draw")
            const newScore = score + 25
            setScore(newScore)
            onScoreUpdate(newScore)
          }

          setIsPlayerTurn(true)
        } else {
          // Fall back to local AI
          console.warn("API move failed, using local AI:", response.error)
          setIsPlayerTurn(true)
        }
      } catch (error) {
        console.error("Error making API move:", error)
        // Fall back to local AI
        setIsPlayerTurn(true)
      }
    } else {
      // Offline mode - AI will be handled by useEffect
      setIsPlayerTurn(true)
    }
  }, [
    board, 
    isPlayerTurn, 
    gameStatus, 
    totalMoves, 
    moveHistory, 
    score, 
    onScoreUpdate, 
    onGameEnd, 
    removeOldestMove, 
    isConnected, 
    isInitialized, 
    gameId, 
    apiMakeMove
  ])

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(16).fill(null))
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setMoveHistory([])
    setTotalMoves(0)
    setGamesPlayed((prev) => prev + 1)
    setIsInitialized(false)
  }, [])

  // End game
  const endGame = useCallback(async (finalScore: number) => {
    if (isConnected && isInitialized && gameId) {
      try {
        await apiEndGame(gameId, finalScore)
      } catch (error) {
        console.error("Error ending game:", error)
      }
    }
  }, [isConnected, isInitialized, gameId, apiEndGame])

  // Helper functions
  const checkWinner = useCallback((board: Board): Player => {
    const winningCombinations = [
      [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
      [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
      [0, 5, 10, 15], [3, 6, 9, 12],
    ]

    for (const combination of winningCombinations) {
      const [a, b, c, d] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
        return board[a]
      }
    }
    return null
  }, [])

  const isBoardFull = useCallback((board: Board): boolean => {
    return board.every((cell) => cell !== null)
  }, [])

  return {
    // State
    board,
    isPlayerTurn,
    gameStatus,
    score,
    gamesPlayed,
    moveHistory,
    totalMoves,
    gameId,
    isOnline: isConnected,
    isInitialized,
    
    // Actions
    initializeGame,
    makePlayerMove,
    resetGame,
    endGame,
  }
}
