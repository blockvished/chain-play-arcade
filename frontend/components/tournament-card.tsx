"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Tournament } from "@/lib/store"
import { Clock, Users, Trophy, Coins } from "lucide-react"
import Link from "next/link"

interface TournamentCardProps {
  tournament: Tournament
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "ended":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: Tournament["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "hard":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getTimeRemaining = () => {
    if (tournament.status === "ended") return "Ended"
    if (tournament.status === "upcoming") {
      const diff = tournament.startTime.getTime() - Date.now()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `Starts in ${hours}h ${minutes}m`
    }
    const diff = tournament.endTime.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m left`
  }

  const playerProgress = (tournament.currentPlayers / tournament.maxPlayers) * 100

  return (
    <Card className="tournament-card hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-balance">{tournament.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(tournament.status)} variant="outline">
                {tournament.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              {tournament.prizePool} ETH
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Coins className="h-4 w-4 mr-2" />
            Entry: {tournament.entryFee} ETH
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {getTimeRemaining()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              Players
            </span>
            <span className="text-foreground">
              {tournament.currentPlayers}
            </span>
          </div>
          <Progress value={playerProgress} className="h-2" />
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          {tournament.status === "active" && tournament.currentPlayers < tournament.maxPlayers && (
            <Button className="flex-1 game-glow">Join Tournament</Button>
          )}
          {tournament.status === "upcoming" && (
            <Button variant="secondary" className="flex-1">
              Register
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
