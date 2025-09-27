"use client"

import { useEffect } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { AdminStats } from "@/components/admin-stats"
import { TournamentCard } from "@/components/tournament-card"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Settings, Users, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { tournaments, setTournaments } = useTournamentStore()

  useEffect(() => {
    setTournaments(dummyTournaments)
  }, [setTournaments])

  const activeTournaments = tournaments.filter((t) => t.status === "active")
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming")
  const endedTournaments = tournaments.filter((t) => t.status === "ended")

  const totalPlayers = tournaments.reduce((sum, t) => sum + t.currentPlayers, 0)
  const totalPrizePool = tournaments.reduce((sum, t) => sum + Number.parseFloat(t.prizePool), 0).toFixed(3)
  const totalRevenue = (Number.parseFloat(totalPrizePool) * 0.05).toFixed(3) // 5% platform fee
  const avgPlayersPerTournament = tournaments.length > 0 ? totalPlayers / tournaments.length : 0

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-red-400" />
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                Admin Access
              </Badge>
            </div>
            <p className="text-muted-foreground text-pretty">
              Manage tournaments, monitor platform performance, and oversee gaming operations.
            </p>
          </div>

          {/* Stats Overview */}
          <AdminStats
            totalTournaments={tournaments.length}
            activeTournaments={activeTournaments.length}
            totalPlayers={totalPlayers}
            totalPrizePool={totalPrizePool}
            totalRevenue={totalRevenue}
            avgPlayersPerTournament={avgPlayersPerTournament}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Tournament
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up new tournaments with custom rules and prize pools.
                </p>
                <Link href="/admin/tournaments/create">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Create New</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Edit, pause, or end existing tournaments and monitor progress.
                </p>
                <Link href="/admin/tournaments">
                  <Button variant="outline" className="w-full border-blue-500/30 hover:bg-blue-500/10 bg-transparent">
                    Manage All
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Activity className="h-5 w-5 mr-2" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View detailed analytics and player engagement metrics.
                </p>
                <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-500/10 bg-transparent">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add new game definitions to the blockchain registry.
                </p>
                <Link href="/admin/games/create">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Create Game</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
