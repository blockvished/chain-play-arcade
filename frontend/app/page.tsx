"use client"

import { Navigation } from "@/components/navigation"
import { StatsOverview } from "@/components/stats-overview"
import { useTournamentStore } from "@/lib/store"
import { useGameEvents } from "@/lib/hooks/useGameEvents"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, Clock, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { TournamentCard } from "@/components/tournament-card"
import { useAccount } from "wagmi"

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { getAllGames, gameEvents, isLoading, error } = useTournamentStore()
  
  const { refetch } = useGameEvents(isConnected ? address : undefined)


  const allGames = getAllGames()
  const activeTournaments = allGames.filter((t: any) => 'active' in t ? t.active : false)
  const totalPrizePool = allGames.reduce((sum, t: any) => sum + Number.parseFloat(t.pooledAmt || '0'), 0).toFixed(3)

  console.log("All games:", allGames)
  console.log("Active tournaments:", activeTournaments)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to ChainPlay Arcade</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stake, play, and win in fair AI-driven mini-games. Real-time leaderboards, automatic payouts, and
            transparent gameplay.
          </p>
        </div>

        {/* Stats Overview */}
        {/* <StatsOverview
          totalTournaments={allGames.length}
          activeTournaments={activeTournaments.length}
          totalPrizePool={totalPrizePool}
          userWinnings="0.23"
        /> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Play Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join active tournaments and start earning rewards immediately.
              </p>
             
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check your ranking and see top players across all tournaments.
              </p>
              <Link href="/leaderboard">
                <Button variant="outline" disabled className="w-full border-yellow-500/30 hover:bg-yellow-500/10 bg-transparent">
                  Coming Soon
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {error && (
          <Card className="mb-6 border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">GameHub Connection Error</span>
              </div>
              <p className="text-sm text-red-300 mt-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={refetch}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">Tournaments</h2>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading game events...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              {/* <Link href="/tournaments">
                <Button variant="outline">View All</Button>
              </Link> */}
            </div>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.slice(0, 6).map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onTournamentJoined={refetch}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Tournaments</h3>
                <p className="text-muted-foreground mb-4">Check back soon for new tournaments to join!</p>
                {!isLoading && (
                  <Button variant="outline" onClick={refetch} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Load Game Events
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
