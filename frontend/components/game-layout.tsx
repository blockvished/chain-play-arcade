"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Target, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

interface GameLayoutProps {
  children: React.ReactNode
  gameTitle: string
  gameType: string
  score: number
  timeRemaining?: number
  maxTime?: number
  onRestart: () => void
  onExit: () => void
  tournamentMode?: boolean
  tournamentId?: string
  gameStatus?: "playing" | "won" | "lost" | "draw"
}

export function GameLayout({
  children,
  gameTitle,
  gameType,
  score,
  timeRemaining,
  maxTime,
  onRestart,
  onExit,
  tournamentMode = false,
  tournamentId,
  gameStatus = "playing",
}: GameLayoutProps) {
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    // Only start timer if game is playing
    if (gameStatus !== "playing") {
      return
    }

    const interval = setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const timeProgress = timeRemaining && maxTime ? ((maxTime - timeRemaining) / maxTime) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/tournaments" className="hover:text-foreground">
              Tournaments
            </Link>
            <span>/</span>
            <span>{gameTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{gameTitle}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {gameType}
                </Badge>
                {tournamentMode && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Tournament Mode
                  </Badge>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="game-glow">
              <CardContent className="p-6">{children}</CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground prize-glow">{score}</div>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Game Time</span>
                    <span className="font-mono">{formatTime(gameTime)}</span>
                  </div>
                </div>
                {timeRemaining !== undefined && maxTime && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Remaining</span>
                      <span className="font-mono text-red-400">{formatTime(timeRemaining)}</span>
                    </div>
                    <Progress value={timeProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-green-400" />
                  Game Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game Type</span>
                  <span className="font-medium capitalize">{gameType.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">{tournamentMode ? "Tournament" : "Practice"}</span>
                </div>
                
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                {gameType === "tic-tac-toe" && (
                  <>
                    <p>• Click on empty squares to place your mark</p>
                    <p>• Get 4 in a row to win</p>
                    <p>• Beat the AI to earn points</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
