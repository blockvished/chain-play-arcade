"use client"

import { useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { StatsOverview } from "@/components/stats-overview"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { TournamentCard } from "@/components/tournament-card"

export default function Dashboard() {
  const { tournaments, setTournaments } = useTournamentStore()

  useEffect(() => {
    // Load dummy data
    setTournaments(dummyTournaments)
  }, [setTournaments])

  const activeTournaments = tournaments.filter((t) => t.status === "active")
  const totalPrizePool = tournaments.reduce((sum, t) => sum + Number.parseFloat(t.prizePool), 0).toFixed(3)

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
        <StatsOverview
          totalTournaments={tournaments.length}
          activeTournaments={activeTournaments.length}
          totalPrizePool={totalPrizePool}
          userWinnings="0.23"
        />

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
              <Link href="/tournaments">
                <Button className="w-full bg-green-600 hover:bg-green-700">Browse Tournaments</Button>
              </Link>
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
                <Button variant="outline" className="w-full border-yellow-500/30 hover:bg-yellow-500/10 bg-transparent">
                  View Rankings
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* Active Tournaments */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Active Tournaments</h2>
            <Link href="/tournaments">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.slice(0, 3).map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Tournaments</h3>
                <p className="text-muted-foreground">Check back soon for new tournaments to join!</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
