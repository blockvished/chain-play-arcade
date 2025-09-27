"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments, dummyLeaderboard } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Trophy, Coins, Target } from "lucide-react"
import Link from "next/link"

export default function TournamentDetailsPage() {
  const params = useParams()
  const { tournaments, setTournaments, setLeaderboard } = useTournamentStore()
  const [tournament, setTournament] = useState(tournaments.find((t) => t.id === params.id))

  useEffect(() => {
    if (tournaments.length === 0) {
      setTournaments(dummyTournaments)
      setLeaderboard(dummyLeaderboard)
    }
    const foundTournament = dummyTournaments.find((t) => t.id === params.id)
    setTournament(foundTournament)
  }, [params.id, tournaments.length, setTournaments, setLeaderboard])

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tournament Not Found</h1>
            <Link href="/tournaments">
              <Button>Back to Tournaments</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
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

  const getTimeRemaining = () => {
    if (tournament.status === "ended") return "Tournament Ended"
    if (tournament.status === "upcoming") {
      const diff = tournament.startTime.getTime() - Date.now()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `Starts in ${hours}h ${minutes}m`
    }
    const diff = tournament.endTime.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m remaining`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/tournaments" className="hover:text-foreground">
              Tournaments
            </Link>
            <span>/</span>
            <span>{tournament.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">{tournament.name}</h1>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(tournament.status)} variant="outline">
              {tournament.status}
            </Badge>
            <span className="text-muted-foreground">{getTimeRemaining()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Tournament Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Coins className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-sm text-muted-foreground">Entry Fee</div>
                    <div className="font-semibold">{tournament.entryFee} ETH</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Trophy className="h-6 w-6 mx-auto mb-2 text-green-400" />
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                    <div className="font-semibold prize-glow">{tournament.prizePool} ETH</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">{tournament.duration}h</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm text-muted-foreground">Players</div>
                    <div className="font-semibold">
                      {tournament.currentPlayers}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Game Rules</h3>
                  <p className="text-muted-foreground text-pretty">{tournament.rules}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
