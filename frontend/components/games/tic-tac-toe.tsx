"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Circle, RotateCcw } from "lucide-react"

type Player = "X" | "O" | null
type Board = Player[]

interface TicTacToeProps {
  onScoreUpdate: (score: number) => void
  onGameEnd: (won: boolean) => void
}

export function TicTacToe({ onScoreUpdate, onGameEnd }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "draw">("playing")
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const checkWinner = (board: Board): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const isBoardFull = (board: Board): boolean => {
    return board.every((cell) => cell !== null)
  }

  const getAvailableMoves = (board: Board): number[] => {
    return board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1)
  }

  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board)
    if (winner === "O") return 10 - depth
    if (winner === "X") return depth - 10
    if (isBoardFull(board)) return 0

    if (isMaximizing) {
      let bestScore = Number.NEGATIVE_INFINITY
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board]
        newBoard[move] = "O"
        const score = minimax(newBoard, depth + 1, false)
        bestScore = Math.max(score, bestScore)
      }
      return bestScore
    } else {
      let bestScore = Number.POSITIVE_INFINITY
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board]
        newBoard[move] = "X"
        const score = minimax(newBoard, depth + 1, true)
        bestScore = Math.min(score, bestScore)
      }
      return bestScore
    }
  }

  const getBestMove = (board: Board): number => {
    let bestScore = Number.NEGATIVE_INFINITY
    let bestMove = -1

    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board]
      newBoard[move] = "O"
      const score = minimax(newBoard, 0, false)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== "playing") return

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)
    setIsPlayerTurn(false)

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
  }

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === "playing") {
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board)
        if (aiMove !== -1) {
          const newBoard = [...board]
          newBoard[aiMove] = "O"
          setBoard(newBoard)

          const winner = checkWinner(newBoard)
          if (winner === "O") {
            setGameStatus("lost")
            onGameEnd(false)
          } else if (isBoardFull(newBoard)) {
            setGameStatus("draw")
            const newScore = score + 25
            setScore(newScore)
            onScoreUpdate(newScore)
          }

          setIsPlayerTurn(true)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, board, gameStatus, score, onScoreUpdate, onGameEnd])

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setGamesPlayed((prev) => prev + 1)
  }

  const renderCell = (index: number) => {
    const value = board[index]
    return (
      <Button
        key={index}
        variant="outline"
        className="h-20 w-20 text-2xl font-bold bg-card hover:bg-accent border-border"
        onClick={() => handleCellClick(index)}
        disabled={!!value || !isPlayerTurn || gameStatus !== "playing"}
      >
        {value === "X" && <X className="h-8 w-8 text-blue-400" />}
        {value === "O" && <Circle className="h-8 w-8 text-red-400" />}
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Status */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Badge variant={gameStatus === "playing" ? "default" : "secondary"}>
            {gameStatus === "playing" && (isPlayerTurn ? "Your Turn" : "AI Thinking...")}
            {gameStatus === "won" && "You Won!"}
            {gameStatus === "lost" && "AI Won"}
            {gameStatus === "draw" && "Draw!"}
          </Badge>
          <Badge variant="outline">Games: {gamesPlayed}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 bg-muted/20 rounded-lg">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>

      {gameStatus !== "playing" && (
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">
            {gameStatus === "won" && <span className="text-green-400">Excellent! +100 points</span>}
            {gameStatus === "lost" && <span className="text-red-400">Better luck next time!</span>}
            {gameStatus === "draw" && <span className="text-yellow-400">Good game! +25 points</span>}
          </div>
          <Button onClick={resetGame} className="game-glow">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}

      <div className="text-center">
        <div className="text-sm text-muted-foreground">Current Score</div>
        <div className="text-2xl font-bold text-primary prize-glow">{score}</div>
      </div>
    </div>
  )
}
