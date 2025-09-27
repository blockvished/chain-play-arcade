"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { AdminStats } from "@/components/admin-stats"
import { TournamentCard } from "@/components/tournament-card"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Settings, Users, Activity, Gamepad2, Loader2 } from "lucide-react"
import Link from "next/link"
import { getGameRegistryService } from "@/lib/services/gameRegistryService"

export default function AdminDashboard() {
  const { tournaments, setTournaments } = useTournamentStore()
  const [games, setGames] = useState<any[]>([])
  const [isLoadingGames, setIsLoadingGames] = useState(false)
  const [gamesError, setGamesError] = useState<string | null>(null)

  useEffect(() => {
    setTournaments(dummyTournaments)
  }, [setTournaments])

  // Fetch games from blockchain
  const fetchGames = async () => {
    try {
      setIsLoadingGames(true)
      setGamesError(null)
      console.log("🔄 Fetching games from blockchain...")
      
      const gameRegistryService = getGameRegistryService()
      const gamesList = await gameRegistryService.getAllGames()
      
      console.log("✅ Games fetched:", gamesList)
      setGames(gamesList)
    } catch (error) {
      console.error("❌ Error fetching games:", error)
      setGamesError(error instanceof Error ? error.message : "Failed to fetch games")
    } finally {
      setIsLoadingGames(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
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

          </div>

          {/* Games List */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-foreground">Game Definitions</h2>
                <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                  {games.length} games
                </Badge>
              </div>
              <Button 
                onClick={fetchGames} 
                variant="outline" 
                size="sm"
                disabled={isLoadingGames}
                className="border-orange-400/30 hover:bg-orange-400/10"
              >
                {isLoadingGames ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>

            {isLoadingGames ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading games from blockchain...</span>
                  </div>
                </CardContent>
              </Card>
            ) : gamesError ? (
              <Card className="border-red-500/20">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="text-red-400 mb-2">Failed to load games</div>
                    <p className="text-sm text-muted-foreground mb-4">{gamesError}</p>
                    <Button onClick={fetchGames} variant="outline" size="sm">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : games.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium text-foreground mb-2">No games found</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      No game definitions have been created yet.
                    </p>
                    <Link href="/admin/games/create">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Create Your First Game
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <Gamepad2 className="h-6 w-6 text-orange-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{game.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              ID: {game.id?.toString() || index + 1}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                       
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {game.description || "No description available"}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="text-xs">
                            Game Definition
                          </Badge>
                          <Link href={`/admin/tournaments/create?id=${game.id?.toString() || index + 1}`}>
                            <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                              Create Event
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
