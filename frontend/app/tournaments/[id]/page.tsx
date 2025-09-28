"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { GameLayout } from "@/components/game-layout"
import { TicTacToe } from "@/components/games/tic-tac-toe"

const gameTypes = {
  "tic-tac-toe": "Tic-Tac-Toe"
}

export default function GamePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const gameType = params.gameType as string
  const tournamentId = searchParams.get("tournament")

  const [score, setScore] = useState(0)
  const [gameKey, setGameKey] = useState(0) // For forcing game restart

  const gameTitle = gameTypes[gameType as keyof typeof gameTypes] || "Unknown Game"
  const tournamentMode = !!tournamentId

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore)
  }

  const handleGameEnd = (won: boolean) => {
    console.log(`Game ended. Won: ${won}, Score: ${score}`)
  }

  const handleRestart = () => {
    setScore(0)
    setGameKey((prev) => prev + 1) // Force component remount
  }

  const handleExit = () => {
    if (tournamentMode && tournamentId) {
      router.push(`/tournaments/${tournamentId}`)
    } else {
      router.push("/tournaments")
    }
  }

  const renderGame = () => {
    const gameProps = {
      key: gameKey,
      onScoreUpdate: handleScoreUpdate,
      onGameEnd: handleGameEnd,
    }

    switch (gameType) {
      case "tic-tac-toe":
        return <TicTacToe {...gameProps} />
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h2>
            <p className="text-muted-foreground">The requested game type is not available.</p>
          </div>
        )
    }
  }

  if (!gameTypes[gameType as keyof typeof gameTypes]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h1>
          <button onClick={() => router.push("/tournaments")} className="text-primary hover:underline">
            Back to Tournaments
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameLayout
      gameTitle={gameTitle}
      gameType={gameType}
      score={score}
      onRestart={handleRestart}
      onExit={handleExit}
      tournamentMode={tournamentMode}
      tournamentId={tournamentId || undefined}
    >
      {renderGame()}
    </GameLayout>
  )
}
