"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Tournament, GameEventTournament } from "@/lib/store"
import { Clock, Users, Trophy, Coins } from "lucide-react"
import Link from "next/link"

interface TournamentCardProps {
  tournament: Tournament | GameEventTournament
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: "upcoming" | "active" | "ended") => {
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


  const getEventStatus = () => {
    const now = Date.now()
    const startTime = tournament.startTime.getTime()
    const endTime = tournament.endTime.getTime()
    
    if (now < startTime) return "upcoming"
    if (now > endTime) return "ended"
    return "active"
  }

  const getTimeRemaining = () => {
    const now = Date.now()
    const startTime = tournament.startTime.getTime()
    const endTime = tournament.endTime.getTime()
    
    if (now < startTime) {
      const diff = startTime - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `Starts in ${hours}h ${minutes}m`
    }
    
    if (now > endTime) {
      return "Ended"
    }
    
    const diff = endTime - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m left`
  }

  const playerProgress = 'maxPlayers' in tournament && tournament.maxPlayers 
    ? (tournament.currentPlayers / tournament.maxPlayers) * 100 
    : 0

  return (
    <Card className="tournament-card hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-balance">
              {'eventName' in tournament ? tournament.eventName : tournament.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(getEventStatus())} variant="outline">
                {getEventStatus()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              {'pooledAmt' in tournament ? tournament.pooledAmt : tournament.prizePool} ETH
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Coins className="h-4 w-4 mr-2" />
            Entry: {'minStakeAmt' in tournament ? tournament.minStakeAmt : tournament.entryFee} ETH
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
              {'playersCount' in tournament ? tournament.playersCount : tournament.currentPlayers}
            </span>
          </div>
          {'maxPlayers' in tournament && tournament.maxPlayers && (
            <Progress value={playerProgress} className="h-2" />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          {getEventStatus() === "active" && (!('maxPlayers' in tournament) || ('currentPlayers' in tournament ? tournament.currentPlayers : 0) < tournament.maxPlayers) && (
            <Button className="flex-1 game-glow">Join Tournament</Button>
          )}
          {getEventStatus() === "upcoming" && (
            <Button variant="secondary" className="flex-1">
              Register
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
